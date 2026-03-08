-- CreateEnum
CREATE TYPE "OrderTier" AS ENUM ('STANDARD_48H', 'EXPRESS_24H', 'SAME_DAY');

-- CreateEnum
CREATE TYPE "OrderStatusCurrent" AS ENUM (
  'CREATED',
  'PICKUP_SCHEDULED',
  'PICKED_UP',
  'RECEIVED_AT_HUB',
  'WASHING_STARTED',
  'DRYING_STARTED',
  'IRONING_STARTED',
  'PACKED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'PAYMENT_DUE',
  'PAID'
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "label" TEXT NOT NULL,
  "contactName" TEXT,
  "phone" TEXT,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "zoneId" TEXT NOT NULL,
  "locationLat" DOUBLE PRECISION,
  "locationLng" DOUBLE PRECISION,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Order"
  ADD COLUMN "customerUserId" TEXT,
  ADD COLUMN "tier" "OrderTier",
  ADD COLUMN "zoneId" TEXT,
  ADD COLUMN "hubId" TEXT,
  ADD COLUMN "pickupAddressId" TEXT,
  ADD COLUMN "dropoffAddressId" TEXT,
  ADD COLUMN "statusCurrent" "OrderStatusCurrent";

UPDATE "Order"
SET
  "tier" = 'STANDARD_48H'::"OrderTier",
  "zoneId" = "orderZoneId",
  "statusCurrent" = 'CREATED'::"OrderStatusCurrent";

UPDATE "Order" o
SET "hubId" = h."id"
FROM "Hub" h
WHERE h."zoneId" = o."zoneId"
  AND o."hubId" IS NULL;

ALTER TABLE "Order"
  ALTER COLUMN "tier" SET NOT NULL,
  ALTER COLUMN "zoneId" SET NOT NULL,
  ALTER COLUMN "hubId" SET NOT NULL,
  ALTER COLUMN "statusCurrent" SET NOT NULL;

ALTER TABLE "CustomerAddress"
  ADD CONSTRAINT "CustomerAddress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "CustomerAddress_zoneId_fkey"
    FOREIGN KEY ("zoneId") REFERENCES "Zone"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_customerUserId_fkey"
    FOREIGN KEY ("customerUserId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Order_zoneId_fkey"
    FOREIGN KEY ("zoneId") REFERENCES "Zone"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "Order_hubId_fkey"
    FOREIGN KEY ("hubId") REFERENCES "Hub"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "Order_pickupAddressId_fkey"
    FOREIGN KEY ("pickupAddressId") REFERENCES "CustomerAddress"("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Order_dropoffAddressId_fkey"
    FOREIGN KEY ("dropoffAddressId") REFERENCES "CustomerAddress"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "CustomerAddress_userId_idx" ON "CustomerAddress"("userId");
CREATE INDEX "CustomerAddress_zoneId_idx" ON "CustomerAddress"("zoneId");
CREATE INDEX "Order_customerUserId_idx" ON "Order"("customerUserId");
CREATE INDEX "Order_zoneId_idx" ON "Order"("zoneId");
CREATE INDEX "Order_hubId_idx" ON "Order"("hubId");
CREATE INDEX "Order_pickupAddressId_idx" ON "Order"("pickupAddressId");
CREATE INDEX "Order_dropoffAddressId_idx" ON "Order"("dropoffAddressId");

ALTER TABLE "Order" DROP COLUMN "orderZoneId";
