import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { WorkspaceService } from './workspace.service';
import type { ChangeRequestStatus, RuntimeStatus } from './workspace.types';

// ── DTOs ─────────────────────────────────────────────────────────────────────

class CreateWorkspaceDto {
  @IsString()               name!:         string;
  @IsString()               ownerId!:      string;
  @IsOptional() @IsString() description?:  string;
}

class ChangeRequestDto {
  @IsString()               workspaceId!: string;
  @IsString()               projectId!:   string;
  @IsString()               prompt!:      string;
}

class UpdateCrStatusDto {
  @IsString() status!: ChangeRequestStatus;
}

class AddDeployDto {
  @IsString()               platform!:    string;
  @IsString()               status!:      string;
  @IsString()               branch!:      string;
  @IsOptional() @IsString() projectId?:   string;
  @IsOptional() @IsString() commitSha?:   string;
  @IsOptional() @IsString() url?:         string;
}

class RuntimeStatusDto {
  @IsString() status!: RuntimeStatus;
}

class AddActivityDto {
  @IsString()               type!:       string;
  @IsString()               severity!:   string;
  @IsString()               message!:    string;
  @IsOptional()             meta?:       Record<string, unknown>;
}

// ── Controller ────────────────────────────────────────────────────────────────

@Controller('v1/workspace')
export class WorkspaceController {
  constructor(private readonly ws: WorkspaceService) {}

  // ── 21-01: Workspace CRUD ─────────────────────────────────────────────────

  @Get()
  listWorkspaces() {
    return { ok: true, workspaces: this.ws.listWorkspaces() };
  }

  @Post()
  createWorkspace(@Body() dto: CreateWorkspaceDto) {
    const workspace = this.ws.createWorkspace(dto);
    return { ok: true, workspace };
  }

  @Get(':workspaceId')
  getWorkspace(@Param('workspaceId') workspaceId: string) {
    const workspace = this.ws.getWorkspace(workspaceId);
    return { ok: true, workspace };
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  @Get(':workspaceId/projects')
  listProjects(@Param('workspaceId') workspaceId: string) {
    const projects = this.ws.listProjects(workspaceId);
    return { ok: true, projects, total: projects.length };
  }

  @Get(':workspaceId/projects/:projectId')
  getProject(
    @Param('workspaceId') _workspaceId: string,
    @Param('projectId')   projectId:    string,
  ) {
    const project = this.ws.getProject(projectId);
    return { ok: true, project };
  }

  // ── 21-03: Runtime status ─────────────────────────────────────────────────

  @Put(':workspaceId/projects/:projectId/runtime')
  @HttpCode(HttpStatus.OK)
  updateRuntime(
    @Param('projectId') projectId: string,
    @Body() dto: RuntimeStatusDto,
  ) {
    const project = this.ws.updateRuntimeStatus(projectId, dto.status);
    return { ok: true, project };
  }

  // ── 21-02: File explorer ──────────────────────────────────────────────────

  @Get(':workspaceId/projects/:projectId/files')
  getFiles(@Param('projectId') projectId: string) {
    const tree = this.ws.getFileTree(projectId);
    return { ok: true, tree };
  }

  @Get(':workspaceId/projects/:projectId/routes')
  getRoutes(@Param('projectId') projectId: string) {
    const routes = this.ws.getRouteMap(projectId);
    return { ok: true, routes };
  }

  @Get(':workspaceId/projects/:projectId/components')
  getComponents(@Param('projectId') projectId: string) {
    const components = this.ws.getComponentMap(projectId);
    return { ok: true, components };
  }

  @Get(':workspaceId/projects/:projectId/api-map')
  getAPIMap(@Param('projectId') projectId: string) {
    const endpoints = this.ws.getAPIMap(projectId);
    return { ok: true, endpoints };
  }

  // ── 21-04: Change requests ────────────────────────────────────────────────

  @Post(':workspaceId/projects/:projectId/change-requests')
  createChangeRequest(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId')   projectId:   string,
    @Body() dto: ChangeRequestDto,
  ) {
    const cr = this.ws.createChangeRequest({ workspaceId, projectId, prompt: dto.prompt });
    return { ok: true, changeRequest: cr };
  }

  @Get(':workspaceId/projects/:projectId/change-requests')
  listChangeRequests(@Param('projectId') projectId: string) {
    const requests = this.ws.listChangeRequests(projectId);
    return { ok: true, requests, total: requests.length };
  }

  @Put('change-requests/:id/status')
  @HttpCode(HttpStatus.OK)
  updateCrStatus(@Param('id') id: string, @Body() dto: UpdateCrStatusDto) {
    const cr = this.ws.updateChangeRequestStatus(id, dto.status);
    return { ok: true, changeRequest: cr };
  }

  // ── 21-08: Deployments ────────────────────────────────────────────────────

  @Get(':workspaceId/deployments')
  listDeployments(@Param('workspaceId') workspaceId: string) {
    const deployments = this.ws.listDeployments(workspaceId);
    return { ok: true, deployments, total: deployments.length };
  }

  @Post(':workspaceId/deployments')
  addDeployment(@Param('workspaceId') workspaceId: string, @Body() dto: AddDeployDto) {
    const deploy = this.ws.addDeployment(workspaceId, {
      workspaceId,
      projectId: dto.projectId,
      platform:  dto.platform as any,
      status:    dto.status  as any,
      branch:    dto.branch,
      commitSha: dto.commitSha,
      url:       dto.url,
    });
    return { ok: true, deployment: deploy };
  }

  // ── 21-09: Activity stream ────────────────────────────────────────────────

  @Get(':workspaceId/activity')
  listActivity(
    @Param('workspaceId') workspaceId: string,
    @Query('limit')       limitRaw?:    string,
  ) {
    const events = this.ws.listActivity(workspaceId, limitRaw ? parseInt(limitRaw, 10) : 50);
    return { ok: true, events, total: events.length };
  }

  @Post(':workspaceId/activity')
  addActivity(@Param('workspaceId') workspaceId: string, @Body() dto: AddActivityDto) {
    this.ws.addActivity({ workspaceId, type: dto.type, severity: dto.severity as any, message: dto.message, meta: dto.meta });
    return { ok: true };
  }

  // ── 21-13: Analytics ─────────────────────────────────────────────────────

  @Get(':workspaceId/analytics')
  getAnalytics(@Param('workspaceId') workspaceId: string) {
    const analytics = this.ws.getAnalytics(workspaceId);
    return { ok: true, analytics };
  }

  // ── 21-10: Editing cards ──────────────────────────────────────────────────

  @Get('editing/cards')
  getEditingCards() {
    const { EDITING_CARDS } = require('./workspace.service');
    return { ok: true, cards: EDITING_CARDS };
  }
}
