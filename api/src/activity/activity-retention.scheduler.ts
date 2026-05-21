import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ActivitySeverity } from '../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

// 07-10: Configurable per-severity retention windows
const RETENTION: Record<ActivitySeverity, number> = {
  [ActivitySeverity.INFO]:     parseInt(process.env.ACTIVITY_RETENTION_INFO_DAYS     ?? '7',  10),
  [ActivitySeverity.WARNING]:  parseInt(process.env.ACTIVITY_RETENTION_WARNING_DAYS  ?? '14', 10),
  [ActivitySeverity.ERROR]:    parseInt(process.env.ACTIVITY_RETENTION_ERROR_DAYS    ?? '30', 10),
  [ActivitySeverity.CRITICAL]: parseInt(process.env.ACTIVITY_RETENTION_CRITICAL_DAYS ?? '90', 10),
};

@Injectable()
export class ActivityRetentionScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ActivityRetentionScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    // Run every 6 hours
    this.timer = setInterval(() => { void this.cleanup(); }, 6 * 60 * 60 * 1000);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async cleanup(): Promise<void> {
    const now = Date.now();
    let total = 0;
    for (const [severity, days] of Object.entries(RETENTION)) {
      const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);
      const { count } = await this.prisma.agentActivityEvent.deleteMany({
        where: {
          severity: severity as ActivitySeverity,
          createdAt: { lt: cutoff },
        },
      }).catch(() => ({ count: 0 }));
      total += count;
    }
    if (total > 0) this.logger.log(`Activity retention: removed ${total} events`);
  }
}
