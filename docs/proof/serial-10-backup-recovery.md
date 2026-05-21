# SERIAL 10 — Backup & Recovery Verification
**Date:** 2026-05-21 | **Branch:** `claude/code-audit-review-bERxc`

---

## 1. Database Backup Strategy

**PostgreSQL (Railway/managed):**
- Automated daily backups via Railway or managed Postgres provider
- Point-in-Time Recovery (PITR) supported on paid plans
- Manual backup: `pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql`
- Restore: `psql $DATABASE_URL < backup_YYYYMMDD.sql`

**What is backed up:**
- All user data (projects, workspaces, API keys)
- RuntimeInstance registry (previewUrl is stable and FK-referenced)
- ProjectSnapshot manifests — entire restore history
- SecurityAuditEvent log — immutable trail
- AgentActivityEvent stream — replay history

---

## 2. Snapshot Restore Walkthrough

Complete restore procedure for a generated app:

```bash
# Step 1: List available snapshots for a project
curl -H "Authorization: Bearer sk-live-..." \
  GET /v1/snapshots/:projectId

# Step 2: Identify a READY snapshot with the desired state

# Step 3: Restore it
curl -X POST -H "Authorization: Bearer sk-live-..." \
  POST /v1/snapshots/:snapshotId/restore

# Step 4: Monitor recovery in activity stream
GET /v1/activity/:projectId/stream   # live SSE

# Step 5: Verify runtime came back
GET /v1/runtimes/:runtimeId          # should show PROVISIONING → RUNNING
GET /p/:runtimeId                    # preview URL unchanged ✓
```

**What is preserved through restore:**
- `previewUrl` — unchanged (stable URL guarantee)
- `sourceId` / fork lineage — unchanged
- `ProjectFork` records — unchanged (09 proof)
- `PreviewRoute` slugs — unchanged

**What is restored:**
- `visibility`, `allowRemix`, `remixNote`
- Safe `metadata` (secrets stripped by BLOCKED_MANIFEST_KEYS)

**What requires orchestrator for full restore (TODO):**
- Container filesystem / image state
- Running process state

---

## 3. Redis Persistence Strategy

**Recommended configuration:**
```
appendonly yes          # AOF (Append-Only File) persistence
appendfsync everysec    # fsync every second (good balance)
save 900 1             # RDB snapshot every 15min if >= 1 change
```

**What is in Redis (can be reconstructed if lost):**
- Rate limit counters (transient — will reset, no data loss)
- Kill switch flags (will reset to env defaults)
- Beta invite codes (re-add via admin API)
- Abuse counters (transient)
- Quota counters (daily — reset at midnight)
- Activity pub/sub channels (live only — not persisted)

**What is NOT in Redis (safe even if Redis is wiped):**
- All persistent state is in PostgreSQL
- RuntimeInstance heartbeats will restart naturally
- Preview routes resolve from DB

---

## 4. Preview Recovery Test

Scenario: runtime CRASHES → preview URL must remain stable → auto-restore triggered:

```
1. Runtime transitions to CRASHED (heartbeat lost)
2. ActivityMonitorScheduler emits RUNTIME_CRASHED
3. SnapshotRecoveryScheduler detects CRASHED runtime
4. If AUTO_RESTORE_ENABLED=true:
   a. Creates AUTO_RECOVERY snapshot of crashed state
   b. Restores last READY snapshot
   c. Emits RESTORE_SUCCESS activity event
   d. Runtime set to PROVISIONING (healer re-provisions container)
5. previewUrl /p/:id remains identical throughout ✓
```

---

## 5. Runtime Recovery Test

Scenario: runtime heartbeat lost → RuntimeHealthScheduler → recover():

```
1. RuntimeHealthScheduler.detectDeadRuntimes() marks runtime CRASHED
2. RuntimeService.recover() is called (max 3 attempts)
3. Before restart: AUTO_RECOVERY snapshot saved (SERIAL 08 hook)
4. containerId cleared → orchestrator re-provisions
5. On success: recoveryCount incremented, event logged
6. On failure (3 attempts): marked permanently CRASHED
   → operator must manually restore via snapshot API
```

---

## 6. Operator Recovery Runbook

**Runtime stuck in CRASHED state:**
```bash
# Option A: manual restart
POST /v1/runtimes/:id/restart

# Option B: restore from snapshot
POST /v1/snapshots/:snapshotId/restore

# Option C: wake from sleep
POST /v1/runtimes/:id/wake
```

**Database corruption:**
```bash
pg_restore -d $DATABASE_URL backup_YYYYMMDD.dump
# Then: restart API to re-sync Redis counters
```

**Redis data loss:**
- Kill switch state: re-enable via POST /admin/kill-switches/:name/enable
- Beta invites: re-add via POST /admin/beta/invite
- All quota/rate counters: self-heal within 1 day
