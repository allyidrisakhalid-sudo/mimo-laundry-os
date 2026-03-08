import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json());

app.get("/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/v1/zones", async (_req, res) => {
  const zones = await prisma.zone.findMany({
    orderBy: { name: "asc" },
  });

  res.json(zones);
});

app.get("/v1/zones/:id/hubs", async (req, res) => {
  const hubs = await prisma.hub.findMany({
    where: { zoneId: req.params.id },
    orderBy: { name: "asc" },
  });

  res.json(hubs);
});

app.get("/v1/hubs", async (_req, res) => {
  const hubs = await prisma.hub.findMany({
    include: {
      zone: true,
      staffProfiles: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  res.json(hubs);
});

app.get("/v1/hubs/:id", async (req, res) => {
  const hub = await prisma.hub.findUnique({
    where: { id: req.params.id },
    include: {
      zone: true,
      staffProfiles: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!hub) {
    return res.status(404).json({ error: "Hub not found" });
  }

  res.json(hub);
});

app.post("/v1/hubs", async (req, res) => {
  const {
    name,
    zoneId,
    addressLabel,
    locationLat,
    locationLng,
    capacityKgPerDay,
    capacityOrdersPerDay,
    supportsTiers,
    isActive,
  } = req.body ?? {};

  if (!name || !zoneId || !addressLabel || !supportsTiers) {
    return res.status(400).json({
      error: "name, zoneId, addressLabel, and supportsTiers are required",
    });
  }

  const hub = await prisma.hub.create({
    data: {
      name,
      zoneId,
      addressLabel,
      locationLat: locationLat ?? null,
      locationLng: locationLng ?? null,
      capacityKgPerDay: capacityKgPerDay ?? null,
      capacityOrdersPerDay: capacityOrdersPerDay ?? null,
      supportsTiers,
      isActive: typeof isActive === "boolean" ? isActive : true,
    },
  });

  res.status(201).json(hub);
});

app.listen(3001, () => {
  console.log("Mimo API running on http://localhost:3001");
  console.log("API docs placeholder on http://localhost:3001/api");
});
