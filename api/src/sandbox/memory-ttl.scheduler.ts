import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MemoryService } from './memory.service';

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

@Injectable()
export class MemoryTtlScheduler implements OnModuleInit, OnModuleDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly memoryService: MemoryService) {}

  onModuleInit() {
    this.timer = setInterval(async () => {
      const purged = await this.memoryService.purgeExpired().catch(() => 0);
      if (purged > 0) {
        console.log(`[memory-ttl] purged ${purged} expired entries`);
      }
    }, CLEANUP_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
