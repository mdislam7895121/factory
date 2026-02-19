import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type OrchestratorProjectStatus = {
  id: string;
  name: string;
  template: string;
  running: boolean;
  healthy: boolean;
  port: number;
  previewPath: string;
  containerName: string;
  createdAt: string;
};

type OrchestratorCreateResponse = {
  ok: boolean;
  project: OrchestratorProjectStatus;
};

type OrchestratorStatusResponse = {
  ok: boolean;
  status: OrchestratorProjectStatus;
};

type PublicProjectResponse = {
  projectId: string;
  templateId: string;
  status: string;
  previewUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const TEMPLATE_REGISTRY: Record<string, { repoUrl: string; orchestratorTemplate: string }> = {
  'nextjs-basic': {
    repoUrl: 'https://github.com/vercel/next.js/tree/canary/examples/with-docker',
    orchestratorTemplate: 'basic-web',
  },
  'basic-web': {
    repoUrl: 'https://example.local/templates/basic-web',
    orchestratorTemplate: 'basic-web',
  },
};

@Injectable()
export class ProvisioningService {
  private readonly logger = new Logger(ProvisioningService.name);
  private readonly activeProjects = new Set<string>();

  constructor(private readonly prisma: PrismaService) {}

  private get orchestratorBaseUrl(): string {
    return process.env.ORCHESTRATOR_BASE_URL ?? 'http://orchestrator:4100';
  }

  private get previewBaseUrl(): string {
    return process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://preview.local';
  }

  private buildPreviewUrl(projectId: string): string {
    return `${this.previewBaseUrl.replace(/\/$/, '')}/${encodeURIComponent(projectId)}`;
  }

  private toResponse(project: {
    id: string;
    templateId: string;
    status: string;
    previewUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PublicProjectResponse {
    return {
      projectId: project.id,
      templateId: project.templateId,
      status: project.status,
      previewUrl: project.previewUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private async callOrchestrator<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.orchestratorBaseUrl}${path}`, {
      headers: { 'content-type': 'application/json' },
      ...init,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new BadRequestException(
        `orchestrator error: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return (await response.json()) as T;
  }

  async createPublicProject(body: { templateId?: string }) {
    const templateId = String(body?.templateId ?? '').trim() || 'nextjs-basic';
    const template = TEMPLATE_REGISTRY[templateId];
    if (!template) {
      throw new BadRequestException(`Unknown templateId: ${templateId}`);
    }

    const project = await this.prisma.publicProject.create({
      data: {
        ownerId: 'public',
        templateId,
        repoUrl: template.repoUrl,
        status: 'provisioning',
      },
    });

    return {
      projectId: project.id,
      status: project.status,
    };
  }

  async getPublicProject(projectId: string): Promise<PublicProjectResponse> {
    const project = await this.prisma.publicProject.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestException('project not found');
    }
    return this.toResponse(project);
  }

  async findPublicProject(projectId: string): Promise<PublicProjectResponse | null> {
    const project = await this.prisma.publicProject.findUnique({ where: { id: projectId } });
    if (!project) {
      return null;
    }
    return this.toResponse(project);
  }

  async getPublicProjectLogs(projectId: string): Promise<string> {
    const project = await this.prisma.publicProject.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestException('project not found');
    }
    if (!project.containerId) {
      throw new BadRequestException('container not available yet');
    }

    const response = await fetch(
      `${this.orchestratorBaseUrl}/v1/projects/${encodeURIComponent(project.containerId)}/logs`,
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new BadRequestException(
        `orchestrator logs error: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return response.text();
  }

  async processPendingJobs(): Promise<void> {
    const pending = await this.prisma.publicProject.findMany({
      where: {
        status: {
          in: ['provisioning', 'booting'],
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    });

    for (const project of pending) {
      if (this.activeProjects.has(project.id)) {
        continue;
      }
      this.activeProjects.add(project.id);
      void this.provisionProject(project.id).finally(() => {
        this.activeProjects.delete(project.id);
      });
    }
  }

  private async markFailed(projectId: string, error: unknown): Promise<void> {
    await this.prisma.publicProject.update({
      where: { id: projectId },
      data: {
        status: 'failed',
      },
    });

    this.logger.error(`Public provisioning failed for ${projectId}: ${String((error as Error)?.message ?? error)}`);
  }

  async provisionProject(projectId: string): Promise<void> {
    const project = await this.prisma.publicProject.findUnique({ where: { id: projectId } });
    if (!project) {
      return;
    }
    if (project.status === 'running' || project.status === 'failed') {
      return;
    }

    const template = TEMPLATE_REGISTRY[project.templateId];
    if (!template) {
      await this.markFailed(projectId, new InternalServerErrorException('template registry mismatch'));
      return;
    }

    try {
      await this.prisma.publicProject.update({
        where: { id: projectId },
        data: {
          status: 'provisioning',
        },
      });

      const createResponse = await this.callOrchestrator<OrchestratorCreateResponse>('/v1/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: `public-${projectId.slice(0, 8)}`,
          template: template.orchestratorTemplate,
        }),
      });

      await this.prisma.publicProject.update({
        where: { id: projectId },
        data: {
          status: 'booting',
          containerId: createResponse.project.id,
          previewUrl: this.buildPreviewUrl(projectId),
        },
      });

      await this.callOrchestrator<OrchestratorStatusResponse>(
        `/v1/projects/${encodeURIComponent(createResponse.project.id)}/start`,
        { method: 'POST' },
      );

      for (let attempt = 1; attempt <= 20; attempt += 1) {
        const status = await this.callOrchestrator<OrchestratorStatusResponse>(
          `/v1/projects/${encodeURIComponent(createResponse.project.id)}/status`,
        );

        if (status.status.running) {
          await this.prisma.publicProject.update({
            where: { id: projectId },
            data: {
              status: 'running',
              containerId: createResponse.project.id,
              previewUrl: this.buildPreviewUrl(projectId),
            },
          });
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      throw new InternalServerErrorException('container did not reach running state in time');
    } catch (error) {
      await this.markFailed(projectId, error);
    }
  }
}
