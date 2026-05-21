import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyService } from './api-key.service';

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_MIN = 60;

interface RateBucket { count: number; resetAt: number }

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly buckets = new Map<string, RateBucket>();

  constructor(private readonly apiKeyService: ApiKeyService) {
    setInterval(() => {
      const now = Date.now();
      for (const [k, v] of this.buckets) {
        if (now >= v.resetAt) this.buckets.delete(k);
      }
    }, RATE_WINDOW_MS).unref();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { apiUserId?: string }>();
    const header = req.headers['authorization'] ?? '';
    const raw = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!raw || !raw.startsWith('sk-live-')) {
      throw new UnauthorizedException('API key required');
    }

    const userId = await this.apiKeyService.validate(raw);
    req.apiUserId = userId;

    // Per-key rate limiting
    const now = Date.now();
    const existing = this.buckets.get(raw);
    const bucket: RateBucket =
      !existing || now >= existing.resetAt
        ? { count: 0, resetAt: now + RATE_WINDOW_MS }
        : existing;

    bucket.count += 1;
    this.buckets.set(raw, bucket);

    if (bucket.count > RATE_LIMIT_PER_MIN) {
      throw new HttpException(
        { ok: false, error: 'TOO_MANY_REQUESTS', retry_after_secs: Math.ceil((bucket.resetAt - now) / 1000) },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
