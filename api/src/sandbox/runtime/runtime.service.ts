import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import {
  RuntimeStatus,
  RuntimeVisibility,
  SleepState,
  SnapshotType,
} from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../lib/redis/redis.service';
import type { SnapshotService } from '../../snapshot/snapshot.service';
import type { SecurityAuditService } from '../../audit/security-audit.service';
import type { QuotaService } from '../../quota/quota.service';
import type { KillSwitchService } from '../../kill-switch/kill-switch.service';

const ORCHESTRATOR_URL = (process.env.ORCHESTRATOR_URL ?? 'http://localhost:4100').trim();
const IDLE_TTL_SEC  = parseInt(process.env.RUNTIME_IDLE_TTL_SEC  ?? '300',  10);
const SLEEP_TTL_SEC = parseInt(process.env.RUNTIME_SLEEP_TTL_SEC ?? '1800', 10);
const AUTO_RECOVERY = (process.env.AUTO_RECOVERY_ENABLED ?? 'true') === 'true';
const MAX_RECOVERIES = 3;

@Injectable()
export class RuntimeService implements OnModuleInit {
  private readonly logger = new Logger(RuntimeService.name);

  constructor(
    private readonly prisma:    PrismaService,
    private readonly redis:     RedisService,
    @Optional() private readonly snapshots?:   SnapshotService,
    @Optional() private readonly audit?:       SecurityAuditService,
    @Optional() private readonly quota?:       QuotaService,
    @Optional() private readonly killSwitch?:  KillSwitchService,
  ) {}

  onModuleInit() {
    this.logger.log(
      `RuntimeService ready (idleTtl=${IDLE_TTL_SEC}s sleepTtl=${SLEEP_TTL_SEC}s autoRecovery=${AUTO_RECOVERY})`,
    );
  }

  // ── 04-02: Provision ──────────────────────────────────────────────────────

  async create(input: {
    ownerUserId: string;
    projectId?: string;
    workspaceId?: string;
    runtimeType?: string;
    visibility?: RuntimeVisibility;
    password?: string;
    metadata?: Record<string, unknown>;
    expiresInSec?: number;
  }) {
    // 10-04: Kill switch check
    await this.killSwitch?.assertNotBlocked('runtime_create', 'Runtime creation is temporarily disabled.');
    // 10-03: Quota check
    await this.quota?.checkRuntimeQuota(input.ownerUserId);

    const id = randomUUID();
    // 04-06: stable preview URL assigned at creation, never changes
    const previewUrl = this.buildPreviewUrl(id);

    let passwordHash: string | undefined;
    if (input.visibility === RuntimeVisibility.PASSWORD && input.password) {
      passwordHash = await hash(input.password, 10);
    }

    const runtime = await this.prisma.runtimeInstance.create({
      data: {
        id,
        ownerUserId: input.ownerUserId,
        projectId:   input.projectId   ?? null,
        workspaceId: input.workspaceId ?? null,
        runtimeType: input.runtimeType ?? 'docker',
        visibility:  input.visibility  ?? RuntimeVisibility.PRIVATE,
        passwordHash: passwordHash ?? null,
        previewUrl,
        status:     RuntimeStatus.PROVISIONING,
        sleepState: SleepState.AWAKE,
        metadata:   input.metadata ? JSON.stringify(input.metadata) : null,
        expiresAt:  input.expiresInSec
          ? new Date(Date.now() + input.expiresInSec * 1000)
          : null,
      },
    });

    this.logger.log({ id, previewUrl, ownerUserId: input.ownerUserId }, 'runtime created');
    return runtime;
  }

  async markRunning(id: string, containerId: string, internalPort: number) {
    const now = new Date();
    return this.prisma.runtimeInstance.update({
      where: { id },
      data: {
        status:         RuntimeStatus.RUNNING,
        sleepState:     SleepState.AWAKE,
        containerId,
        internalPort,
        lastHeartbeatAt: now,
        lastAccessAt:   now,
      },
    });
  }

  // ── 04-02: Lifecycle operations ───────────────────────────────────────────

  async stop(id: string, requesterId: string) {
    const runtime = await this.getOwnedOrThrow(id, requesterId);
    await this.haltContainer(runtime.containerId);
    return this.prisma.runtimeInstance.update({
      where: { id },
      data: { status: RuntimeStatus.STOPPED, sleepState: SleepState.AWAKE, containerId: null },
    });
  }

