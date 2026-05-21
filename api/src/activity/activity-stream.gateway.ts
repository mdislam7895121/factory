import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import type { Response } from 'express';

const REDIS_URL    = (process.env.REDIS_URL    ?? 'redis://localhost:6379').trim();
const REDIS_PREFIX = (process.env.REDIS_PREFIX ?? 'factory').trim();

/**
 * 07-03: Redis pub/sub fan-out gateway for SSE activity streams.
 * Maintains a separate ioredis subscriber connection (required by ioredis —
 * a subscribed client cannot issue regular commands).
 */
@Injectable()
export class ActivityStreamGateway implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ActivityStreamGateway.name);

  // Map<redis_channel, Set<Express.Response>>
  private readonly listeners = new Map<string, Set<Response>>();
  private subClient: Redis | null = null;

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;

    this.subClient = new Redis(REDIS_URL, {
      lazyConnect:          false,
      maxRetriesPerRequest: null,
      enableReadyCheck:     false,
    });
    this.subClient.on('error', () => {}); // fail-open

    // Pattern subscribe covers both project and runtime channels
    this.subClient.on('pmessage', (_pattern: string, channel: string, message: string) => {
      const bucket = this.listeners.get(channel);
      if (!bucket || bucket.size === 0) return;
      const frame = `data: ${message}\n\n`;
      for (const res of [...bucket]) {
        try { res.write(frame); }
        catch { bucket.delete(res); }
      }
    });

    this.subClient.psubscribe(`${REDIS_PREFIX}:activity:*`).catch(() => {});
    this.logger.log('Activity stream gateway started (Redis pub/sub)');
  }

  onModuleDestroy() {
    this.subClient?.disconnect();
    this.listeners.clear();
  }

  /**
   * Register an SSE client for a given Redis channel.
   * Returns a cleanup function to call on connection close.
   */
  addListener(channel: string, res: Response): () => void {
    const bucket = this.listeners.get(channel) ?? new Set();
    bucket.add(res);
    this.listeners.set(channel, bucket);
    return () => {
      bucket.delete(res);
      if (bucket.size === 0) this.listeners.delete(channel);
    };
  }
}
