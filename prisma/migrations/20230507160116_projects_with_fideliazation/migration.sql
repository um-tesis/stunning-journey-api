/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "acceptsVolunteers" BOOLEAN DEFAULT false,
ADD COLUMN     "coverPhoto" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "photoGallery" TEXT[],
ADD COLUMN     "video" TEXT;

-- AlterTable
ALTER TABLE "ProjectUser" DROP COLUMN "role",
ADD COLUMN     "hours" INTEGER;
