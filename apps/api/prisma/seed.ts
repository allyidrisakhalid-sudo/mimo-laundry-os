import "dotenv/config";
import {
  CommissionAppliesTo,
  CommissionPlanType,
  OrderChannel,
  OrderSourceType,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const zoneA = await prisma.zone.upsert({
    where: { name: "Zone A" },
    update: {
      boundaries: { type: "manual", label: "Zone A boundary descriptor" },
      metadata: { seedKey: "zone-a" },
    },
    create: {
      name: "Zone A",
      boundaries: { type: "manual", label: "Zone A boundary descriptor" },
      metadata: { seedKey: "zone-a" },
    },
  });

  const zoneB = await prisma.zone.upsert({
    where: { name: "Zone B" },
    update: {
      boundaries: { type: "manual", label: "Zone B boundary descriptor" },
      metadata: { seedKey: "zone-b" },
    },
    create: {
      name: "Zone B",
      boundaries: { type: "manual", label: "Zone B boundary descriptor" },
      metadata: { seedKey: "zone-b" },
    },
  });

  const hubA = await prisma.hub.upsert({
    where: { name: "Sinza Hub" },
    update: {
      zoneId: zoneA.id,
      addressLabel: "Sinza Hub",
      capacityKgPerDay: 500,
      capacityOrdersPerDay: 120,
      supportsTiers: { standard: true, express: true, sameDay: false },
      isActive: true,
    },
    create: {
      name: "Sinza Hub",
      zoneId: zoneA.id,
      addressLabel: "Sinza Hub",
      capacityKgPerDay: 500,
      capacityOrdersPerDay: 120,
      supportsTiers: { standard: true, express: true, sameDay: false },
      isActive: true,
    },
  });

  const hubB = await prisma.hub.upsert({
    where: { name: "Mbezi Hub" },
    update: {
      zoneId: zoneB.id,
      addressLabel: "Mbezi Hub",
      capacityKgPerDay: 650,
      capacityOrdersPerDay: 160,
      supportsTiers: { standard: true, express: true, sameDay: true },
      isActive: true,
    },
    create: {
      name: "Mbezi Hub",
      zoneId: zoneB.id,
      addressLabel: "Mbezi Hub",
      capacityKgPerDay: 650,
      capacityOrdersPerDay: 160,
      supportsTiers: { standard: true, express: true, sameDay: true },
      isActive: true,
    },
  });

  const hubStaffUserA = await prisma.user.upsert({
    where: { email: "hub.staff.sinza@mimo.local" },
    update: {
      fullName: "Sinza Hub Staff",
      role: UserRole.HUB_STAFF,
      isActive: true,
      passwordHash: "dev-only-placeholder",
    },
    create: {
      email: "hub.staff.sinza@mimo.local",
      fullName: "Sinza Hub Staff",
      role: UserRole.HUB_STAFF,
      passwordHash: "dev-only-placeholder",
      isActive: true,
    },
  });

  const hubStaffUserB = await prisma.user.upsert({
    where: { email: "hub.staff.mbezi@mimo.local" },
    update: {
      fullName: "Mbezi Hub Staff",
      role: UserRole.HUB_STAFF,
      isActive: true,
      passwordHash: "dev-only-placeholder",
    },
    create: {
      email: "hub.staff.mbezi@mimo.local",
      fullName: "Mbezi Hub Staff",
      role: UserRole.HUB_STAFF,
      passwordHash: "dev-only-placeholder",
      isActive: true,
    },
  });

  await prisma.hubStaffProfile.upsert({
    where: { userId: hubStaffUserA.id },
    update: {
      hubId: hubA.id,
      jobTitle: "Hub Supervisor",
      isActive: true,
    },
    create: {
      userId: hubStaffUserA.id,
      hubId: hubA.id,
      jobTitle: "Hub Supervisor",
      isActive: true,
    },
  });

  await prisma.hubStaffProfile.upsert({
    where: { userId: hubStaffUserB.id },
    update: {
      hubId: hubB.id,
      jobTitle: "Hub Supervisor",
      isActive: true,
    },
    create: {
      userId: hubStaffUserB.id,
      hubId: hubB.id,
      jobTitle: "Hub Supervisor",
      isActive: true,
    },
  });

  const commissionPlanA = await prisma.commissionPlan.upsert({
    where: { name: "Shop Fixed TZS 1500" },
    update: {
      type: CommissionPlanType.FIXED_PER_ORDER,
      fixedAmountTzs: 1500,
      percentRate: null,
      appliesTo: CommissionAppliesTo.SHOP_ONLY,
      isActive: true,
    },
    create: {
      name: "Shop Fixed TZS 1500",
      type: CommissionPlanType.FIXED_PER_ORDER,
      fixedAmountTzs: 1500,
      percentRate: null,
      appliesTo: CommissionAppliesTo.SHOP_ONLY,
      isActive: true,
    },
  });

  const commissionPlanB = await prisma.commissionPlan.upsert({
    where: { name: "Shop Service 12.5 Percent" },
    update: {
      type: CommissionPlanType.PERCENT_OF_SERVICE,
      fixedAmountTzs: null,
      percentRate: "12.50",
      appliesTo: CommissionAppliesTo.SHOP_ONLY,
      isActive: true,
    },
    create: {
      name: "Shop Service 12.5 Percent",
      type: CommissionPlanType.PERCENT_OF_SERVICE,
      fixedAmountTzs: null,
      percentRate: "12.50",
      appliesTo: CommissionAppliesTo.SHOP_ONLY,
      isActive: true,
    },
  });

  const affiliateShopA = await prisma.affiliateShop.upsert({
    where: { code: "SHOP-A" },
    update: {
      name: "Affiliate Shop A",
      zoneId: zoneA.id,
      commissionPlanId: commissionPlanA.id,
      addressLabel: "Msasani Affiliate Pickup Counter",
      contactPhone: "+255700000101",
      isActive: true,
    },
    create: {
      code: "SHOP-A",
      name: "Affiliate Shop A",
      zoneId: zoneA.id,
      commissionPlanId: commissionPlanA.id,
      addressLabel: "Msasani Affiliate Pickup Counter",
      contactPhone: "+255700000101",
      isActive: true,
    },
  });

  const affiliateShopB = await prisma.affiliateShop.upsert({
    where: { code: "SHOP-B" },
    update: {
      name: "Affiliate Shop B",
      zoneId: zoneB.id,
      commissionPlanId: commissionPlanB.id,
      addressLabel: "Mbezi Affiliate Collection Point",
      contactPhone: "+255700000202",
      isActive: true,
    },
    create: {
      code: "SHOP-B",
      name: "Affiliate Shop B",
      zoneId: zoneB.id,
      commissionPlanId: commissionPlanB.id,
      addressLabel: "Mbezi Affiliate Collection Point",
      contactPhone: "+255700000202",
      isActive: true,
    },
  });

  const affiliateStaffUserA = await prisma.user.upsert({
    where: { email: "affiliate.staff.shopa@mimo.local" },
    update: {
      fullName: "Affiliate Shop A Staff",
      role: UserRole.AFFILIATE_STAFF,
      isActive: true,
      passwordHash: "dev-only-placeholder",
    },
    create: {
      email: "affiliate.staff.shopa@mimo.local",
      fullName: "Affiliate Shop A Staff",
      role: UserRole.AFFILIATE_STAFF,
      passwordHash: "dev-only-placeholder",
      isActive: true,
    },
  });

  const affiliateStaffUserB = await prisma.user.upsert({
    where: { email: "affiliate.staff.shopb@mimo.local" },
    update: {
      fullName: "Affiliate Shop B Staff",
      role: UserRole.AFFILIATE_STAFF,
      isActive: true,
      passwordHash: "dev-only-placeholder",
    },
    create: {
      email: "affiliate.staff.shopb@mimo.local",
      fullName: "Affiliate Shop B Staff",
      role: UserRole.AFFILIATE_STAFF,
      passwordHash: "dev-only-placeholder",
      isActive: true,
    },
  });

  await prisma.affiliateStaffProfile.upsert({
    where: { userId: affiliateStaffUserA.id },
    update: {
      affiliateShopId: affiliateShopA.id,
      jobTitle: "Shop Clerk",
      isActive: true,
    },
    create: {
      userId: affiliateStaffUserA.id,
      affiliateShopId: affiliateShopA.id,
      jobTitle: "Shop Clerk",
      isActive: true,
    },
  });

  await prisma.affiliateStaffProfile.upsert({
    where: { userId: affiliateStaffUserB.id },
    update: {
      affiliateShopId: affiliateShopB.id,
      jobTitle: "Shop Supervisor",
      isActive: true,
    },
    create: {
      userId: affiliateStaffUserB.id,
      affiliateShopId: affiliateShopB.id,
      jobTitle: "Shop Supervisor",
      isActive: true,
    },
  });

  await prisma.driver.upsert({
    where: { email: "driver.a@mimo.local" },
    update: {
      fullName: "Driver A",
      zoneId: zoneA.id,
    },
    create: {
      email: "driver.a@mimo.local",
      fullName: "Driver A",
      zoneId: zoneA.id,
    },
  });

  await prisma.driver.upsert({
    where: { email: "driver.b@mimo.local" },
    update: {
      fullName: "Driver B",
      zoneId: zoneB.id,
    },
    create: {
      email: "driver.b@mimo.local",
      fullName: "Driver B",
      zoneId: zoneB.id,
    },
  });

  await prisma.customerAddress.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {
      customerName: "Customer A",
      addressLine: "Msasani Sample Address",
      zoneId: zoneA.id,
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      customerName: "Customer A",
      addressLine: "Msasani Sample Address",
      zoneId: zoneA.id,
    },
  });

  const orderA = await prisma.order.upsert({
    where: { orderNumber: "AFF-SHOP-A-001" },
    update: {
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: affiliateShopA.id,
      channel: OrderChannel.SHOP_DROP,
      orderZoneId: affiliateShopA.zoneId,
      customerName: "Shop A Walk-in Customer",
      customerPhone: "+255711000001",
      notes: "Seeded affiliate order for SHOP-A",
    },
    create: {
      orderNumber: "AFF-SHOP-A-001",
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: affiliateShopA.id,
      channel: OrderChannel.SHOP_DROP,
      orderZoneId: affiliateShopA.zoneId,
      customerName: "Shop A Walk-in Customer",
      customerPhone: "+255711000001",
      notes: "Seeded affiliate order for SHOP-A",
    },
  });

  const orderB = await prisma.order.upsert({
    where: { orderNumber: "AFF-SHOP-B-001" },
    update: {
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: affiliateShopB.id,
      channel: OrderChannel.SHOP_DROP,
      orderZoneId: affiliateShopB.zoneId,
      customerName: "Shop B Walk-in Customer",
      customerPhone: "+255711000002",
      notes: "Seeded affiliate order for SHOP-B",
    },
    create: {
      orderNumber: "AFF-SHOP-B-001",
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: affiliateShopB.id,
      channel: OrderChannel.SHOP_DROP,
      orderZoneId: affiliateShopB.zoneId,
      customerName: "Shop B Walk-in Customer",
      customerPhone: "+255711000002",
      notes: "Seeded affiliate order for SHOP-B",
    },
  });

  console.log("Seed complete");
  console.log({
    zones: [zoneA.name, zoneB.name],
    hubs: [hubA.name, hubB.name],
    hubStaffUsers: [hubStaffUserA.email, hubStaffUserB.email],
    commissionPlans: [commissionPlanA.name, commissionPlanB.name],
    affiliateShops: [affiliateShopA.code, affiliateShopB.code],
    affiliateStaffUsers: [affiliateStaffUserA.email, affiliateStaffUserB.email],
    orders: [orderA.orderNumber, orderB.orderNumber],
    drivers: ["driver.a@mimo.local", "driver.b@mimo.local"],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
