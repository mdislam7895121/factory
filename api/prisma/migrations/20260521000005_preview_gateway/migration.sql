-- SERIAL 05: Public Preview Gateway
-- Additive only — no destructive changes to existing tables.

-- 05-01: Slug-based preview route registry
CREATE TABLE "PreviewRoute" (
  "id"           TEXT    NOT NULL,
  "runtimeId"    TEXT    NOT NULL,
  "slug"         TEXT    NOT NULL,
  "visibility"   "RuntimeVisibility" NOT NULL DEFAULT 'PRIVATE',
  "passwordHash" TEXT,
  "isActive"     BOOLEAN NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PreviewRoute_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PreviewRoute_slug_key"       ON "PreviewRoute"("slug");
CREATE        INDEX "PreviewRoute_runtimeId_idx"  ON "PreviewRoute"("runtimeId");

-- 05-08: Privacy-safe access log (IP/UA stored as SHA-256 hashes)
CREATE TABLE "PreviewAccessLog" (
  "id"         TEXT    NOT NULL,
  "runtimeId"  TEXT    NOT NULL,
  "ipHash"     TEXT    NOT NULL,
  "uaHash"     TEXT    NOT NULL,
  "path"       TEXT    NOT NULL DEFAULT '/',
  "statusCode" INTEGER NOT NULL DEFAULT 200,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PreviewAccessLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PreviewAccessLog_runtimeId_createdAt_idx" ON "PreviewAccessLog"("runtimeId", "createdAt");
CREATE INDEX "PreviewAccessLog_createdAt_idx"           ON "PreviewAccessLog"("createdAt");
