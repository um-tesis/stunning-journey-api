/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `field` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `web` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "logo",
DROP COLUMN "phone",
DROP COLUMN "website",
ADD COLUMN     "facebook_account" TEXT,
ADD COLUMN     "field" TEXT NOT NULL,
ADD COLUMN     "instagram_account" TEXT,
ADD COLUMN     "organization_id" SERIAL NOT NULL,
ADD COLUMN     "twitter_account" TEXT,
ADD COLUMN     "web" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("organization_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;
