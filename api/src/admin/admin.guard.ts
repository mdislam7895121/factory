import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const adminKey = (process.env.ADMIN_API_KEY ?? '').trim();
    if (!adminKey) {
      throw new UnauthorizedException('Admin access not configured');
    }

    const req    = context.switchToHttp().getRequest<Request>();
    const header = (req.headers['authorization'] ?? '') as string;
    const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!provided) throw new UnauthorizedException('Admin API key required');

    try {
      const a = Buffer.from(adminKey, 'utf8');
      const b = Buffer.from(provided,  'utf8');
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        throw new UnauthorizedException('Invalid admin API key');
      }
    } catch {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }
}
