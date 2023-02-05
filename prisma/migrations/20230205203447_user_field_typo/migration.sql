/*
  Warnings:

  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId",
ADD COLUMN     "organization_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;
