import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  Organization, OrganizationMember, OrganizationInvite,
  TeamAuditEvent, ProjectPermission,
  CreateOrgDto, AddMemberDto, ChangeMemberRoleDto,
  CreateInviteDto, AcceptInviteDto, RevokeInviteDto,
  OrgRole, PermissionScope, ROLE_PERMISSIONS, INVITE_EXPIRY_MS,
  ORG_BLOCKED_CONTENT,
} from './organization.types';
import { RbacService } from './rbac.service';

// ── 25: Team Invites + Organization RBAC Service ──────────────────────────────

const AVATAR_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
];

const AUDIT_RING_LIMIT = 500;

@Injectable()
export class OrganizationService {
  private orgs = new Map<string, Organization>();
  private invites = new Map<string, OrganizationInvite>();
  private audit = new Map<string, TeamAuditEvent[]>();
  private projectPermissions = new Map<string, ProjectPermission>();

  constructor(private readonly rbac: RbacService) {
    this.seedDefaultOrg();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private id(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private avatarColor(userId: string): string {
    let h = 0;
    for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }

  private hashEmail(email: string): string {
    let h = 5381;
    for (let i = 0; i < email.toLowerCase().length; i++) {
      h = ((h << 5) + h) ^ email.charCodeAt(i);
      h = h >>> 0;
    }
    return `emailhash-${h.toString(16).padStart(8, '0')}`;
  }

  private hashToken(token: string): string {
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return `tokenhash-${h.toString(16).padStart(8, '0')}`;
  }

  private generateToken(): string {
    return Array.from({ length: 32 }, () =>
      Math.random().toString(36).charAt(2)
    ).join('');
  }

  private checkBlocked(text: string, label: string): void {
    if (ORG_BLOCKED_CONTENT.test(text)) {
      throw new BadRequestException(`${label} contains blocked content.`);
    }
  }

  private pushAudit(
    orgId: string,
    event: Omit<TeamAuditEvent, 'auditId' | 'timestamp'>,
  ): TeamAuditEvent {
    const entry: TeamAuditEvent = {
      ...event,
      auditId: this.id('aud'),
      timestamp: new Date(),
    };
    if (!this.audit.has(orgId)) this.audit.set(orgId, []);
    const list = this.audit.get(orgId)!;
    list.unshift(entry);
    if (list.length > AUDIT_RING_LIMIT) list.splice(AUDIT_RING_LIMIT);
    return entry;
  }

  private seedDefaultOrg(): void {
    const orgId = 'org-factory-default';
    const now = new Date();
    const owner: OrganizationMember = {
      userId: 'user-alice',
      displayName: 'Alice',
      role: 'OWNER',
      permissions: ROLE_PERMISSIONS['OWNER'],
      joinedAt: now,
      addedBy: 'system',
      avatarColor: this.avatarColor('user-alice'),
    };
    const dev: OrganizationMember = {
      userId: 'user-bob',
      displayName: 'Bob',
      role: 'DEVELOPER',
      permissions: ROLE_PERMISSIONS['DEVELOPER'],
      joinedAt: now,
      addedBy: 'user-alice',
      avatarColor: this.avatarColor('user-bob'),
    };
    const reviewer: OrganizationMember = {
      userId: 'user-carol',
      displayName: 'Carol',
      role: 'REVIEWER',
      permissions: ROLE_PERMISSIONS['REVIEWER'],
      joinedAt: now,
      addedBy: 'user-alice',
      avatarColor: this.avatarColor('user-carol'),
    };
    const billing: OrganizationMember = {
      userId: 'user-dave',
      displayName: 'Dave',
      role: 'BILLING',
      permissions: ROLE_PERMISSIONS['BILLING'],
      joinedAt: now,
      addedBy: 'user-alice',
      avatarColor: this.avatarColor('user-dave'),
    };
    const org: Organization = {
      orgId,
      name: 'Factory Default Org',
      slug: 'factory-default',
      description: 'Default seeded organization for Factory workspace.',
      ownerId: 'user-alice',
      plan: 'TEAM',
      members: [owner, dev, reviewer, billing],
      createdAt: now,
      updatedAt: now,
    };
    this.orgs.set(orgId, org);
    this.pushAudit(orgId, {
      orgId, type: 'ORG_CREATED',
      actorId: 'system', description: 'Default org seeded',
      metadata: { plan: 'TEAM' },
    });
  }

  // ── 25-02: Organization CRUD ───────────────────────────────────────────────

  createOrg(dto: CreateOrgDto): Organization {
    if (dto.description) this.checkBlocked(dto.description, 'Description');
    this.checkBlocked(dto.name, 'Org name');

    const orgId = this.id('org');
    const now = new Date();
    const ownerMember: OrganizationMember = {
      userId: dto.ownerId,
      displayName: dto.ownerDisplayName.slice(0, 64),
      role: 'OWNER',
      permissions: ROLE_PERMISSIONS['OWNER'],
      joinedAt: now,
      addedBy: 'system',
      avatarColor: this.avatarColor(dto.ownerId),
    };
    const org: Organization = {
      orgId,
      name: dto.name.slice(0, 100),
      slug: dto.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 100),
      description: dto.description?.slice(0, 300) ?? '',
      ownerId: dto.ownerId,
      plan: dto.plan,
      members: [ownerMember],
      createdAt: now,
      updatedAt: now,
    };
    this.orgs.set(orgId, org);

    this.pushAudit(orgId, {
      orgId, type: 'ORG_CREATED',
      actorId: dto.ownerId,
      description: `Organization "${dto.name}" created`,
      metadata: { plan: dto.plan, slug: dto.slug },
    });

    return org;
  }

  getOrg(orgId: string): Organization {
    const org = this.orgs.get(orgId);
    if (!org) throw new NotFoundException(`Organization ${orgId} not found.`);
    return org;
  }

  listOrgs(): Organization[] {
    return Array.from(this.orgs.values());
  }

  // ── 25-02: Member Management ───────────────────────────────────────────────

  addMember(dto: AddMemberDto): Organization {
    const org = this.getOrg(dto.orgId);

    if (org.members.some(m => m.userId === dto.userId)) {
      throw new BadRequestException(`User ${dto.userId} is already a member.`);
    }

    const member: OrganizationMember = {
      userId: dto.userId,
      displayName: dto.displayName.slice(0, 64),
      role: dto.role,
      permissions: ROLE_PERMISSIONS[dto.role],
      joinedAt: new Date(),
      addedBy: dto.addedBy,
      avatarColor: this.avatarColor(dto.userId),
    };

    const updated: Organization = {
      ...org,
      members: [...org.members, member],
      updatedAt: new Date(),
    };
    this.orgs.set(dto.orgId, updated);

    this.pushAudit(dto.orgId, {
      orgId: dto.orgId, type: 'MEMBER_ADDED',
      actorId: dto.addedBy, targetId: dto.userId,
      description: `${dto.displayName} added as ${dto.role}`,
      metadata: { role: dto.role, userId: dto.userId },
    });

    return updated;
  }

  removeMember(orgId: string, userId: string, removedBy: string): Organization {
    const org = this.getOrg(orgId);
    const member = org.members.find(m => m.userId === userId);
    if (!member) throw new NotFoundException(`Member ${userId} not found.`);

    if (member.role === 'OWNER') {
      const ownerCount = org.members.filter(m => m.role === 'OWNER').length;
      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot remove the last OWNER of an organization.');
      }
    }

    const updated: Organization = {
      ...org,
      members: org.members.filter(m => m.userId !== userId),
      updatedAt: new Date(),
    };
    this.orgs.set(orgId, updated);

    this.pushAudit(orgId, {
      orgId, type: 'MEMBER_REMOVED',
      actorId: removedBy, targetId: userId,
      description: `${member.displayName} (${member.role}) removed from organization`,
      metadata: { role: member.role, userId },
    });

    return updated;
  }

