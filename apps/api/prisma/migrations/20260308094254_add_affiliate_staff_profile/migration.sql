-- CreateTable
CREATE TABLE "AffiliateStaffProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "affiliateShopId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateStaffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateStaffProfile_userId_key" ON "AffiliateStaffProfile"("userId");

-- CreateIndex
CREATE INDEX "AffiliateStaffProfile_affiliateShopId_idx" ON "AffiliateStaffProfile"("affiliateShopId");

-- AddForeignKey
ALTER TABLE "AffiliateStaffProfile" ADD CONSTRAINT "AffiliateStaffProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateStaffProfile" ADD CONSTRAINT "AffiliateStaffProfile_affiliateShopId_fkey" FOREIGN KEY ("affiliateShopId") REFERENCES "AffiliateShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
