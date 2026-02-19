-- CreateTable
CREATE TABLE "PublicProject" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "repoUrl" TEXT,
    "status" TEXT NOT NULL,
    "previewUrl" TEXT,
    "containerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicProject_pkey" PRIMARY KEY ("id")
);
