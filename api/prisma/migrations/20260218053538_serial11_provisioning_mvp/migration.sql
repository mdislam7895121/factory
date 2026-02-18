-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('QUEUED', 'RUNNING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "ProvisioningRunStatus" AS ENUM ('RUNNING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "orchestratorProjectId" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'QUEUED',
    "previewUrl" TEXT,
    "logsRef" TEXT,
    "provisionError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProvisioningRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "ProvisioningRunStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ProvisioningRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_workspaceId_idx" ON "Project"("workspaceId");

-- CreateIndex
CREATE INDEX "ProvisioningRun_projectId_idx" ON "ProvisioningRun"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvisioningRun" ADD CONSTRAINT "ProvisioningRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
