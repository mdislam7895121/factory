import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import {
  CreateCollabSessionDto, UpsertPresenceDto, CreateCommentDto,
  CreateReviewDto, ReviewDecisionDto, CreateHandoffTaskDto, UpdateHandoffTaskDto,
} from './collaboration.types';

// ── 24: Multiplayer Collaboration + AI Team Workflows Controller ──────────────

@Controller('v1/collaboration')
export class CollaborationController {
  constructor(private readonly svc: CollaborationService) {}

  // ── 24-01: Sessions ───────────────────────────────────────────────────────

  @Post('sessions')
  createSession(@Body() dto: CreateCollabSessionDto) {
    return this.svc.createSession(dto);
  }

  @Get('sessions/:sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    const s = this.svc.getSession(sessionId);
    if (!s) return { error: 'Session not found' };
    return s;
  }

  // ── 24-02: Presence ───────────────────────────────────────────────────────

  @Post('presence')
  upsertPresence(@Body() dto: UpsertPresenceDto) {
    return this.svc.upsertPresence(dto);
  }

  @Get(':workspaceId/:projectId/presence')
  getPresence(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.svc.getPresence(workspaceId, projectId);
  }

  // ── 24-03: Comments ───────────────────────────────────────────────────────

  @Post('comments')
  createComment(@Body() dto: CreateCommentDto) {
    return this.svc.createComment(dto);
  }

  @Get(':workspaceId/:projectId/comments')
  getComments(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.svc.getComments(workspaceId, projectId);
  }

  @Patch('comments/:commentId/resolve')
  resolveComment(
    @Param('commentId') commentId: string,
    @Body('resolverId') resolverId: string,
  ) {
    return this.svc.resolveComment(commentId, resolverId ?? 'system');
  }

  @Post('comments/:commentId/reply')
  addReply(
    @Param('commentId') commentId: string,
    @Body('authorId') authorId: string,
    @Body('authorName') authorName: string,
    @Body('content') content: string,
  ) {
    return this.svc.addReply(commentId, authorId, authorName, content);
  }

  // ── 24-04: Reviews ────────────────────────────────────────────────────────

  @Post('reviews')
  createReview(@Body() dto: CreateReviewDto) {
    return this.svc.createReview(dto);
  }

  @Patch('reviews/:reviewId/decision')
  decideReview(
    @Param('reviewId') reviewId: string,
    @Body() dto: ReviewDecisionDto,
  ) {
    return this.svc.decideReview({ ...dto, reviewId });
  }

  @Get(':workspaceId/:projectId/reviews')
  getReviews(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.svc.getReviews(workspaceId, projectId);
  }

  @Get('reviews/:reviewId')
  getReview(@Param('reviewId') reviewId: string) {
    const r = this.svc.getReview(reviewId);
    if (!r) return { error: 'Review not found' };
    return r;
  }

  // ── 24-05: Tasks ──────────────────────────────────────────────────────────

  @Post('tasks')
  createTask(@Body() dto: CreateHandoffTaskDto) {
    return this.svc.createTask(dto);
  }

  @Patch('tasks/:taskId')
  updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateHandoffTaskDto,
  ) {
    return this.svc.updateTask({ ...dto, taskId });
  }

  @Get(':workspaceId/:projectId/tasks')
  getTasks(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.svc.getTasks(workspaceId, projectId);
  }

  // ── 24-07: Review Gate ────────────────────────────────────────────────────

  @Get('review-gate/:riskLevel')
  checkReviewGate(
    @Param('riskLevel') riskLevel: string,
    @Query('reviewId') reviewId?: string,
  ) {
    const valid = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const level = (valid.includes(riskLevel.toUpperCase()) ? riskLevel.toUpperCase() : 'MEDIUM') as
      'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    return this.svc.checkReviewGate(level, reviewId);
  }

  // ── 24-08: Activity Timeline ──────────────────────────────────────────────

  @Get(':workspaceId/:projectId/activity')
  getActivity(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string,
  ) {
    return this.svc.getActivity(workspaceId, projectId, limit ? parseInt(limit, 10) : 50);
  }

  // ── 24-09: Notifications ──────────────────────────────────────────────────

  @Get('notifications/:userId')
  getNotifications(@Param('userId') userId: string) {
    return this.svc.getNotifications(userId);
  }

  @Patch('notifications/:userId/:notificationId/read')
  markRead(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ) {
    this.svc.markNotificationRead(userId, notificationId);
    return { ok: true };
  }

  // ── 24-10: Safety Validation ──────────────────────────────────────────────

  @Post('validate-content')
  validateContent(@Body('text') text: string) {
    if (!text) return { safe: false, reason: 'No content provided.' };
    return this.svc.validateContent(text);
  }

  // ── Analytics ─────────────────────────────────────────────────────────────

  @Get(':workspaceId/:projectId/analytics')
  getAnalytics(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.svc.getAnalytics(workspaceId, projectId);
  }
}
