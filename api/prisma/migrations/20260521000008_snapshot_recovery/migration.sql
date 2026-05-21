-- ── SERIAL 08: Persistent Snapshots + Recovery ───────────────────────────────

CREATE TYPE "SnapshotType" AS ENUM (
  'MANUAL',
  'PRE_DEPLOY',
  'PRE_REMIX',
  'AUTO_RECOVERY',
  'SCHEDULED'
);

CREATE TYPE "SnapshotStatus" AS ENUM (
  'CREATING',
  'READY',
  'FAILED',
  'RESTORING',
  'RESTORED',
  'EXPIRED'
);

CREATE TYPE "RecoveryEventType" AS ENUM (
  'SNAPSHOT_CREATED',
  'RESTORE_STARTED',
  'RESTORE_SUCCEEDED',
  'RESTORE_FAILED',
  'RUNTIME_RECOVERED',
  'ROLLBACK_TRIGGERED'
);

CREATE TABLE "ProjectSnapshot" (
  "id"           TEXT             NOT NULL,
  "projectId"    TEXT,
  "runtimeId"    TEXT,
  "workspaceId"  TEXT,
  "ownerUserId"  TEXT             NOT NULL,
  "label"        TEXT,
  "reason"       TEXT,
  "snapshotType" "SnapshotType"   NOT NULL,
  "status"       "SnapshotStatus" NOT NULL DEFAULT 'CREATING',
  "storagePath"  TEXT,
  "manifest"     TEXT,
  "checksum"     TEXT,
  "sizeBytes"    INTEGER,
  "createdAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "restoredAt"   TIMESTAMP(3),
  "expiresAt"    TIMESTAMP(3),

  CONSTRAINT "ProjectSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RuntimeRecoveryEvent" (
  "id"          TEXT                NOT NULL,
  "projectId"   TEXT,
  "runtimeId"   TEXT,
  "snapshotId"  TEXT,
  "eventType"   "RecoveryEventType" NOT NULL,
  "status"      "EventStatus"       NOT NULL,
  "reason"      TEXT,
  "metadata"    TEXT,
  "createdAt"   TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),

  CONSTRAINT "RuntimeRecoveryEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectSnapshot_projectId_createdAt_idx"    ON "ProjectSnapshot"("projectId", "createdAt");
CREATE INDEX "ProjectSnapshot_runtimeId_createdAt_idx"    ON "ProjectSnapshot"("runtimeId",  "createdAt");
CREATE INDEX "ProjectSnapshot_status_idx"                 ON "ProjectSnapshot"("status");
CREATE INDEX "ProjectSnapshot_createdAt_idx"              ON "ProjectSnapshot"("createdAt");

CREATE INDEX "RuntimeRecoveryEvent_projectId_createdAt_idx" ON "RuntimeRecoveryEvent"("projectId", "createdAt");
CREATE INDEX "RuntimeRecoveryEvent_runtimeId_createdAt_idx" ON "RuntimeRecoveryEvent"("runtimeId",  "createdAt");
CREATE INDEX "RuntimeRecoveryEvent_snapshotId_idx"          ON "RuntimeRecoveryEvent"("snapshotId");
CREATE INDEX "RuntimeRecoveryEvent_createdAt_idx"           ON "RuntimeRecoveryEvent"("createdAt");

ALTER TABLE "RuntimeRecoveryEvent"
  ADD CONSTRAINT "RuntimeRecoveryEvent_snapshotId_fkey"
  FOREIGN KEY ("snapshotId")
  REFERENCES "ProjectSnapshot"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
