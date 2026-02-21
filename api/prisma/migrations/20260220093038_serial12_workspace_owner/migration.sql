-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "ownerId" TEXT;

-- CreateIndex
CREATE INDEX "Workspace_ownerId_idx" ON "Workspace"("ownerId");
