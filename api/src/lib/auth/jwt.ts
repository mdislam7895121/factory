import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

type AccessTokenPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor() {
    const secret = (process.env.AUTH_SECRET || '').trim();
    if (!secret) {
      throw new Error(
        'AUTH_SECRET environment variable is required. Please set AUTH_SECRET in your environment.',
      );
    }

    this.secret = secret;
  }

  signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded !== 'object' || decoded === null) {
        throw new UnauthorizedException('invalid token');
      }

      const sub = (decoded as { sub?: unknown }).sub;
      const email = (decoded as { email?: unknown }).email;

      if (typeof sub !== 'string' || typeof email !== 'string') {
        throw new UnauthorizedException('invalid token');
      }

      return { sub, email };
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }
}
