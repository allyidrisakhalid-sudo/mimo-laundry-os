-- CreateEnum
CREATE TYPE "OrderEventType" AS ENUM ('ORDER_CREATED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'RECEIVED_AT_HUB', 'WASHING_STARTED', 'DRYING_STARTED', 'IRONING_STARTED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PAYMENT_DUE', 'PAID');

-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "eventType" "OrderEventType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "notes" TEXT,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
