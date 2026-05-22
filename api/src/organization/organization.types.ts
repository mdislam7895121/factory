import { IsString, IsOptional, IsIn, MaxLength, IsEmail } from 'class-validator';

// ── 25: Team Invites + Organization RBAC ──────────────────────────────────────

// ── Security Constants ────────────────────────────────────────────────────────

export const ORG_BLOCKED_CONTENT =
  /secret|token|key|password|credential|eval\(|<script|javascript:|exec\(|rm\s+-rf|shell|bash|sudo|chmod|api_key|private_key|access_key|jwt_secret|database_url|innerHTML\s*=|__proto__|process\.env/i;

export const ORG_BLOCKED_META_KEYS = new Set([
  '.env', '.env.local', '.env.production', '.git', 'node_modules',
  'id_rsa', '.pem', '.key', '.cert', 'prisma/migrations',
  'src/lib/auth', 'src/lib/jwt', '__factory__', '__runtime__', 'orchestrator',
]);

// ── Roles ─────────────────────────────────────────────────────────────────────

export type OrgRole =
  | 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'DESIGNER' | 'REVIEWER' | 'BILLING' | 'VIEWER';

export const ALL_ORG_ROLES: OrgRole[] = [
  'OWNER', 'ADMIN', 'DEVELOPER', 'DESIGNER', 'REVIEWER', 'BILLING', 'VIEWER',
];

// ── Permission Scopes ─────────────────────────────────────────────────────────

export type PermissionScope =
  | 'workspace.read'
  | 'workspace.manage'
  | 'project.read'
  | 'project.edit'
  | 'project.review'
  | 'project.deploy'
  | 'runtime.manage'
  | 'billing.manage'
  | 'member.invite'
  | 'member.manage'
  | 'admin.audit';

export const ROLE_PERMISSIONS: Record<OrgRole, PermissionScope[]> = {
  OWNER: [
    'workspace.read', 'workspace.manage',
    'project.read', 'project.edit', 'project.review', 'project.deploy',
    'runtime.manage', 'billing.manage', 'member.invite', 'member.manage', 'admin.audit',
  ],
  ADMIN: [
    'workspace.read', 'workspace.manage',
    'project.read', 'project.edit', 'project.review', 'project.deploy',
    'runtime.manage', 'member.invite', 'member.manage',
  ],
  DEVELOPER: [
    'workspace.read', 'project.read', 'project.edit', 'project.review', 'project.deploy',
    'runtime.manage',
  ],
  DESIGNER: [
    'workspace.read', 'project.read', 'project.edit', 'project.review',
  ],
  REVIEWER: [
    'workspace.read', 'project.read', 'project.review',
  ],
  BILLING: [
    'workspace.read', 'billing.manage',
  ],
  VIEWER: [
    'workspace.read', 'project.read',
  ],
};

// ── Invite ────────────────────────────────────────────────────────────────────

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';

export const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── Audit ─────────────────────────────────────────────────────────────────────

export type TeamAuditEventType =
  | 'ORG_CREATED'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED'
  | 'ROLE_CHANGED'
  | 'INVITE_CREATED'
  | 'INVITE_ACCEPTED'
  | 'INVITE_REVOKED'
  | 'INVITE_EXPIRED'
  | 'PERMISSION_CHECKED';

// ── Entities ──────────────────────────────────────────────────────────────────

export interface Organization {
  orgId: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  plan: 'FREE' | 'TEAM' | 'AGENCY';
  members: OrganizationMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  userId: string;
  displayName: string;
  role: OrgRole;
  permissions: PermissionScope[];
  joinedAt: Date;
  addedBy: string;
  avatarColor: string;
}

export interface OrganizationInvite {
  inviteId: string;
  organizationId: string;
  emailHash: string;
  role: OrgRole;
  status: InviteStatus;
  tokenHash: string;
  note: string;
  expiresAt: Date;
  createdByUserId: string;
  acceptedByUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPermission {
  projectId: string;
  userId: string;
  orgId: string;
  scopeOverrides: PermissionScope[];
  grantedBy: string;
  grantedAt: Date;
}

export interface TeamAuditEvent {
  auditId: string;
  orgId: string;
  type: TeamAuditEventType;
  actorId: string;
  targetId?: string;
  description: string;
  metadata: Record<string, string>;
  timestamp: Date;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export class CreateOrgDto {
  @IsString() @MaxLength(100) name: string;
  @IsString() @MaxLength(100) slug: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsString() ownerId: string;
  @IsString() ownerDisplayName: string;
  @IsIn(['FREE', 'TEAM', 'AGENCY']) plan: 'FREE' | 'TEAM' | 'AGENCY';
}

export class AddMemberDto {
  @IsString() orgId: string;
  @IsString() userId: string;
  @IsString() @MaxLength(64) displayName: string;
  @IsIn(['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'])
  role: OrgRole;
  @IsString() addedBy: string;
}

export class ChangeMemberRoleDto {
  @IsString() orgId: string;
  @IsString() userId: string;
  @IsIn(['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'])
  newRole: OrgRole;
  @IsString() changedBy: string;
}

export class CreateInviteDto {
  @IsString() organizationId: string;
  @IsString() @MaxLength(320) email: string;
  @IsIn(['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'])
  role: OrgRole;
  @IsOptional() @IsString() @MaxLength(500) note?: string;
  @IsString() createdByUserId: string;
}

export class AcceptInviteDto {
  @IsString() token: string;
  @IsString() userId: string;
  @IsString() @MaxLength(64) displayName: string;
}

export class RevokeInviteDto {
  @IsString() revokedBy: string;
}
