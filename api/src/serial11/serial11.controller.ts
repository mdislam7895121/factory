import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Serial11Service } from './serial11.service';
import { requireUserId } from '../lib/auth/principal';

@Controller('/v1')
export class Serial11Controller {
  constructor(private readonly serial11Service: Serial11Service) {}

  @Get('/templates')
  listTemplates() {
    return this.serial11Service.listTemplates();
  }

  @Post('/workspaces')
  createWorkspace(@Req() req: Request, @Body() body: { name?: string }) {
    return this.serial11Service.createWorkspace(body ?? {}, requireUserId(req));
  }

  @Get('/workspaces')
  listWorkspaces(@Req() req: Request) {
    return this.serial11Service.listWorkspaces(requireUserId(req));
  }

  @Get('/workspaces/:id')
  getWorkspace(@Req() req: Request, @Param('id') id: string) {
    return this.serial11Service.getWorkspace(id, requireUserId(req));
  }

  @Post('/workspaces/:id/projects')
  createWorkspaceProject(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { name?: string; templateId?: string },
  ) {
    return this.serial11Service.createWorkspaceProject(
      id,
      body ?? {},
      requireUserId(req),
    );
  }

  @Get('/workspaces/:id/projects')
  listWorkspaceProjects(@Req() req: Request, @Param('id') id: string) {
    return this.serial11Service.listWorkspaceProjects(id, requireUserId(req));
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
