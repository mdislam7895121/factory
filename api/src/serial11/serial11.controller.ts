import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Serial11Service } from './serial11.service';
import { requireUserId } from '../lib/auth/principal';

@Controller('/v1')
export class Serial11Controller {
  constructor(private readonly serial11Service: Serial11Service) {}

  private readonly ensureUserId = requireUserId;

  @Get('/templates')
  listTemplates() {
    return this.serial11Service.listTemplates();
  }

  @Post('/workspaces')
  createWorkspace(@Body() body: { name?: string }) {
    return this.serial11Service.createWorkspace(body ?? {});
  }

  @Get('/workspaces')
  listWorkspaces() {
    return this.serial11Service.listWorkspaces();
  }

  @Get('/workspaces/:id')
  getWorkspace(@Param('id') id: string) {
    return this.serial11Service.getWorkspace(id);
  }

  @Post('/workspaces/:id/projects')
  createWorkspaceProject(
    @Param('id') id: string,
    @Body() body: { name?: string; templateId?: string },
  ) {
    return this.serial11Service.createWorkspaceProject(id, body ?? {});
  }

  @Get('/workspaces/:id/projects')
  listWorkspaceProjects(@Param('id') id: string) {
    return this.serial11Service.listWorkspaceProjects(id);
  }

  @Get('/projects/:id')
  getProject(@Param('id') id: string) {
    return this.serial11Service.getProject(id);
  }

  @Post('/projects/:id/provision')
  provisionProject(@Param('id') id: string) {
    return this.serial11Service.provisionProject(id);
  }
}
