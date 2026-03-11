CREATE TABLE "OrderDeliveryOtp" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "otpHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "OrderDeliveryOtp_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrderDeliveryOtp_orderId_key" ON "OrderDeliveryOtp"("orderId");
CREATE INDEX "OrderDeliveryOtp_expiresAt_idx" ON "OrderDeliveryOtp"("expiresAt");

ALTER TABLE "OrderDeliveryOtp"
ADD CONSTRAINT "OrderDeliveryOtp_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