  async restart(id: string, requesterId: string) {
    const runtime = await this.getOwnedOrThrow(id, requesterId);
    await this.haltContainer(runtime.containerId);
    return this.prisma.runtimeInstance.update({
      where: { id },
      data: { status: RuntimeStatus.PROVISIONING, sleepState: SleepState.AWAKE, containerId: null },
    });
  }

  async terminate(id: string, requesterId: string) {
    const runtime = await this.getOwnedOrThrow(id, requesterId);
    await this.haltContainer(runtime.containerId);
    await this.redis.client.del(`${this.redis.prefix}:runtime:heartbeat:${id}`).catch(() => {});
    const updated = await this.prisma.runtimeInstance.update({
      where: { id },
      data: { status: RuntimeStatus.TERMINATED, sleepState: SleepState.AWAKE, containerId: null },
    });
    // 10-06: Audit dangerous action
    void this.audit?.log({ actorUserId: requesterId, action: 'RUNTIME_TERMINATE', targetType: 'runtime', targetId: id });
    return updated;
  }

  // ── 04-03: Detached access tracking ──────────────────────────────────────
  // Called on every preview request — does NOT terminate the runtime.

  async touchAccess(id: string) {
    await this.prisma.runtimeInstance.updateMany({
      where: {
        id,
        status: { in: [RuntimeStatus.RUNNING, RuntimeStatus.SLEEPING] },
      },
      data: { lastAccessAt: new Date() },
    });
  }

  // ── 04-05: Sleep ──────────────────────────────────────────────────────────

