import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@mimo.local" },
    update: { role: UserRole.ADMIN },
    create: {
      email: "admin@mimo.local",
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@mimo.local" },
    update: { role: UserRole.CUSTOMER },
    create: {
      email: "customer@mimo.local",
      role: UserRole.CUSTOMER,
    },
  });

  const affiliateUserA = await prisma.user.upsert({
    where: { email: "affiliate.a@mimo.local" },
    update: { role: UserRole.AFFILIATE },
    create: {
      email: "affiliate.a@mimo.local",
      role: UserRole.AFFILIATE,
    },
  });

  const affiliateUserB = await prisma.user.upsert({
    where: { email: "affiliate.b@mimo.local" },
    update: { role: UserRole.AFFILIATE },
    create: {
      email: "affiliate.b@mimo.local",
      role: UserRole.AFFILIATE,
    },
  });

  const hubStaffUserA = await prisma.user.upsert({
    where: { email: "hubstaff.a@mimo.local" },
    update: { role: UserRole.HUB_STAFF },
    create: {
      email: "hubstaff.a@mimo.local",
      role: UserRole.HUB_STAFF,
    },
  });

  const hubStaffUserB = await prisma.user.upsert({
    where: { email: "hubstaff.b@mimo.local" },
    update: { role: UserRole.HUB_STAFF },
    create: {
      email: "hubstaff.b@mimo.local",
      role: UserRole.HUB_STAFF,
    },
  });

  const driverUserA = await prisma.user.upsert({
    where: { email: "driver.a@mimo.local" },
    update: { role: UserRole.DRIVER },
    create: {
      email: "driver.a@mimo.local",
      role: UserRole.DRIVER,
    },
  });

  const driverUserB = await prisma.user.upsert({
    where: { email: "driver.b@mimo.local" },
    update: { role: UserRole.DRIVER },
    create: {
      email: "driver.b@mimo.local",
      role: UserRole.DRIVER,
    },
  });

  const customerProfile = await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
    },
  });

  const zoneA = await prisma.zone.upsert({
    where: { name: "Zone A" },
    update: {
      boundaries: {
        type: "manual",
        label: "Zone A boundary descriptor",
      },
      metadata: {
        seedKey: "zone-a",
      },
    },
    create: {
      name: "Zone A",
      boundaries: {
        type: "manual",
        label: "Zone A boundary descriptor",
      },
      metadata: {
        seedKey: "zone-a",
      },
    },
  });

  const zoneB = await prisma.zone.upsert({
    where: { name: "Zone B" },
    update: {
      boundaries: {
        type: "manual",
        label: "Zone B boundary descriptor",
      },
      metadata: {
        seedKey: "zone-b",
      },
    },
    create: {
      name: "Zone B",
      boundaries: {
        type: "manual",
        label: "Zone B boundary descriptor",
      },
      metadata: {
        seedKey: "zone-b",
      },
    },
  });

  await prisma.hub.upsert({
    where: { code: "HUB-A" },
    update: {
      name: "Hub A",
      zoneId: zoneA.id,
      staffUserId: hubStaffUserA.id,
      isActive: true,
    },
    create: {
      name: "Hub A",
      code: "HUB-A",
      zoneId: zoneA.id,
      staffUserId: hubStaffUserA.id,
      isActive: true,
    },
  });

  await prisma.hub.upsert({
    where: { code: "HUB-B" },
    update: {
      name: "Hub B",
      zoneId: zoneB.id,
      staffUserId: hubStaffUserB.id,
      isActive: true,
    },
    create: {
      name: "Hub B",
      code: "HUB-B",
      zoneId: zoneB.id,
      staffUserId: hubStaffUserB.id,
      isActive: true,
    },
  });

  await prisma.affiliateShop.upsert({
    where: { code: "SHOP-A" },
    update: {
      name: "Affiliate Shop A",
      zoneId: zoneA.id,
      staffUserId: affiliateUserA.id,
      isActive: true,
    },
    create: {
      name: "Affiliate Shop A",
      code: "SHOP-A",
      zoneId: zoneA.id,
      staffUserId: affiliateUserA.id,
      isActive: true,
    },
  });

  await prisma.affiliateShop.upsert({
    where: { code: "SHOP-B" },
    update: {
      name: "Affiliate Shop B",
      zoneId: zoneB.id,
      staffUserId: affiliateUserB.id,
      isActive: true,
    },
    create: {
      name: "Affiliate Shop B",
      code: "SHOP-B",
      zoneId: zoneB.id,
      staffUserId: affiliateUserB.id,
      isActive: true,
    },
  });

  await prisma.driver.upsert({
    where: { userId: driverUserA.id },
    update: {
      homeZoneId: zoneA.id,
      isActive: true,
    },
    create: {
      userId: driverUserA.id,
      homeZoneId: zoneA.id,
      isActive: true,
    },
  });

  await prisma.driver.upsert({
    where: { userId: driverUserB.id },
    update: {
      homeZoneId: zoneB.id,
      isActive: true,
    },
    create: {
      userId: driverUserB.id,
      homeZoneId: zoneB.id,
      isActive: true,
    },
  });

  await prisma.customerAddress.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {
      customerId: customerProfile.id,
      zoneId: zoneA.id,
      label: "Home",
      line1: "Mikocheni Block A",
      city: "Dar es Salaam",
      postalCode: "14112",
      notes: "Seeded default customer address",
      isDefault: true,
    },
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      customerId: customerProfile.id,
      zoneId: zoneA.id,
      label: "Home",
      line1: "Mikocheni Block A",
      city: "Dar es Salaam",
      postalCode: "14112",
      notes: "Seeded default customer address",
      isDefault: true,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: "seed.admin.created_or_verified" },
      { actorId: customer.id, action: "seed.customer.created_or_verified" },
      { actorId: affiliateUserA.id, action: "seed.affiliate_a.created_or_verified" },
      { actorId: affiliateUserB.id, action: "seed.affiliate_b.created_or_verified" },
      { actorId: hubStaffUserA.id, action: "seed.hubstaff_a.created_or_verified" },
      { actorId: hubStaffUserB.id, action: "seed.hubstaff_b.created_or_verified" },
      { actorId: driverUserA.id, action: "seed.driver_a.created_or_verified" },
      { actorId: driverUserB.id, action: "seed.driver_b.created_or_verified" },
      { actorId: admin.id, action: "seed.zone_links.created_or_verified" },
    ],
  });

  console.log("Seed complete");
  console.log({
    zones: ["Zone A", "Zone B"],
    hubs: ["HUB-A", "HUB-B"],
    affiliateShops: ["SHOP-A", "SHOP-B"],
    drivers: ["driver.a@mimo.local", "driver.b@mimo.local"],
    customerAddressZone: "Zone A",
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
