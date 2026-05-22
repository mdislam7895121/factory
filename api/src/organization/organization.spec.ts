import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { RbacService } from './rbac.service';
import {
  CreateOrgDto, AddMemberDto, ChangeMemberRoleDto, CreateInviteDto,
  AcceptInviteDto, RevokeInviteDto,
  ROLE_PERMISSIONS, ORG_BLOCKED_CONTENT, OrgRole, PermissionScope,
} from './organization.types';

// ── 25: Team Invites + Organization RBAC Tests ────────────────────────────────

describe('OrganizationService', () => {
  let svc: OrganizationService;
  let rbac: RbacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService, RbacService],
    }).compile();
    svc = module.get<OrganizationService>(OrganizationService);
    rbac = module.get<RbacService>(RbacService);
  });

  // ── 25-01/02: Organization Creation ───────────────────────────────────────

  describe('Organization Creation', () => {
    const baseDto: CreateOrgDto = {
      name: 'Acme Corp', slug: 'acme-corp', description: 'Test org.',
      ownerId: 'u-owner', ownerDisplayName: 'Owner User', plan: 'TEAM',
    };

    it('creates an org with a single OWNER member', () => {
      const org = svc.createOrg(baseDto);
      expect(org.orgId).toMatch(/^org-/);
      expect(org.name).toBe('Acme Corp');
      expect(org.members).toHaveLength(1);
      expect(org.members[0].role).toBe('OWNER');
      expect(org.members[0].userId).toBe('u-owner');
    });

    it('slugifies org slug to safe characters', () => {
      const org = svc.createOrg({ ...baseDto, slug: 'My Org!!' });
      expect(org.slug).toMatch(/^[a-z0-9-]+$/);
    });

    it('retrieves org by id', () => {
      const created = svc.createOrg(baseDto);
      const found = svc.getOrg(created.orgId);
      expect(found.orgId).toBe(created.orgId);
    });

    it('throws NotFoundException for unknown orgId', () => {
      expect(() => svc.getOrg('nonexistent-org')).toThrow();
    });

    it('emits ORG_CREATED audit event', () => {
      const org = svc.createOrg(baseDto);
      const audit = svc.getAuditLog(org.orgId, 10);
      expect(audit.some(e => e.type === 'ORG_CREATED')).toBe(true);
    });

    it('rejects blocked content in org name', () => {
      expect(() => svc.createOrg({ ...baseDto, name: 'exec(rm -rf /) Org' })).toThrow();
    });

    it('rejects blocked content in org description', () => {
      expect(() => svc.createOrg({ ...baseDto, description: 'api_key = secret123' })).toThrow();
    });

    it('default seeded org exists', () => {
      const org = svc.getOrg('org-factory-default');
      expect(org.members.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ── 25-02: Member Management ───────────────────────────────────────────────

  describe('Member Management', () => {
    let orgId: string;

    beforeEach(() => {
      const org = svc.createOrg({
        name: 'Test Org', slug: 'test-org', ownerId: 'u-1', ownerDisplayName: 'Owner', plan: 'TEAM',
      });
      orgId = org.orgId;
    });

    it('adds a member with correct role and permissions', () => {
      const org = svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev User', role: 'DEVELOPER', addedBy: 'u-1' });
      const member = org.members.find(m => m.userId === 'u-2');
      expect(member).toBeDefined();
      expect(member!.role).toBe('DEVELOPER');
      expect(member!.permissions).toContain('project.edit');
    });

    it('throws when adding duplicate member', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-1' });
      expect(() =>
        svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'VIEWER', addedBy: 'u-1' })
      ).toThrow();
    });

    it('removes a non-owner member', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-1' });
      const org = svc.removeMember(orgId, 'u-2', 'u-1');
      expect(org.members.find(m => m.userId === 'u-2')).toBeUndefined();
    });

    it('cannot remove the last OWNER', () => {
      expect(() => svc.removeMember(orgId, 'u-1', 'u-1')).toThrow('last OWNER');
    });

    it('allows removing OWNER if another OWNER exists', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Owner2', role: 'OWNER', addedBy: 'u-1' });
      expect(() => svc.removeMember(orgId, 'u-1', 'u-2')).not.toThrow();
    });

    it('changes member role and updates permissions', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-1' });
      const org = svc.changeMemberRole({ orgId, userId: 'u-2', newRole: 'REVIEWER', changedBy: 'u-1' });
      const member = org.members.find(m => m.userId === 'u-2');
      expect(member!.role).toBe('REVIEWER');
      expect(member!.permissions).not.toContain('project.edit');
      expect(member!.permissions).toContain('project.review');
    });

    it('cannot demote last OWNER', () => {
      expect(() =>
        svc.changeMemberRole({ orgId, userId: 'u-1', newRole: 'ADMIN', changedBy: 'u-1' })
      ).toThrow('last OWNER');
    });

    it('emits MEMBER_ADDED audit event', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-1' });
      const audit = svc.getAuditLog(orgId, 10);
      expect(audit.some(e => e.type === 'MEMBER_ADDED')).toBe(true);
    });

    it('emits MEMBER_REMOVED audit event', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-1' });
      svc.removeMember(orgId, 'u-2', 'u-1');
      const audit = svc.getAuditLog(orgId, 10);
      expect(audit.some(e => e.type === 'MEMBER_REMOVED')).toBe(true);
    });

    it('emits ROLE_CHANGED audit event', () => {
      svc.addMember({ orgId, userId: 'u-2', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-1' });
      svc.changeMemberRole({ orgId, userId: 'u-2', newRole: 'ADMIN', changedBy: 'u-1' });
      const audit = svc.getAuditLog(orgId, 10);
      expect(audit.some(e => e.type === 'ROLE_CHANGED')).toBe(true);
    });

    it('assigns avatar color deterministically', () => {
      const org1 = svc.addMember({ orgId, userId: 'u-stable', displayName: 'Stable', role: 'VIEWER', addedBy: 'u-1' });
      const org2 = svc.getOrg(orgId);
      const m1 = org1.members.find(m => m.userId === 'u-stable');
      const m2 = org2.members.find(m => m.userId === 'u-stable');
      expect(m1!.avatarColor).toBe(m2!.avatarColor);
    });
  });

  // ── 25-03: Invite Lifecycle ────────────────────────────────────────────────

  describe('Invite Lifecycle', () => {
    let orgId: string;

    beforeEach(() => {
      const org = svc.createOrg({
        name: 'Invite Org', slug: 'invite-org', ownerId: 'u-owner', ownerDisplayName: 'Owner', plan: 'TEAM',
      });
      orgId = org.orgId;
    });

    it('creates invite and returns one-time token', () => {
      const { invite, token } = svc.createInvite({
        organizationId: orgId, email: 'new@example.com', role: 'DEVELOPER',
        createdByUserId: 'u-owner',
      });
      expect(invite.inviteId).toMatch(/^inv-/);
      expect(invite.status).toBe('PENDING');
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(0);
    });

    it('does NOT expose raw token in invite object', () => {
      const { invite } = svc.createInvite({
        organizationId: orgId, email: 'new@example.com', role: 'DEVELOPER',
        createdByUserId: 'u-owner',
      });
      expect((invite as any).tokenHash).toBeUndefined();
      expect((invite as any).token).toBeUndefined();
    });

    it('does NOT expose raw email — only emailHash', () => {
      const { invite } = svc.createInvite({
        organizationId: orgId, email: 'secret@example.com', role: 'VIEWER',
        createdByUserId: 'u-owner',
      });
      const serialized = JSON.stringify(invite);
      expect(serialized).not.toContain('secret@example.com');
      expect(invite.emailHash).toMatch(/^emailhash-/);
    });

    it('accepts a valid invite token and adds member', () => {
      const { token } = svc.createInvite({
        organizationId: orgId, email: 'new@example.com', role: 'DESIGNER',
        createdByUserId: 'u-owner',
      });
      const org = svc.acceptInvite({ token, userId: 'u-new', displayName: 'New User' });
      expect(org.members.find(m => m.userId === 'u-new')).toBeDefined();
      expect(org.members.find(m => m.userId === 'u-new')!.role).toBe('DESIGNER');
    });

    it('rejects invalid/unknown token', () => {
      expect(() =>
        svc.acceptInvite({ token: 'invalid-token-xyz', userId: 'u-x', displayName: 'X' })
      ).toThrow();
    });

    it('rejects already-accepted token (one-time use)', () => {
      const { token } = svc.createInvite({
        organizationId: orgId, email: 'new2@example.com', role: 'VIEWER',
        createdByUserId: 'u-owner',
      });
      svc.acceptInvite({ token, userId: 'u-new2', displayName: 'New2' });
      expect(() =>
        svc.acceptInvite({ token, userId: 'u-new3', displayName: 'New3' })
      ).toThrow();
    });

    it('revokes a pending invite', () => {
      const { invite } = svc.createInvite({
        organizationId: orgId, email: 'rev@example.com', role: 'VIEWER',
        createdByUserId: 'u-owner',
      });
      const revoked = svc.revokeInvite(orgId, invite.inviteId, { revokedBy: 'u-owner' });
      expect(revoked.status).toBe('REVOKED');
    });

    it('rejects revoked invite on accept attempt', () => {
      const { invite, token } = svc.createInvite({
        organizationId: orgId, email: 'rev2@example.com', role: 'VIEWER',
        createdByUserId: 'u-owner',
      });
      svc.revokeInvite(orgId, invite.inviteId, { revokedBy: 'u-owner' });
      expect(() =>
        svc.acceptInvite({ token, userId: 'u-rev2', displayName: 'Rev2' })
      ).toThrow();
    });

    it('cannot revoke already-revoked invite', () => {
      const { invite } = svc.createInvite({
        organizationId: orgId, email: 'rv3@example.com', role: 'VIEWER',
        createdByUserId: 'u-owner',
      });
      svc.revokeInvite(orgId, invite.inviteId, { revokedBy: 'u-owner' });
      expect(() =>
        svc.revokeInvite(orgId, invite.inviteId, { revokedBy: 'u-owner' })
      ).toThrow();
    });

    it('lists invites without exposing tokenHash', () => {
      svc.createInvite({ organizationId: orgId, email: 'ls@example.com', role: 'VIEWER', createdByUserId: 'u-owner' });
      const list = svc.listInvites(orgId);
      const serialized = JSON.stringify(list);
      expect(serialized).not.toContain('tokenHash');
    });

    it('emits INVITE_CREATED audit event', () => {
      svc.createInvite({ organizationId: orgId, email: 'aud@example.com', role: 'VIEWER', createdByUserId: 'u-owner' });
      const audit = svc.getAuditLog(orgId, 20);
      expect(audit.some(e => e.type === 'INVITE_CREATED')).toBe(true);
    });

    it('emits INVITE_ACCEPTED audit event', () => {
      const { token } = svc.createInvite({ organizationId: orgId, email: 'acc@example.com', role: 'VIEWER', createdByUserId: 'u-owner' });
      svc.acceptInvite({ token, userId: 'u-acc', displayName: 'Acc' });
      const audit = svc.getAuditLog(orgId, 20);
      expect(audit.some(e => e.type === 'INVITE_ACCEPTED')).toBe(true);
    });

    it('emits INVITE_REVOKED audit event', () => {
      const { invite } = svc.createInvite({ organizationId: orgId, email: 'raud@example.com', role: 'VIEWER', createdByUserId: 'u-owner' });
      svc.revokeInvite(orgId, invite.inviteId, { revokedBy: 'u-owner' });
      const audit = svc.getAuditLog(orgId, 20);
      expect(audit.some(e => e.type === 'INVITE_REVOKED')).toBe(true);
    });

    it('rejects blocked content in invite note', () => {
      expect(() =>
        svc.createInvite({ organizationId: orgId, email: 'note@example.com', role: 'VIEWER', note: 'bash -c "rm -rf /"', createdByUserId: 'u-owner' })
      ).toThrow();
    });
  });

  // ── 25-04: RBAC Permission Engine ─────────────────────────────────────────

  describe('RBAC Permission Engine', () => {
    it('OWNER has all permissions', () => {
      const perms = ROLE_PERMISSIONS['OWNER'];
      const allScopes: PermissionScope[] = [
        'workspace.read','workspace.manage','project.read','project.edit',
        'project.review','project.deploy','runtime.manage','billing.manage',
        'member.invite','member.manage','admin.audit',
      ];
      for (const scope of allScopes) {
        expect(perms).toContain(scope);
      }
    });

    it('VIEWER only has workspace.read and project.read', () => {
      const perms = ROLE_PERMISSIONS['VIEWER'];
      expect(perms).toContain('workspace.read');
      expect(perms).toContain('project.read');
      expect(perms).not.toContain('project.edit');
      expect(perms).not.toContain('project.deploy');
      expect(perms).not.toContain('billing.manage');
    });

    it('BILLING only has workspace.read and billing.manage', () => {
      const perms = ROLE_PERMISSIONS['BILLING'];
      expect(perms).toContain('billing.manage');
      expect(perms).toContain('workspace.read');
      expect(perms).not.toContain('project.edit');
      expect(perms).not.toContain('member.invite');
    });

    it('REVIEWER can review but not deploy', () => {
      expect(rbac.canReview('REVIEWER')).toBe(true);
      expect(rbac.canDeploy('REVIEWER')).toBe(false);
    });

    it('DESIGNER can edit but not deploy or manage runtime', () => {
      expect(rbac.canEdit('DESIGNER')).toBe(true);
      expect(rbac.canDeploy('DESIGNER')).toBe(false);
      expect(rbac.canManageRuntime('DESIGNER')).toBe(false);
    });

    it('DEVELOPER can edit, review, and deploy', () => {
      expect(rbac.canEdit('DEVELOPER')).toBe(true);
      expect(rbac.canReview('DEVELOPER')).toBe(true);
      expect(rbac.canDeploy('DEVELOPER')).toBe(true);
    });

    it('DEVELOPER cannot manage billing or audit', () => {
      expect(rbac.canManageBilling('DEVELOPER')).toBe(false);
      expect(rbac.canAudit('DEVELOPER')).toBe(false);
    });

    it('ADMIN can invite and manage members but not audit', () => {
      expect(rbac.canInviteMembers('ADMIN')).toBe(true);
      expect(rbac.canManageMembers('ADMIN')).toBe(true);
      expect(rbac.canAudit('ADMIN')).toBe(false);
    });

    it('OWNER can audit', () => {
      expect(rbac.canAudit('OWNER')).toBe(true);
    });

    it('hasPermission returns false for unknown role', () => {
      expect(rbac.hasPermission('UNKNOWN' as OrgRole, 'project.edit')).toBe(false);
    });

    it('getPermissionMatrix returns all roles', () => {
      const matrix = rbac.getPermissionMatrix();
      expect(matrix).toHaveProperty('OWNER');
      expect(matrix).toHaveProperty('VIEWER');
      expect(matrix).toHaveProperty('BILLING');
      expect(matrix).toHaveProperty('REVIEWER');
      expect(matrix).toHaveProperty('DEVELOPER');
      expect(matrix).toHaveProperty('DESIGNER');
      expect(matrix).toHaveProperty('ADMIN');
    });

    it('service hasPermission returns true for OWNER on any scope', () => {
      const org = svc.createOrg({ name: 'P Org', slug: 'p-org', ownerId: 'u-own', ownerDisplayName: 'Own', plan: 'TEAM' });
      expect(svc.hasPermission('u-own', org.orgId, 'admin.audit')).toBe(true);
    });

    it('service hasPermission returns false for VIEWER on project.edit', () => {
      const org = svc.createOrg({ name: 'P Org2', slug: 'p-org2', ownerId: 'u-own2', ownerDisplayName: 'Own2', plan: 'TEAM' });
      svc.addMember({ orgId: org.orgId, userId: 'u-view', displayName: 'Viewer', role: 'VIEWER', addedBy: 'u-own2' });
      expect(svc.hasPermission('u-view', org.orgId, 'project.edit')).toBe(false);
    });

    it('service hasPermission returns false for non-member', () => {
      const org = svc.createOrg({ name: 'P Org3', slug: 'p-org3', ownerId: 'u-own3', ownerDisplayName: 'Own3', plan: 'TEAM' });
      expect(svc.hasPermission('u-outsider', org.orgId, 'project.read')).toBe(false);
    });

    it('getUserPermissions returns role and scopes', () => {
      const org = svc.createOrg({ name: 'P Org4', slug: 'p-org4', ownerId: 'u-own4', ownerDisplayName: 'Own4', plan: 'TEAM' });
      svc.addMember({ orgId: org.orgId, userId: 'u-dev', displayName: 'Dev', role: 'DEVELOPER', addedBy: 'u-own4' });
      const { role, permissions } = svc.getUserPermissions('u-dev', org.orgId);
      expect(role).toBe('DEVELOPER');
      expect(permissions).toContain('project.edit');
    });

    it('resolveEffectivePermissions merges project overrides', () => {
      const effective = rbac.resolveEffectivePermissions('VIEWER', ['project.edit']);
      expect(effective).toContain('workspace.read');
      expect(effective).toContain('project.edit');
    });
  });

  // ── Audit Log ─────────────────────────────────────────────────────────────

  describe('Audit Log', () => {
    it('audit log is ordered reverse-chronologically', () => {
      const org = svc.createOrg({ name: 'Audit Org', slug: 'audit-org', ownerId: 'u-a', ownerDisplayName: 'A', plan: 'FREE' });
      svc.addMember({ orgId: org.orgId, userId: 'u-b', displayName: 'B', role: 'VIEWER', addedBy: 'u-a' });
      const log = svc.getAuditLog(org.orgId, 10);
      for (let i = 1; i < log.length; i++) {
        expect(log[i-1].timestamp.getTime()).toBeGreaterThanOrEqual(log[i].timestamp.getTime());
      }
    });

    it('audit log respects limit', () => {
      const org = svc.createOrg({ name: 'Lim Org', slug: 'lim-org', ownerId: 'u-l', ownerDisplayName: 'L', plan: 'FREE' });
      for (let i = 0; i < 10; i++) {
        svc.addMember({ orgId: org.orgId, userId: `u-m${i}`, displayName: `M${i}`, role: 'VIEWER', addedBy: 'u-l' });
      }
      const log = svc.getAuditLog(org.orgId, 3);
      expect(log.length).toBeLessThanOrEqual(3);
    });

    it('audit events have required fields', () => {
      const org = svc.createOrg({ name: 'Fields Org', slug: 'fields-org', ownerId: 'u-f', ownerDisplayName: 'F', plan: 'FREE' });
      const log = svc.getAuditLog(org.orgId, 10);
      for (const e of log) {
        expect(e.auditId).toBeDefined();
        expect(e.type).toBeDefined();
        expect(e.actorId).toBeDefined();
        expect(e.timestamp).toBeInstanceOf(Date);
      }
    });

    it('permission checks are audited', () => {
      const org = svc.createOrg({ name: 'Perm Org', slug: 'perm-org', ownerId: 'u-p', ownerDisplayName: 'P', plan: 'FREE' });
      svc.hasPermission('u-p', org.orgId, 'project.edit');
      const log = svc.getAuditLog(org.orgId, 10);
      expect(log.some(e => e.type === 'PERMISSION_CHECKED')).toBe(true);
    });

    it('throws on getAuditLog for unknown org', () => {
      expect(() => svc.getAuditLog('nonexistent-org')).toThrow();
    });
  });

  // ── Security + Sanitization ────────────────────────────────────────────────

  describe('Security + Sanitization', () => {
    it('ORG_BLOCKED_CONTENT blocks secret keyword', () => {
      expect(ORG_BLOCKED_CONTENT.test('my secret key')).toBe(true);
    });

    it('ORG_BLOCKED_CONTENT blocks eval()', () => {
      expect(ORG_BLOCKED_CONTENT.test('eval(payload)')).toBe(true);
    });

    it('ORG_BLOCKED_CONTENT blocks api_key', () => {
      expect(ORG_BLOCKED_CONTENT.test('api_key=abc123')).toBe(true);
    });

    it('ORG_BLOCKED_CONTENT blocks bash keyword', () => {
      expect(ORG_BLOCKED_CONTENT.test('run bash command')).toBe(true);
    });

    it('ORG_BLOCKED_CONTENT blocks jwt_secret', () => {
      expect(ORG_BLOCKED_CONTENT.test('jwt_secret=xyz')).toBe(true);
    });

    it('raw email not stored — only emailHash', () => {
      const org = svc.createOrg({ name: 'Sec Org', slug: 'sec-org', ownerId: 'u-sec', ownerDisplayName: 'Sec', plan: 'FREE' });
      const { invite } = svc.createInvite({ organizationId: org.orgId, email: 'raw@email.com', role: 'VIEWER', createdByUserId: 'u-sec' });
      const serialized = JSON.stringify(invite);
      expect(serialized).not.toContain('raw@email.com');
      expect(invite.emailHash).toMatch(/^emailhash-/);
    });

    it('raw token NOT in invite object — only one-time returned', () => {
      const org = svc.createOrg({ name: 'Sec Org2', slug: 'sec-org2', ownerId: 'u-sec2', ownerDisplayName: 'Sec2', plan: 'FREE' });
      const result = svc.createInvite({ organizationId: org.orgId, email: 'tok@email.com', role: 'VIEWER', createdByUserId: 'u-sec2' });
      expect(result.token).toBeDefined();
      expect((result.invite as any).token).toBeUndefined();
      expect((result.invite as any).tokenHash).toBeUndefined();
    });

    it('tokenHash not present in listInvites output', () => {
      const org = svc.createOrg({ name: 'Sec Org3', slug: 'sec-org3', ownerId: 'u-sec3', ownerDisplayName: 'Sec3', plan: 'FREE' });
      svc.createInvite({ organizationId: org.orgId, email: 'list@email.com', role: 'VIEWER', createdByUserId: 'u-sec3' });
      const list = svc.listInvites(org.orgId);
      expect(JSON.stringify(list)).not.toContain('tokenHash');
    });

    it('audit metadata does not contain raw email', () => {
      const org = svc.createOrg({ name: 'Sec Org4', slug: 'sec-org4', ownerId: 'u-sec4', ownerDisplayName: 'Sec4', plan: 'FREE' });
      svc.createInvite({ organizationId: org.orgId, email: 'audit@email.com', role: 'VIEWER', createdByUserId: 'u-sec4' });
      const log = svc.getAuditLog(org.orgId, 10);
      const serialized = JSON.stringify(log);
      expect(serialized).not.toContain('audit@email.com');
    });

    it('analytics output safe — no secrets', () => {
      const analytics = svc.getAnalytics('org-factory-default');
      expect(ORG_BLOCKED_CONTENT.test(JSON.stringify(analytics))).toBe(false);
    });

    it('member permissions array correct for all roles', () => {
      const org = svc.createOrg({ name: 'All Roles Org', slug: 'all-roles', ownerId: 'u-r0', ownerDisplayName: 'R0', plan: 'AGENCY' });
      const roles: OrgRole[] = ['ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'];
      roles.forEach((role, i) => {
        svc.addMember({ orgId: org.orgId, userId: `u-r${i+1}`, displayName: `R${i+1}`, role, addedBy: 'u-r0' });
      });
      const members = svc.listMembers(org.orgId);
      for (const m of members) {
        expect(m.permissions).toEqual(ROLE_PERMISSIONS[m.role]);
      }
    });
  });

  // ── Analytics ──────────────────────────────────────────────────────────────

  describe('Analytics', () => {
    it('returns analytics with expected shape', () => {
      const a = svc.getAnalytics('org-factory-default');
      expect(a).toHaveProperty('totalMembers');
      expect(a).toHaveProperty('roleCounts');
      expect(a).toHaveProperty('totalInvites');
      expect(a).toHaveProperty('pendingInvites');
      expect(a).toHaveProperty('auditEvents');
      expect(a).toHaveProperty('plan');
    });

    it('seeded default org has 4 members', () => {
      const a = svc.getAnalytics('org-factory-default');
      expect(a.totalMembers).toBeGreaterThanOrEqual(4);
    });

    it('plan is one of FREE/TEAM/AGENCY', () => {
      const a = svc.getAnalytics('org-factory-default');
      expect(['FREE','TEAM','AGENCY']).toContain(a.plan);
    });

    it('throws for unknown org', () => {
      expect(() => svc.getAnalytics('bad-org')).toThrow();
    });

    it('inviteAcceptanceRate correctly computed after accept', () => {
      const org = svc.createOrg({ name: 'Rate Org', slug: 'rate-org', ownerId: 'u-rt', ownerDisplayName: 'Rt', plan: 'FREE' });
      const { token } = svc.createInvite({ organizationId: org.orgId, email: 'rate@ex.com', role: 'VIEWER', createdByUserId: 'u-rt' });
      svc.acceptInvite({ token, userId: 'u-rate', displayName: 'Rate User' });
      const a = svc.getAnalytics(org.orgId);
      expect(a.acceptedInvites).toBe(1);
      expect(a.totalInvites).toBe(1);
    });
  });
});

