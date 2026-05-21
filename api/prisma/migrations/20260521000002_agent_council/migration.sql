-- CreateEnum
CREATE TYPE "CouncilStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "CouncilSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "context" TEXT,
    "status" "CouncilStatus" NOT NULL DEFAULT 'PENDING',
    "result" TEXT,
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouncilSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouncilMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "agentRole" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouncilMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CouncilSession_userId_createdAt_idx" ON "CouncilSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CouncilSession_status_idx" ON "CouncilSession"("status");

-- CreateIndex
CREATE INDEX "CouncilMessage_sessionId_round_idx" ON "CouncilMessage"("sessionId", "round");

-- AddForeignKey
ALTER TABLE "CouncilSession" ADD CONSTRAINT "CouncilSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouncilMessage" ADD CONSTRAINT "CouncilMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CouncilSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
