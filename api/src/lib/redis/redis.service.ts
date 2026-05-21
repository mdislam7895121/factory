import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { getRedisPrefix, getRedisRuntimeTtl } from '../../config/env.contract';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private _client!: Redis;
  private _heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  get prefix(): string { return getRedisPrefix(); }
  get runtimeTtl(): number { return getRedisRuntimeTtl(); }

  onModuleInit() {
    const url = (process.env.REDIS_URL ?? 'redis://localhost:6379').trim();
    this._client = new Redis(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 2,
      connectTimeout: 5_000,
      enableReadyCheck: true,
    });

    this._client.on('connect', () => this.logger.log('Redis connected'));
    this._client.on('ready',   () => {
      this.logger.log('Redis ready');
      void this._pingAndLog();
      this._startHeartbeat();
    });
    this._client.on('error', (err: Error) =>
      this.logger.error(`Redis error: ${err.message}`),
    );
  }

  onModuleDestroy() {
    if (this._heartbeatTimer) clearInterval(this._heartbeatTimer);
    this._client.disconnect();
  }

  get client(): Redis {
    return this._client;
  }

  private async _pingAndLog(): Promise<void> {
    try {
      const pong = await this._client.ping();
      this.logger.log(`Redis ping: ${pong}`);
    } catch (err) {
      this.logger.error(`Redis ping failed: ${(err as Error).message}`);
    }
  }

  private _startHeartbeat(): void {
    const instanceId = (process.env.INSTANCE_ID ?? String(process.pid)).trim();
    const key = `${this.prefix}:runtime:heartbeat:${instanceId}`;
    const ttl = this.runtimeTtl;

    const beat = async () => {
      await this._client
        .set(key, new Date().toISOString(), 'EX', ttl)
        .catch(() => {});
    };

    void beat();
    this._heartbeatTimer = setInterval(() => { void beat(); }, Math.floor(ttl * 1000 * 0.4));
    this._heartbeatTimer.unref();
    this.logger.log(`Runtime heartbeat started (key=${key} ttl=${ttl}s)`);
  }
}
