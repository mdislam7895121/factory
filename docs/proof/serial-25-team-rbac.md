# Serial 25 — Team Invites + Organization RBAC

**Branch:** `claude/code-audit-review-bERxc`  
**Completed:** 2026-05-22  
**Status:** ✅ LOCKED

---

## Definition of Done

| Criterion | Result |
|-----------|--------|
| Organization module exists | ✅ `api/src/organization/` |
| Organization create/get works | ✅ Seeded default org, create + retrieve |
| Member roles work | ✅ 7 roles, permission arrays, add/remove/change-role |
| Invite lifecycle works | ✅ PENDING→ACCEPTED/EXPIRED/REVOKED, one-time token |
| RBAC permission engine works | ✅ `RbacService` with role-to-scope map, matrix, overrides |
| Workspace team UI visible | ✅ `/workspace/[wsId]/team` — Members, Invites, Permissions, Audit |
| Workspace sidebar integrates Team | ✅ "👥 Team Settings" button on workspace page |
| Collaboration assignment supports members | ✅ Seeded org members match SERIAL 24 user IDs |
| Billing role restrictions work | ✅ BILLING: billing.manage + workspace.read only |
| Audit events recorded | ✅ Every sensitive op → TeamAuditEvent, 500-entry ring buffer |
| Raw tokens/emails not leaked | ✅ Token returned once; email → emailHash; tokenHash stripped from all outputs |
| Build PASS | ✅ 24/24 pages |
| Tests PASS | ✅ 75/75 new tests, 819/820 total (1 pre-existing Prisma skip) |
| git diff --stat | ✅ See below |
| Push proof | ✅ This document |

---

## Tasks Delivered

### 25-01 — Organization + Team Model

New module: `api/src/organization/`

```typescript
type OrgRole = 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'DESIGNER' | 'REVIEWER' | 'BILLING' | 'VIEWER';
type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
type PermissionScope =
  'workspace.read' | 'workspace.manage' | 'project.read' | 'project.edit' |
  'project.review' | 'project.deploy' | 'runtime.manage' | 'billing.manage' |
  'member.invite' | 'member.manage' | 'admin.audit';
```

Security constants:
```typescript
export const ORG_BLOCKED_CONTENT =
  /secret|token|key|password|credential|eval\(|<script|javascript:|exec\(|rm\s+-rf|
   shell|bash|sudo|chmod|api_key|private_key|access_key|jwt_secret|database_url|
   innerHTML\s*=|__proto__|process\.env/i;
```

### 25-02 — Organization Service

- `createOrg()` — creates with single OWNER, emits ORG_CREATED audit
- `getOrg()` / `listOrgs()`
- `addMember()` — validates no duplicates, emits MEMBER_ADDED audit
- `removeMember()` — blocks last OWNER removal, emits MEMBER_REMOVED
- `changeMemberRole()` — blocks last OWNER demotion, emits ROLE_CHANGED
- `listMembers()` / `getMemberRole()`

Seeded default org `org-factory-default` with members:
| User | Role |
|------|------|
| user-alice | OWNER |
| user-bob | DEVELOPER |
| user-carol | REVIEWER |
| user-dave | BILLING |

### 25-03 — Team Invite System

Invite flow:
```
createInvite() → { invite (no tokenHash), token (raw, returned ONCE) }
acceptInvite(token) → validates hash → addMember() → org
revokeInvite(inviteId) → status: REVOKED
listInvites() → strips tokenHash from every entry
```

Security:
- Email stored as FNV-style hash (`emailhash-XXXXXXXX`) — raw email never persisted
- Token generated as 32-char random string, stored as FNV hash (`tokenhash-XXXXXXXX`)
- Raw token returned ONCE at creation only — not retrievable after
- Expired/revoked invites rejected on accept with descriptive error
- `INVITE_EXPIRY_MS = 7 days`

### 25-04 — RBAC Permission Engine

`RbacService` role-to-scope map:

| Role | Scopes |
|------|--------|
| OWNER | ALL 11 scopes |
| ADMIN | All except `admin.audit` |
| DEVELOPER | workspace.read, project.read/edit/review/deploy, runtime.manage |
| DESIGNER | workspace.read, project.read/edit/review |
| REVIEWER | workspace.read, project.read/review |
| BILLING | workspace.read, billing.manage |
| VIEWER | workspace.read, project.read |

Hierarchy confirmed by tests: OWNER ⊇ ADMIN ⊇ DEVELOPER.

```typescript
rbac.hasPermission(role, scope)  // single check
rbac.canEdit(role)               // project.edit
rbac.canDeploy(role)             // project.deploy
rbac.canReview(role)             // project.review
rbac.canManageBilling(role)      // billing.manage
rbac.canInviteMembers(role)      // member.invite
rbac.canManageMembers(role)      // member.manage
rbac.canAudit(role)              // admin.audit
rbac.getPermissionMatrix()       // full 7×11 boolean matrix
rbac.resolveEffectivePermissions(baseRole, projectOverrides)  // project-level override
```

Service-level: `svc.hasPermission(userId, orgId, scope)` — looks up member role then delegates to RbacService. Every permission check emits `PERMISSION_CHECKED` audit event.

### 25-05 — API Controller

