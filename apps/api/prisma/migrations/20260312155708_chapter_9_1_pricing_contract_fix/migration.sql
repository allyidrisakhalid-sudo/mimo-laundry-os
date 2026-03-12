-- CreateEnum
CREATE TYPE "PricingPlanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "PricingServiceType" AS ENUM ('WASH_DRY_FOLD', 'IRONING', 'ADDON_SCENT');

-- CreateEnum
CREATE TYPE "PricingItemCode" AS ENUM ('DUVET', 'SUIT', 'CURTAIN_HEAVY');

-- CreateEnum
CREATE TYPE "OrderPricingQuoteStatus" AS ENUM ('ESTIMATED', 'FINALIZED');

-- CreateEnum
CREATE TYPE "OrderLineItemType" AS ENUM ('CHARGE', 'DISCOUNT');

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PricingPlanStatus" NOT NULL DEFAULT 'DRAFT',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlanChannel" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "channel" "OrderChannel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingPlanChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KgRate" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "tier" "OrderTier" NOT NULL,
    "serviceType" "PricingServiceType" NOT NULL,
    "pricePerKgTzs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KgRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRate" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "tier" "OrderTier" NOT NULL,
    "itemCode" "PricingItemCode" NOT NULL,
    "priceTzs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZoneFee" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "doorFeeTzs" INTEGER NOT NULL,
    "freeThresholdTzs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZoneFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinimumChargeRule" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "tier" "OrderTier" NOT NULL,
    "channel" "OrderChannel",
    "minimumTzs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinimumChargeRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPricingSnapshot" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "pricingPlanId" TEXT NOT NULL,
    "pricingPlanEffectiveFrom" TIMESTAMP(3),
    "quoteStatus" "OrderPricingQuoteStatus" NOT NULL,
    "quotedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "inputsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPricingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLineItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "OrderLineItemType" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "metaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderTotals" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "deliveryTotal" INTEGER NOT NULL,
    "discountTotal" INTEGER NOT NULL,
    "grandTotal" INTEGER NOT NULL,
    "balanceDue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderTotals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PricingPlan_status_effectiveFrom_idx" ON "PricingPlan"("status", "effectiveFrom");

-- CreateIndex
CREATE INDEX "PricingPlanChannel_planId_idx" ON "PricingPlanChannel"("planId");

-- CreateIndex
CREATE INDEX "PricingPlanChannel_channel_idx" ON "PricingPlanChannel"("channel");

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlanChannel_planId_channel_key" ON "PricingPlanChannel"("planId", "channel");

-- CreateIndex
CREATE INDEX "KgRate_planId_tier_idx" ON "KgRate"("planId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "KgRate_planId_tier_serviceType_key" ON "KgRate"("planId", "tier", "serviceType");

-- CreateIndex
CREATE INDEX "ItemRate_planId_tier_idx" ON "ItemRate"("planId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "ItemRate_planId_tier_itemCode_key" ON "ItemRate"("planId", "tier", "itemCode");

-- CreateIndex
CREATE INDEX "DeliveryZoneFee_planId_idx" ON "DeliveryZoneFee"("planId");

-- CreateIndex
CREATE INDEX "DeliveryZoneFee_zoneId_idx" ON "DeliveryZoneFee"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZoneFee_planId_zoneId_key" ON "DeliveryZoneFee"("planId", "zoneId");

-- CreateIndex
CREATE INDEX "MinimumChargeRule_planId_tier_idx" ON "MinimumChargeRule"("planId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "MinimumChargeRule_planId_tier_channel_key" ON "MinimumChargeRule"("planId", "tier", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPricingSnapshot_orderId_key" ON "OrderPricingSnapshot"("orderId");

-- CreateIndex
CREATE INDEX "OrderPricingSnapshot_pricingPlanId_quoteStatus_idx" ON "OrderPricingSnapshot"("pricingPlanId", "quoteStatus");

-- CreateIndex
CREATE INDEX "OrderLineItem_orderId_idx" ON "OrderLineItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderTotals_orderId_key" ON "OrderTotals"("orderId");

-- AddForeignKey
ALTER TABLE "PricingPlanChannel" ADD CONSTRAINT "PricingPlanChannel_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KgRate" ADD CONSTRAINT "KgRate_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRate" ADD CONSTRAINT "ItemRate_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryZoneFee" ADD CONSTRAINT "DeliveryZoneFee_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryZoneFee" ADD CONSTRAINT "DeliveryZoneFee_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinimumChargeRule" ADD CONSTRAINT "MinimumChargeRule_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPricingSnapshot" ADD CONSTRAINT "OrderPricingSnapshot_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPricingSnapshot" ADD CONSTRAINT "OrderPricingSnapshot_pricingPlanId_fkey" FOREIGN KEY ("pricingPlanId") REFERENCES "PricingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTotals" ADD CONSTRAINT "OrderTotals_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
