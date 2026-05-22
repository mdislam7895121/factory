import { Injectable } from '@nestjs/common';
import { OrgRole, PermissionScope, ROLE_PERMISSIONS } from './organization.types';

// ── 25: RBAC Permission Engine ────────────────────────────────────────────────

@Injectable()
export class RbacService {
  // ── Role → Permission Map ──────────────────────────────────────────────────

  getPermissionsForRole(role: OrgRole): PermissionScope[] {
    return ROLE_PERMISSIONS[role] ?? [];
  }

  hasPermission(role: OrgRole, scope: PermissionScope): boolean {
    return ROLE_PERMISSIONS[role]?.includes(scope) ?? false;
  }

  // ── Convenience checks ─────────────────────────────────────────────────────

  canEdit(role: OrgRole): boolean {
    return this.hasPermission(role, 'project.edit');
  }

  canDeploy(role: OrgRole): boolean {
    return this.hasPermission(role, 'project.deploy');
  }

  canReview(role: OrgRole): boolean {
    return this.hasPermission(role, 'project.review');
  }

  canManageBilling(role: OrgRole): boolean {
    return this.hasPermission(role, 'billing.manage');
  }

  canInviteMembers(role: OrgRole): boolean {
    return this.hasPermission(role, 'member.invite');
  }

  canManageMembers(role: OrgRole): boolean {
    return this.hasPermission(role, 'member.manage');
  }

  canAudit(role: OrgRole): boolean {
    return this.hasPermission(role, 'admin.audit');
  }

  canManageWorkspace(role: OrgRole): boolean {
    return this.hasPermission(role, 'workspace.manage');
  }

  canManageRuntime(role: OrgRole): boolean {
    return this.hasPermission(role, 'runtime.manage');
  }

  // ── Full matrix ────────────────────────────────────────────────────────────

  getPermissionMatrix(): Record<OrgRole, Record<PermissionScope, boolean>> {
    const allScopes: PermissionScope[] = [
      'workspace.read', 'workspace.manage', 'project.read', 'project.edit',
      'project.review', 'project.deploy', 'runtime.manage', 'billing.manage',
      'member.invite', 'member.manage', 'admin.audit',
    ];

    const matrix = {} as Record<OrgRole, Record<PermissionScope, boolean>>;
    const roles: OrgRole[] = ['OWNER','ADMIN','DEVELOPER','DESIGNER','REVIEWER','BILLING','VIEWER'];

    for (const role of roles) {
      matrix[role] = {} as Record<PermissionScope, boolean>;
      for (const scope of allScopes) {
        matrix[role][scope] = this.hasPermission(role, scope);
      }
    }
    return matrix;
  }

  // ── Project-level overrides (placeholder for SERIAL 26+) ──────────────────

  resolveEffectivePermissions(
    baseRole: OrgRole,
    projectOverrides: PermissionScope[],
  ): PermissionScope[] {
    const base = this.getPermissionsForRole(baseRole);
    const merged = new Set([...base, ...projectOverrides]);
    return Array.from(merged);
  }
}
