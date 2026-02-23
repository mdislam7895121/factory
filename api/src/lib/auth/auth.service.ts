import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from './jwt';

type LoginResult = {
  accessToken: string;
  tokenType: 'Bearer';
  user: {
    id: string;
    email: string;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(input: { email?: string; password?: string }): Promise<LoginResult> {
    const email = this.normalizeEmail(input.email);
    const password = this.normalizePassword(input.password);
    const passwordHash = await hash(password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
        },
      });

      const accessToken = this.jwtService.signAccessToken({
        sub: user.id,
        email: user.email,
      });

      return {
        accessToken,
        tokenType: 'Bearer',
        user,
      };
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: unknown }).code === 'P2002'
      ) {
        throw new ConflictException('email already exists');
      }

      throw error;
    }
  }

  async login(input: { email?: string; password?: string }): Promise<LoginResult> {
    const email = this.normalizeEmail(input.email);
    const password = this.normalizePassword(input.password);

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const accessToken = this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private normalizeEmail(email: unknown): string {
    if (typeof email !== 'string') {
      throw new BadRequestException('email is required');
    }

    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      throw new BadRequestException('email is invalid');
    }

    return normalized;
  }

  private normalizePassword(password: unknown): string {
    if (typeof password !== 'string') {
      throw new BadRequestException('password is required');
    }

    const normalized = password.trim();
    if (normalized.length < 8) {
      throw new BadRequestException('password must be at least 8 characters');
    }

    return normalized;
  }
}