  changeMemberRole(dto: ChangeMemberRoleDto): Organization {
    const org = this.getOrg(dto.orgId);
    const member = org.members.find(m => m.userId === dto.userId);
    if (!member) throw new NotFoundException(`Member ${dto.userId} not found.`);

    if (member.role === 'OWNER' && dto.newRole !== 'OWNER') {
      const ownerCount = org.members.filter(m => m.role === 'OWNER').length;
      if (ownerCount <= 1) {
        throw new BadRequestException('Cannot demote the last OWNER.');
      }
    }

    const oldRole = member.role;
    const updatedMember: OrganizationMember = {
      ...member,
      role: dto.newRole,
      permissions: ROLE_PERMISSIONS[dto.newRole],
    };

    const updated: Organization = {
      ...org,
      members: org.members.map(m => m.userId === dto.userId ? updatedMember : m),
      updatedAt: new Date(),
    };
    this.orgs.set(dto.orgId, updated);

    this.pushAudit(dto.orgId, {
      orgId: dto.orgId, type: 'ROLE_CHANGED',
      actorId: dto.changedBy, targetId: dto.userId,
      description: `${member.displayName} role changed from ${oldRole} to ${dto.newRole}`,
      metadata: { oldRole, newRole: dto.newRole, userId: dto.userId },
    });

    return updated;
  }

