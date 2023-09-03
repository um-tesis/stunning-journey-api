/*
  Warnings:

  - You are about to drop the column `donorId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_donorId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "donorId";
