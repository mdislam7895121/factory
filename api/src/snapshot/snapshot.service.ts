import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AgentType,
  ActivitySeverity,
  EventStatus,
  SnapshotStatus,
  SnapshotType,
  RecoveryEventType,
} from '../generated/prisma';
import type { ProjectSnapshot } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityStreamService } from '../activity/activity-stream.service';
import { MetadataSnapshotAdapter } from './runtime-snapshot.adapter';
import type { SecurityAuditService } from '../audit/security-audit.service';

const AUTO_RESTORE_ENABLED      = (process.env.AUTO_RESTORE_ENABLED      ?? 'false') === 'true';
const AUTO_RESTORE_MAX_ATTEMPTS = parseInt(process.env.AUTO_RESTORE_MAX_ATTEMPTS ?? '2', 10);

export interface CreateSnapshotInput {
  runtimeId:    string;
  projectId?:   string;
  ownerUserId:  string;
  label?:       string;
  reason?:      string;
  snapshotType: SnapshotType;
}

@Injectable()
export class SnapshotService {
  private readonly logger = new Logger(SnapshotService.name);

  constructor(
    private readonly prisma:    PrismaService,
    private readonly activity:  ActivityStreamService,
    private readonly adapter:   MetadataSnapshotAdapter,
    @Optional() private readonly auditService?: SecurityAuditService,
  ) {}

  // 08-02: Create + persist snapshot — returns READY snapshot or throws
  async createSnapshot(input: CreateSnapshotInput): Promise<ProjectSnapshot> {
    const runtime = await this.prisma.runtimeInstance.findUnique({
      where: { id: input.runtimeId },
    });
    if (!runtime) throw new NotFoundException('runtime not found');

    const id = randomUUID();

    // Persist placeholder record — status CREATING
    let snapshot = await this.prisma.projectSnapshot.create({
      data: {
        id,
        runtimeId:    input.runtimeId,
        projectId:    input.projectId   ?? runtime.projectId   ?? null,
        workspaceId:  runtime.workspaceId ?? null,
        ownerUserId:  input.ownerUserId,
        label:        input.label  ?? null,
        reason:       input.reason ?? null,
        snapshotType: input.snapshotType,
        status:       SnapshotStatus.CREATING,
      },
    });

    void this.emitActivity({
      eventType: 'SNAPSHOT_STARTED',
      title:     `Snapshot ${input.snapshotType} started`,
      severity:  ActivitySeverity.INFO,
      status:    EventStatus.RUNNING,
      projectId: snapshot.projectId ?? undefined,
      runtimeId: input.runtimeId,
      metadata:  { snapshotId: id, snapshotType: input.snapshotType },
    });

    try {
      // Capture manifest via adapter (metadata-only; full FS is TODO)
      const manifest  = await this.adapter.capture(input.runtimeId);
      const checksum  = this.adapter.computeChecksum(manifest);
      const serialized = JSON.stringify(manifest);
      const sizeBytes  = Buffer.byteLength(serialized, 'utf8');

      snapshot = await this.prisma.projectSnapshot.update({
        where: { id },
        data: {
          status:   SnapshotStatus.READY,
          manifest: serialized,
          checksum,
          sizeBytes,
        },
      });

      // 08-08: Create recovery event record
      await this.createRecoveryEvent({
        runtimeId: input.runtimeId,
        projectId: snapshot.projectId ?? undefined,
        snapshotId: id,
        eventType: RecoveryEventType.SNAPSHOT_CREATED,
        status:    EventStatus.SUCCESS,
        reason:    input.reason,
        metadata:  { snapshotType: input.snapshotType, sizeBytes, checksum },
      });

      void this.emitActivity({
        eventType: 'SNAPSHOT_READY',
        title:     `Snapshot ${input.snapshotType} ready`,
        severity:  ActivitySeverity.INFO,
        status:    EventStatus.SUCCESS,
        projectId: snapshot.projectId ?? undefined,
        runtimeId: input.runtimeId,
        metadata:  { snapshotId: id, sizeBytes },
      });

      this.logger.log({ id, snapshotType: input.snapshotType, sizeBytes }, 'snapshot created');
      return snapshot;
    } catch (err) {
      await this.prisma.projectSnapshot.update({
        where: { id },
        data: { status: SnapshotStatus.FAILED },
      }).catch(() => {});

      void this.emitActivity({
        eventType: 'SNAPSHOT_FAILED',
        title:     `Snapshot ${input.snapshotType} failed`,
        severity:  ActivitySeverity.ERROR,
        status:    EventStatus.FAILED,
        projectId: snapshot.projectId ?? undefined,
        runtimeId: input.runtimeId,
        metadata:  { snapshotId: id, error: String(err) },
      });

      throw err;
    }
  }

