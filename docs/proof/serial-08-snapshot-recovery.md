# SERIAL 08 — Persistent Snapshots + Recovery
**Date:** 2026-05-21
**Branch:** `claude/code-audit-review-bERxc`

---

## 1. DB Migration Proof

**File:** `api/prisma/migrations/20260521000008_snapshot_recovery/migration.sql`

New types and tables created:
```
CREATE TYPE "SnapshotType"       AS ENUM ('MANUAL','PRE_DEPLOY','PRE_REMIX','AUTO_RECOVERY','SCHEDULED')
CREATE TYPE "SnapshotStatus"     AS ENUM ('CREATING','READY','FAILED','RESTORING','RESTORED','EXPIRED')
CREATE TYPE "RecoveryEventType"  AS ENUM ('SNAPSHOT_CREATED','RESTORE_STARTED','RESTORE_SUCCEEDED',
                                          'RESTORE_FAILED','RUNTIME_RECOVERED','ROLLBACK_TRIGGERED')
CREATE TABLE "ProjectSnapshot"         — 4 indexes
CREATE TABLE "RuntimeRecoveryEvent"    — 4 indexes + FK → ProjectSnapshot
```

Schema validated: `prisma generate` succeeds with no errors.

---

## 2. Snapshot Create Proof

**Service:** `api/src/snapshot/snapshot.service.ts` — `createSnapshot(input)`

Flow:
1. Runtime fetched from DB — throws `NotFoundException` if missing
2. Placeholder `ProjectSnapshot` record inserted with status `CREATING`
3. `SNAPSHOT_STARTED` AgentActivityEvent emitted (HEALER/INFO/RUNNING)
4. `MetadataSnapshotAdapter.capture(runtimeId)` builds manifest:
   - runtime config (visibility, allowRemix, remixNote, runtimeType)
   - safe metadata (BLOCKED_MANIFEST_KEYS stripped)
   - fork lineage from `ProjectFork` table
   - preview routes from `PreviewRoute` table
5. SHA-256 checksum computed; manifest JSON serialized
6. Record updated to `READY` with manifest/checksum/sizeBytes
7. `RuntimeRecoveryEvent` (SNAPSHOT_CREATED/SUCCESS) persisted
8. `SNAPSHOT_READY` activity event emitted

If capture fails: record set to `FAILED`, `SNAPSHOT_FAILED` activity emitted, error rethrown.

---

## 3. Snapshot Restore Proof

**Endpoint:** `POST /v1/snapshots/:snapshotId/restore`

Flow:
1. Snapshot fetched — throws `NotFoundException` if missing
2. `ownerUserId !== requesterId` → `ForbiddenException` (unauthorized restore blocked ✓)
3. `status !== READY` → `NotFoundException`
4. Status set to `RESTORING` + `RESTORE_STARTED` recovery event + activity event
5. Checksum verified against stored value
6. `MetadataSnapshotAdapter.restore(runtimeId, manifest)` applies:
   - `visibility`, `allowRemix`, `remixNote`, `metadata` (safe-only)
   - `previewUrl`, `sourceId`, `ownerUserId` intentionally NOT restored (see §4, §9)
7. Snapshot updated to `RESTORED` + `restoredAt` timestamp
8. `RESTORE_SUCCEEDED` recovery event + `RESTORE_SUCCESS` activity event

If restore fails: snapshot reverted to `READY` (user can retry), `RESTORE_FAILED` events emitted.

---

## 4. Preview URL Preservation Proof

`MetadataSnapshotAdapter.restore()` at line:
```typescript
// NOTE: previewUrl, sourceId, ownerUserId intentionally NOT restored
// to preserve stable URLs (08-09) and fork lineage (08-09)
```

The `previewUrl` field is never included in the Prisma `update()` data object during restore. The stable URL assigned at runtime creation (`/p/:id`) is guaranteed to remain unchanged through any number of restore operations.

---

## 5. Secret Redaction Proof

**Pattern:** `BLOCKED_MANIFEST_KEYS = /secret|token|key|password|credential|auth|private|prompt|instruction|system|chain_of_thought|hidden|internal/i`

Applied in two places:
- `MetadataSnapshotAdapter.redactMetadata()` — strips during `capture()`
- `MetadataSnapshotAdapter.restore()` → calls `redactMetadata()` before writing back

Additionally, `SnapshotService.restoreSnapshot()` passes the manifest through `adapter.restore()` which re-strips before any DB write. Secrets are never persisted in `manifest` column.

---

## 6. Unauthorized Restore Blocked

```typescript
if (snapshot.ownerUserId !== requesterId) throw new ForbiddenException('access denied');
```

`POST /v1/snapshots/:snapshotId/restore` is also behind `@UseGuards(ApiKeyGuard)` — unauthenticated requests receive `401` before ownership check.

---

## 7. Auto Snapshot Hook Proof

