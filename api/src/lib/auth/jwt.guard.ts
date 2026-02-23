import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from './jwt';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('authentication required');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('authentication required');
    }

    const payload = this.jwtService.verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return true;
  }
}
