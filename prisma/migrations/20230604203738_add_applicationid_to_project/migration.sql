/*
  Warnings:

  - A unique constraint covering the columns `[mpApplicationId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "mpApplicationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_mpApplicationId_key" ON "Project"("mpApplicationId");
