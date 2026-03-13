-- CreateEnum
CREATE TYPE "CommissionCalculationType" AS ENUM ('FIXED_PER_ORDER', 'PERCENT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "CommissionLedgerStatus" AS ENUM ('EARNED', 'APPROVED', 'PAID', 'VOID');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('DRAFT', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutMethod" AS ENUM ('MOBILE_MONEY', 'CASH', 'BANK');

-- AlterTable
ALTER TABLE "CommissionPlan" ADD COLUMN     "includeDeliveryInPercent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "percentRate" INTEGER,
ADD COLUMN     "type" "CommissionCalculationType" NOT NULL DEFAULT 'PERCENT_OF_SERVICE';

-- CreateTable
CREATE TABLE "CommissionLedgerEntry" (
    "id" TEXT NOT NULL,
    "affiliateShopId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "calculationType" "CommissionCalculationType" NOT NULL,
    "baseAmountTzs" INTEGER,
    "rate" INTEGER,
    "amountTzs" INTEGER NOT NULL,
    "status" "CommissionLedgerStatus" NOT NULL DEFAULT 'EARNED',
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "affiliateShopId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalAmountTzs" INTEGER NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "paidByUserId" TEXT,
    "paidAt" TIMESTAMP(3),
    "paymentMethod" "PayoutMethod",
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommissionLedgerEntry_orderId_key" ON "CommissionLedgerEntry"("orderId");

-- CreateIndex
CREATE INDEX "CommissionLedgerEntry_affiliateShopId_status_earnedAt_idx" ON "CommissionLedgerEntry"("affiliateShopId", "status", "earnedAt");

-- CreateIndex
CREATE INDEX "CommissionLedgerEntry_payoutId_idx" ON "CommissionLedgerEntry"("payoutId");

-- CreateIndex
CREATE INDEX "CommissionLedgerEntry_planId_idx" ON "CommissionLedgerEntry"("planId");

-- CreateIndex
CREATE INDEX "Payout_affiliateShopId_periodStart_periodEnd_idx" ON "Payout"("affiliateShopId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- AddForeignKey
ALTER TABLE "CommissionLedgerEntry" ADD CONSTRAINT "CommissionLedgerEntry_affiliateShopId_fkey" FOREIGN KEY ("affiliateShopId") REFERENCES "AffiliateShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionLedgerEntry" ADD CONSTRAINT "CommissionLedgerEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionLedgerEntry" ADD CONSTRAINT "CommissionLedgerEntry_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CommissionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionLedgerEntry" ADD CONSTRAINT "CommissionLedgerEntry_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_affiliateShopId_fkey" FOREIGN KEY ("affiliateShopId") REFERENCES "AffiliateShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_paidByUserId_fkey" FOREIGN KEY ("paidByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
