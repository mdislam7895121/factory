import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    input: { name?: string; slug?: string },
    ownerUserId: string,
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        isActive: true,
        OR: [{ ownerUserId }, { ownerId: ownerUserId }],
      },
    });

    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }

    const name = this.normalizeName(input?.name);
    const slug = this.normalizeSlug(input?.slug);

    try {
      const project = await this.prisma.project.create({
        data: {
          workspaceId,
          name,
          slug,
          templateId: 'basic-web',
          isActive: true,
        },
      });

      return project;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: unknown }).code === 'P2002'
      ) {
        throw new ConflictException('slug already exists in workspace');
      }

      throw error;
    }
  }

  async list(workspaceId: string, ownerUserId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        isActive: true,
        OR: [{ ownerUserId }, { ownerId: ownerUserId }],
      },
    });

    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }

    return this.prisma.project.findMany({
      where: {
        workspaceId,
        isActive: true,
      },
      orderBy: { createdAt: 'asc' },
    });
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

  private normalizeSlug(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('slug is required');
    }

    const normalized = value.trim();
    if (!/^[a-z0-9-]{2,40}$/.test(normalized)) {
      throw new BadRequestException(
        'slug must be 2..40 chars, lower-case [a-z0-9-]',
      );
    }

    return normalized;
  }
}
