import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { EditorService } from './editor.service';
import {
  CreateEditSessionDto, ApplyBrandingDto, RewriteContentDto,
  UpdateLayoutDto, AIChangePlanDto, ApproveDiffDto, RollbackDto,
} from './editor.types';

// ── 22: Controlled Visual Editor Controller ───────────────────────────────────

@Controller('v1/editor')
export class EditorController {
  constructor(private readonly svc: EditorService) {}

  // ── Sessions ──────────────────────────────────────────────────────────────

  @Post('sessions')
  createSession(@Body() dto: CreateEditSessionDto) {
    return this.svc.createSession(dto);
  }

  @Get('sessions/:sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    const s = this.svc.getSession(sessionId);
    if (!s) return { error: 'Session not found' };
    return s;
  }

  @Get('projects/:projectId/sessions')
  listSessions(@Param('projectId') projectId: string) {
    return this.svc.listSessions(projectId);
  }

  // ── 22-02: Branding ───────────────────────────────────────────────────────

  @Get('projects/:projectId/branding')
  getBranding(@Param('projectId') projectId: string) {
    return this.svc.getBranding(projectId);
  }

  @Post('branding/apply')
  applyBranding(@Body() dto: ApplyBrandingDto) {
    return this.svc.applyBranding(dto);
  }

  // ── 22-03: Content ────────────────────────────────────────────────────────

  @Get('projects/:projectId/content')
  getContentBlocks(@Param('projectId') projectId: string) {
    return this.svc.getContentBlocks(projectId);
  }

  @Post('content/rewrite')
  rewriteContent(@Body() dto: RewriteContentDto) {
    return this.svc.rewriteContent(dto);
  }

  @Post('projects/:projectId/content/:blockId/apply')
  applyContentBlock(
    @Param('projectId') projectId: string,
    @Param('blockId') blockId: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    return this.svc.applyContentBlock(projectId, blockId, workspaceId ?? 'ws-unknown');
  }

  // ── 22-04: Layout ─────────────────────────────────────────────────────────

  @Get('projects/:projectId/layout')
  getLayoutBlocks(@Param('projectId') projectId: string) {
    return this.svc.getLayoutBlocks(projectId);
  }

  @Put('layout/update')
  updateLayout(@Body() dto: UpdateLayoutDto) {
    return this.svc.updateLayout(dto);
  }

  // ── 22-05: Safe File View ─────────────────────────────────────────────────

  @Get('projects/:projectId/files')
  getSafeFile(
    @Param('projectId') projectId: string,
    @Query('path') filePath: string,
  ) {
    if (!filePath) return { error: 'path query param required' };
    return this.svc.getSafeFile(projectId, filePath);
  }

  // ── 22-06: Diff + Approval ────────────────────────────────────────────────

  @Get('sessions/:sessionId/diff')
  generateDiff(@Param('sessionId') sessionId: string) {
    return this.svc.generateDiff(sessionId);
  }

  @Post('diff/approve')
  approveAndApply(@Body() dto: ApproveDiffDto) {
    return this.svc.approveAndApply(dto.sessionId, dto.workspaceId, dto.projectId);
  }

  @Post('diff/reject')
  rejectDiff(@Body() dto: ApproveDiffDto) {
    return this.svc.rejectDiff(dto.sessionId, dto.workspaceId, dto.projectId);
  }

  // ── 22-07: AI Change Engine ───────────────────────────────────────────────

  @Post('change-plan')
  generateChangePlan(@Body() dto: AIChangePlanDto) {
    return this.svc.generateChangePlan(dto);
  }

  // ── 22-08: Snapshots ──────────────────────────────────────────────────────

  @Post('snapshots/create')
  createSnapshot(
    @Body() body: { workspaceId: string; projectId: string; sessionId: string },
  ) {
    return this.svc.createEditSnapshot(body.workspaceId, body.projectId, body.sessionId);
  }

  @Post('rollback')
  rollback(@Body() dto: RollbackDto) {
    return this.svc.rollback(dto.sessionId, dto.workspaceId, dto.projectId);
  }

  // ── 22-09: Quality Recheck ────────────────────────────────────────────────

  @Post('projects/:projectId/quality-recheck')
  recheckQuality(
    @Param('projectId') projectId: string,
    @Body() body: { sessionId: string },
  ) {
    return this.svc.recheckQuality(projectId, body.sessionId);
  }

  // ── 22-11: History ────────────────────────────────────────────────────────

  @Get('workspaces/:workspaceId/projects/:projectId/history')
  getEditHistory(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string,
  ) {
    return this.svc.getEditHistory(workspaceId, projectId, limit ? parseInt(limit, 10) : 50);
  }

  // ── 22-10: Safety Validation ──────────────────────────────────────────────

  @Post('validate-safety')
  validateSafety(@Body() body: { content: string }) {
    return this.svc.validateEditSafety(body.content ?? '');
  }

  // ── 22-14: Analytics ──────────────────────────────────────────────────────

  @Get('workspaces/:workspaceId/analytics')
  getAnalytics(@Param('workspaceId') workspaceId: string) {
    return this.svc.getAnalytics(workspaceId);
  }
}
