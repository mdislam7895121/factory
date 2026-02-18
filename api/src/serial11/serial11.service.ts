import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ProjectStatus,
  ProvisioningRunStatus,
  type Project,
} from '../generated/prisma';
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

@Injectable()
export class Serial11Service {
  constructor(private readonly prisma: PrismaService) {}

  private get orchestratorBaseUrl(): string {
    return process.env.ORCHESTRATOR_BASE_URL ?? 'http://orchestrator:4100';
  }

  private get previewBaseUrl(): string {
    return process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  }

  private get logsWsBaseUrl(): string {
    return process.env.ORCHESTRATOR_WS_PUBLIC_BASE_URL ?? 'ws://localhost:4100';
  }

  private ensureNonEmptyName(rawName: unknown, fallback: string): string {
    const resolvedName =
      typeof rawName === 'string' && rawName.trim().length > 0
        ? rawName
        : fallback;
    const name = resolvedName.trim();
    if (!name) {
      throw new BadRequestException('name is required');
    }
    return name;
  }

  private buildPreviewUrl(orchestratorProjectId: string): string {
    return `${this.previewBaseUrl.replace(/\/$/, '')}/p/${encodeURIComponent(orchestratorProjectId)}/`;
  }

  private buildLogsRef(orchestratorProjectId: string): string {
    return `${this.logsWsBaseUrl.replace(/\/$/, '')}/v1/ws/projects/${encodeURIComponent(orchestratorProjectId)}/logs`;
  }

  private async callOrchestrator<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
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

  private mapProjectStatus(status: OrchestratorProjectStatus): ProjectStatus {
    if (status.running && status.healthy) {
      return ProjectStatus.READY;
    }
    if (status.running) {
      return ProjectStatus.RUNNING;
    }
    return ProjectStatus.QUEUED;
  }

  private async syncProjectFromOrchestrator(
    project: Project,
  ): Promise<Project> {
    if (!project.orchestratorProjectId) {
      return project;
    }

    try {
      const orchestratorStatus =
        await this.callOrchestrator<OrchestratorStatusResponse>(
          `/v1/projects/${encodeURIComponent(project.orchestratorProjectId)}/status`,
        );

      const nextStatus = this.mapProjectStatus(orchestratorStatus.status);
      return this.prisma.project.update({
        where: { id: project.id },
        data: {
          status: nextStatus,
          previewUrl: this.buildPreviewUrl(orchestratorStatus.status.id),
          logsRef: this.buildLogsRef(orchestratorStatus.status.id),
          provisionError: null,
        },
      });
    } catch (error) {
      void error;
      return project;
    }
  }

  async listTemplates() {
    const templates = new Set<string>();
    templates.add('basic-web');

    try {
      const response = await this.callOrchestrator<{
        ok: boolean;
        projects: Array<{ template?: string }>;
      }>('/v1/projects');
      for (const project of response.projects) {
        const template = String(project.template ?? '').trim();
        if (template) {
          templates.add(template);
        }
      }
    } catch (error) {
      void error;
    }

    return {
      ok: true,
      templates: Array.from(templates).map((templateId) => ({
        id: templateId,
      })),
    };
  }

  async createWorkspace(body: { name?: string }) {
    const name = this.ensureNonEmptyName(body?.name, 'Default Workspace');
    const workspace = await this.prisma.workspace.create({ data: { name } });
    return { ok: true, workspace };
  }

  async listWorkspaces() {
    const workspaces = await this.prisma.workspace.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { projects: true } } },
    });

    return {
      ok: true,
      workspaces: workspaces.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
        projectCount: workspace._count.projects,
      })),
    };
  }

  async getWorkspace(id: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            templateId: true,
            status: true,
            previewUrl: true,
            logsRef: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }

    return { ok: true, workspace };
  }

  async createWorkspaceProject(
    workspaceId: string,
    body: { name?: string; templateId?: string },
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }

    const name = this.ensureNonEmptyName(body?.name, 'Untitled Project');
    const templateId =
      String(body?.templateId ?? 'basic-web').trim() || 'basic-web';

    const orchestratorCreate =
      await this.callOrchestrator<OrchestratorCreateResponse>('/v1/projects', {
        method: 'POST',
        body: JSON.stringify({ name, template: templateId }),
      });

    const project = await this.prisma.project.create({
      data: {
        workspaceId,
        name,
        templateId,
        orchestratorProjectId: orchestratorCreate.project.id,
        status: ProjectStatus.QUEUED,
        previewUrl: this.buildPreviewUrl(orchestratorCreate.project.id),
        logsRef: this.buildLogsRef(orchestratorCreate.project.id),
      },
    });

    return { ok: true, project };
  }

  async listWorkspaceProjects(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }

    const projects = await this.prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return { ok: true, projects };
  }

  async getProject(projectId: string) {
    const existing = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        provisioningRuns: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('project not found');
    }

    const synced = await this.syncProjectFromOrchestrator(existing);

    return {
      ok: true,
      project: {
        ...synced,
        workspace: existing.workspace,
        provisioningRuns: existing.provisioningRuns,
      },
    };
  }

  async provisionProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('project not found');
    }

    if (!project.orchestratorProjectId) {
      throw new InternalServerErrorException(
        'project is missing orchestratorProjectId',
      );
    }

    if (project.status === ProjectStatus.READY) {
      return {
        ok: true,
        idempotent: true,
        status: project.status,
        project,
      };
    }

    const run = await this.prisma.provisioningRun.create({
      data: {
        projectId,
        status: ProvisioningRunStatus.RUNNING,
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: ProjectStatus.RUNNING,
        provisionError: null,
      },
    });

    try {
      const orchestratorStart =
        await this.callOrchestrator<OrchestratorStatusResponse>(
          `/v1/projects/${encodeURIComponent(project.orchestratorProjectId)}/start`,
          { method: 'POST' },
        );

      const status = this.mapProjectStatus(orchestratorStart.status);
      const updatedProject = await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status,
          previewUrl: this.buildPreviewUrl(project.orchestratorProjectId),
          logsRef: this.buildLogsRef(project.orchestratorProjectId),
          provisionError: null,
        },
      });

      const runStatus =
        status === ProjectStatus.FAILED
          ? ProvisioningRunStatus.FAILED
          : status === ProjectStatus.READY
            ? ProvisioningRunStatus.READY
            : ProvisioningRunStatus.RUNNING;

      await this.prisma.provisioningRun.update({
        where: { id: run.id },
        data: {
          status: runStatus,
          finishedAt:
            runStatus === ProvisioningRunStatus.RUNNING ? null : new Date(),
        },
      });

      return {
        ok: true,
        idempotent: false,
        status: updatedProject.status,
        project: updatedProject,
      };
    } catch (error) {
      const message = String((error as Error)?.message ?? error);

      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: ProjectStatus.FAILED,
          provisionError: message,
        },
      });

      await this.prisma.provisioningRun.update({
        where: { id: run.id },
        data: {
          status: ProvisioningRunStatus.FAILED,
          error: message,
          finishedAt: new Date(),
        },
      });

      throw new BadRequestException(message);
    }
  }
}
