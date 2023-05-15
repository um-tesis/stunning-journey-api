/*
  Warnings:

  - Made the column `hours` on table `ProjectUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProjectUser" ALTER COLUMN "hours" SET NOT NULL,
ALTER COLUMN "hours" SET DEFAULT 0;
