import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

// 10-06: Dangerous / admin action types
export type AuditAction =
  | 'RUNTIME_TERMINATE'
  | 'RUNTIME_RESTART'
  | 'VISIBILITY_CHANGE'
  | 'SNAPSHOT_RESTORE'
  | 'REMIX_DISABLE'
  | 'KILL_SWITCH_ENABLE'
  | 'KILL_SWITCH_DISABLE'
  | 'ADMIN_ACTION'
  | 'BETA_INVITE_REDEEM'
  | 'QUOTA_EXCEEDED';

const BLOCKED_AUDIT_KEYS = /secret|token|key|password|credential|auth|private/i;

@Injectable()
export class SecurityAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(event: {
    actorUserId?: string;
    action:       AuditAction;
    targetType?:  string;
    targetId?:    string;
    metadata?:    Record<string, unknown>;
    ip?:          string;
  }): Promise<void> {
    const safeMeta = event.metadata ? this.redact(event.metadata) : null;
    const ipHash   = event.ip
      ? createHash('sha256').update(event.ip).digest('hex').slice(0, 32)
      : null;

    await this.prisma.securityAuditEvent.create({
      data: {
        id:          randomUUID(),
        actorUserId: event.actorUserId ?? null,
        action:      event.action,
        targetType:  event.targetType  ?? null,
        targetId:    event.targetId    ?? null,
        metadata:    safeMeta ? JSON.stringify(safeMeta) : null,
        ipHash,
      },
    }).catch(() => {}); // audit must never crash the caller
  }

  async recent(limit = 100) {
    return this.prisma.securityAuditEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take:    Math.min(limit, 500),
    });
  }

  private redact(obj: Record<string, unknown>): Record<string, unknown> {
    const safe: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!BLOCKED_AUDIT_KEYS.test(k)) safe[k] = v;
    }
    return safe;
  }
}