  // 08-04: Restore a snapshot — preserves previewUrl + fork lineage (08-09)
  async restoreSnapshot(snapshotId: string, requesterId: string): Promise<ProjectSnapshot> {
    const snapshot = await this.prisma.projectSnapshot.findUnique({
      where: { id: snapshotId },
    });
    if (!snapshot) throw new NotFoundException('snapshot not found');
    if (snapshot.ownerUserId !== requesterId) throw new ForbiddenException('access denied');
    if (snapshot.status !== SnapshotStatus.READY) {
      throw new NotFoundException('snapshot is not in READY state');
    }
    if (!snapshot.manifest) throw new NotFoundException('snapshot manifest missing');

    // Set RESTORING
    await this.prisma.projectSnapshot.update({
      where: { id: snapshotId },
      data: { status: SnapshotStatus.RESTORING },
    });

    await this.createRecoveryEvent({
      runtimeId:  snapshot.runtimeId ?? undefined,
      projectId:  snapshot.projectId ?? undefined,
      snapshotId,
      eventType:  RecoveryEventType.RESTORE_STARTED,
      status:     EventStatus.RUNNING,
      reason:     'user-initiated restore',
    });

    void this.emitActivity({
      eventType: 'RESTORE_STARTED',
      title:     'Snapshot restore started',
      severity:  ActivitySeverity.WARNING,
      status:    EventStatus.RUNNING,
      projectId: snapshot.projectId ?? undefined,
      runtimeId: snapshot.runtimeId ?? undefined,
      metadata:  { snapshotId },
    });

    try {
      const manifest = JSON.parse(snapshot.manifest) as Parameters<MetadataSnapshotAdapter['restore']>[1];

      // Verify integrity
      if (snapshot.checksum && !this.adapter.verify(manifest, snapshot.checksum)) {
        throw new Error('snapshot checksum mismatch');
      }

      if (!snapshot.runtimeId) throw new Error('snapshot has no runtimeId');

      // Apply safe fields — previewUrl/sourceId are intentionally preserved (08-09)
      await this.adapter.restore(snapshot.runtimeId, manifest);

      const restored = await this.prisma.projectSnapshot.update({
        where: { id: snapshotId },
        data:  { status: SnapshotStatus.RESTORED, restoredAt: new Date() },
      });

      await this.createRecoveryEvent({
        runtimeId:  snapshot.runtimeId,
        projectId:  snapshot.projectId ?? undefined,
        snapshotId,
        eventType:  RecoveryEventType.RESTORE_SUCCEEDED,
        status:     EventStatus.SUCCESS,
        completedAt: new Date(),
      });

      void this.emitActivity({
        eventType: 'RESTORE_SUCCESS',
        title:     'Snapshot restore completed',
        severity:  ActivitySeverity.INFO,
        status:    EventStatus.SUCCESS,
        projectId: snapshot.projectId ?? undefined,
        runtimeId: snapshot.runtimeId,
        metadata:  { snapshotId },
      });

      // 10-06: Audit dangerous restore action
      void this.auditService?.log({
        actorUserId: requesterId,
        action:      'SNAPSHOT_RESTORE',
        targetType:  'snapshot',
        targetId:    snapshotId,
        metadata:    { runtimeId: snapshot.runtimeId },
      });

      this.logger.log({ snapshotId, runtimeId: snapshot.runtimeId }, 'snapshot restored');
      return restored;
    } catch (err) {
      await this.prisma.projectSnapshot.update({
        where: { id: snapshotId },
        data:  { status: SnapshotStatus.READY }, // revert so user can retry
      }).catch(() => {});

      await this.createRecoveryEvent({
        runtimeId:  snapshot.runtimeId ?? undefined,
        projectId:  snapshot.projectId ?? undefined,
        snapshotId,
        eventType:  RecoveryEventType.RESTORE_FAILED,
        status:     EventStatus.FAILED,
        reason:     String(err),
        completedAt: new Date(),
      });

      void this.emitActivity({
        eventType: 'RESTORE_FAILED',
        title:     'Snapshot restore failed',
        severity:  ActivitySeverity.ERROR,
        status:    EventStatus.FAILED,
        projectId: snapshot.projectId ?? undefined,
        runtimeId: snapshot.runtimeId ?? undefined,
        metadata:  { snapshotId, error: String(err) },
      });

      throw err;
    }
  }

  // 08-04: List snapshots for a project
  async listByProject(projectId: string, limit = 50): Promise<ProjectSnapshot[]> {
    return this.prisma.projectSnapshot.findMany({
      where:   { projectId },
      orderBy: { createdAt: 'desc' },
      take:    Math.min(limit, 100),
    });
  }

  // List snapshots for a runtime
  async listByRuntime(runtimeId: string, limit = 50): Promise<ProjectSnapshot[]> {
    return this.prisma.projectSnapshot.findMany({
      where:   { runtimeId },
      orderBy: { createdAt: 'desc' },
      take:    Math.min(limit, 100),
    });
  }

