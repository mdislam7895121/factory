import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Serial11Service } from './serial11.service';
import { requireUserId } from '../lib/auth/principal';
import { JwtGuard } from '../lib/auth/jwt.guard';
import { WorkspaceService } from '../serial15/workspace.service';
import { ProjectService } from '../serial15/project.service';

@Controller('/v1')
export class Serial11Controller {
  constructor(
    private readonly serial11Service: Serial11Service,
    private readonly workspaceService: WorkspaceService,
    private readonly projectService: ProjectService,
  ) {}

  @Get('/templates')
  listTemplates() {
    return this.serial11Service.listTemplates();
  }

  @UseGuards(JwtGuard)
  @Post('/workspaces')
  createWorkspace(@Req() req: Request, @Body() body: { name?: string }) {
    return this.workspaceService
      .create(body ?? {}, requireUserId(req))
      .then((workspace) => ({ ok: true, workspace }));
  }

  @UseGuards(JwtGuard)
  @Get('/workspaces')
  listWorkspaces(@Req() req: Request) {
    return this.workspaceService
      .list(requireUserId(req))
      .then((workspaces) => ({ ok: true, workspaces }));
  }

  @Get('/workspaces/:id')
  getWorkspace(@Req() req: Request, @Param('id') id: string) {
    return this.serial11Service.getWorkspace(id, requireUserId(req));
  }

  @UseGuards(JwtGuard)
  @Post('/workspaces/:workspaceId/projects')
  createWorkspaceProject(
    @Req() req: Request,
    @Param('workspaceId') workspaceId: string,
    @Body() body: { name?: string; slug?: string },
  ) {
    return this.projectService
      .create(workspaceId, body ?? {}, requireUserId(req))
      .then((project) => ({ ok: true, project }));
  }

  @UseGuards(JwtGuard)
  @Get('/workspaces/:workspaceId/projects')
  listWorkspaceProjects(
    @Req() req: Request,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.projectService
      .list(workspaceId, requireUserId(req))
      .then((projects) => ({ ok: true, projects }));
  }

  @Get('/projects/:id')
  getProject(@Req() req: Request, @Param('id') id: string) {
    return this.serial11Service.getProject(id, requireUserId(req));
  }

  @Post('/projects/:id/provision')
  provisionProject(@Req() req: Request, @Param('id') id: string) {
    return this.serial11Service.provisionProject(id, requireUserId(req));
  }
}
