import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';

// 08-07: Run every 4 hours
const TICK_MS = 4 * 60 * 60 * 1000;

@Injectable()
export class SnapshotRetentionScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SnapshotRetentionScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly snapshotService: SnapshotService) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => { void this.tick(); }, TICK_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick(): Promise<void> {
    const expired = await this.snapshotService.expireOldSnapshots();
    if (expired > 0) this.logger.log(`Snapshot retention: expired ${expired} snapshots`);
  }
}