  // Get latest READY snapshot for a runtime (used by auto-recovery)
  async getLatestReady(runtimeId: string): Promise<ProjectSnapshot | null> {
    return this.prisma.projectSnapshot.findFirst({
      where:   { runtimeId, status: SnapshotStatus.READY },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 08-07: Mark old auto/scheduled snapshots as EXPIRED — called by retention scheduler
  async expireOldSnapshots(): Promise<number> {
    const manualDays    = parseInt(process.env.SNAPSHOT_MANUAL_RETENTION_DAYS ?? '90', 10);
    const autoDays      = parseInt(process.env.SNAPSHOT_AUTO_RETENTION_DAYS   ?? '14', 10);
    const maxPerProject = parseInt(process.env.SNAPSHOT_MAX_PER_PROJECT        ?? '25', 10);

    const now = Date.now();
    let total = 0;

    // Expire auto/scheduled snapshots past retention window
    const autoTypes: SnapshotType[] = [SnapshotType.AUTO_RECOVERY, SnapshotType.SCHEDULED];
    const manualTypes: SnapshotType[] = [SnapshotType.MANUAL, SnapshotType.PRE_DEPLOY, SnapshotType.PRE_REMIX];

    const { count: autoCount } = await this.prisma.projectSnapshot.updateMany({
      where: {
        snapshotType: { in: autoTypes },
        status:       SnapshotStatus.READY,
        createdAt:    { lt: new Date(now - autoDays * 86_400_000) },
      },
      data: { status: SnapshotStatus.EXPIRED },
    }).catch(() => ({ count: 0 }));
    total += autoCount;

    const { count: manualCount } = await this.prisma.projectSnapshot.updateMany({
      where: {
        snapshotType: { in: manualTypes },
        status:       SnapshotStatus.READY,
        createdAt:    { lt: new Date(now - manualDays * 86_400_000) },
      },
      data: { status: SnapshotStatus.EXPIRED },
    }).catch(() => ({ count: 0 }));
    total += manualCount;

    // Enforce per-project max: find projects that exceed the limit
    const excess = await this.prisma.$queryRaw<Array<{ projectId: string }>>`
      SELECT "projectId"
      FROM   "ProjectSnapshot"
      WHERE  "status" = 'READY'
        AND  "projectId" IS NOT NULL
      GROUP  BY "projectId"
      HAVING COUNT(*) > ${maxPerProject}
    `.catch(() => [] as Array<{ projectId: string }>);

    for (const { projectId } of excess) {
      // Find oldest IDs beyond the limit
      const oldest = await this.prisma.projectSnapshot.findMany({
        where:   { projectId, status: SnapshotStatus.READY },
        orderBy: { createdAt: 'asc' },
        take:    500,
        select:  { id: true },
      });
      const toExpire = oldest.slice(0, oldest.length - maxPerProject).map((s) => s.id);
      if (toExpire.length > 0) {
        const { count } = await this.prisma.projectSnapshot.updateMany({
          where: { id: { in: toExpire } },
          data:  { status: SnapshotStatus.EXPIRED },
        }).catch(() => ({ count: 0 }));
        total += count;
      }
    }

    return total;
  }

  // 08-06: Check if auto-restore policy allows a restore attempt
  autoRestoreEnabled(): boolean { return AUTO_RESTORE_ENABLED; }
  autoRestoreMaxAttempts(): number { return AUTO_RESTORE_MAX_ATTEMPTS; }

  // ── Private helpers ─────────────────────────────────────────────────────────

  async createRecoveryEvent(opts: {
    runtimeId?:   string;
    projectId?:   string;
    snapshotId?:  string;
    eventType:    RecoveryEventType;
    status:       EventStatus;
    reason?:      string;
    metadata?:    Record<string, unknown>;
    completedAt?: Date;
  }): Promise<void> {
    await this.prisma.runtimeRecoveryEvent.create({
      data: {
        id:          randomUUID(),
        runtimeId:   opts.runtimeId   ?? null,
        projectId:   opts.projectId   ?? null,
        snapshotId:  opts.snapshotId  ?? null,
        eventType:   opts.eventType,
        status:      opts.status,
        reason:      opts.reason      ?? null,
        metadata:    opts.metadata ? JSON.stringify(opts.metadata) : null,
        completedAt: opts.completedAt ?? null,
      },
    }).catch(() => {});
  }

  private emitActivity(opts: {
    eventType: string;
    title:     string;
    severity:  ActivitySeverity;
    status:    EventStatus;
    projectId?: string;
    runtimeId?: string;
    metadata?:  Record<string, unknown>;
  }): Promise<void> {
    return this.activity.append({
      agentType:  AgentType.HEALER,
      eventType:  opts.eventType,
      title:      opts.title,
      severity:   opts.severity,
      status:     opts.status,
      projectId:  opts.projectId,
      runtimeId:  opts.runtimeId,
      metadata:   opts.metadata,
      startedAt:  new Date(),
    }).then(() => {}).catch(() => {});
  }
}
