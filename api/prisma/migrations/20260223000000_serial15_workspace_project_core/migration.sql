-- AlterTable
ALTER TABLE "Workspace"
  ADD COLUMN "ownerUserId" TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Project"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Workspace_ownerUserId_idx" ON "Workspace"("ownerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_workspaceId_slug_key" ON "Project"("workspaceId", "slug");
