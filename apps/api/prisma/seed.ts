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

  const affiliate = await prisma.user.upsert({
    where: { email: "affiliate@mimo.local" },
    update: { role: UserRole.AFFILIATE },
    create: {
      email: "affiliate@mimo.local",
      role: UserRole.AFFILIATE,
    },
  });

  const hubStaff = await prisma.user.upsert({
    where: { email: "hubstaff@mimo.local" },
    update: { role: UserRole.HUB_STAFF },
    create: {
      email: "hubstaff@mimo.local",
      role: UserRole.HUB_STAFF,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: "seed.admin.created_or_verified",
      },
      {
        actorId: customer.id,
        action: "seed.customer.created_or_verified",
      },
      {
        actorId: affiliate.id,
        action: "seed.affiliate.created_or_verified",
      },
      {
        actorId: hubStaff.id,
        action: "seed.hubstaff.created_or_verified",
      },
    ],
  });

  console.log("Seed complete");
  console.log({
    admin: admin.email,
    customer: customer.email,
    affiliate: affiliate.email,
    hubStaff: hubStaff.email,
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
