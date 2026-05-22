import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { PairProgrammerService } from './pair-programmer.service';
import {
  CreatePairSessionDto, SendPairMessageDto, CreatePatchPlanDto,
  ApprovePatchDto, RunTerminalDto, GenerateTestsDto,
} from './pair-programmer.types';

// ── 23: Advanced AI Pair Programmer Controller ────────────────────────────────

@Controller('v1/pair')
export class PairProgrammerController {
  constructor(private readonly svc: PairProgrammerService) {}

  // ── Sessions ──────────────────────────────────────────────────────────────

  @Post('sessions')
  createSession(@Body() dto: CreatePairSessionDto) {
    return this.svc.createPairSession(dto);
  }

  @Get('sessions/:sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    const s = this.svc.getPairSession(sessionId);
    if (!s) return { error: 'Session not found' };
    return s;
  }

  @Get('projects/:projectId/sessions')
  listSessions(@Param('projectId') projectId: string) {
    return this.svc.listPairSessions(projectId);
  }

  @Post('sessions/message')
  sendMessage(@Body() dto: SendPairMessageDto) {
    return this.svc.sendMessage(dto);
  }

  // ── 23-03: Patch Pipeline ─────────────────────────────────────────────────

  @Post('patches')
  createPatch(@Body() dto: CreatePatchPlanDto) {
    return this.svc.createPatchPlan(dto);
  }

  @Get('patches/:planId')
  getPatch(@Param('planId') planId: string) {
    const p = this.svc.getPatchPlan(planId);
    if (!p) return { error: 'Patch plan not found' };
    return p;
  }

  @Get('projects/:projectId/patches')
  listPatches(@Param('projectId') projectId: string) {
    return this.svc.listPatchPlans(projectId);
  }

  @Post('patches/approve')
  approvePatch(@Body() dto: ApprovePatchDto) {
    return this.svc.approvePatch(dto.planId, dto.workspaceId, dto.projectId);
  }

  @Post('patches/reject')
  rejectPatch(@Body() dto: ApprovePatchDto) {
    return this.svc.rejectPatch(dto.planId, dto.workspaceId, dto.projectId);
  }

  @Post('patches/rollback')
  rollbackPatch(@Body() dto: ApprovePatchDto) {
    return this.svc.rollbackPatch(dto.planId, dto.workspaceId, dto.projectId);
  }

  // ── 23-04: Safe File Mutation ─────────────────────────────────────────────

  @Get('files/check')
  checkFile(@Query('path') filePath: string) {
    if (!filePath) return { error: 'path query param required' };
    return this.svc.checkFileMutation(filePath);
  }

  // ── 23-06: Refactor Safety ────────────────────────────────────────────────

  @Post('refactor/validate')
  validateRefactor(@Body() body: { description: string }) {
    return this.svc.validateRefactor(body.description ?? '');
  }

  // ── 23-07: Controlled Terminal ────────────────────────────────────────────

  @Get('terminal/commands')
  listCommands() {
    return this.svc.listTerminalCommands();
  }

  @Post('terminal/run')
  runCommand(@Body() dto: RunTerminalDto) {
    return this.svc.runTerminalAction(dto);
  }

  @Post('terminal/validate')
  validateCommand(@Body() body: { command: string }) {
    return this.svc.rejectUnknownCommand(body.command ?? '');
  }

  @Get('projects/:projectId/terminal/history')
  getTerminalHistory(@Param('projectId') projectId: string) {
    return this.svc.listTerminalHistory(projectId);
  }

  // ── 23-08: Build Logs ─────────────────────────────────────────────────────

  @Get('projects/:projectId/build-logs')
  getBuildLogs(
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string,
  ) {
    return this.svc.getBuildLogs(projectId, limit ? parseInt(limit, 10) : 20);
  }

  @Post('projects/:projectId/build-logs/:logId/explain')
  explainError(
    @Param('projectId') projectId: string,
    @Param('logId') logId: string,
  ) {
    return this.svc.explainBuildError(logId, projectId);
  }

  // ── 23-09: Bug Detector ───────────────────────────────────────────────────

  @Get('projects/:projectId/bugs')
  detectBugs(@Param('projectId') projectId: string) {
    return this.svc.detectBugs(projectId);
  }

  @Delete('projects/:projectId/bugs/:bugId')
  dismissBug(
    @Param('projectId') projectId: string,
    @Param('bugId') bugId: string,
  ) {
    return { dismissed: this.svc.dismissBug(bugId, projectId) };
  }

  // ── 23-10: Test Generation ────────────────────────────────────────────────

  @Post('tests/generate')
  generateTests(@Body() dto: GenerateTestsDto) {
    return this.svc.generateTests(dto);
  }

  @Get('projects/:projectId/tests')
  listTests(@Param('projectId') projectId: string) {
    return this.svc.listGeneratedTests(projectId);
  }

  // ── 23-11: Change History ─────────────────────────────────────────────────

  @Get('workspaces/:workspaceId/projects/:projectId/history')
  getHistory(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string,
  ) {
    return this.svc.getChangeHistory(workspaceId, projectId, limit ? parseInt(limit, 10) : 50);
  }

  @Get('workspaces/:workspaceId/projects/:projectId/history/compare')
  compareHistory(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Query('id1') id1: string,
    @Query('id2') id2: string,
  ) {
    return this.svc.compareHistoryEntries(id1, id2, workspaceId, projectId);
  }

  @Post('workspaces/:workspaceId/projects/:projectId/history/:entryId/restore')
  restoreHistory(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Param('entryId') entryId: string,
  ) {
    return this.svc.restoreFromHistory(entryId, workspaceId, projectId);
  }

  // ── 23-12: Collaboration Prep ─────────────────────────────────────────────

  @Get('workspaces/:workspaceId/projects/:projectId/collab-prep')
  getCollabPrep(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.svc.getCollaborationPrep(workspaceId, projectId);
  }

  // ── 23-13: Security Validation ────────────────────────────────────────────

  @Post('security/validate-patch')
  validatePatch(@Body() body: { content: string }) {
    return this.svc.validatePatchContent(body.content ?? '');
  }

  // ── 23-15: Analytics ──────────────────────────────────────────────────────

  @Get('workspaces/:workspaceId/analytics')
  getAnalytics(@Param('workspaceId') workspaceId: string) {
    return this.svc.getAnalytics(workspaceId);
  }
}
