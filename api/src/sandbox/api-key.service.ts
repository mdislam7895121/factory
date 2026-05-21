import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  generateRawKey(): string {
    return `sk-live-${randomBytes(32).toString('hex')}`;
  }

  hashKey(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  async create(userId: string, name: string) {
    const raw = this.generateRawKey();
    const hash = this.hashKey(raw);
    const prefix = raw.slice(0, 14);

    const apiKey = await this.prisma.apiKey.create({
      data: { userId, keyHash: hash, keyPrefix: prefix, name },
    });

    return { id: apiKey.id, key: raw, prefix, name, createdAt: apiKey.createdAt };
  }

  async validate(raw: string): Promise<string> {
    const hash = this.hashKey(raw);
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { keyHash: hash },
      select: { id: true, userId: true, isActive: true },
    });

    if (!apiKey || !apiKey.isActive) {
      throw new UnauthorizedException('Invalid API key');
    }

    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey.userId;
  }

  async list(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId, isActive: true },
      select: { id: true, keyPrefix: true, name: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(id: string, userId: string) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, userId } });
    if (!key) throw new UnauthorizedException('Key not found');
    await this.prisma.apiKey.update({ where: { id }, data: { isActive: false } });
    return { success: true };
  }
}
