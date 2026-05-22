import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  CreateOrgDto, AddMemberDto, ChangeMemberRoleDto,
  CreateInviteDto, AcceptInviteDto, RevokeInviteDto,
  PermissionScope,
} from './organization.types';
import { RbacService } from './rbac.service';

// ── 25: Team Invites + Organization RBAC Controller ──────────────────────────

@Controller('v1/organizations')
export class OrganizationController {
  constructor(
    private readonly svc: OrganizationService,
    private readonly rbac: RbacService,
  ) {}

  // ── Organization ──────────────────────────────────────────────────────────

  @Post()
  createOrg(@Body() dto: CreateOrgDto) {
    return this.svc.createOrg(dto);
  }

  @Get()
  listOrgs() {
    return this.svc.listOrgs();
  }

  @Get(':orgId')
  getOrg(@Param('orgId') orgId: string) {
    try { return this.svc.getOrg(orgId); }
    catch { return { error: 'Organization not found' }; }
  }

  // ── Members ───────────────────────────────────────────────────────────────

  @Get(':orgId/members')
  listMembers(@Param('orgId') orgId: string) {
    try { return this.svc.listMembers(orgId); }
    catch { return { error: 'Organization not found' }; }
  }

  @Post(':orgId/members')
  addMember(@Param('orgId') orgId: string, @Body() dto: AddMemberDto) {
    return this.svc.addMember({ ...dto, orgId });
  }

  @Patch(':orgId/members/:userId/role')
  changeMemberRole(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Body() dto: ChangeMemberRoleDto,
  ) {
    return this.svc.changeMemberRole({ ...dto, orgId, userId });
  }

  @Delete(':orgId/members/:userId')
  removeMember(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Body('removedBy') removedBy: string,
  ) {
    return this.svc.removeMember(orgId, userId, removedBy ?? 'system');
  }

  // ── Invites ───────────────────────────────────────────────────────────────

  @Post(':orgId/invites')
  createInvite(@Param('orgId') orgId: string, @Body() dto: CreateInviteDto) {
    return this.svc.createInvite({ ...dto, organizationId: orgId });
  }

  @Get(':orgId/invites')
  listInvites(@Param('orgId') orgId: string) {
    try { return this.svc.listInvites(orgId); }
    catch { return { error: 'Organization not found' }; }
  }

  @Post('invites/accept')
  acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.svc.acceptInvite(dto);
  }

  @Post(':orgId/invites/:inviteId/revoke')
  revokeInvite(
    @Param('orgId') orgId: string,
    @Param('inviteId') inviteId: string,
    @Body() dto: RevokeInviteDto,
  ) {
    return this.svc.revokeInvite(orgId, inviteId, dto);
  }

  // ── RBAC ──────────────────────────────────────────────────────────────────

  @Get(':orgId/permissions/:userId')
  getUserPermissions(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
  ) {
    return this.svc.getUserPermissions(userId, orgId);
  }

  @Get('rbac/matrix')
  getPermissionMatrix() {
    return this.rbac.getPermissionMatrix();
  }

  @Get(':orgId/check-permission')
  checkPermission(
    @Param('orgId') orgId: string,
    @Query('userId') userId: string,
    @Query('scope') scope: string,
  ) {
    const allowed = this.svc.hasPermission(userId, orgId, scope as PermissionScope);
    return { userId, orgId, scope, allowed };
  }

  // ── Audit ─────────────────────────────────────────────────────────────────

  @Get(':orgId/audit')
  getAuditLog(
    @Param('orgId') orgId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      return this.svc.getAuditLog(orgId, limit ? parseInt(limit, 10) : 50);
    } catch { return { error: 'Organization not found' }; }
  }

  // ── Analytics ─────────────────────────────────────────────────────────────

  @Get(':orgId/analytics')
  getAnalytics(@Param('orgId') orgId: string) {
    try { return this.svc.getAnalytics(orgId); }
    catch { return { error: 'Organization not found' }; }
  }
}
