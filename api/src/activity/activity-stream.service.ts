import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AgentType, ActivitySeverity, EventStatus, Prisma } from '../generated/prisma';
import type { AgentActivityEvent } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../lib/redis/redis.service';

// 07-05: Keys that must never appear in public event metadata
const BLOCKED_META_KEYS = /secret|token|key|password|credential|auth|private|prompt|instruction|system|chain_of_thought|hidden|internal/i;
const MAX_META_BYTES    = 4096;

export interface CreateEventInput {
  projectId?:   string;
  runtimeId?:   string;
  workspaceId?: string;
  agentType:    AgentType;
  eventType:    string;
  title:        string;
  message?:     string;
  metadata?:    Record<string, unknown>;
  severity?:    ActivitySeverity;
  status?:      EventStatus;
  startedAt?:   Date;
}

@Injectable()
export class ActivityStreamService {
  private readonly logger = new Logger(ActivityStreamService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  // 07-02: Append event — persist to DB + publish to Redis for fanout
  async append(input: CreateEventInput): Promise<AgentActivityEvent> {
    const safeMeta = this.redactMetadata(input.metadata);

    const event = await this.prisma.agentActivityEvent.create({
      data: {
        id:          randomUUID(),
        projectId:   input.projectId   ?? null,
        runtimeId:   input.runtimeId   ?? null,
        workspaceId: input.workspaceId ?? null,
        agentType:   input.agentType,
        eventType:   input.eventType,
        title:       input.title.slice(0, 500),
        message:     input.message?.slice(0, 4000) ?? null,
        metadata:    safeMeta ? JSON.stringify(safeMeta) : null,
        severity:    input.severity ?? ActivitySeverity.INFO,
        status:      input.status   ?? EventStatus.PENDING,
        startedAt:   input.startedAt ?? null,
      },
    });

    void this.publish(event);
    return event;
  }

  // 07-02: Update an in-progress event (status, completion, message)
  async update(
    id:      string,
    updates: {
      status?:      EventStatus;
      message?:     string;
      completedAt?: Date;
      durationMs?:  number;
      metadata?:    Record<string, unknown>;
    },
  ): Promise<AgentActivityEvent> {
    const safeMeta = updates.metadata
      ? this.redactMetadata(updates.metadata)
      : undefined;

    const event = await this.prisma.agentActivityEvent.update({
      where: { id },
      data: {
        ...(updates.status      !== undefined && { status:      updates.status }),
        ...(updates.message     !== undefined && { message:     updates.message.slice(0, 4000) }),
        ...(updates.completedAt !== undefined && { completedAt: updates.completedAt }),
        ...(updates.durationMs  !== undefined && { durationMs:  updates.durationMs }),
        ...(safeMeta            !== undefined && { metadata:    safeMeta ? JSON.stringify(safeMeta) : null }),
      },
    });

    void this.publish(event);
    return event;
  }

  // 07-07: Cursor-paginated history query
  async query(opts: {
    projectId?:   string;
    runtimeId?:   string;
    agentType?:   AgentType;
    severity?:    ActivitySeverity;
    status?:      EventStatus;
    after?:       string; // ISO date cursor
    before?:      string;
    limit?:       number;
  }): Promise<AgentActivityEvent[]> {
    const where: Prisma.AgentActivityEventWhereInput = {};
    if (opts.projectId) where.projectId = opts.projectId;
    if (opts.runtimeId) where.runtimeId = opts.runtimeId;
    if (opts.agentType) where.agentType = opts.agentType;
    if (opts.severity)  where.severity  = opts.severity;
    if (opts.status)    where.status    = opts.status;
    if (opts.after || opts.before) {
      where.createdAt = {};
      if (opts.after)  where.createdAt.gt = new Date(opts.after);
      if (opts.before) where.createdAt.lt = new Date(opts.before);
    }

    return this.prisma.agentActivityEvent.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take:    Math.min(opts.limit ?? 50, 200),
    });
  }

  // 07-05: Safe thought summary — strips sensitive keys from metadata
  redactMetadata(metadata: unknown): Record<string, unknown> | null {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
    const safe: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(metadata as Record<string, unknown>)) {
      if (!BLOCKED_META_KEYS.test(k)) safe[k] = v;
    }
    const str = JSON.stringify(safe);
    if (str.length > MAX_META_BYTES) {
      return { truncated: true, preview: str.slice(0, 256) };
    }
    return Object.keys(safe).length > 0 ? safe : null;
  }

  // Redact a full event object for public-safe output
  redactEvent(event: AgentActivityEvent): Record<string, unknown> {
    const copy: Record<string, unknown> = { ...event };
    if (typeof copy.metadata === 'string') {
      try {
        copy.metadata = this.redactMetadata(JSON.parse(copy.metadata as string));
      } catch {
        copy.metadata = null;
      }
    }
    return copy;
  }

  // Publish event to Redis channel for cross-instance fanout
  private async publish(event: AgentActivityEvent): Promise<void> {
    const channels: string[] = [];
    if (event.projectId)  channels.push(`${this.redis.prefix}:activity:${event.projectId}`);
    if (event.runtimeId)  channels.push(`${this.redis.prefix}:activity:runtime:${event.runtimeId}`);
    if (channels.length === 0) return;

    const payload = JSON.stringify(event);
    await Promise.all(
      channels.map((ch) => this.redis.client.publish(ch, payload).catch(() => {})),
    );
  }
}
