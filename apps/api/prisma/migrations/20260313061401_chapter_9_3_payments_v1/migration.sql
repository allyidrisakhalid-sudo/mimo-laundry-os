-- CreateEnum
CREATE TYPE "CashCollectedFrom" AS ENUM ('CUSTOMER', 'AFFILIATE', 'OTHER');

-- CreateEnum
CREATE TYPE "MobileMoneyProvider" AS ENUM ('MPESA', 'TIGO', 'AIRTEL', 'HALOPESA', 'OTHER');

-- CreateEnum
CREATE TYPE "RefundMethod" AS ENUM ('CASH', 'MOBILE_MONEY', 'CREDIT');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('ISSUED', 'REVERSED');

-- CreateEnum
CREATE TYPE "CashReconciliationStatus" AS ENUM ('OPEN', 'SUBMITTED', 'APPROVED');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cashBatchId" TEXT,
ADD COLUMN     "collectedAt" TIMESTAMP(3),
ADD COLUMN     "collectedByUserId" TEXT,
ADD COLUMN     "collectedFrom" "CashCollectedFrom",
ADD COLUMN     "provider" "MobileMoneyProvider",
ADD COLUMN     "providerTxnId" TEXT,
ADD COLUMN     "rawCallbackJson" JSONB,
ADD COLUMN     "receivedAtHubAt" TIMESTAMP(3),
ADD COLUMN     "receivedAtHubByUserId" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amountTzs" INTEGER NOT NULL,
    "method" "RefundMethod" NOT NULL,
    "reference" TEXT,
    "reason" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RefundStatus" NOT NULL DEFAULT 'ISSUED',

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerCreditLedger" (
    "id" TEXT NOT NULL,
    "customerUserId" TEXT NOT NULL,
    "orderId" TEXT,
    "amountTzs" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerCreditLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashReconciliation" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "expectedCashTzs" INTEGER NOT NULL,
    "declaredCashTzs" INTEGER,
    "differenceTzs" INTEGER,
    "status" "CashReconciliationStatus" NOT NULL DEFAULT 'OPEN',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedByUserId" TEXT,

    CONSTRAINT "CashReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Refund_orderId_createdAt_idx" ON "Refund"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- CreateIndex
CREATE INDEX "CustomerCreditLedger_customerUserId_createdAt_idx" ON "CustomerCreditLedger"("customerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerCreditLedger_orderId_createdAt_idx" ON "CustomerCreditLedger"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "CashReconciliation_date_status_idx" ON "CashReconciliation"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CashReconciliation_driverId_date_key" ON "CashReconciliation"("driverId", "date");

-- CreateIndex
CREATE INDEX "Payment_method_receivedAt_idx" ON "Payment"("method", "receivedAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_collectedByUserId_fkey" FOREIGN KEY ("collectedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_receivedAtHubByUserId_fkey" FOREIGN KEY ("receivedAtHubByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashReconciliation" ADD CONSTRAINT "CashReconciliation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashReconciliation" ADD CONSTRAINT "CashReconciliation_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
