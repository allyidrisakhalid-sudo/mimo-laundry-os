-- CreateEnum
CREATE TYPE "BagStatus" AS ENUM ('CREATED', 'IN_TRANSIT', 'AT_HUB', 'PROCESSING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED');

-- DropIndex
DROP INDEX "CustomerAddress_userId_idx";

-- DropIndex
DROP INDEX "CustomerAddress_zoneId_idx";

-- DropIndex
DROP INDEX "Order_customerUserId_idx";

-- DropIndex
DROP INDEX "Order_dropoffAddressId_idx";

-- DropIndex
DROP INDEX "Order_hubId_idx";

-- DropIndex
DROP INDEX "Order_pickupAddressId_idx";

-- DropIndex
DROP INDEX "Order_zoneId_idx";

-- CreateTable
CREATE TABLE "Bag" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tagCode" TEXT NOT NULL,
    "bagStatus" "BagStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bag_tagCode_key" ON "Bag"("tagCode");

-- AddForeignKey
ALTER TABLE "Bag" ADD CONSTRAINT "Bag_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
