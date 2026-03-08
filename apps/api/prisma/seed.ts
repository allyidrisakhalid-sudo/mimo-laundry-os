import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
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

  await prisma.affiliateShop.upsert({
    where: { code: "SHOP-A" },
    update: {
      name: "Affiliate Shop A",
      zoneId: zoneA.id,
    },
    create: {
      code: "SHOP-A",
      name: "Affiliate Shop A",
      zoneId: zoneA.id,
    },
  });

  await prisma.affiliateShop.upsert({
    where: { code: "SHOP-B" },
    update: {
      name: "Affiliate Shop B",
      zoneId: zoneB.id,
    },
    create: {
      code: "SHOP-B",
      name: "Affiliate Shop B",
      zoneId: zoneB.id,
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

  console.log("Seed complete");
  console.log({
    zones: [zoneA.name, zoneB.name],
    hubs: [hubA.name, hubB.name],
    hubStaffUsers: [hubStaffUserA.email, hubStaffUserB.email],
    affiliateShops: ["SHOP-A", "SHOP-B"],
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
