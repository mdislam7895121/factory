import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

const RETENTION_DAYS = parseInt(process.env.PREVIEW_LOG_RETENTION_DAYS ?? '30', 10);

@Injectable()
export class PreviewLogService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PreviewLogService.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    // Daily TTL cleanup
    this.timer = setInterval(() => { void this.cleanup(); }, 24 * 60 * 60 * 1000);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  // 05-08: Record access — privacy-safe (store hashes, not raw values)
  async record(opts: {
    runtimeId:  string;
    ip:         string;
    ua:         string;
    path:       string;
    statusCode: number;
  }): Promise<void> {
    const ipHash = createHash('sha256').update(opts.ip || 'unknown').digest('hex');
    const uaHash = createHash('sha256').update(opts.ua || '').digest('hex');
    await this.prisma.previewAccessLog.create({
      data: {
        id:         randomUUID(),
        runtimeId:  opts.runtimeId,
        ipHash,
        uaHash,
        path:       (opts.path || '/').slice(0, 512),
        statusCode: opts.statusCode,
      },
    }).catch(() => {}); // best-effort; never block the response
  }

  private async cleanup(): Promise<void> {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    try {
      const { count } = await this.prisma.previewAccessLog.deleteMany({
        where: { createdAt: { lt: cutoff } },
      });
      if (count > 0) this.logger.log(`cleaned ${count} preview access log entries`);
    } catch (err) {
      this.logger.warn({ err }, 'preview log cleanup failed');
    }
  }
}
