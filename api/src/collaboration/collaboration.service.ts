import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  CollaborationSession, WorkspaceMemberPresence, CollaborationEvent,
  CommentThread, CommentReply, ReviewRequest, ApprovalDecision,
  HandoffTask, NotificationEvent,
  CreateCollabSessionDto, UpsertPresenceDto, CreateCommentDto,
  CreateReviewDto, ReviewDecisionDto, CreateHandoffTaskDto, UpdateHandoffTaskDto,
  WORKSPACE_BLOCKED_PROMPT, COMMENT_BLOCKED_CONTENT, BLOCKED_META_KEYS_24,
  CollaborationRole, TaskStatus,
} from './collaboration.types';

// ── 24: Multiplayer Collaboration + AI Team Workflows ─────────────────────────

const AVATAR_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
];

const STALE_PRESENCE_MS = 5 * 60 * 1000; // 5 minutes

const ACTIVITY_RING_LIMIT = 300;

// Seeded data for proj-creator-os

const SEEDED_COMMENTS: CommentThread[] = [
  {
    commentId: 'cmt-001',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    target: 'patch',
    targetRef: 'patch-seeded-001',
    authorId: 'user-alice',
    authorName: 'Alice',
    content: 'This patch looks good overall. Can we verify the mobile layout after applying?',
    resolved: false,
    replies: [],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    commentId: 'cmt-002',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    target: 'quality_warning',
    targetRef: 'qw-missing-alt',
    authorId: 'user-bob',
    authorName: 'Bob',
    content: 'Accessibility issue flagged by AI. We should fix alt text on hero images.',
    resolved: true,
    resolvedBy: 'user-alice',
    resolvedAt: new Date(Date.now() - 1800000),
    replies: [
      {
        replyId: 'rpl-001',
        authorId: 'user-alice',
        authorName: 'Alice',
        content: 'Fixed in the latest patch. Resolving.',
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 1800000),
  },
];

const SEEDED_REVIEWS: ReviewRequest[] = [
  {
    reviewId: 'rev-001',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    title: 'Hero layout responsive patch',
    description: 'Patch updates hero section for mobile. Risk: LOW. Direct approval permitted.',
    requesterId: 'user-alice',
    requesterName: 'Alice',
    status: 'APPROVED',
    riskLevel: 'LOW',
    linkedPatchId: 'patch-seeded-001',
    requiresApproval: false,
    approvedBy: 'user-alice',
    decisions: [],
    createdAt: new Date(Date.now() - 3000000),
    updatedAt: new Date(Date.now() - 2700000),
  },
  {
    reviewId: 'rev-002',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    title: 'API route refactor — needs reviewer sign-off',
    description: 'HIGH risk patch modifying API routes. Requires reviewer approval before merge.',
    requesterId: 'user-bob',
    requesterName: 'Bob',
    assignedReviewerId: 'user-alice',
    status: 'OPEN',
    riskLevel: 'HIGH',
    linkedPatchId: 'patch-seeded-002',
    requiresApproval: true,
    decisions: [],
    createdAt: new Date(Date.now() - 1200000),
    updatedAt: new Date(Date.now() - 1200000),
  },
];

const SEEDED_TASKS: HandoffTask[] = [
  {
    taskId: 'task-001',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    title: 'Security Agent: review payment flow',
    description: 'Assign Security Agent to audit the payment flow for vulnerabilities.',
    assigneeType: 'AGENT',
    assigneeId: 'agent-security',
    assigneeName: 'Security Agent',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdBy: 'user-alice',
    createdAt: new Date(Date.now() - 5400000),
    updatedAt: new Date(Date.now() - 5400000),
  },
  {
    taskId: 'task-002',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    title: 'QA Agent: test mobile layout',
    description: 'Run QA checks on all mobile viewports after patch application.',
    assigneeType: 'AGENT',
    assigneeId: 'agent-qa',
    assigneeName: 'QA Agent',
    status: 'DONE',
    priority: 'MEDIUM',
    createdBy: 'user-bob',
    result: 'All mobile viewports passed. No regressions detected.',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    completedAt: new Date(Date.now() - 3600000),
  },
  {
    taskId: 'task-003',
    workspaceId: 'ws-creator',
    projectId: 'proj-creator-os',
    title: 'Developer: approve HIGH-risk API patch',
    description: 'Review and approve the API route refactor (rev-002) before merge.',
    assigneeType: 'USER',
    assigneeId: 'user-alice',
    assigneeName: 'Alice',
    status: 'PENDING',
    priority: 'HIGH',
    linkedPatchId: 'patch-seeded-002',
    createdBy: 'user-bob',
    createdAt: new Date(Date.now() - 1200000),
    updatedAt: new Date(Date.now() - 1200000),
  },
];

@Injectable()
export class CollaborationService {
  // ── Storage ────────────────────────────────────────────────────────────────
  private sessions = new Map<string, CollaborationSession>();
  private presence = new Map<string, WorkspaceMemberPresence>();
  private comments = new Map<string, CommentThread>();
  private reviews = new Map<string, ReviewRequest>();
  private tasks = new Map<string, HandoffTask>();
  private activity = new Map<string, CollaborationEvent[]>();
  private notifications = new Map<string, NotificationEvent[]>();

  constructor() {
    // Seed seeded data
    for (const c of SEEDED_COMMENTS) this.comments.set(c.commentId, c);
    for (const r of SEEDED_REVIEWS) this.reviews.set(r.reviewId, r);
    for (const t of SEEDED_TASKS) this.tasks.set(t.taskId, t);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private id(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private projectKey(workspaceId: string, projectId: string): string {
    return `${workspaceId}:${projectId}`;
  }

  private avatarColor(userId: string): string {
    let h = 0;
    for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }

  private sanitizeContent(text: string): string {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
  }

  private checkBlockedContent(text: string, label: string): void {
    if (WORKSPACE_BLOCKED_PROMPT.test(text) || COMMENT_BLOCKED_CONTENT.test(text)) {
      throw new BadRequestException(`${label} contains blocked content.`);
    }
  }

  private checkBlockedFile(filePath: string): void {
    for (const key of BLOCKED_META_KEYS_24) {
      if (filePath.includes(key)) {
        throw new BadRequestException(`File reference '${filePath}' is not permitted.`);
      }
    }
  }

  private pushActivity(
    workspaceId: string,
    projectId: string,
    event: Omit<CollaborationEvent, 'eventId' | 'workspaceId' | 'projectId' | 'timestamp'>,
  ): CollaborationEvent {
    const key = this.projectKey(workspaceId, projectId);
    const entry: CollaborationEvent = {
      ...event,
      eventId: this.id('evt'),
      workspaceId,
      projectId,
      timestamp: new Date(),
      isPublic: true,
    };
    if (!this.activity.has(key)) this.activity.set(key, []);
    const list = this.activity.get(key)!;
    list.unshift(entry);
    if (list.length > ACTIVITY_RING_LIMIT) list.splice(ACTIVITY_RING_LIMIT);
    return entry;
  }

  private pushNotification(
    workspaceId: string,
    projectId: string,
    notif: Omit<NotificationEvent, 'notificationId' | 'workspaceId' | 'projectId' | 'read' | 'createdAt'>,
  ): void {
    const key = `notif:${notif.recipientId}`;
    if (!this.notifications.has(key)) this.notifications.set(key, []);
    const list = this.notifications.get(key)!;
    list.unshift({
      ...notif,
      notificationId: this.id('notif'),
      workspaceId,
      projectId,
      read: false,
      createdAt: new Date(),
    });
    if (list.length > 100) list.splice(100);
  }

  // ── 24-01: Session ─────────────────────────────────────────────────────────

  createSession(dto: CreateCollabSessionDto): CollaborationSession {
    const sessionId = this.id('sess');
    const now = new Date();
    const presence: WorkspaceMemberPresence = {
      userId: dto.userId,
      displayName: dto.displayName.slice(0, 64),
      role: dto.role,
      currentPanel: 'collaboration',
      isOnline: true,
      lastSeen: now,
      joinedAt: now,
      avatarColor: this.avatarColor(dto.userId),
    };
    const session: CollaborationSession = {
      sessionId,
      workspaceId: dto.workspaceId,
      projectId: dto.projectId,
      activeUsers: [presence],
      activeAgents: [],
      currentFocus: 'collaboration',
      startedAt: now,
      updatedAt: now,
    };
    this.sessions.set(sessionId, session);

    this.pushActivity(dto.workspaceId, dto.projectId, {
      type: 'USER_JOINED',
      actorId: dto.userId,
      actorName: dto.displayName,
      title: `${dto.displayName} joined the workspace`,
      description: `Role: ${dto.role}`,
      metadata: { role: dto.role },
    });

    return session;
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  // ── 24-02: Presence ────────────────────────────────────────────────────────

  upsertPresence(dto: UpsertPresenceDto): WorkspaceMemberPresence {
    if (dto.selectedFile) this.checkBlockedFile(dto.selectedFile);

    const presenceKey = `${dto.workspaceId}:${dto.projectId}:${dto.userId}`;
    const now = new Date();
    const existing = this.presence.get(presenceKey);
    const updated: WorkspaceMemberPresence = {
      userId: dto.userId,
      displayName: dto.displayName.slice(0, 64),
      role: dto.role,
      currentPanel: dto.currentPanel,
      selectedFile: dto.selectedFile,
      selectedSection: dto.selectedSection,
      isOnline: true,
      lastSeen: now,
      joinedAt: existing?.joinedAt ?? now,
      avatarColor: this.avatarColor(dto.userId),
    };
    this.presence.set(presenceKey, updated);

    this.pushActivity(dto.workspaceId, dto.projectId, {
      type: 'PRESENCE_UPDATED',
      actorId: dto.userId,
      actorName: dto.displayName,
      title: `${dto.displayName} moved to ${dto.currentPanel} panel`,
      description: dto.selectedFile ? `Viewing: ${dto.selectedFile}` : '',
      metadata: { panel: dto.currentPanel },
    });

    return updated;
  }

  getPresence(workspaceId: string, projectId: string): WorkspaceMemberPresence[] {
    this.expireStalePresence(workspaceId, projectId);
    const prefix = `${workspaceId}:${projectId}:`;
    const result: WorkspaceMemberPresence[] = [];
    for (const [key, val] of this.presence.entries()) {
      if (key.startsWith(prefix)) result.push(val);
    }
    return result;
  }

  expireStalePresence(workspaceId: string, projectId: string): void {
    const prefix = `${workspaceId}:${projectId}:`;
    const cutoff = Date.now() - STALE_PRESENCE_MS;
    for (const [key, val] of this.presence.entries()) {
      if (key.startsWith(prefix) && val.lastSeen.getTime() < cutoff) {
        this.presence.set(key, { ...val, isOnline: false });
      }
    }
  }

  // ── 24-03: Comment Threads ─────────────────────────────────────────────────

  createComment(dto: CreateCommentDto): CommentThread {
    this.checkBlockedContent(dto.content, 'Comment');
    const sanitized = this.sanitizeContent(dto.content);

    const thread: CommentThread = {
      commentId: this.id('cmt'),
      workspaceId: dto.workspaceId,
      projectId: dto.projectId,
      target: dto.target,
      targetRef: dto.targetRef,
      authorId: dto.authorId,
      authorName: dto.authorName.slice(0, 64),
      content: sanitized,
      resolved: false,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.comments.set(thread.commentId, thread);

    this.pushActivity(dto.workspaceId, dto.projectId, {
      type: 'COMMENT_ADDED',
      actorId: dto.authorId,
      actorName: dto.authorName,
      title: `${dto.authorName} commented on ${dto.target}`,
      description: sanitized.slice(0, 120),
      metadata: { target: dto.target, targetRef: dto.targetRef },
    });

    return thread;
  }

  getComments(workspaceId: string, projectId: string): CommentThread[] {
    const results: CommentThread[] = [];
    for (const c of this.comments.values()) {
      if (c.workspaceId === workspaceId && c.projectId === projectId) {
        results.push(c);
      }
    }
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  resolveComment(commentId: string, resolverId: string): CommentThread {
    const thread = this.comments.get(commentId);
    if (!thread) throw new NotFoundException(`Comment ${commentId} not found.`);
    const updated: CommentThread = {
      ...thread,
      resolved: true,
      resolvedBy: resolverId,
      resolvedAt: new Date(),
      updatedAt: new Date(),
    };
    this.comments.set(commentId, updated);

    this.pushActivity(thread.workspaceId, thread.projectId, {
      type: 'COMMENT_RESOLVED',
      actorId: resolverId,
      actorName: resolverId,
      title: `Comment resolved`,
      description: thread.content.slice(0, 80),
      metadata: { commentId, target: thread.target },
    });

    return updated;
  }

  addReply(
    commentId: string,
    authorId: string,
    authorName: string,
    content: string,
  ): CommentThread {
    this.checkBlockedContent(content, 'Reply');
    const thread = this.comments.get(commentId);
    if (!thread) throw new NotFoundException(`Comment ${commentId} not found.`);
    const reply: CommentReply = {
      replyId: this.id('rpl'),
      authorId,
      authorName: authorName.slice(0, 64),
      content: this.sanitizeContent(content),
      createdAt: new Date(),
    };
    const updated: CommentThread = {
      ...thread,
      replies: [...thread.replies, reply],
      updatedAt: new Date(),
    };
    this.comments.set(commentId, updated);
    return updated;
  }

  // ── 24-04: Review Request Workflow ─────────────────────────────────────────

  createReview(dto: CreateReviewDto): ReviewRequest {
    this.checkBlockedContent(dto.description, 'Review description');

    const requiresApproval = dto.riskLevel === 'HIGH' || dto.riskLevel === 'CRITICAL';

    const review: ReviewRequest = {
      reviewId: this.id('rev'),
      workspaceId: dto.workspaceId,
      projectId: dto.projectId,
      title: dto.title.slice(0, 200),
      description: this.sanitizeContent(dto.description),
      requesterId: dto.requesterId,
      requesterName: dto.requesterName.slice(0, 64),
      assignedReviewerId: dto.assignedReviewerId,
      status: 'OPEN',
      riskLevel: dto.riskLevel,
      linkedPatchId: dto.linkedPatchId,
      requiresApproval,
      decisions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reviews.set(review.reviewId, review);

    this.pushActivity(dto.workspaceId, dto.projectId, {
      type: 'REVIEW_REQUESTED',
      actorId: dto.requesterId,
      actorName: dto.requesterName,
      title: `Review requested: ${dto.title}`,
      description: `Risk: ${dto.riskLevel} — ${requiresApproval ? 'Requires approval' : 'Direct approval permitted'}`,
      metadata: { riskLevel: dto.riskLevel, reviewId: review.reviewId },
    });

    if (dto.assignedReviewerId) {
      this.pushNotification(dto.workspaceId, dto.projectId, {
        type: 'REVIEW_REQUESTED',
        recipientId: dto.assignedReviewerId,
        title: `Review requested: ${dto.title}`,
        body: `${dto.requesterName} requested your review. Risk level: ${dto.riskLevel}.`,
        metadata: { reviewId: review.reviewId, riskLevel: dto.riskLevel },
      });
    }

    return review;
  }

  decideReview(dto: ReviewDecisionDto): ReviewRequest {
    const review = this.reviews.get(dto.reviewId);
    if (!review) throw new NotFoundException(`Review ${dto.reviewId} not found.`);

    if (review.status === 'MERGED' || review.status === 'CANCELLED') {
      throw new BadRequestException(`Review is already ${review.status}.`);
    }

    if (review.riskLevel === 'CRITICAL' && dto.decision === 'APPROVED') {
      if (!review.assignedReviewerId || review.assignedReviewerId !== dto.reviewerId) {
        throw new BadRequestException(
          'CRITICAL risk reviews require approval from the assigned reviewer.',
        );
      }
    }

    if (review.requiresApproval && dto.decision === 'APPROVED') {
      if (!review.assignedReviewerId) {
        throw new BadRequestException(
          'HIGH/CRITICAL risk reviews require an assigned reviewer before approval.',
        );
      }
    }

    const decision: ApprovalDecision = {
      decisionId: this.id('dec'),
      reviewId: dto.reviewId,
      reviewerId: dto.reviewerId,
      reviewerName: dto.reviewerName.slice(0, 64),
      status: dto.decision,
      note: dto.note ? this.sanitizeContent(dto.note) : '',
      decidedAt: new Date(),
    };

    const newStatus: ReviewRequest['status'] =
      dto.decision === 'APPROVED' ? 'APPROVED' :
      dto.decision === 'REJECTED' ? 'REJECTED' : 'CHANGES_REQUESTED';

    const updated: ReviewRequest = {
      ...review,
      status: newStatus,
      approvedBy: dto.decision === 'APPROVED' ? dto.reviewerId : review.approvedBy,
      rejectedBy: dto.decision === 'REJECTED' ? dto.reviewerId : review.rejectedBy,
      decisionNote: decision.note,
      decisions: [...review.decisions, decision],
      updatedAt: new Date(),
    };
    this.reviews.set(dto.reviewId, updated);

    const eventType =
      dto.decision === 'APPROVED' ? 'REVIEW_APPROVED' :
      dto.decision === 'REJECTED' ? 'REVIEW_REJECTED' : 'REVIEW_CHANGES_REQUESTED';

    this.pushActivity(review.workspaceId, review.projectId, {
      type: eventType,
      actorId: dto.reviewerId,
      actorName: dto.reviewerName,
      title: `Review ${dto.decision.toLowerCase()}: ${review.title}`,
      description: decision.note || '',
      metadata: { reviewId: dto.reviewId, riskLevel: review.riskLevel },
    });

    this.pushNotification(review.workspaceId, review.projectId, {
      type: dto.decision === 'APPROVED' ? 'PATCH_APPROVED' : 'REVIEW_REQUESTED',
      recipientId: review.requesterId,
      title: `Review ${dto.decision.toLowerCase()}: ${review.title}`,
      body: `${dto.reviewerName} ${dto.decision.toLowerCase()} your review request.`,
      metadata: { reviewId: dto.reviewId, decision: dto.decision },
    });

    return updated;
  }

  getReviews(workspaceId: string, projectId: string): ReviewRequest[] {
    const results: ReviewRequest[] = [];
    for (const r of this.reviews.values()) {
      if (r.workspaceId === workspaceId && r.projectId === projectId) results.push(r);
    }
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getReview(reviewId: string): ReviewRequest | undefined {
    return this.reviews.get(reviewId);
  }

  // ── 24-05: Handoff Tasks ───────────────────────────────────────────────────

  createTask(dto: CreateHandoffTaskDto): HandoffTask {
    this.checkBlockedContent(dto.description, 'Task description');
    this.checkBlockedContent(dto.title, 'Task title');

    const task: HandoffTask = {
      taskId: this.id('task'),
      workspaceId: dto.workspaceId,
      projectId: dto.projectId,
      title: dto.title.slice(0, 200),
      description: this.sanitizeContent(dto.description),
      assigneeType: dto.assigneeType,
      assigneeId: dto.assigneeId,
      assigneeName: dto.assigneeName.slice(0, 64),
      status: 'PENDING',
      priority: dto.priority,
      linkedPatchId: dto.linkedPatchId,
      linkedQualityIssueId: dto.linkedQualityIssueId,
      linkedRuntimeId: dto.linkedRuntimeId,
      createdBy: dto.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(task.taskId, task);

    this.pushActivity(dto.workspaceId, dto.projectId, {
      type: 'TASK_ASSIGNED',
      actorId: dto.createdBy,
      actorName: dto.createdBy,
      title: `Task assigned to ${dto.assigneeName}: ${dto.title}`,
      description: `Priority: ${dto.priority} | Assignee type: ${dto.assigneeType}`,
      metadata: {
        taskId: task.taskId,
        assigneeType: dto.assigneeType,
        priority: dto.priority,
      },
    });

    if (dto.assigneeType === 'USER') {
      this.pushNotification(dto.workspaceId, dto.projectId, {
        type: 'TASK_ASSIGNED',
        recipientId: dto.assigneeId,
        title: `New task: ${dto.title}`,
        body: `Assigned by ${dto.createdBy}. Priority: ${dto.priority}.`,
        metadata: { taskId: task.taskId, priority: dto.priority },
      });
    }

    return task;
  }

  updateTask(dto: UpdateHandoffTaskDto): HandoffTask {
    const task = this.tasks.get(dto.taskId);
    if (!task) throw new NotFoundException(`Task ${dto.taskId} not found.`);

    const now = new Date();
    const updated: HandoffTask = {
      ...task,
      status: dto.status ?? task.status,
      result: dto.result ?? task.result,
      updatedAt: now,
      completedAt: dto.status === 'DONE' ? now : task.completedAt,
    };
    this.tasks.set(dto.taskId, updated);

    if (dto.status === 'DONE') {
      this.pushActivity(task.workspaceId, task.projectId, {
        type: task.assigneeType === 'AGENT' ? 'AGENT_TASK_COMPLETED' : 'TASK_COMPLETED',
        actorId: task.assigneeId,
        actorName: task.assigneeName,
        title: `${task.assigneeName} completed: ${task.title}`,
        description: dto.result ?? '',
        metadata: { taskId: dto.taskId, assigneeType: task.assigneeType },
      });
    }

    return updated;
  }

  getTasks(workspaceId: string, projectId: string): HandoffTask[] {
    const results: HandoffTask[] = [];
    for (const t of this.tasks.values()) {
      if (t.workspaceId === workspaceId && t.projectId === projectId) results.push(t);
    }
    return results.sort((a, b) => {
      const pOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (pOrder[a.priority] - pOrder[b.priority]) || b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  // ── 24-07: Review Gate ─────────────────────────────────────────────────────

  checkReviewGate(
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    reviewId?: string,
  ): { canProceed: boolean; reason: string; requiresReview: boolean } {
    if (riskLevel === 'LOW') {
      return { canProceed: true, reason: 'LOW risk — direct approval permitted.', requiresReview: false };
    }
    if (riskLevel === 'MEDIUM') {
      return { canProceed: true, reason: 'MEDIUM risk — review recommended but not required.', requiresReview: false };
    }
    if (riskLevel === 'HIGH') {
      if (!reviewId) {
        return { canProceed: false, reason: 'HIGH risk — review approval required before proceeding.', requiresReview: true };
      }
      const review = this.reviews.get(reviewId);
      if (!review || review.status !== 'APPROVED') {
        return { canProceed: false, reason: 'HIGH risk — waiting for reviewer approval.', requiresReview: true };
      }
      return { canProceed: true, reason: 'HIGH risk — reviewer approved.', requiresReview: true };
    }
    // CRITICAL
    if (!reviewId) {
      return { canProceed: false, reason: 'CRITICAL risk — admin/senior approval required.', requiresReview: true };
    }
    const review = this.reviews.get(reviewId);
    if (!review || review.status !== 'APPROVED') {
      return { canProceed: false, reason: 'CRITICAL risk — awaiting senior reviewer approval.', requiresReview: true };
    }
    if (!review.assignedReviewerId) {
      return { canProceed: false, reason: 'CRITICAL risk — no assigned reviewer found.', requiresReview: true };
    }
    return { canProceed: true, reason: 'CRITICAL risk — senior reviewer approved.', requiresReview: true };
  }

  // ── 24-08: Activity Timeline ───────────────────────────────────────────────

  getActivity(workspaceId: string, projectId: string, limit = 50): CollaborationEvent[] {
    const key = this.projectKey(workspaceId, projectId);
    const list = this.activity.get(key) ?? [];
    return list.filter(e => e.isPublic).slice(0, Math.min(limit, ACTIVITY_RING_LIMIT));
  }

  // ── 24-09: Notifications ───────────────────────────────────────────────────

  getNotifications(userId: string): NotificationEvent[] {
    return this.notifications.get(`notif:${userId}`) ?? [];
  }

  markNotificationRead(userId: string, notificationId: string): void {
    const key = `notif:${userId}`;
    const list = this.notifications.get(key);
    if (!list) return;
    const idx = list.findIndex(n => n.notificationId === notificationId);
    if (idx >= 0) list[idx] = { ...list[idx], read: true };
  }

  // ── 24-10: Safety Validation Endpoint ─────────────────────────────────────

  validateContent(text: string): { safe: boolean; reason?: string } {
    if (WORKSPACE_BLOCKED_PROMPT.test(text)) {
      return { safe: false, reason: 'Content contains blocked keywords (secrets, eval, shell commands).' };
    }
    if (COMMENT_BLOCKED_CONTENT.test(text)) {
      return { safe: false, reason: 'Content contains blocked HTML/script patterns.' };
    }
    return { safe: true };
  }

  // ── Analytics ──────────────────────────────────────────────────────────────

  getAnalytics(workspaceId: string, projectId: string) {
    const reviews = this.getReviews(workspaceId, projectId);
    const tasks = this.getTasks(workspaceId, projectId);
    const comments = this.getComments(workspaceId, projectId);
    const activity = this.getActivity(workspaceId, projectId, ACTIVITY_RING_LIMIT);

    const approved = reviews.filter(r => r.status === 'APPROVED').length;
    const rejected = reviews.filter(r => r.status === 'REJECTED').length;

    return {
      totalReviews: reviews.length,
      approvedReviews: approved,
      rejectedReviews: rejected,
      openReviews: reviews.filter(r => r.status === 'OPEN').length,
      approvalRate: (approved + rejected) > 0 ? approved / (approved + rejected) : 0,
      totalTasks: tasks.length,
      doneTasks: tasks.filter(t => t.status === 'DONE').length,
      agentTasks: tasks.filter(t => t.assigneeType === 'AGENT').length,
      totalComments: comments.length,
      resolvedComments: comments.filter(c => c.resolved).length,
      activityEvents: activity.length,
      highRiskReviews: reviews.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').length,
    };
  }
}
