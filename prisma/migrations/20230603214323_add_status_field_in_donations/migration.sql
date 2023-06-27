/*
  Warnings:

  - You are about to drop the column `mpPreferenceId` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `status` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "mpPreferenceId",
ADD COLUMN     "status" TEXT NOT NULL;
