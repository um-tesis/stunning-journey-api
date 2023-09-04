-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "ProjectBilling" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "BillingStatus" NOT NULL DEFAULT 'PENDING',
    "endsAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paidBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectBilling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectBilling" ADD CONSTRAINT "ProjectBilling_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBilling" ADD CONSTRAINT "ProjectBilling_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
