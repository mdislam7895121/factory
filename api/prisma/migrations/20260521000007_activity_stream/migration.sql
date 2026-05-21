-- SERIAL 07: Live AI Company Stream
-- Additive only — no destructive changes to existing tables.

CREATE TYPE "AgentType" AS ENUM (
  'PLANNER', 'ARCHITECT', 'FRONTEND', 'BACKEND',
  'DATABASE', 'QA', 'DEVOPS', 'SECURITY', 'HEALER', 'OBSERVER'
);

CREATE TYPE "EventStatus" AS ENUM (
  'PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'CANCELLED'
);

CREATE TYPE "ActivitySeverity" AS ENUM (
  'INFO', 'WARNING', 'ERROR', 'CRITICAL'
);

-- 07-01: Persistent AI orchestration event log
CREATE TABLE "AgentActivityEvent" (
  "id"          TEXT                NOT NULL,
  "projectId"   TEXT,
  "runtimeId"   TEXT,
  "workspaceId" TEXT,
  "agentType"   "AgentType"         NOT NULL,
  "eventType"   TEXT                NOT NULL,
  "title"       TEXT                NOT NULL,
  "message"     TEXT,
  "metadata"    TEXT,               -- JSON, secrets stripped
  "severity"    "ActivitySeverity"  NOT NULL DEFAULT 'INFO',
  "status"      "EventStatus"       NOT NULL DEFAULT 'PENDING',
  "startedAt"   TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "durationMs"  INTEGER,
  "createdAt"   TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AgentActivityEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AgentActivityEvent_projectId_createdAt_idx"  ON "AgentActivityEvent"("projectId",  "createdAt");
CREATE INDEX "AgentActivityEvent_runtimeId_createdAt_idx"  ON "AgentActivityEvent"("runtimeId",  "createdAt");
CREATE INDEX "AgentActivityEvent_agentType_idx"            ON "AgentActivityEvent"("agentType");
CREATE INDEX "AgentActivityEvent_createdAt_idx"            ON "AgentActivityEvent"("createdAt");
CREATE INDEX "AgentActivityEvent_severity_createdAt_idx"   ON "AgentActivityEvent"("severity",   "createdAt");
