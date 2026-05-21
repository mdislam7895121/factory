-- CreateEnum
CREATE TYPE "LoopRunStatus" AS ENUM ('RUNNING', 'HEALTHY', 'ISSUES_FOUND', 'HEALED', 'FAILED');

-- CreateTable
CREATE TABLE "LoopConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "intervalSecs" INTEGER NOT NULL DEFAULT 3600,
    "context" TEXT,
    "webhookUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoopConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoopRun" (
    "id" TEXT NOT NULL,
    "loopId" TEXT NOT NULL,
    "status" "LoopRunStatus" NOT NULL DEFAULT 'RUNNING',
    "monitorOutput" TEXT,
    "healerOutput" TEXT,
    "issuesFound" INTEGER NOT NULL DEFAULT 0,
    "issuesFixed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "LoopRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoopConfig_userId_idx" ON "LoopConfig"("userId");

-- CreateIndex
CREATE INDEX "LoopConfig_isActive_nextRunAt_idx" ON "LoopConfig"("isActive", "nextRunAt");

-- CreateIndex
CREATE INDEX "LoopRun_loopId_createdAt_idx" ON "LoopRun"("loopId", "createdAt");

-- CreateIndex
CREATE INDEX "LoopRun_status_idx" ON "LoopRun"("status");

-- AddForeignKey
ALTER TABLE "LoopConfig" ADD CONSTRAINT "LoopConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoopRun" ADD CONSTRAINT "LoopRun_loopId_fkey" FOREIGN KEY ("loopId") REFERENCES "LoopConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
