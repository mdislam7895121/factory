import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: { name?: string }, ownerUserId: string) {
    const name = this.normalizeName(input?.name);

    const workspace = await this.prisma.workspace.create({
      data: {
        name,
        ownerId: ownerUserId,
        ownerUserId,
        isActive: true,
      },
    });

    return workspace;
  }

  async list(ownerUserId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        isActive: true,
        OR: [{ ownerUserId }, { ownerId: ownerUserId }],
      },
      orderBy: { createdAt: 'asc' },
    });

    return workspaces;
  }

  private normalizeName(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('name is required');
    }

    const normalized = value.trim();
    if (normalized.length < 2 || normalized.length > 80) {
      throw new BadRequestException('name must be 2..80 characters');
    }

    return normalized;
  }
}
