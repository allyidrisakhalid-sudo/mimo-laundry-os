-- CreateEnum
CREATE TYPE "OrderSourceType" AS ENUM ('DIRECT', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "OrderChannel" AS ENUM ('DOOR', 'SHOP_DROP', 'HYBRID');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "sourceType" "OrderSourceType" NOT NULL,
    "affiliateShopId" TEXT,
    "channel" "OrderChannel" NOT NULL,
    "orderZoneId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_affiliateShopId_idx" ON "Order"("affiliateShopId");

-- CreateIndex
CREATE INDEX "Order_orderZoneId_idx" ON "Order"("orderZoneId");

-- CreateIndex
CREATE INDEX "Order_sourceType_idx" ON "Order"("sourceType");

-- CreateIndex
CREATE INDEX "Order_channel_idx" ON "Order"("channel");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_affiliateShopId_fkey" FOREIGN KEY ("affiliateShopId") REFERENCES "AffiliateShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderZoneId_fkey" FOREIGN KEY ("orderZoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
