import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyService } from './api-key.service';
import { RedisService } from '../lib/redis/redis.service';

const RATE_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10);
const RATE_LIMIT_PER_MIN = parseInt(process.env.RATE_LIMIT_MAX ?? '60', 10);

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { apiUserId?: string }>();
    const header = req.headers['authorization'] ?? '';
    const raw = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!raw || !raw.startsWith('sk-live-')) {
      throw new UnauthorizedException('API key required');
    }

    const userId = await this.apiKeyService.validate(raw);
    req.apiUserId = userId;

    // Redis fixed-window rate limiting — shared across all instances
    const redisKey = `rl:ak:${raw}`;
    const count = await this.redis.client.incr(redisKey);
    if (count === 1) {
      await this.redis.client.pexpire(redisKey, RATE_WINDOW_MS);
    }

    if (count > RATE_LIMIT_PER_MIN) {
      const ttlMs = await this.redis.client.pttl(redisKey);
      throw new HttpException(
        {
          ok: false,
          error: 'TOO_MANY_REQUESTS',
          retry_after_secs: Math.ceil(Math.max(ttlMs, 0) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
