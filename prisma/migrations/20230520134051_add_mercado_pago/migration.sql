/*
  Warnings:

  - You are about to drop the column `monetaryGoal` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "monetaryGoal",
ADD COLUMN     "mpAccessToken" TEXT,
ADD COLUMN     "mpEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "mpInstantCheckout" BOOLEAN DEFAULT false,
ADD COLUMN     "mpPublicKey" TEXT;
