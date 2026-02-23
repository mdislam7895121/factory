import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  Prisma,
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
export class Serial11Service implements OnModuleInit {
  private readonly activeLogStreamsByUser = new Map<string, Set<string>>();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      await this.prisma.template.upsert({
        where: { id: 'basic-web' },
        create: {
          id: 'basic-web',
          name: 'Basic Web App',
          description: 'Minimal starter web template',
          isActive: true,
        },
        update: {
          name: 'Basic Web App',
          description: 'Minimal starter web template',
          isActive: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2021'
      ) {
        return;
      }
      throw error;
    }
  }

  private get orchestratorBaseUrl(): string {
    return process.env.ORCHESTRATOR_BASE_URL ?? 'http://orchestrator:4100';
  }

  private get previewBaseUrl(): string {
    return process.env.PREVIEW_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  }

  private get apiPublicBaseUrl(): string {
    return process.env.API_PUBLIC_BASE_URL ?? 'http://localhost:4000';
  }

  private get maxLogStreamsPerUser(): number {
    const raw = process.env.LOG_STREAM_MAX_PER_USER ?? '2';
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
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
    return `${this.apiPublicBaseUrl.replace(/\/$/, '')}/v1/projects/${encodeURIComponent(orchestratorProjectId)}/logs/stream`;
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

  private async callOrchestratorText(
    path: string,
    init?: RequestInit,
  ): Promise<string> {
    const response = await fetch(`${this.orchestratorBaseUrl}${path}`, {
      headers: { accept: 'text/plain, application/json;q=0.8' },
      ...init,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new BadRequestException(
        `orchestrator error: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return response.text();
  }

  private openLogStreamSlot(ownerId: string): () => void {
    const bucket =
      this.activeLogStreamsByUser.get(ownerId) ?? new Set<string>();

    if (bucket.size >= this.maxLogStreamsPerUser) {
      throw new HttpException(
        'too many active log streams',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const streamId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    bucket.add(streamId);
    this.activeLogStreamsByUser.set(ownerId, bucket);

    return () => {
      const current = this.activeLogStreamsByUser.get(ownerId);
      if (!current) {
        return;
      }

      current.delete(streamId);
      if (current.size === 0) {
        this.activeLogStreamsByUser.delete(ownerId);
      }
    };
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
    const templates = await this.prisma.template.findMany({
      where: { isActive: true },
      orderBy: [{ createdAt: 'asc' }],
      select: { id: true, name: true },
    });

    return {
      ok: true,
      templates,
    };
  }

  async getTemplate(id: string) {
    const template = await this.prisma.template.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!template) {
      throw new NotFoundException('template not found');
    }

    return { ok: true, template };
  }

  async createWorkspace(body: { name?: string }, ownerId: string) {
    const name = this.ensureNonEmptyName(body?.name, 'Default Workspace');
    const workspace = await this.prisma.workspace.create({
      data: { name, ownerId },
    });
    return { ok: true, workspace };
  }

  async listWorkspaces(ownerId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { ownerId },
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

  async getWorkspace(id: string, ownerId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id, ownerId },
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
    ownerId: string,
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
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

    setTimeout(() => {
      void this.provisionProject(project.id, ownerId).catch(
        (error: unknown) => {
          const message = String((error as Error)?.message ?? error);
          console.warn(
            `[WARN] background provision failed for project=${project.id}: ${message}`,
          );
        },
      );
    }, 0);

    return { ok: true, project };
  }

  async listWorkspaceProjects(workspaceId: string, ownerId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!workspace) {
      throw new NotFoundException('workspace not found');
    }

    const projects = await this.prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    const syncedProjects = await Promise.all(
      projects.map((project) => this.syncProjectFromOrchestrator(project)),
    );

    return { ok: true, projects: syncedProjects };
  }

  async getProject(projectId: string, ownerId: string) {
    const existing = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          ownerId,
        },
      },
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

  async streamProjectLogs(
    projectOrOrchestratorId: string,
    ownerId: string,
    res: Response,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        workspace: { ownerId },
        OR: [
          { id: projectOrOrchestratorId },
          { orchestratorProjectId: projectOrOrchestratorId },
        ],
      },
      select: {
        id: true,
        orchestratorProjectId: true,
        previewUrl: true,
        provisionError: true,
      },
    });

    if (!project) {
      throw new NotFoundException('project not found');
    }

    if (!project.orchestratorProjectId) {
      throw new InternalServerErrorException(
        'project is missing orchestratorProjectId',
      );
    }

    const orchestratorProjectId = project.orchestratorProjectId;

    const release = this.openLogStreamSlot(ownerId);
    let lastLogSnapshot = '';
    let closed = false;

    const sendSse = (event: string, payload: unknown) => {
      if (closed || res.writableEnded) {
        return;
      }
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    const closeStream = () => {
      if (closed) {
        return;
      }

      closed = true;
      clearInterval(pingInterval);
      clearInterval(statusInterval);
      clearInterval(logInterval);
      release();

      if (!res.writableEnded) {
        res.end();
      }
    };

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const emitStatus = async () => {
      try {
        const orchestratorStatus =
          await this.callOrchestrator<OrchestratorStatusResponse>(
            `/v1/projects/${encodeURIComponent(orchestratorProjectId)}/status`,
          );
        const nextStatus = this.mapProjectStatus(orchestratorStatus.status);
        const previewUrl = this.buildPreviewUrl(orchestratorStatus.status.id);

        await this.prisma.project.update({
          where: { id: project.id },
          data: {
            status: nextStatus,
            previewUrl,
            logsRef: this.buildLogsRef(orchestratorStatus.status.id),
          },
        });

        sendSse('status', {
          projectId: project.id,
          status: nextStatus,
          previewUrl,
          running: orchestratorStatus.status.running,
          healthy: orchestratorStatus.status.healthy,
        });
      } catch (error) {
        const message = String((error as Error)?.message ?? error);
        sendSse('status', {
          projectId: project.id,
          status: 'UNKNOWN',
          previewUrl: project.previewUrl,
          error: message,
        });
      }
    };

    const emitLogs = async () => {
      try {
        const text = await this.callOrchestratorText(
          `/v1/projects/${encodeURIComponent(orchestratorProjectId)}/logs`,
        );

        if (text === lastLogSnapshot) {
          return;
        }

        const chunk =
          lastLogSnapshot.length > 0 && text.startsWith(lastLogSnapshot)
            ? text.slice(lastLogSnapshot.length)
            : `${lastLogSnapshot.length > 0 ? '[api] logs snapshot reset\n' : ''}${text}`;

        lastLogSnapshot = text;

        if (chunk.trim().length > 0) {
          sendSse('log', {
            projectId: project.id,
            chunk,
          });
        }
      } catch (error) {
        const message = String((error as Error)?.message ?? error);
        sendSse('log', {
          projectId: project.id,
          chunk: `[api] logs fetch error: ${message}\n`,
        });

        if (project.provisionError) {
          sendSse('log', {
            projectId: project.id,
            chunk: `[api] provision error: ${project.provisionError}\n`,
          });
        }
      }
    };

    const pingInterval = setInterval(() => {
      sendSse('ping', { ts: new Date().toISOString() });
    }, 15000);

    const statusInterval = setInterval(() => {
      void emitStatus();
    }, 4000);

    const logInterval = setInterval(() => {
      void emitLogs();
    }, 2000);

    res.on('close', closeStream);
    res.on('error', closeStream);

    sendSse('connected', {
      projectId: project.id,
      maxPerUser: this.maxLogStreamsPerUser,
      via: 'orchestrator-tail',
    });
    void emitStatus();
    void emitLogs();
  }

  async provisionProject(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          ownerId,
        },
      },
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
