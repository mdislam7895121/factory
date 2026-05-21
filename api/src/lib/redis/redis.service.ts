import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private _client!: Redis;

  onModuleInit() {
    const url = (process.env.REDIS_URL ?? 'redis://localhost:6379').trim();
    this._client = new Redis(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 2,
      connectTimeout: 5_000,
      enableReadyCheck: true,
    });
    this._client.on('connect', () => this.logger.log('Redis connected'));
    this._client.on('ready', () => this.logger.log('Redis ready'));
    this._client.on('error', (err: Error) =>
      this.logger.error(`Redis error: ${err.message}`),
    );
  }

  onModuleDestroy() {
    this._client.disconnect();
  }

  get client(): Redis {
    return this._client;
  }
}