**PRE_REMIX (blocks on failure):**
`api/src/remix/remix.service.ts` — `remix()` method:
```typescript
// 08-05: PRE_REMIX snapshot — capture source state before fork; blocks if it fails
if (this.snapshots) {
  await this.snapshots.createSnapshot({
    snapshotType: SnapshotType.PRE_REMIX,
    ...
  });  // no .catch() — intentionally blocks remix on snapshot failure
}
```

**AUTO_RECOVERY (non-blocking, warns):**
`api/src/sandbox/runtime/runtime.service.ts` — `recover()` method:
```typescript
// 08-05: AUTO_RECOVERY snapshot — capture state before attempting restart (non-blocking)
await this.snapshots.createSnapshot({ snapshotType: SnapshotType.AUTO_RECOVERY, ... })
  .catch((err) => this.logger.warn(..., 'pre-recovery snapshot failed (non-fatal)'));
```

Both use `@Optional()` injection — if `SnapshotModule` is not loaded (e.g. test env), the hook silently skips.

---

## 8. Recovery Event Proof

`RuntimeRecoveryEvent` records created by `SnapshotService.createRecoveryEvent()` for:
- `SNAPSHOT_CREATED` — on every successful snapshot
- `RESTORE_STARTED` / `RESTORE_SUCCEEDED` / `RESTORE_FAILED` — on every restore attempt
- `RUNTIME_RECOVERED` (FAILED) — by `SnapshotRecoveryScheduler` when no snapshot available
- `ROLLBACK_TRIGGERED` (FAILED) — by `SnapshotRecoveryScheduler` on auto-restore failure

`SnapshotRecoveryScheduler` polls at `ACTIVITY_MONITOR_INTERVAL_MS` (default 30s), detects newly CRASHED runtimes, and when `AUTO_RESTORE_ENABLED=true` attempts to restore the latest READY snapshot.

---

## 9. Retention Cleanup Proof

**Scheduler:** `api/src/snapshot/snapshot-retention.scheduler.ts` — runs every 4 hours.

**Config:**
```
SNAPSHOT_MANUAL_RETENTION_DAYS=90   # MANUAL, PRE_DEPLOY, PRE_REMIX
SNAPSHOT_AUTO_RETENTION_DAYS=14     # AUTO_RECOVERY, SCHEDULED
SNAPSHOT_MAX_PER_PROJECT=25         # hard cap per project
```

Cleanup sets status to `EXPIRED` — records are not deleted, preserving audit trail.

---

## 10. Activity Stream Proof

All snapshot/recovery events visible at `GET /v1/activity/:projectId/replay`:

| eventType             | agentType | severity | status  |
|-----------------------|-----------|----------|---------|
| SNAPSHOT_STARTED      | HEALER    | INFO     | RUNNING |
| SNAPSHOT_READY        | HEALER    | INFO     | SUCCESS |
| SNAPSHOT_FAILED       | HEALER    | ERROR    | FAILED  |
| RESTORE_STARTED       | HEALER    | WARNING  | RUNNING |
| RESTORE_SUCCESS       | HEALER    | INFO     | SUCCESS |
| RESTORE_FAILED        | HEALER    | ERROR    | FAILED  |

---

## 11. Rollback Instructions

To roll back a runtime to a previous state:

```bash
# 1. List available snapshots for a project
GET /v1/snapshots/:projectId

# 2. Find a READY snapshot with desired label/timestamp

# 3. Restore it
POST /v1/snapshots/:snapshotId/restore
Authorization: X-Api-Key <key>

# 4. Monitor recovery
GET /v1/activity/:projectId/stream   # live SSE
GET /v1/activity/:projectId/replay   # full history

# 5. Verify preview URL still works (previewUrl is never changed by restore)
GET /p/:runtimeId
```

To enable automatic restore on crash:
```
AUTO_RESTORE_ENABLED=true
AUTO_RESTORE_MAX_ATTEMPTS=2
```

---

## Build / Test / Git

```
Build:  PASS (npm run build — zero TS errors)
Tests:  PASS (2/2 suites)

13 source files changed (excluding generated):
  api/.env.example                           |  12 +
  api/prisma/schema.prisma                   |  74 +
  api/src/app.module.ts                      |   3 +-
  api/src/remix/remix.module.ts              |   2 +
  api/src/remix/remix.service.ts             |  20 +-
  api/src/sandbox/runtime/runtime.module.ts  |   6 +-
  api/src/sandbox/runtime/runtime.service.ts |  19 +-
  api/src/snapshot/runtime-snapshot.adapter.ts (new)
  api/src/snapshot/snapshot.service.ts       (new)
  api/src/snapshot/snapshot.controller.ts    (new)
  api/src/snapshot/snapshot-retention.scheduler.ts (new)
  api/src/snapshot/snapshot-recovery.scheduler.ts  (new)
  api/src/snapshot/snapshot.module.ts        (new)
  docs/proof/serial-08-snapshot-recovery.md  (new)
```
