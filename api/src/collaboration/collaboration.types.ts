import { IsString, IsOptional, IsIn, MaxLength, IsArray } from 'class-validator';

// ── 24: Multiplayer Collaboration + AI Team Workflows ─────────────────────────

// ── Security Constants ────────────────────────────────────────────────────────

export const WORKSPACE_BLOCKED_PROMPT =
  /secret|token|key|password|credential|eval\(|<script|javascript:|exec\(|rm\s+-rf|shell|bash|sudo|chmod|\/etc\/passwd|api_key|private_key|access_key|jwt_secret|database_url|innerHTML\s*=|__proto__|process\.env/i;

export const COMMENT_BLOCKED_CONTENT =
  /<script|javascript:|data:text\/html|eval\(|document\.cookie|window\.location|innerHTML\s*=|__proto__|prototype\.constructor|<iframe|<object|<embed|onerror=|onload=/i;

export const BLOCKED_META_KEYS_24 = new Set([
  '.env', '.env.local', '.env.production', '.env.staging',
  'package-lock.json', 'yarn.lock', '.git', 'node_modules',
  'prisma/migrations', 'id_rsa', '.pem', '.key', '.cert',
  'src/lib/auth', 'src/lib/jwt', 'src/server/auth', 'src/middleware',
  '__factory__', '__runtime__', 'orchestrator',
]);

// ── Enums / Unions ────────────────────────────────────────────────────────────

export type CollaborationRole = 'OWNER' | 'EDITOR' | 'REVIEWER' | 'VIEWER' | 'AI_AGENT';

export type PresencePanel =
  | 'visual' | 'branding' | 'content' | 'layout' | 'advanced' | 'code' | 'collaboration';

export type ReviewStatus =
  | 'DRAFT' | 'OPEN' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'MERGED' | 'CANCELLED';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AssigneeType = 'USER' | 'AGENT';

export type CollaborationEventType =
  | 'USER_JOINED' | 'USER_LEFT'
  | 'COMMENT_ADDED' | 'COMMENT_RESOLVED'
  | 'REVIEW_REQUESTED' | 'REVIEW_APPROVED' | 'REVIEW_REJECTED' | 'REVIEW_CHANGES_REQUESTED'
  | 'PATCH_APPROVED' | 'PATCH_REJECTED' | 'PATCH_MERGED'
  | 'TASK_ASSIGNED' | 'TASK_COMPLETED'
  | 'AGENT_TASK_COMPLETED'
  | 'SNAPSHOT_CREATED'
  | 'PRESENCE_UPDATED'
  | 'NOTIFICATION_SENT';

export type CommentTarget =
  | 'file' | 'section' | 'quality_warning' | 'memory_item'
  | 'patch' | 'preview' | 'runtime_event';

// ── Core Entities ──────────────────────────────────────────────────────────────

export interface CollaborationSession {
  sessionId: string;
  workspaceId: string;
  projectId: string;
  activeUsers: WorkspaceMemberPresence[];
  activeAgents: string[];
  currentFocus: string;
  startedAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMemberPresence {
  userId: string;
  displayName: string;
  role: CollaborationRole;
  currentPanel: PresencePanel;
  selectedFile?: string;
  selectedSection?: string;
  isOnline: boolean;
  lastSeen: Date;
  joinedAt: Date;
  avatarColor: string;
}

export interface CollaborationEvent {
  eventId: string;
  workspaceId: string;
  projectId: string;
  type: CollaborationEventType;
  actorId: string;
  actorName: string;
  title: string;
  description: string;
  metadata: Record<string, string>;
  timestamp: Date;
  isPublic: boolean;
}

export interface CommentThread {
  commentId: string;
  workspaceId: string;
  projectId: string;
  target: CommentTarget;
  targetRef: string;
  authorId: string;
  authorName: string;
  content: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies: CommentReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentReply {
  replyId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface ReviewRequest {
  reviewId: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  assignedReviewerId?: string;
  status: ReviewStatus;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  linkedPatchId?: string;
  requiresApproval: boolean;
  approvedBy?: string;
  rejectedBy?: string;
  decisionNote?: string;
  decisions: ApprovalDecision[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalDecision {
  decisionId: string;
  reviewId: string;
  reviewerId: string;
  reviewerName: string;
  status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  note: string;
  decidedAt: Date;
}

export interface HandoffTask {
  taskId: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  assigneeType: AssigneeType;
  assigneeId: string;
  assigneeName: string;
  status: TaskStatus;
  priority: TaskPriority;
  linkedPatchId?: string;
  linkedQualityIssueId?: string;
  linkedRuntimeId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  result?: string;
}

export interface NotificationEvent {
  notificationId: string;
  workspaceId: string;
  projectId: string;
  type: 'REVIEW_REQUESTED' | 'COMMENT_MENTION' | 'TASK_ASSIGNED' | 'PATCH_APPROVED' | 'DEPLOYMENT_FAILED';
  recipientId: string;
  title: string;
  body: string;
  metadata: Record<string, string>;
  read: boolean;
  createdAt: Date;
}

// ── DTOs ───────────────────────────────────────────────────────────────────────

export class CreateCollabSessionDto {
  @IsString() workspaceId: string;
  @IsString() projectId: string;
  @IsString() userId: string;
  @IsString() displayName: string;
  @IsIn(['OWNER','EDITOR','REVIEWER','VIEWER','AI_AGENT'])
  role: CollaborationRole;
}

export class UpsertPresenceDto {
  @IsString() workspaceId: string;
  @IsString() projectId: string;
  @IsString() userId: string;
  @IsString() displayName: string;
  @IsIn(['OWNER','EDITOR','REVIEWER','VIEWER','AI_AGENT'])
  role: CollaborationRole;
  @IsIn(['visual','branding','content','layout','advanced','code','collaboration'])
  currentPanel: PresencePanel;
  @IsOptional() @IsString() selectedFile?: string;
  @IsOptional() @IsString() selectedSection?: string;
}

export class CreateCommentDto {
  @IsString() workspaceId: string;
  @IsString() projectId: string;
  @IsIn(['file','section','quality_warning','memory_item','patch','preview','runtime_event'])
  target: CommentTarget;
  @IsString() targetRef: string;
  @IsString() authorId: string;
  @IsString() @MaxLength(64) authorName: string;
  @IsString() @MaxLength(2000) content: string;
}

export class CreateReviewDto {
  @IsString() workspaceId: string;
  @IsString() projectId: string;
  @IsString() @MaxLength(200) title: string;
  @IsString() @MaxLength(2000) description: string;
  @IsString() requesterId: string;
  @IsString() requesterName: string;
  @IsOptional() @IsString() assignedReviewerId?: string;
  @IsIn(['LOW','MEDIUM','HIGH','CRITICAL']) riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  @IsOptional() @IsString() linkedPatchId?: string;
}

export class ReviewDecisionDto {
  @IsString() reviewId: string;
  @IsString() reviewerId: string;
  @IsString() reviewerName: string;
  @IsIn(['APPROVED','REJECTED','CHANGES_REQUESTED'])
  decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
}

export class CreateHandoffTaskDto {
  @IsString() workspaceId: string;
  @IsString() projectId: string;
  @IsString() @MaxLength(200) title: string;
  @IsString() @MaxLength(2000) description: string;
  @IsIn(['USER','AGENT']) assigneeType: AssigneeType;
  @IsString() assigneeId: string;
  @IsString() @MaxLength(64) assigneeName: string;
  @IsIn(['LOW','MEDIUM','HIGH','CRITICAL']) priority: TaskPriority;
  @IsOptional() @IsString() linkedPatchId?: string;
  @IsOptional() @IsString() linkedQualityIssueId?: string;
  @IsOptional() @IsString() linkedRuntimeId?: string;
  @IsString() createdBy: string;
}

export class UpdateHandoffTaskDto {
  @IsString() taskId: string;
  @IsOptional() @IsIn(['PENDING','IN_PROGRESS','DONE','BLOCKED','CANCELLED'])
  status?: TaskStatus;
  @IsOptional() @IsString() @MaxLength(2000) result?: string;
}
