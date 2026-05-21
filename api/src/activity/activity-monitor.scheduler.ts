import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AgentType, ActivitySeverity, EventStatus, RuntimeStatus } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityStreamService } from './activity-stream.service';

const MONITOR_INTERVAL_MS = parseInt(process.env.ACTIVITY_MONITOR_INTERVAL_MS ?? '30000', 10);

/**
 * 07-06: Observer — watches RuntimeInstance for CRASHED / recovering state
 * transitions and emits AgentActivityEvents without coupling to RuntimeModule.
 */
@Injectable()
export class ActivityMonitorScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ActivityMonitorScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastCheck = new Date();

  constructor(
    private readonly prisma:           PrismaService,
    private readonly activityService:  ActivityStreamService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => { void this.tick(); }, MONITOR_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick(): Promise<void> {
    const since = this.lastCheck;
    this.lastCheck = new Date();

    // 07-06: Detect newly CRASHED runtimes
    const crashed = await this.prisma.runtimeInstance.findMany({
      where: { status: RuntimeStatus.CRASHED, updatedAt: { gte: since } },
      select: { id: true, projectId: true, recoveryCount: true },
    }).catch(() => []);

    for (const r of crashed) {
      await this.activityService.append({
        runtimeId:  r.id,
        projectId:  r.projectId ?? undefined,
        agentType:  AgentType.HEALER,
        eventType:  'RUNTIME_CRASHED',
        title:      'Runtime heartbeat lost — marked CRASHED',
        severity:   ActivitySeverity.ERROR,
        status:     EventStatus.FAILED,
        startedAt:  new Date(),
        metadata:   { recoveryCount: r.recoveryCount },
      }).catch(() => {});
    }

    // 07-06: Detect recovery attempts (PROVISIONING with recoveryCount > 0)
    const recovering = await this.prisma.runtimeInstance.findMany({
      where: {
        status:        RuntimeStatus.PROVISIONING,
        recoveryCount: { gt: 0 },
        updatedAt:     { gte: since },
      },
      select: { id: true, projectId: true, recoveryCount: true },
    }).catch(() => []);

    for (const r of recovering) {
      await this.activityService.append({
        runtimeId:  r.id,
        projectId:  r.projectId ?? undefined,
        agentType:  AgentType.HEALER,
        eventType:  'RECOVERY_TRIGGERED',
        title:      `Healer: recovery attempt ${r.recoveryCount}`,
        severity:   ActivitySeverity.WARNING,
        status:     EventStatus.RUNNING,
        startedAt:  new Date(),
        metadata:   { attempt: r.recoveryCount },
      }).catch(() => {});
    }

    // Detect runtimes that successfully came back RUNNING after a crash
    const healed = await this.prisma.runtimeInstance.findMany({
      where: {
        status:        RuntimeStatus.RUNNING,
        recoveryCount: { gt: 0 },
        updatedAt:     { gte: since },
      },
      select: { id: true, projectId: true, recoveryCount: true },
    }).catch(() => []);

    for (const r of healed) {
      await this.activityService.append({
        runtimeId:  r.id,
        projectId:  r.projectId ?? undefined,
        agentType:  AgentType.HEALER,
        eventType:  'RECOVERY_SUCCESS',
        title:      'Runtime recovered and running',
        severity:   ActivitySeverity.INFO,
        status:     EventStatus.SUCCESS,
        startedAt:  new Date(),
        metadata:   { recoveryCount: r.recoveryCount },
      }).catch(() => {});
    }
  }
}