  async sleep(id: string) {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });
    if (!runtime || runtime.status !== RuntimeStatus.RUNNING) return null;

    this.logger.log({ id }, 'sleeping runtime');

    // Snapshot container info into metadata before stopping
    const meta = runtime.metadata ? (JSON.parse(runtime.metadata) as Record<string, unknown>) : {};
    meta['sleepSnapshot'] = {
      containerId: runtime.containerId,
      internalPort: runtime.internalPort,
      at: new Date().toISOString(),
    };

    await this.haltContainer(runtime.containerId);

    const updated = await this.prisma.runtimeInstance.update({
      where: { id },
      data: {
        status:      RuntimeStatus.SLEEPING,
        sleepState:  SleepState.SLEEPING,
        containerId: null,
        metadata:    JSON.stringify(meta),
      },
    });

    await this.redis.client
      .set(`${this.redis.prefix}:runtime:sleep:${id}`, new Date().toISOString(), 'EX', SLEEP_TTL_SEC * 4)
      .catch(() => {});

    return updated;
  }

  // ── 04-05: Wake ───────────────────────────────────────────────────────────

  async wake(id: string): Promise<{ woke: boolean; previewUrl: string | null }> {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });
    if (!runtime) return { woke: false, previewUrl: null };
    if (runtime.status === RuntimeStatus.RUNNING) {
      return { woke: true, previewUrl: runtime.previewUrl };
    }
    if (runtime.status !== RuntimeStatus.SLEEPING) {
      return { woke: false, previewUrl: runtime.previewUrl };
    }

    // Acquire distributed wake lock — only one instance starts the wake
    const lockKey = `${this.redis.prefix}:runtime:wakeLock:${id}`;
    const acquired = await this.redis.client
      .set(lockKey, String(process.pid), 'EX', 60, 'NX')
      .catch(() => null);

    if (!acquired) {
      // Another instance is already waking — report waking status
      return { woke: false, previewUrl: runtime.previewUrl };
    }

    try {
      await this.prisma.runtimeInstance.update({
        where: { id },
        data: { status: RuntimeStatus.PROVISIONING, sleepState: SleepState.WAKING },
      });

      this.logger.log({ id }, 'waking runtime');

      // Signal orchestrator to resume container (best-effort HTTP call)
      await fetch(`${ORCHESTRATOR_URL}/v1/runtimes/${encodeURIComponent(id)}/wake`, {
        method: 'POST',
        headers: { 'content-type': 'application/json',
          'x-api-key': process.env.ORCHESTRATOR_API_KEY ?? '' },
        body: JSON.stringify({ runtimeId: id, projectId: runtime.projectId }),
      }).catch(() => {});

      await this.redis.client.del(`${this.redis.prefix}:runtime:sleep:${id}`).catch(() => {});
      return { woke: true, previewUrl: runtime.previewUrl };
    } finally {
      await this.redis.client.del(lockKey).catch(() => {});
    }
  }

  // ── 04-07: Recovery ───────────────────────────────────────────────────────

  async recover(id: string, reason: string) {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });
    if (!runtime) return null;

    if (!AUTO_RECOVERY || runtime.recoveryCount >= MAX_RECOVERIES) {
      this.logger.warn({ id, count: runtime.recoveryCount }, 'recovery denied (limit or disabled)');
      return null;
    }

    // 08-05: AUTO_RECOVERY snapshot — capture state before attempting restart (non-blocking)
    if (this.snapshots) {
      await this.snapshots.createSnapshot({
        runtimeId:    id,
        projectId:    runtime.projectId ?? undefined,
        ownerUserId:  runtime.ownerUserId,
        reason,
        snapshotType: SnapshotType.AUTO_RECOVERY,
      }).catch((err) => this.logger.warn({ id, err: String(err) }, 'pre-recovery snapshot failed (non-fatal)'));
    }

    const events: { at: string; reason: string; success: boolean }[] = runtime.recoveryEvents
      ? (JSON.parse(runtime.recoveryEvents) as typeof events)
      : [];

    events.push({ at: new Date().toISOString(), reason, success: true });

    await this.haltContainer(runtime.containerId);

    const updated = await this.prisma.runtimeInstance.update({
      where: { id },
      data: {
        status:         RuntimeStatus.PROVISIONING,
        sleepState:     SleepState.AWAKE,
        containerId:    null,
        recoveryCount:  runtime.recoveryCount + 1,
        recoveryEvents: JSON.stringify(events),
      },
    });

    this.logger.log({ id, count: updated.recoveryCount, reason }, 'runtime recovery triggered');
    return updated;
  }

  // ── 04-08: Access model ───────────────────────────────────────────────────

  async checkAccess(id: string, requesterId?: string, password?: string): Promise<boolean> {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });
    if (!runtime) return false;
    if (runtime.status === RuntimeStatus.TERMINATED) return false;

    switch (runtime.visibility) {
      case RuntimeVisibility.PUBLIC:
        return true;
      case RuntimeVisibility.PRIVATE:
      case RuntimeVisibility.TEAM:
        return runtime.ownerUserId === requesterId;
      case RuntimeVisibility.PASSWORD:
        if (runtime.ownerUserId === requesterId) return true;
        if (!password || !runtime.passwordHash) return false;
        return compare(password, runtime.passwordHash);
    }
  }

  async setVisibility(
    id: string,
    requesterId: string,
    visibility: RuntimeVisibility,
    password?: string,
  ) {
    await this.getOwnedOrThrow(id, requesterId);

    let passwordHash: string | null = null;
    if (visibility === RuntimeVisibility.PASSWORD) {
      if (!password) throw new BadRequestException('password required for PASSWORD visibility');
      passwordHash = await hash(password, 10);
    }

    const result = await this.prisma.runtimeInstance.update({
      where: { id },
      data: { visibility, passwordHash },
    });
    // 10-06: Audit visibility change
    void this.audit?.log({ actorUserId: requesterId, action: 'VISIBILITY_CHANGE', targetType: 'runtime', targetId: id, metadata: { visibility } });
    return result;
  }

  // ── 04-06: Stable URL helpers ─────────────────────────────────────────────

  private buildPreviewUrl(runtimeId: string): string {
    const base = (process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    return `${base}/p/${runtimeId}`;
  }

  // ── Query helpers ─────────────────────────────────────────────────────────

  async list(ownerUserId: string) {
    return this.prisma.runtimeInstance.findMany({
      where: { ownerUserId, status: { not: RuntimeStatus.TERMINATED } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    return this.prisma.runtimeInstance.findUnique({ where: { id } });
  }

  async getByPreviewUrl(previewUrl: string) {
    return this.prisma.runtimeInstance.findFirst({ where: { previewUrl } });
  }

  private async getOwnedOrThrow(id: string, requesterId: string) {
    const runtime = await this.prisma.runtimeInstance.findUnique({ where: { id } });
    if (!runtime) throw new NotFoundException('runtime not found');
    if (runtime.ownerUserId !== requesterId) throw new ForbiddenException('access denied');
    return runtime;
  }

  // ── Container helpers ─────────────────────────────────────────────────────

  private async haltContainer(containerId: string | null) {
    if (!containerId) return;
    await fetch(
      `${ORCHESTRATOR_URL}/v1/projects/${encodeURIComponent(containerId)}/stop`,
      {
        method: 'POST',
        headers: { 'x-api-key': process.env.ORCHESTRATOR_API_KEY ?? '' },
      },
    ).catch(() => {});
  }
}
