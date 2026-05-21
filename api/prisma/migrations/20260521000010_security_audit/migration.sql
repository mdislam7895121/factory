-- ── SERIAL 10: Public Beta Launch Gate — Security Audit Trail ────────────────

CREATE TABLE "SecurityAuditEvent" (
  "id"          TEXT         NOT NULL,
  "actorUserId" TEXT,
  "action"      TEXT         NOT NULL,
  "targetType"  TEXT,
  "targetId"    TEXT,
  "metadata"    TEXT,
  "ipHash"      TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SecurityAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SecurityAuditEvent_actorUserId_createdAt_idx" ON "SecurityAuditEvent"("actorUserId", "createdAt");
CREATE INDEX "SecurityAuditEvent_action_createdAt_idx"      ON "SecurityAuditEvent"("action", "createdAt");
CREATE INDEX "SecurityAuditEvent_targetType_targetId_idx"   ON "SecurityAuditEvent"("targetType", "targetId");
CREATE INDEX "SecurityAuditEvent_createdAt_idx"             ON "SecurityAuditEvent"("createdAt");
