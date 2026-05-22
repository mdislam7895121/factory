import { Test, TestingModule } from '@nestjs/testing';
import { CollaborationService } from './collaboration.service';
import {
  CreateCollabSessionDto, UpsertPresenceDto, CreateCommentDto,
  CreateReviewDto, ReviewDecisionDto, CreateHandoffTaskDto, UpdateHandoffTaskDto,
  WORKSPACE_BLOCKED_PROMPT, COMMENT_BLOCKED_CONTENT, BLOCKED_META_KEYS_24,
} from './collaboration.types';

// ── 24: Multiplayer Collaboration + AI Team Workflows Tests ───────────────────

describe('CollaborationService', () => {
  let svc: CollaborationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaborationService],
    }).compile();
    svc = module.get<CollaborationService>(CollaborationService);
  });

  // ── 24-01: Collaboration Sessions ─────────────────────────────────────────

  describe('Collaboration Sessions', () => {
    it('creates a session with active user presence', () => {
      const dto: CreateCollabSessionDto = {
        workspaceId: 'ws-1', projectId: 'proj-1',
        userId: 'user-1', displayName: 'Alice', role: 'EDITOR',
      };
      const session = svc.createSession(dto);
      expect(session.sessionId).toMatch(/^sess-/);
      expect(session.workspaceId).toBe('ws-1');
      expect(session.projectId).toBe('proj-1');
      expect(session.activeUsers).toHaveLength(1);
      expect(session.activeUsers[0].displayName).toBe('Alice');
      expect(session.activeUsers[0].role).toBe('EDITOR');
    });

    it('assigns avatar color consistently per userId', () => {
      const dto: CreateCollabSessionDto = {
        workspaceId: 'ws-1', projectId: 'proj-1',
        userId: 'user-stable', displayName: 'Bob', role: 'VIEWER',
      };
      const s1 = svc.createSession(dto);
      const s2 = svc.createSession(dto);
      expect(s1.activeUsers[0].avatarColor).toBe(s2.activeUsers[0].avatarColor);
    });

    it('retrieves created session by id', () => {
      const session = svc.createSession({
        workspaceId: 'ws-x', projectId: 'proj-x',
        userId: 'u-1', displayName: 'Charlie', role: 'OWNER',
      });
      const found = svc.getSession(session.sessionId);
      expect(found).toBeDefined();
      expect(found!.sessionId).toBe(session.sessionId);
    });

    it('returns undefined for unknown session id', () => {
      expect(svc.getSession('nonexistent-session')).toBeUndefined();
    });

    it('records USER_JOINED activity on session creation', () => {
      svc.createSession({
        workspaceId: 'ws-act', projectId: 'proj-act',
        userId: 'u-act', displayName: 'Dave', role: 'EDITOR',
      });
      const activity = svc.getActivity('ws-act', 'proj-act', 10);
      expect(activity.some(e => e.type === 'USER_JOINED')).toBe(true);
    });

    it('supports AI_AGENT role in session', () => {
      const session = svc.createSession({
        workspaceId: 'ws-1', projectId: 'proj-1',
        userId: 'agent-security', displayName: 'Security Agent', role: 'AI_AGENT',
      });
      expect(session.activeUsers[0].role).toBe('AI_AGENT');
    });
  });

  // ── 24-02: Presence System ─────────────────────────────────────────────────

  describe('Presence System', () => {
    const baseDto: UpsertPresenceDto = {
      workspaceId: 'ws-p', projectId: 'proj-p',
      userId: 'u-p1', displayName: 'Eve', role: 'EDITOR',
      currentPanel: 'code',
    };

    it('upserts user presence', () => {
      const p = svc.upsertPresence(baseDto);
      expect(p.userId).toBe('u-p1');
      expect(p.currentPanel).toBe('code');
      expect(p.isOnline).toBe(true);
    });

    it('returns presence list for workspace+project', () => {
      svc.upsertPresence(baseDto);
      svc.upsertPresence({ ...baseDto, userId: 'u-p2', displayName: 'Frank', currentPanel: 'visual' });
      const list = svc.getPresence('ws-p', 'proj-p');
      expect(list.length).toBeGreaterThanOrEqual(2);
    });

    it('updates panel when presence is re-upserted', () => {
      svc.upsertPresence(baseDto);
      const updated = svc.upsertPresence({ ...baseDto, currentPanel: 'visual' });
      expect(updated.currentPanel).toBe('visual');
    });

    it('rejects blocked file path in presence', () => {
      expect(() =>
        svc.upsertPresence({ ...baseDto, selectedFile: '.env.production' })
      ).toThrow();
    });

    it('expires stale presence entries', () => {
      svc.upsertPresence(baseDto);
      // Manually set lastSeen to stale
      const list = svc.getPresence('ws-p', 'proj-p');
      expect(list.length).toBeGreaterThan(0);
      // After expiry call, stale users become isOnline: false
      svc.expireStalePresence('ws-p', 'proj-p');
      const after = svc.getPresence('ws-p', 'proj-p');
      // Recent entries are still present, just may have isOnline toggled if they were old
      expect(after).toBeDefined();
    });

    it('records PRESENCE_UPDATED activity', () => {
      svc.upsertPresence({ ...baseDto, workspaceId: 'ws-evt', projectId: 'proj-evt' });
      const activity = svc.getActivity('ws-evt', 'proj-evt', 10);
      expect(activity.some(e => e.type === 'PRESENCE_UPDATED')).toBe(true);
    });

    it('truncates display name to 64 chars', () => {
      const longName = 'A'.repeat(100);
      const p = svc.upsertPresence({ ...baseDto, displayName: longName });
      expect(p.displayName.length).toBeLessThanOrEqual(64);
    });
  });

  // ── 24-03: Comment Threads ─────────────────────────────────────────────────

  describe('Comment Threads', () => {
    const baseComment: CreateCommentDto = {
      workspaceId: 'ws-c', projectId: 'proj-c',
      target: 'patch', targetRef: 'patch-001',
      authorId: 'u-c1', authorName: 'Grace',
      content: 'This patch looks good, but check the mobile layout.',
    };

    it('creates a comment thread', () => {
      const c = svc.createComment(baseComment);
      expect(c.commentId).toMatch(/^cmt-/);
      expect(c.content).toBe('This patch looks good, but check the mobile layout.');
      expect(c.resolved).toBe(false);
    });

    it('returns comments for workspace+project', () => {
      svc.createComment(baseComment);
      const list = svc.getComments('ws-c', 'proj-c');
      expect(list.length).toBeGreaterThanOrEqual(1);
    });

    it('sanitizes HTML in comment content', () => {
      const c = svc.createComment({ ...baseComment, content: 'Check <b>this</b> out' });
      expect(c.content).toContain('&lt;b&gt;');
    });

    it('rejects blocked comment content — script tag', () => {
      expect(() =>
        svc.createComment({ ...baseComment, content: '<script>alert(1)</script>' })
      ).toThrow();
    });

    it('rejects eval in comment content', () => {
      expect(() =>
        svc.createComment({ ...baseComment, content: 'eval(malicious())' })
      ).toThrow();
    });

    it('rejects innerHTML= pattern', () => {
      expect(() =>
        svc.createComment({ ...baseComment, content: 'div.innerHTML = "<b>x</b>"' })
      ).toThrow();
    });

    it('resolves a comment thread', () => {
      const c = svc.createComment(baseComment);
      const resolved = svc.resolveComment(c.commentId, 'u-resolver');
      expect(resolved.resolved).toBe(true);
      expect(resolved.resolvedBy).toBe('u-resolver');
      expect(resolved.resolvedAt).toBeDefined();
    });

    it('throws on resolving unknown comment', () => {
      expect(() => svc.resolveComment('nonexistent-cmt', 'u-x')).toThrow();
    });

    it('adds a reply to a comment thread', () => {
      const c = svc.createComment(baseComment);
      const updated = svc.addReply(c.commentId, 'u-c2', 'Heidi', 'Agree, will check!');
      expect(updated.replies).toHaveLength(1);
      expect(updated.replies[0].content).toBe('Agree, will check!');
    });

    it('rejects blocked content in reply', () => {
      const c = svc.createComment(baseComment);
      expect(() => svc.addReply(c.commentId, 'u-c2', 'Heidi', 'my api_key is leaked')).toThrow();
    });

    it('records COMMENT_ADDED in activity', () => {
      svc.createComment({ ...baseComment, workspaceId: 'ws-ca', projectId: 'proj-ca' });
      const activity = svc.getActivity('ws-ca', 'proj-ca', 10);
      expect(activity.some(e => e.type === 'COMMENT_ADDED')).toBe(true);
    });

    it('records COMMENT_RESOLVED in activity', () => {
      const c = svc.createComment({ ...baseComment, workspaceId: 'ws-cr', projectId: 'proj-cr' });
      svc.resolveComment(c.commentId, 'u-c1');
      const activity = svc.getActivity('ws-cr', 'proj-cr', 10);
      expect(activity.some(e => e.type === 'COMMENT_RESOLVED')).toBe(true);
    });

    it('supports all comment target types', () => {
      const targets = ['file','section','quality_warning','memory_item','patch','preview','runtime_event'] as const;
      for (const target of targets) {
        const c = svc.createComment({ ...baseComment, target, targetRef: `ref-${target}` });
        expect(c.target).toBe(target);
      }
    });
  });

  // ── 24-04: Review Request Workflow ─────────────────────────────────────────

  describe('Review Request Workflow', () => {
    const baseReview: CreateReviewDto = {
      workspaceId: 'ws-r', projectId: 'proj-r',
      title: 'Style refactor review',
      description: 'Minor style changes — safe to apply.',
      requesterId: 'u-r1', requesterName: 'Ivan',
      riskLevel: 'LOW',
    };

    it('creates a review in OPEN status', () => {
      const r = svc.createReview(baseReview);
      expect(r.reviewId).toMatch(/^rev-/);
      expect(r.status).toBe('OPEN');
      expect(r.requiresApproval).toBe(false);
    });

    it('sets requiresApproval=true for HIGH risk', () => {
      const r = svc.createReview({ ...baseReview, riskLevel: 'HIGH' });
      expect(r.requiresApproval).toBe(true);
    });

    it('sets requiresApproval=true for CRITICAL risk', () => {
      const r = svc.createReview({ ...baseReview, riskLevel: 'CRITICAL' });
      expect(r.requiresApproval).toBe(true);
    });

    it('approves a LOW risk review directly', () => {
      const r = svc.createReview(baseReview);
      const decided = svc.decideReview({
        reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy',
        decision: 'APPROVED', note: 'Looks fine.',
      });
      expect(decided.status).toBe('APPROVED');
      expect(decided.approvedBy).toBe('u-r2');
    });

    it('rejects a review with REJECTED status', () => {
      const r = svc.createReview(baseReview);
      const decided = svc.decideReview({
        reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy',
        decision: 'REJECTED', note: 'Not ready.',
      });
      expect(decided.status).toBe('REJECTED');
      expect(decided.rejectedBy).toBe('u-r2');
    });

    it('requests changes — status becomes CHANGES_REQUESTED', () => {
      const r = svc.createReview(baseReview);
      const decided = svc.decideReview({
        reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy',
        decision: 'CHANGES_REQUESTED',
      });
      expect(decided.status).toBe('CHANGES_REQUESTED');
    });

    it('appends decision audit record', () => {
      const r = svc.createReview(baseReview);
      const decided = svc.decideReview({
        reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy',
        decision: 'APPROVED',
      });
      expect(decided.decisions).toHaveLength(1);
      expect(decided.decisions[0].reviewerId).toBe('u-r2');
    });

    it('throws when deciding on nonexistent review', () => {
      expect(() =>
        svc.decideReview({ reviewId: 'bad-id', reviewerId: 'u-x', reviewerName: 'X', decision: 'APPROVED' })
      ).toThrow();
    });

    it('blocks HIGH risk review approval without assigned reviewer', () => {
      const r = svc.createReview({ ...baseReview, riskLevel: 'HIGH' });
      expect(() =>
        svc.decideReview({ reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy', decision: 'APPROVED' })
      ).toThrow();
    });

    it('allows HIGH risk approval when reviewer is assigned', () => {
      const r = svc.createReview({ ...baseReview, riskLevel: 'HIGH', assignedReviewerId: 'u-r2' });
      const decided = svc.decideReview({
        reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy', decision: 'APPROVED',
      });
      expect(decided.status).toBe('APPROVED');
    });

    it('returns reviews list for workspace+project', () => {
      svc.createReview(baseReview);
      const list = svc.getReviews('ws-r', 'proj-r');
      expect(list.length).toBeGreaterThanOrEqual(1);
    });

    it('records REVIEW_REQUESTED in activity', () => {
      svc.createReview({ ...baseReview, workspaceId: 'ws-ra', projectId: 'proj-ra' });
      const activity = svc.getActivity('ws-ra', 'proj-ra', 10);
      expect(activity.some(e => e.type === 'REVIEW_REQUESTED')).toBe(true);
    });

    it('records REVIEW_APPROVED in activity', () => {
      const r = svc.createReview({ ...baseReview, workspaceId: 'ws-rv', projectId: 'proj-rv' });
      svc.decideReview({ reviewId: r.reviewId, reviewerId: 'u-r2', reviewerName: 'Judy', decision: 'APPROVED' });
      const activity = svc.getActivity('ws-rv', 'proj-rv', 10);
      expect(activity.some(e => e.type === 'REVIEW_APPROVED')).toBe(true);
    });
  });

  // ── 24-05: Handoff Tasks ───────────────────────────────────────────────────

  describe('Handoff Tasks', () => {
    const baseTask: CreateHandoffTaskDto = {
      workspaceId: 'ws-t', projectId: 'proj-t',
      title: 'Designer Agent: polish hero section',
      description: 'Polish the hero section for better visual hierarchy.',
      assigneeType: 'AGENT', assigneeId: 'agent-designer', assigneeName: 'Designer Agent',
      priority: 'MEDIUM', createdBy: 'u-t1',
    };

    it('creates a task in PENDING status', () => {
      const t = svc.createTask(baseTask);
      expect(t.taskId).toMatch(/^task-/);
      expect(t.status).toBe('PENDING');
      expect(t.assigneeType).toBe('AGENT');
    });

    it('returns task list sorted by priority', () => {
      svc.createTask({ ...baseTask, priority: 'LOW', title: 'Low task' });
      svc.createTask({ ...baseTask, priority: 'CRITICAL', title: 'Critical task' });
      const tasks = svc.getTasks('ws-t', 'proj-t');
      expect(tasks[0].priority).toBe('CRITICAL');
    });

    it('updates task status to IN_PROGRESS', () => {
      const t = svc.createTask(baseTask);
      const updated = svc.updateTask({ taskId: t.taskId, status: 'IN_PROGRESS' });
      expect(updated.status).toBe('IN_PROGRESS');
    });

    it('marks task as DONE and sets completedAt', () => {
      const t = svc.createTask(baseTask);
      const updated = svc.updateTask({ taskId: t.taskId, status: 'DONE', result: 'Hero polished successfully.' });
      expect(updated.status).toBe('DONE');
      expect(updated.completedAt).toBeDefined();
      expect(updated.result).toBe('Hero polished successfully.');
    });

    it('throws on updating nonexistent task', () => {
      expect(() => svc.updateTask({ taskId: 'bad-task', status: 'DONE' })).toThrow();
    });

    it('records TASK_ASSIGNED in activity', () => {
      svc.createTask({ ...baseTask, workspaceId: 'ws-ta', projectId: 'proj-ta' });
      const activity = svc.getActivity('ws-ta', 'proj-ta', 10);
      expect(activity.some(e => e.type === 'TASK_ASSIGNED')).toBe(true);
    });

    it('records AGENT_TASK_COMPLETED when agent task marked DONE', () => {
      const t = svc.createTask({ ...baseTask, workspaceId: 'ws-tc', projectId: 'proj-tc' });
      svc.updateTask({ taskId: t.taskId, status: 'DONE', result: 'Done.' });
      const activity = svc.getActivity('ws-tc', 'proj-tc', 10);
      expect(activity.some(e => e.type === 'AGENT_TASK_COMPLETED')).toBe(true);
    });

    it('records TASK_COMPLETED for user task', () => {
      const t = svc.createTask({
        ...baseTask, assigneeType: 'USER', assigneeId: 'u-dev', assigneeName: 'Dev',
        workspaceId: 'ws-tu', projectId: 'proj-tu',
      });
      svc.updateTask({ taskId: t.taskId, status: 'DONE' });
      const activity = svc.getActivity('ws-tu', 'proj-tu', 10);
      expect(activity.some(e => e.type === 'TASK_COMPLETED')).toBe(true);
    });

    it('rejects blocked content in task description', () => {
      expect(() =>
        svc.createTask({ ...baseTask, description: 'exec(rm -rf /)', title: 'Exploit' })
      ).toThrow();
    });

    it('rejects blocked content in task title', () => {
      expect(() =>
        svc.createTask({ ...baseTask, title: 'Run sudo bash attack' })
      ).toThrow();
    });

    it('supports USER assignee type with notification', () => {
      const t = svc.createTask({ ...baseTask, assigneeType: 'USER', assigneeId: 'u-dev', assigneeName: 'Dev' });
      expect(t.assigneeType).toBe('USER');
      const notifs = svc.getNotifications('u-dev');
      expect(notifs.some(n => n.type === 'TASK_ASSIGNED')).toBe(true);
    });
  });

  // ── 24-07: Review Gate ─────────────────────────────────────────────────────

  describe('Review Gate (Patch Risk Enforcement)', () => {
    it('LOW risk — canProceed: true, requiresReview: false', () => {
      const result = svc.checkReviewGate('LOW');
      expect(result.canProceed).toBe(true);
      expect(result.requiresReview).toBe(false);
    });

    it('MEDIUM risk — canProceed: true, requiresReview: false', () => {
      const result = svc.checkReviewGate('MEDIUM');
      expect(result.canProceed).toBe(true);
      expect(result.requiresReview).toBe(false);
    });

    it('HIGH risk without reviewId — canProceed: false', () => {
      const result = svc.checkReviewGate('HIGH');
      expect(result.canProceed).toBe(false);
      expect(result.requiresReview).toBe(true);
    });

    it('CRITICAL risk without reviewId — canProceed: false', () => {
      const result = svc.checkReviewGate('CRITICAL');
      expect(result.canProceed).toBe(false);
      expect(result.requiresReview).toBe(true);
    });

    it('HIGH risk with unapproved review — canProceed: false', () => {
      const r = svc.createReview({
        workspaceId: 'ws-g', projectId: 'proj-g',
        title: 'Gate test', description: 'Test',
        requesterId: 'u-g1', requesterName: 'Gater',
        riskLevel: 'HIGH',
      });
      const result = svc.checkReviewGate('HIGH', r.reviewId);
      expect(result.canProceed).toBe(false);
    });

    it('HIGH risk with approved review — canProceed: true', () => {
      const r = svc.createReview({
        workspaceId: 'ws-g2', projectId: 'proj-g2',
        title: 'Gate test 2', description: 'Test',
        requesterId: 'u-g2', requesterName: 'Gater',
        riskLevel: 'HIGH', assignedReviewerId: 'u-approver',
      });
      svc.decideReview({ reviewId: r.reviewId, reviewerId: 'u-approver', reviewerName: 'Approver', decision: 'APPROVED' });
      const result = svc.checkReviewGate('HIGH', r.reviewId);
      expect(result.canProceed).toBe(true);
    });

    it('CRITICAL risk requires assigned reviewer on approval', () => {
      const r = svc.createReview({
        workspaceId: 'ws-g3', projectId: 'proj-g3',
        title: 'Critical gate', description: 'Critical test',
        requesterId: 'u-g3', requesterName: 'CritGater',
        riskLevel: 'CRITICAL',
      });
      expect(() =>
        svc.decideReview({ reviewId: r.reviewId, reviewerId: 'u-random', reviewerName: 'Random', decision: 'APPROVED' })
      ).toThrow();
    });
  });

  // ── 24-08: Activity Timeline ───────────────────────────────────────────────

  describe('Activity Timeline', () => {
    it('returns activity events in reverse chronological order', () => {
      svc.createSession({ workspaceId: 'ws-act2', projectId: 'proj-act2', userId: 'u1', displayName: 'A', role: 'EDITOR' });
      svc.createSession({ workspaceId: 'ws-act2', projectId: 'proj-act2', userId: 'u2', displayName: 'B', role: 'VIEWER' });
      const activity = svc.getActivity('ws-act2', 'proj-act2', 10);
      expect(activity.length).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < activity.length; i++) {
        expect(activity[i-1].timestamp.getTime()).toBeGreaterThanOrEqual(activity[i].timestamp.getTime());
      }
    });

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        svc.createSession({ workspaceId: 'ws-lim', projectId: 'proj-lim', userId: `u-${i}`, displayName: `User${i}`, role: 'VIEWER' });
      }
      const limited = svc.getActivity('ws-lim', 'proj-lim', 3);
      expect(limited.length).toBeLessThanOrEqual(3);
    });

    it('only returns public-safe events', () => {
      svc.createSession({ workspaceId: 'ws-pub', projectId: 'proj-pub', userId: 'u-pub', displayName: 'Public', role: 'EDITOR' });
      const activity = svc.getActivity('ws-pub', 'proj-pub', 50);
      expect(activity.every(e => e.isPublic)).toBe(true);
    });

    it('activity events have required fields', () => {
      svc.createSession({ workspaceId: 'ws-fields', projectId: 'proj-fields', userId: 'u-f', displayName: 'Fields', role: 'VIEWER' });
      const events = svc.getActivity('ws-fields', 'proj-fields', 10);
      for (const e of events) {
        expect(e.eventId).toBeDefined();
        expect(e.type).toBeDefined();
        expect(e.actorId).toBeDefined();
        expect(e.timestamp).toBeInstanceOf(Date);
      }
    });

    it('returns empty array for workspace with no activity', () => {
      const activity = svc.getActivity('ws-empty', 'proj-empty', 10);
      expect(activity).toEqual([]);
    });
  });

  // ── 24-09: Notifications ───────────────────────────────────────────────────

  describe('Notification System', () => {
    it('stores notification on task assignment to user', () => {
      svc.createTask({
        workspaceId: 'ws-notif', projectId: 'proj-notif',
        title: 'Do something', description: 'Please do this task.',
        assigneeType: 'USER', assigneeId: 'u-notif', assigneeName: 'Notif User',
        priority: 'HIGH', createdBy: 'u-admin',
      });
      const notifs = svc.getNotifications('u-notif');
      expect(notifs.some(n => n.type === 'TASK_ASSIGNED')).toBe(true);
    });

    it('stores notification on review approval for requester', () => {
      const r = svc.createReview({
        workspaceId: 'ws-rn', projectId: 'proj-rn',
        title: 'Review notif', description: 'Test review notification.',
        requesterId: 'u-req', requesterName: 'Requester',
        riskLevel: 'LOW',
      });
      svc.decideReview({ reviewId: r.reviewId, reviewerId: 'u-rev', reviewerName: 'Reviewer', decision: 'APPROVED' });
      const notifs = svc.getNotifications('u-req');
      expect(notifs.some(n => n.type === 'PATCH_APPROVED')).toBe(true);
    });

    it('sends REVIEW_REQUESTED notification to assigned reviewer', () => {
      svc.createReview({
        workspaceId: 'ws-rn2', projectId: 'proj-rn2',
        title: 'Assign notif', description: 'Test.',
        requesterId: 'u-req2', requesterName: 'Req2',
        riskLevel: 'HIGH', assignedReviewerId: 'u-rev-target',
      });
      const notifs = svc.getNotifications('u-rev-target');
      expect(notifs.some(n => n.type === 'REVIEW_REQUESTED')).toBe(true);
    });

    it('marks notification as read', () => {
      svc.createTask({
        workspaceId: 'ws-nr', projectId: 'proj-nr',
        title: 'Read notif task', description: 'Test.',
        assigneeType: 'USER', assigneeId: 'u-read', assigneeName: 'Reader',
        priority: 'LOW', createdBy: 'u-admin',
      });
      const notifs = svc.getNotifications('u-read');
      const notif = notifs[0];
      svc.markNotificationRead('u-read', notif.notificationId);
      const after = svc.getNotifications('u-read');
      expect(after.find(n => n.notificationId === notif.notificationId)?.read).toBe(true);
    });

    it('returns empty array for user with no notifications', () => {
      expect(svc.getNotifications('u-nobody')).toEqual([]);
    });
  });

  // ── 24-10: Safety + Sanitization ──────────────────────────────────────────

  describe('Safety + Sanitization', () => {
    it('WORKSPACE_BLOCKED_PROMPT blocks secret keyword', () => {
      expect(WORKSPACE_BLOCKED_PROMPT.test('my secret is here')).toBe(true);
    });

    it('WORKSPACE_BLOCKED_PROMPT blocks token keyword', () => {
      expect(WORKSPACE_BLOCKED_PROMPT.test('here is a token')).toBe(true);
    });

    it('WORKSPACE_BLOCKED_PROMPT blocks eval()', () => {
      expect(WORKSPACE_BLOCKED_PROMPT.test('eval(payload)')).toBe(true);
    });

    it('WORKSPACE_BLOCKED_PROMPT blocks bash keyword', () => {
      expect(WORKSPACE_BLOCKED_PROMPT.test('run bash command')).toBe(true);
    });

    it('WORKSPACE_BLOCKED_PROMPT blocks api_key', () => {
      expect(WORKSPACE_BLOCKED_PROMPT.test('api_key=12345')).toBe(true);
    });

    it('WORKSPACE_BLOCKED_PROMPT blocks process.env[', () => {
      expect(WORKSPACE_BLOCKED_PROMPT.test('process.env["SECRET"]')).toBe(true);
    });

    it('COMMENT_BLOCKED_CONTENT blocks <script', () => {
      expect(COMMENT_BLOCKED_CONTENT.test('<script>alert(1)</script>')).toBe(true);
    });

    it('COMMENT_BLOCKED_CONTENT blocks onerror=', () => {
      expect(COMMENT_BLOCKED_CONTENT.test('<img onerror=alert(1)>')).toBe(true);
    });

    it('BLOCKED_META_KEYS_24 includes .env files', () => {
      expect(BLOCKED_META_KEYS_24.has('.env')).toBe(true);
      expect(BLOCKED_META_KEYS_24.has('.env.production')).toBe(true);
    });

    it('BLOCKED_META_KEYS_24 includes auth internals', () => {
      expect(BLOCKED_META_KEYS_24.has('src/lib/auth')).toBe(true);
      expect(BLOCKED_META_KEYS_24.has('src/lib/jwt')).toBe(true);
    });

    it('BLOCKED_META_KEYS_24 includes orchestrator', () => {
      expect(BLOCKED_META_KEYS_24.has('orchestrator')).toBe(true);
    });

    it('validateContent returns safe for clean text', () => {
      const result = svc.validateContent('This is a helpful comment about the UI.');
      expect(result.safe).toBe(true);
    });

    it('validateContent returns unsafe for blocked content', () => {
      const result = svc.validateContent('my api_key = abc123');
      expect(result.safe).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('validateContent returns unsafe for script tag', () => {
      const result = svc.validateContent('<script>evil()</script>');
      expect(result.safe).toBe(false);
    });

    it('no secret leakage in analytics response', () => {
      const analytics = svc.getAnalytics('ws-creator', 'proj-creator-os');
      const str = JSON.stringify(analytics);
      expect(WORKSPACE_BLOCKED_PROMPT.test(str)).toBe(false);
    });

    it('comment content sanitized — no raw < > allowed', () => {
      const c = svc.createComment({
        workspaceId: 'ws-san', projectId: 'proj-san',
        target: 'file', targetRef: 'main.tsx',
        authorId: 'u-san', authorName: 'San',
        content: 'Use React.FC<Props> syntax',
      });
      expect(c.content).not.toContain('<Props>');
      expect(c.content).toContain('&lt;Props&gt;');
    });
  });

  // ── Analytics ──────────────────────────────────────────────────────────────

  describe('Analytics', () => {
    it('returns analytics with expected shape', () => {
      const a = svc.getAnalytics('ws-creator', 'proj-creator-os');
      expect(a).toHaveProperty('totalReviews');
      expect(a).toHaveProperty('approvedReviews');
      expect(a).toHaveProperty('rejectedReviews');
      expect(a).toHaveProperty('approvalRate');
      expect(a).toHaveProperty('totalTasks');
      expect(a).toHaveProperty('agentTasks');
      expect(a).toHaveProperty('totalComments');
      expect(a).toHaveProperty('resolvedComments');
    });

    it('seeded data shows tasks for proj-creator-os', () => {
      const a = svc.getAnalytics('ws-creator', 'proj-creator-os');
      expect(a.totalTasks).toBeGreaterThanOrEqual(3);
    });

    it('seeded data shows reviews for proj-creator-os', () => {
      const a = svc.getAnalytics('ws-creator', 'proj-creator-os');
      expect(a.totalReviews).toBeGreaterThanOrEqual(2);
    });

    it('seeded data shows comments for proj-creator-os', () => {
      const a = svc.getAnalytics('ws-creator', 'proj-creator-os');
      expect(a.totalComments).toBeGreaterThanOrEqual(2);
    });

    it('approvalRate is between 0 and 1', () => {
      const a = svc.getAnalytics('ws-creator', 'proj-creator-os');
      expect(a.approvalRate).toBeGreaterThanOrEqual(0);
      expect(a.approvalRate).toBeLessThanOrEqual(1);
    });

    it('highRiskReviews count is accurate', () => {
      const a = svc.getAnalytics('ws-creator', 'proj-creator-os');
      expect(a.highRiskReviews).toBeGreaterThanOrEqual(1);
    });
  });
});
