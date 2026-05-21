import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { apiUserId?: string }>();
    const header = req.headers['authorization'] ?? '';
    const raw = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!raw || !raw.startsWith('sk-live-')) {
      throw new UnauthorizedException('API key required');
    }

    const userId = await this.apiKeyService.validate(raw);
    req.apiUserId = userId;
    return true;
  }
}