  listMembers(orgId: string): OrganizationMember[] {
    return this.getOrg(orgId).members;
  }

  getMemberRole(orgId: string, userId: string): OrgRole | null {
    const org = this.orgs.get(orgId);
    if (!org) return null;
    return org.members.find(m => m.userId === userId)?.role ?? null;
  }

  // ── 25-03: Invite System ───────────────────────────────────────────────────

  createInvite(dto: CreateInviteDto): { invite: Omit<OrganizationInvite, 'tokenHash'>; token: string } {
    this.getOrg(dto.organizationId);
    if (dto.note) this.checkBlocked(dto.note, 'Invite note');

    const rawToken = this.generateToken();
    const tokenHash = this.hashToken(rawToken);
    const emailHash = this.hashEmail(dto.email);

    const invite: OrganizationInvite = {
      inviteId: this.id('inv'),
      organizationId: dto.organizationId,
      emailHash,
      role: dto.role,
      status: 'PENDING',
      tokenHash,
      note: dto.note ? dto.note.slice(0, 500) : '',
      expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
      createdByUserId: dto.createdByUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.invites.set(invite.inviteId, invite);

    this.pushAudit(dto.organizationId, {
      orgId: dto.organizationId, type: 'INVITE_CREATED',
      actorId: dto.createdByUserId,
      description: `Invite created for role ${dto.role}`,
      metadata: { role: dto.role, emailHash, inviteId: invite.inviteId },
    });

    // Return token ONCE — not stored in plain text
    const { tokenHash: _th, ...safeInvite } = invite;
    return { invite: safeInvite, token: rawToken };
  }

  acceptInvite(dto: AcceptInviteDto): Organization {
    const tokenHash = this.hashToken(dto.token);

    let found: OrganizationInvite | undefined;
    for (const inv of this.invites.values()) {
      if (inv.tokenHash === tokenHash) { found = inv; break; }
    }

    if (!found) throw new BadRequestException('Invalid or unknown invite token.');

    if (found.status !== 'PENDING') {
      throw new BadRequestException(`Invite is ${found.status} and cannot be accepted.`);
    }
    if (found.expiresAt < new Date()) {
      const expired: OrganizationInvite = { ...found, status: 'EXPIRED', updatedAt: new Date() };
      this.invites.set(found.inviteId, expired);
      this.pushAudit(found.organizationId, {
        orgId: found.organizationId, type: 'INVITE_EXPIRED',
        actorId: dto.userId,
        description: `Invite expired for role ${found.role}`,
        metadata: { inviteId: found.inviteId, role: found.role },
      });
      throw new BadRequestException('Invite has expired.');
    }

    const updated: OrganizationInvite = {
      ...found,
      status: 'ACCEPTED',
      acceptedByUserId: dto.userId,
      updatedAt: new Date(),
    };
    this.invites.set(found.inviteId, updated);

    const org = this.addMember({
      orgId: found.organizationId,
      userId: dto.userId,
      displayName: dto.displayName,
      role: found.role,
      addedBy: found.createdByUserId,
    });

    this.pushAudit(found.organizationId, {
      orgId: found.organizationId, type: 'INVITE_ACCEPTED',
      actorId: dto.userId,
      description: `${dto.displayName} accepted invite and joined as ${found.role}`,
      metadata: { role: found.role, inviteId: found.inviteId, userId: dto.userId },
    });

    return org;
  }

  revokeInvite(orgId: string, inviteId: string, dto: RevokeInviteDto): OrganizationInvite {
    const invite = this.invites.get(inviteId);
    if (!invite || invite.organizationId !== orgId) {
      throw new NotFoundException(`Invite ${inviteId} not found.`);
    }
    if (invite.status !== 'PENDING') {
      throw new BadRequestException(`Invite is already ${invite.status}.`);
    }

    const updated: OrganizationInvite = { ...invite, status: 'REVOKED', updatedAt: new Date() };
    this.invites.set(inviteId, updated);

    this.pushAudit(orgId, {
      orgId, type: 'INVITE_REVOKED',
      actorId: dto.revokedBy,
      description: `Invite ${inviteId} revoked`,
      metadata: { inviteId, role: invite.role },
    });

    const { tokenHash: _th, ...safe } = updated;
    return safe as OrganizationInvite;
  }

  listInvites(orgId: string): Omit<OrganizationInvite, 'tokenHash'>[] {
    const results: Omit<OrganizationInvite, 'tokenHash'>[] = [];
    for (const inv of this.invites.values()) {
      if (inv.organizationId === orgId) {
        const { tokenHash: _th, ...safe } = inv;
        results.push(safe);
      }
    }
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ── 25-04: RBAC ────────────────────────────────────────────────────────────

  hasPermission(userId: string, orgId: string, scope: PermissionScope): boolean {
    const role = this.getMemberRole(orgId, userId);
    if (!role) return false;
    const allowed = this.rbac.hasPermission(role, scope);

    this.pushAudit(orgId, {
      orgId, type: 'PERMISSION_CHECKED',
      actorId: userId,
      description: `Permission check: ${scope} → ${allowed ? 'GRANTED' : 'DENIED'} (role: ${role})`,
      metadata: { scope, result: allowed ? 'GRANTED' : 'DENIED', role },
    });

    return allowed;
  }

  getUserPermissions(userId: string, orgId: string): { role: OrgRole | null; permissions: PermissionScope[] } {
    const role = this.getMemberRole(orgId, userId);
    if (!role) return { role: null, permissions: [] };
    return { role, permissions: ROLE_PERMISSIONS[role] };
  }

  getPermissionMatrix() {
    return this.rbac.getPermissionMatrix();
  }

  // ── Audit ──────────────────────────────────────────────────────────────────

  getAuditLog(orgId: string, limit = 50): TeamAuditEvent[] {
    this.getOrg(orgId);
    const list = this.audit.get(orgId) ?? [];
    return list.slice(0, Math.min(limit, AUDIT_RING_LIMIT));
  }

  // ── Analytics ──────────────────────────────────────────────────────────────

  getAnalytics(orgId: string) {
    const org = this.getOrg(orgId);
    const invites = this.listInvites(orgId);
    const auditLog = this.getAuditLog(orgId, AUDIT_RING_LIMIT);

    const roleCounts: Partial<Record<OrgRole, number>> = {};
    for (const m of org.members) {
      roleCounts[m.role] = (roleCounts[m.role] ?? 0) + 1;
    }

    return {
      orgId,
      totalMembers: org.members.length,
      roleCounts,
      totalInvites: invites.length,
      pendingInvites: invites.filter(i => i.status === 'PENDING').length,
      acceptedInvites: invites.filter(i => i.status === 'ACCEPTED').length,
      revokedInvites: invites.filter(i => i.status === 'REVOKED').length,
      auditEvents: auditLog.length,
      plan: org.plan,
    };
  }
}
