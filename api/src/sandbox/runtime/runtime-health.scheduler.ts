import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RuntimeStatus, SleepState } from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../lib/redis/redis.service';
import { RuntimeService } from './runtime.service';

const HEALTH_INTERVAL_MS = parseInt(process.env.RUNTIME_HEALTH_INTERVAL_MS ?? '30000', 10);
const HEARTBEAT_DEAD_SEC = parseInt(process.env.RUNTIME_HEARTBEAT_DEAD_SEC ?? '90',    10);
const IDLE_TTL_SEC       = parseInt(process.env.RUNTIME_IDLE_TTL_SEC       ?? '300',   10);
const SLEEP_TTL_SEC      = parseInt(process.env.RUNTIME_SLEEP_TTL_SEC      ?? '1800',  10);

@Injectable()
export class RuntimeHealthScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RuntimeHealthScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly runtimeService: RuntimeService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => { void this.tick(); }, HEALTH_INTERVAL_MS);
    this.timer.unref();
    this.logger.log(`Runtime health scheduler started (interval=${HEALTH_INTERVAL_MS}ms)`);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    try {
      await Promise.all([
        this.detectDeadRuntimes(),     // 04-04
        this.syncRedisHeartbeats(),    // 04-04
        this.applyIdleTransitions(),   // 04-03
        this.applySleepTransitions(),  // 04-05
      ]);
    } catch (err) {
      this.logger.error({ err }, 'health tick error');
    }
  }

  // 04-04: Mark runtimes CRASHED when heartbeat goes stale
  private async detectDeadRuntimes() {
    const deadThreshold = new Date(Date.now() - HEARTBEAT_DEAD_SEC * 1000);

    const deadRuntimes = await this.prisma.runtimeInstance.findMany({
      where: {
        status: RuntimeStatus.RUNNING,
        lastHeartbeatAt: { lt: deadThreshold },
      },
      select: { id: true, recoveryCount: true },
    });

    for (const r of deadRuntimes) {
      this.logger.warn({ id: r.id }, 'runtime heartbeat dead — marking CRASHED');
      await this.prisma.runtimeInstance.update({
        where: { id: r.id },
        data:  { status: RuntimeStatus.CRASHED },
      });

      // 04-07: Attempt recovery if policy allows
      await this.runtimeService.recover(r.id, 'heartbeat dead').catch(() => {});
    }
  }

  // 04-04: Sync Redis preview:lastSeen keys → DB lastAccessAt
  private async syncRedisHeartbeats() {
    const prefix = this.redis.prefix;
    const keys = await this.redis.client
      .keys(`${prefix}:preview:lastSeen:*`)
      .catch(() => [] as string[]);

    for (const key of keys) {
      const projectId = key.replace(`${prefix}:preview:lastSeen:`, '');
      const val = await this.redis.client.get(key).catch(() => null);
      if (!val) continue;

      // Sync access time to any RUNNING runtime linked to this projectId
      await this.prisma.runtimeInstance.updateMany({
        where: { projectId, status: RuntimeStatus.RUNNING },
        data:  { lastAccessAt: new Date(val), lastHeartbeatAt: new Date(val) },
      });
    }
  }

  // 04-03: Transition RUNNING → IDLE after inactivity
  private async applyIdleTransitions() {
    const idleThreshold = new Date(Date.now() - IDLE_TTL_SEC * 1000);

    await this.prisma.runtimeInstance.updateMany({
      where: {
        status:      RuntimeStatus.RUNNING,
        sleepState:  SleepState.AWAKE,
        lastAccessAt: { lt: idleThreshold },
      },
      data: { sleepState: SleepState.IDLE },
    });
  }

  // 04-05: Transition IDLE → SLEEPING after sleep threshold
  private async applySleepTransitions() {
    const sleepThreshold = new Date(Date.now() - SLEEP_TTL_SEC * 1000);

    const toSleep = await this.prisma.runtimeInstance.findMany({
      where: {
        status:      RuntimeStatus.RUNNING,
        sleepState:  SleepState.IDLE,
        lastAccessAt: { lt: sleepThreshold },
      },
      select: { id: true },
    });

    for (const r of toSleep) {
      this.logger.log({ id: r.id }, 'runtime idle → sleeping');
      await this.runtimeService.sleep(r.id).catch(() => {});
    }
  }
}
