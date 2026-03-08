-- CreateEnum
CREATE TYPE "OrderIssueType" AS ENUM ('DAMAGE', 'MISSING_ITEM', 'DELAY', 'REFUND_REQUEST');

-- CreateEnum
CREATE TYPE "OrderIssueStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "OrderIssue" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "type" "OrderIssueType" NOT NULL,
    "status" "OrderIssueStatus" NOT NULL DEFAULT 'OPEN',
    "reportedByUserId" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "resolutionNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderIssue" ADD CONSTRAINT "OrderIssue_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