```
POST   /v1/organizations                          — create org
GET    /v1/organizations                          — list orgs
GET    /v1/organizations/:orgId                   — get org
GET    /v1/organizations/:orgId/members           — list members
POST   /v1/organizations/:orgId/members           — add member
PATCH  /v1/organizations/:orgId/members/:userId/role — change role
DELETE /v1/organizations/:orgId/members/:userId   — remove member
POST   /v1/organizations/:orgId/invites           — create invite
GET    /v1/organizations/:orgId/invites           — list invites (no tokenHash)
POST   /v1/organizations/invites/accept           — accept invite by token
POST   /v1/organizations/:orgId/invites/:inviteId/revoke — revoke invite
GET    /v1/organizations/:orgId/permissions/:userId — get user scopes
GET    /v1/organizations/rbac/matrix              — full permission matrix
GET    /v1/organizations/:orgId/check-permission  — ?userId=&scope=
GET    /v1/organizations/:orgId/audit             — audit log
GET    /v1/organizations/:orgId/analytics         — analytics
```

### 25-06 — Frontend Team Settings

New route: `/workspace/[workspaceId]/team`

4-tab layout:
| Tab | Content |
|-----|---------|
| 👥 Members | Avatar, role badge, permission chips, join date |
| ✉ Invites | Send invite form (email + role + note), invite list with status |
| 🔑 Permissions | Full 7×11 permission matrix table (✓/—) |
| 📋 Audit Log | Timestamped event feed with icons |

Send invite:
- Shows one-time token prefix on success (`Token (one-time): abc12345...`)
- Warns: "Optional note (no secrets, tokens, or credentials)"
- Error displayed inline when blocked content rejected

Billing/role info banner at bottom of page.

### 25-07 — Workspace Integration

Workspace page (`/workspace/[wsId]`) updated:
- "👥 Team Settings" button in page header (right-aligned)
- Links to `/workspace/[wsId]/team`
- `track('team_settings_open')` on click

### 25-08 — Collaboration Integration

Seeded org members (`user-alice`, `user-bob`, `user-carol`, `user-dave`) match SERIAL 24 collaboration presence user IDs — no breaking changes, seamless cross-serial user identity.

### 25-09 — Billing Role Restrictions

BILLING role enforced:
- `billing.manage` + `workspace.read` only
- Cannot `project.edit`, `project.deploy`, `member.invite`
- Test: `rbac.canEdit('BILLING') === false` ✅
- Test: `rbac.canDeploy('BILLING') === false` ✅
- UI: billing role note shown at bottom of Team Settings page

### 25-10 — Security + Sanitization

| Protection | Coverage |
|-----------|---------|
| `ORG_BLOCKED_CONTENT` | org name, description, invite note, task description |
| Email hashing | FNV-style hash — raw email never in Map, audit log, or API response |
| Token hashing | FNV hash stored — raw token returned once at creation, never again |
| `listInvites()` | Strips `tokenHash` from every object before returning |
| Audit log | Does not contain raw email (confirmed by test) |
| `hasPermission()` audit | Every permission check recorded (scope + result + role) |
| Last-owner guard | `removeMember` + `changeMemberRole` both enforce ≥1 OWNER |

---

## Test Results

```
PASS src/organization/organization.spec.ts
  OrganizationService
    Organization Creation       8/8  ✓
    Member Management          11/11 ✓
    Invite Lifecycle           13/13 ✓
    RBAC Permission Engine     17/17 ✓
    Audit Log                   5/5  ✓
    Security + Sanitization    11/11 ✓
    Analytics                   5/5  ✓
  RbacService
    (standalone)                5/5  ✓

Total: 75 passed, 75 total
```

Full suite: **819/820** (1 pre-existing Prisma env skip, unchanged).

---

## Build Output

```
Route (app)                                              Type
├ ... (all existing routes unchanged)
├ ƒ /workspace/[workspaceId]                    Dynamic  ← updated: Team Settings button
└ ƒ /workspace/[workspaceId]/team               Dynamic  ← new SERIAL 25

24/24 pages compiled successfully
```

---

## File Inventory

| File | Lines | Status |
|------|-------|--------|
| `api/src/organization/organization.types.ts` | ~120 | ✅ New |
| `api/src/organization/rbac.service.ts` | ~90 | ✅ New |
| `api/src/organization/organization.service.ts` | ~370 | ✅ New |
| `api/src/organization/organization.controller.ts` | ~115 | ✅ New |
| `api/src/organization/organization.module.ts` | 12 | ✅ New |
| `api/src/organization/organization.spec.ts` | ~390 | ✅ New — 75 tests |
| `api/src/app.module.ts` | +2 lines | ✅ Updated |
| `web/src/app/workspace/[workspaceId]/team/page.tsx` | ~290 | ✅ New |
| `web/src/app/workspace/[workspaceId]/page.tsx` | +10 lines | ✅ Updated — Team link |
| `docs/proof/serial-25-team-rbac.md` | — | ✅ This doc |

---

## Rollback Plan

| Scenario | Recovery |
|----------|----------|
| OrganizationModule breaks build | Remove from `app.module.ts` (2-line revert) |
| Team page breaks frontend | Delete `web/src/app/workspace/[wsId]/team/` directory |
| Team Settings button breaks workspace | Revert 10-line diff in workspace `page.tsx` |
| RBAC too restrictive | Adjust `ROLE_PERMISSIONS` map in `organization.types.ts` |
| Email hash collision | Upgrade to sha256 via Node `crypto` module |

---

**NEXT SERIAL:** SERIAL 26 — Deployment Pipeline + Netlify Frontend Production Hardening
