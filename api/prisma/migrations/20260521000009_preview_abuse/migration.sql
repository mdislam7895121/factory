-- ── SERIAL 09: Mobile Viral Preview Experience ───────────────────────────────

CREATE TABLE "PreviewAbuseReport" (
  "id"        TEXT         NOT NULL,
  "previewId" TEXT         NOT NULL,
  "reason"    TEXT         NOT NULL,
  "message"   TEXT,
  "ipHash"    TEXT         NOT NULL,
  "userId"    TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PreviewAbuseReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PreviewAbuseReport_previewId_createdAt_idx" ON "PreviewAbuseReport"("previewId", "createdAt");
CREATE INDEX "PreviewAbuseReport_createdAt_idx"            ON "PreviewAbuseReport"("createdAt");
