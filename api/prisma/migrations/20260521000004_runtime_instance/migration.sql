-- SERIAL 04: Detached Runtime Cloud — RuntimeInstance registry
-- Additive only — no destructive changes to existing tables.

CREATE TYPE "RuntimeStatus" AS ENUM (
  'PROVISIONING',
  'RUNNING',
  'STOPPED',
  'CRASHED',
  'SLEEPING',
  'TERMINATED'
);

CREATE TYPE "RuntimeVisibility" AS ENUM (
  'PRIVATE',
  'PUBLIC',
  'PASSWORD',
  'TEAM'
);

CREATE TYPE "SleepState" AS ENUM (
  'AWAKE',
  'IDLE',
  'SLEEPING',
  'WAKING'
);

CREATE TABLE "RuntimeInstance" (
  "id"              TEXT NOT NULL,
  "projectId"       TEXT,
  "workspaceId"     TEXT,
  "ownerUserId"     TEXT NOT NULL,
  "runtimeType"     TEXT NOT NULL DEFAULT 'docker',
  "containerId"     TEXT,
  "previewUrl"      TEXT,
  "internalPort"    INTEGER,
  "externalPort"    INTEGER,
  "status"          "RuntimeStatus"     NOT NULL DEFAULT 'PROVISIONING',
  "visibility"      "RuntimeVisibility" NOT NULL DEFAULT 'PRIVATE',
  "sleepState"      "SleepState"        NOT NULL DEFAULT 'AWAKE',
  "recoveryCount"   INTEGER NOT NULL DEFAULT 0,
  "recoveryEvents"  TEXT,
  "passwordHash"    TEXT,
  "metadata"        TEXT,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL,
  "lastAccessAt"    TIMESTAMP(3),
  "lastHeartbeatAt" TIMESTAMP(3),
  "expiresAt"       TIMESTAMP(3),

  CONSTRAINT "RuntimeInstance_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RuntimeInstance_projectId_idx"          ON "RuntimeInstance"("projectId");
CREATE INDEX "RuntimeInstance_workspaceId_idx"        ON "RuntimeInstance"("workspaceId");
CREATE INDEX "RuntimeInstance_ownerUserId_idx"        ON "RuntimeInstance"("ownerUserId");
CREATE INDEX "RuntimeInstance_status_idx"             ON "RuntimeInstance"("status");
CREATE INDEX "RuntimeInstance_lastHeartbeatAt_idx"    ON "RuntimeInstance"("lastHeartbeatAt");
CREATE INDEX "RuntimeInstance_status_lastHB_idx"      ON "RuntimeInstance"("status", "lastHeartbeatAt");
