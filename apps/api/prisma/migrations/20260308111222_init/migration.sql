/*
  Warnings:

  - You are about to alter the column `locationLat` on the `AffiliateShop` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.
  - You are about to alter the column `locationLng` on the `AffiliateShop` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.
  - You are about to drop the column `appliesTo` on the `CommissionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `percentRate` on the `CommissionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CommissionPlan` table. All the data in the column will be lost.
  - You are about to alter the column `locationLat` on the `Hub` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.
  - You are about to alter the column `locationLng` on the `Hub` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CustomerAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Driver` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `addressLabel` on table `AffiliateShop` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commissionPlanId` on table `AffiliateShop` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `kind` to the `CommissionPlan` table without a default value. This is not possible if the table is not empty.
  - Made the column `boundaries` on table `Zone` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORBIKE', 'CAR', 'VAN');

-- CreateEnum
CREATE TYPE "DriverAvailabilityStatus" AS ENUM ('OFFLINE', 'AVAILABLE', 'ON_TRIP', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TripStopType" AS ENUM ('PICKUP', 'DROPOFF');

-- CreateEnum
CREATE TYPE "TripStopStatus" AS ENUM ('PENDING', 'DONE', 'FAILED', 'SKIPPED');

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_affiliateShopId_fkey";

-- DropIndex
DROP INDEX "AffiliateShop_commissionPlanId_idx";

-- DropIndex
DROP INDEX "AffiliateShop_zoneId_idx";

-- DropIndex
DROP INDEX "AffiliateStaffProfile_affiliateShopId_idx";

-- DropIndex
DROP INDEX "Hub_zoneId_idx";

-- DropIndex
DROP INDEX "HubStaffProfile_hubId_idx";

-- DropIndex
DROP INDEX "Order_affiliateShopId_idx";

-- DropIndex
DROP INDEX "Order_channel_idx";

-- DropIndex
DROP INDEX "Order_orderZoneId_idx";

-- DropIndex
DROP INDEX "Order_sourceType_idx";

-- AlterTable
ALTER TABLE "AffiliateShop" ALTER COLUMN "addressLabel" SET NOT NULL,
ALTER COLUMN "commissionPlanId" SET NOT NULL,
ALTER COLUMN "locationLat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "locationLng" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CommissionPlan" DROP COLUMN "appliesTo",
DROP COLUMN "percentRate",
DROP COLUMN "type",
ADD COLUMN     "kind" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "percentageBps" INTEGER;

-- AlterTable
ALTER TABLE "Hub" ALTER COLUMN "locationLat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "locationLng" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
DROP COLUMN "passwordHash";

-- AlterTable
ALTER TABLE "Zone" ALTER COLUMN "boundaries" SET NOT NULL;

-- DropTable
DROP TABLE "CustomerAddress";

-- DropTable
DROP TABLE "Driver";

-- DropEnum
DROP TYPE "CommissionAppliesTo";

-- DropEnum
DROP TYPE "CommissionPlanType";

-- CreateTable
CREATE TABLE "DriverProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "homeZoneId" TEXT NOT NULL,
    "phone" TEXT,
    "vehicleType" "VehicleType",
    "vehiclePlate" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availabilityStatus" "DriverAvailabilityStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastStatusAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "type" "TripType" NOT NULL,
    "zoneId" TEXT NOT NULL,
    "hubId" TEXT,
    "driverId" TEXT NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripStop" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stopType" "TripStopType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" "TripStopStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripStop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_userId_key" ON "DriverProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TripStop_tripId_sequence_key" ON "TripStop"("tripId", "sequence");

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_homeZoneId_fkey" FOREIGN KEY ("homeZoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripStop" ADD CONSTRAINT "TripStop_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripStop" ADD CONSTRAINT "TripStop_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_affiliateShopId_fkey" FOREIGN KEY ("affiliateShopId") REFERENCES "AffiliateShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
