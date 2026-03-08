/*
  Warnings:

  - The values [AFFILIATE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isActive` on the `AffiliateShop` table. All the data in the column will be lost.
  - You are about to drop the column `staffUserId` on the `AffiliateShop` table. All the data in the column will be lost.
  - You are about to drop the column `affiliateShopId` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `line1` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `line2` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `CustomerAddress` table. All the data in the column will be lost.
  - You are about to drop the column `homeZoneId` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Hub` table. All the data in the column will be lost.
  - You are about to drop the column `staffUserId` on the `Hub` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DriverSecondaryZone` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Hub` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressLine` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zoneId` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLabel` to the `Hub` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportsTiers` to the `Hub` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'CUSTOMER', 'AFFILIATE_STAFF', 'DRIVER', 'HUB_STAFF');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AffiliateShop" DROP CONSTRAINT "AffiliateShop_staffUserId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_actorId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_affiliateShopId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerProfile" DROP CONSTRAINT "CustomerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_homeZoneId_fkey";

-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_userId_fkey";

-- DropForeignKey
ALTER TABLE "DriverSecondaryZone" DROP CONSTRAINT "DriverSecondaryZone_driverId_fkey";

-- DropForeignKey
ALTER TABLE "DriverSecondaryZone" DROP CONSTRAINT "DriverSecondaryZone_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "Hub" DROP CONSTRAINT "Hub_staffUserId_fkey";

-- DropIndex
DROP INDEX "CustomerAddress_affiliateShopId_idx";

-- DropIndex
DROP INDEX "Driver_userId_key";

-- DropIndex
DROP INDEX "Hub_code_key";

-- AlterTable
ALTER TABLE "AffiliateShop" DROP COLUMN "isActive",
DROP COLUMN "staffUserId";

-- AlterTable
ALTER TABLE "CustomerAddress" DROP COLUMN "affiliateShopId",
DROP COLUMN "city",
DROP COLUMN "customerId",
DROP COLUMN "isDefault",
DROP COLUMN "label",
DROP COLUMN "line1",
DROP COLUMN "line2",
DROP COLUMN "notes",
DROP COLUMN "postalCode",
ADD COLUMN     "addressLine" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "homeZoneId",
DROP COLUMN "isActive",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "zoneId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hub" DROP COLUMN "code",
DROP COLUMN "staffUserId",
ADD COLUMN     "addressLabel" TEXT NOT NULL,
ADD COLUMN     "capacityKgPerDay" INTEGER,
ADD COLUMN     "capacityOrdersPerDay" INTEGER,
ADD COLUMN     "locationLat" DECIMAL(10,7),
ADD COLUMN     "locationLng" DECIMAL(10,7),
ADD COLUMN     "supportsTiers" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Zone" ALTER COLUMN "boundaries" DROP NOT NULL;

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "CustomerProfile";

-- DropTable
DROP TABLE "DriverSecondaryZone";

-- CreateTable
CREATE TABLE "HubStaffProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hubId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HubStaffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HubStaffProfile_userId_key" ON "HubStaffProfile"("userId");

-- CreateIndex
CREATE INDEX "HubStaffProfile_hubId_idx" ON "HubStaffProfile"("hubId");

-- CreateIndex
CREATE INDEX "AffiliateShop_zoneId_idx" ON "AffiliateShop"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE INDEX "Driver_zoneId_idx" ON "Driver"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Hub_name_key" ON "Hub"("name");

-- CreateIndex
CREATE INDEX "Hub_zoneId_idx" ON "Hub"("zoneId");

-- AddForeignKey
ALTER TABLE "HubStaffProfile" ADD CONSTRAINT "HubStaffProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubStaffProfile" ADD CONSTRAINT "HubStaffProfile_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
