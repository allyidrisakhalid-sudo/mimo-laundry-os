import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = [
  { email: "admin@mimo.local", phone: "+255700000001" },
  { email: "devadmin@mimo.local", phone: "+255700000002" },
  { email: "hubstaff@mimo.local", phone: "+255700000003" },
  { email: "affiliatea@mimo.local", phone: "+255700000004" },
  { email: "affiliateb@mimo.local", phone: "+255700000005" },
  { email: "driver@mimo.local", phone: "+255700000006" },
] as const;

async function main() {
  for (const item of updates) {
    const user = await prisma.user.update({
      where: { email: item.email },
      data: { phone: item.phone },
      select: { email: true, phone: true },
    });

    console.log("UPDATED", user.email, "->", user.phone);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
