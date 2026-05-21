-- SERIAL 06: Remix / Fork Engine
-- Additive only — no destructive changes to existing tables.

-- 06-01: Fork ancestry registry
CREATE TABLE "ProjectFork" (
  "id"                    TEXT    NOT NULL,
  "sourceProjectId"       TEXT,
  "forkProjectId"         TEXT,
  "sourceRuntimeId"       TEXT    NOT NULL,
  "forkRuntimeId"         TEXT    NOT NULL,
  "sourcePreviewRouteId"  TEXT,
  "forkPreviewRouteId"    TEXT,
  "ownerUserId"           TEXT    NOT NULL,
  "remixPrompt"           TEXT,
  "visibility"            "RuntimeVisibility" NOT NULL DEFAULT 'PRIVATE',
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectFork_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProjectFork_sourceRuntimeId_idx" ON "ProjectFork"("sourceRuntimeId");
CREATE INDEX "ProjectFork_forkRuntimeId_idx"   ON "ProjectFork"("forkRuntimeId");
CREATE INDEX "ProjectFork_ownerUserId_idx"      ON "ProjectFork"("ownerUserId");

-- 06-07: Allow-remix flag; 06-03: lineage fields
ALTER TABLE "RuntimeInstance"
  ADD COLUMN IF NOT EXISTS "allowRemix" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "sourceId"   TEXT,
  ADD COLUMN IF NOT EXISTS "remixNote"  TEXT;

CREATE INDEX "RuntimeInstance_sourceId_idx" ON "RuntimeInstance"("sourceId");