// ── RbacService standalone ────────────────────────────────────────────────────

describe('RbacService', () => {
  let rbac: RbacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RbacService],
    }).compile();
    rbac = module.get<RbacService>(RbacService);
  });

  it('getPermissionsForRole returns array for all roles', () => {
    const roles: OrgRole[] = ['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'];
    for (const role of roles) {
      expect(Array.isArray(rbac.getPermissionsForRole(role))).toBe(true);
    }
  });

  it('OWNER permissions superset of ADMIN', () => {
    const owner = rbac.getPermissionsForRole('OWNER');
    const admin = rbac.getPermissionsForRole('ADMIN');
    for (const perm of admin) {
      expect(owner).toContain(perm);
    }
  });

  it('ADMIN permissions superset of DEVELOPER', () => {
    const admin = rbac.getPermissionsForRole('ADMIN');
    const dev = rbac.getPermissionsForRole('DEVELOPER');
    for (const perm of dev) {
      expect(admin).toContain(perm);
    }
  });

  it('BILLING cannot edit or deploy', () => {
    expect(rbac.canEdit('BILLING')).toBe(false);
    expect(rbac.canDeploy('BILLING')).toBe(false);
  });

  it('VIEWER cannot do anything except read', () => {
    expect(rbac.canEdit('VIEWER')).toBe(false);
    expect(rbac.canDeploy('VIEWER')).toBe(false);
    expect(rbac.canReview('VIEWER')).toBe(false);
    expect(rbac.canManageBilling('VIEWER')).toBe(false);
    expect(rbac.canInviteMembers('VIEWER')).toBe(false);
    expect(rbac.canAudit('VIEWER')).toBe(false);
  });
});
