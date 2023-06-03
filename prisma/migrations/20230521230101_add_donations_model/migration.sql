-- CreateEnum
CREATE TYPE "FrequencyInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "Donor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" TEXT,
    "identification" TEXT,
    "identificationType" TEXT,
    "cardStart" TEXT,
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "donorId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "mpPreferenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "donorId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,
    "frequencyInterval" "FrequencyInterval" NOT NULL,
    "billingDayOfMonth" INTEGER NOT NULL,
    "mpSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donor_identification_identificationType_key" ON "Donor"("identification", "identificationType");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
