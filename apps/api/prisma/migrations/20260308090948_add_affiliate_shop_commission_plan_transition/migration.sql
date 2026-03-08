-- CreateEnum
CREATE TYPE "CommissionPlanType" AS ENUM ('FIXED_PER_ORDER', 'PERCENT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "CommissionAppliesTo" AS ENUM ('SHOP_ONLY', 'ALL_CHANNELS');

-- AlterTable
ALTER TABLE "AffiliateShop" ADD COLUMN     "addressLabel" TEXT,
ADD COLUMN     "commissionPlanId" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "locationLat" DECIMAL(10,7),
ADD COLUMN     "locationLng" DECIMAL(10,7);

-- CreateTable
CREATE TABLE "CommissionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CommissionPlanType" NOT NULL,
    "fixedAmountTzs" INTEGER,
    "percentRate" DECIMAL(5,2),
    "appliesTo" "CommissionAppliesTo" NOT NULL DEFAULT 'SHOP_ONLY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommissionPlan_name_key" ON "CommissionPlan"("name");

-- CreateIndex
CREATE INDEX "AffiliateShop_commissionPlanId_idx" ON "AffiliateShop"("commissionPlanId");

-- AddForeignKey
ALTER TABLE "AffiliateShop" ADD CONSTRAINT "AffiliateShop_commissionPlanId_fkey" FOREIGN KEY ("commissionPlanId") REFERENCES "CommissionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
