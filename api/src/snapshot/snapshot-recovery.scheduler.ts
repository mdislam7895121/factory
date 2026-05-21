import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventStatus, RecoveryEventType, RuntimeStatus, SnapshotType } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { SnapshotService } from './snapshot.service';

const TICK_MS = parseInt(process.env.ACTIVITY_MONITOR_INTERVAL_MS ?? '30000', 10);

/**
 * 08-06: Observer — watches for CRASHED runtimes and, when AUTO_RESTORE_ENABLED,
 * attempts to restore the last READY snapshot. Queries DB directly to avoid
 * coupling to RuntimeModule.
 */
@Injectable()
export class SnapshotRecoveryScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SnapshotRecoveryScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastCheck = new Date();

  // Track how many auto-restore attempts have been made per runtimeId this cycle
  private readonly restoreAttempts = new Map<string, number>();

  constructor(
    private readonly prisma:          PrismaService,
    private readonly snapshotService: SnapshotService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => { void this.tick(); }, TICK_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick(): Promise<void> {
    if (!this.snapshotService.autoRestoreEnabled()) return;

    const since = this.lastCheck;
    this.lastCheck = new Date();

    const crashed = await this.prisma.runtimeInstance.findMany({
      where: { status: RuntimeStatus.CRASHED, updatedAt: { gte: since } },
      select: { id: true, projectId: true, ownerUserId: true, recoveryCount: true },
    }).catch(() => []);

    for (const r of crashed) {
      const attempts = this.restoreAttempts.get(r.id) ?? 0;
      if (attempts >= this.snapshotService.autoRestoreMaxAttempts()) {
        // Reset counter after runtime eventually reaches a non-crashed state
        continue;
      }

      const latest = await this.snapshotService.getLatestReady(r.id);
      if (!latest) {
        // No ready snapshot — emit recovery event and skip
        await this.snapshotService.createRecoveryEvent({
          runtimeId: r.id,
          projectId: r.projectId ?? undefined,
          eventType: RecoveryEventType.RUNTIME_RECOVERED,
          status:    EventStatus.FAILED,
          reason:    'no READY snapshot available for auto-restore',
        });
        continue;
      }

      this.restoreAttempts.set(r.id, attempts + 1);
      this.logger.log({ runtimeId: r.id, snapshotId: latest.id, attempt: attempts + 1 }, 'auto-restore triggered');

      // Create an AUTO_RECOVERY snapshot first so the current (crashed) state is saved
      await this.snapshotService.createSnapshot({
        runtimeId:    r.id,
        projectId:    r.projectId ?? undefined,
        ownerUserId:  r.ownerUserId,
        label:        'pre-restore crash capture',
        reason:       `auto-recovery attempt ${attempts + 1}`,
        snapshotType: SnapshotType.AUTO_RECOVERY,
      }).catch(() => {});

      // Restore the latest READY snapshot (will preserve previewUrl + fork lineage)
      await this.snapshotService.restoreSnapshot(latest.id, r.ownerUserId).catch(async (err) => {
        this.logger.warn({ runtimeId: r.id, err: String(err) }, 'auto-restore failed');
        await this.snapshotService.createRecoveryEvent({
          runtimeId:  r.id,
          projectId:  r.projectId ?? undefined,
          snapshotId: latest.id,
          eventType:  RecoveryEventType.ROLLBACK_TRIGGERED,
          status:     EventStatus.FAILED,
          reason:     String(err),
          completedAt: new Date(),
        });
      });
    }

    // Clear attempt counters for runtimes that have recovered (no longer CRASHED)
    if (this.restoreAttempts.size > 0) {
      const trackedIds = [...this.restoreAttempts.keys()];
      const recovered  = await this.prisma.runtimeInstance.findMany({
        where: { id: { in: trackedIds }, status: { not: RuntimeStatus.CRASHED } },
        select: { id: true },
      }).catch(() => []);
      for (const { id } of recovered) this.restoreAttempts.delete(id);
    }
  }
}
