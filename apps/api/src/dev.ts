import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  DriverAvailabilityStatus,
  OrderChannel,
  OrderSourceType,
  TripStatus,
  TripStopStatus,
  TripStopType,
  TripType,
  UserRole,
  VehicleType,
} from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json());

type AffiliateAuthedRequest = express.Request & {
  affiliateAuth?: {
    userId: string;
  };
};

type DriverAuthedRequest = express.Request & {
  driverAuth?: {
    userId: string;
    driverProfileId: string;
  };
};

function buildAffiliateToken(userId: string) {
  return `affiliate:${userId}`;
}

function buildDriverToken(userId: string) {
  return `driver:${userId}`;
}

function resolveAffiliateAuth(
  req: AffiliateAuthedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing bearer token",
    });
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token.startsWith("affiliate:")) {
    return res.status(401).json({
      error: "Invalid token type",
    });
  }

  const userId = token.slice("affiliate:".length).trim();

  if (!userId) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  req.affiliateAuth = { userId };
  next();
}

async function resolveDriverAuth(
  req: DriverAuthedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Missing bearer token",
    });
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token.startsWith("driver:")) {
    return res.status(401).json({
      error: "Invalid token type",
    });
  }

  const userId = token.slice("driver:".length).trim();

  if (!userId) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  const driverProfile = await prisma.driverProfile.findUnique({
    where: { userId },
  });

  if (!driverProfile) {
    return res.status(403).json({
      error: "Driver profile not found",
    });
  }

  req.driverAuth = {
    userId,
    driverProfileId: driverProfile.id,
  };

  next();
}

app.get("/health", async (_req, res) => {
  const zoneCount = await prisma.zone.count();
  res.json({ ok: true, zoneCount });
});

app.post("/v1/auth/affiliate/login", async (req, res) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      affiliateStaffProfile: {
        include: {
          affiliateShop: true,
        },
      },
    },
  });

  if (!user || user.role !== UserRole.AFFILIATE_STAFF || !user.affiliateStaffProfile) {
    return res.status(401).json({
      error: "Invalid affiliate credentials",
    });
  }

  res.json({
    tokenType: "Bearer",
    accessToken: buildAffiliateToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    affiliateShop: {
      id: user.affiliateStaffProfile.affiliateShop.id,
      code: user.affiliateStaffProfile.affiliateShop.code,
      name: user.affiliateStaffProfile.affiliateShop.name,
      zoneId: user.affiliateStaffProfile.affiliateShop.zoneId,
    },
  });
});

app.post("/v1/auth/driver/login", async (req, res) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      driverProfile: {
        include: {
          homeZone: true,
        },
      },
    },
  });

  if (!user || user.role !== UserRole.DRIVER || !user.driverProfile) {
    return res.status(401).json({
      error: "Invalid driver credentials",
    });
  }

  res.json({
    tokenType: "Bearer",
    accessToken: buildDriverToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    driverProfile: {
      id: user.driverProfile.id,
      homeZoneId: user.driverProfile.homeZoneId,
      availabilityStatus: user.driverProfile.availabilityStatus,
      homeZone: user.driverProfile.homeZone,
    },
  });
});

app.get("/v1/zones", async (_req, res) => {
  const zones = await prisma.zone.findMany({
    orderBy: { name: "asc" },
  });

  res.json(zones);
});

app.post("/v1/zones", async (req, res) => {
  const { name, boundaries, metadata } = req.body ?? {};

  if (!name || !boundaries) {
    return res.status(400).json({
      error: "name and boundaries are required",
    });
  }

  const zone = await prisma.zone.create({
    data: {
      name,
      boundaries,
      metadata: metadata ?? null,
    },
  });

  res.status(201).json(zone);
});

app.get("/v1/hubs/by-zone/:zoneId", async (req, res) => {
  const hubs = await prisma.hub.findMany({
    where: { zoneId: req.params.zoneId },
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

app.get("/v1/affiliate/me", resolveAffiliateAuth, async (req: AffiliateAuthedRequest, res) => {
  const auth = req.affiliateAuth!;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      affiliateStaffProfile: {
        include: {
          affiliateShop: {
            include: {
              commissionPlan: true,
              zone: true,
            },
          },
        },
      },
    },
  });

  if (!user?.affiliateStaffProfile) {
    return res.status(404).json({
      error: "Affiliate profile not found",
    });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    affiliateStaffProfile: {
      id: user.affiliateStaffProfile.id,
      jobTitle: user.affiliateStaffProfile.jobTitle,
      isActive: user.affiliateStaffProfile.isActive,
    },
    shop: user.affiliateStaffProfile.affiliateShop,
  });
});

app.post("/v1/affiliate/orders", resolveAffiliateAuth, async (req: AffiliateAuthedRequest, res) => {
  const auth = req.affiliateAuth!;
  const { orderNumber, channel, customerName, customerPhone, notes } = req.body ?? {};

  if (!orderNumber || !channel || !customerName) {
    return res.status(400).json({
      error: "orderNumber, channel, and customerName are required",
    });
  }

  if (!Object.values(OrderChannel).includes(channel)) {
    return res.status(400).json({
      error: "channel must be one of DOOR, SHOP_DROP, HYBRID",
    });
  }

  const affiliateProfile = await prisma.affiliateStaffProfile.findUnique({
    where: { userId: auth.userId },
    include: {
      affiliateShop: true,
    },
  });

  if (!affiliateProfile) {
    return res.status(403).json({
      error: "Affiliate staff profile missing",
    });
  }

  const createdOrder = await prisma.order.create({
    data: {
      orderNumber,
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: affiliateProfile.affiliateShopId,
      channel,
      orderZoneId: affiliateProfile.affiliateShop.zoneId,
      customerName,
      customerPhone: customerPhone ?? null,
      notes: notes ?? null,
    },
    include: {
      affiliateShop: true,
      orderZone: true,
    },
  });

  res.status(201).json(createdOrder);
});

app.get("/v1/affiliate/orders", resolveAffiliateAuth, async (req: AffiliateAuthedRequest, res) => {
  const auth = req.affiliateAuth!;

  const affiliateProfile = await prisma.affiliateStaffProfile.findUnique({
    where: { userId: auth.userId },
  });

  if (!affiliateProfile) {
    return res.status(403).json({
      error: "Affiliate staff profile missing",
    });
  }

  const orders = await prisma.order.findMany({
    where: {
      affiliateShopId: affiliateProfile.affiliateShopId,
    },
    include: {
      affiliateShop: true,
      orderZone: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
});

app.get(
  "/v1/affiliate/orders/:id",
  resolveAffiliateAuth,
  async (req: AffiliateAuthedRequest, res) => {
    const auth = req.affiliateAuth!;

    const affiliateProfile = await prisma.affiliateStaffProfile.findUnique({
      where: { userId: auth.userId },
    });

    if (!affiliateProfile) {
      return res.status(403).json({
        error: "Affiliate staff profile missing",
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        affiliateShop: true,
        orderZone: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    if (order.affiliateShopId !== affiliateProfile.affiliateShopId) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    res.json(order);
  }
);

app.post("/v1/admin/drivers", async (req, res) => {
  const {
    email,
    fullName,
    homeZoneId,
    phone,
    vehicleType,
    vehiclePlate,
    isActive,
    availabilityStatus,
  } = req.body ?? {};

  if (!email || !fullName || !homeZoneId) {
    return res.status(400).json({
      error: "email, fullName, and homeZoneId are required",
    });
  }

  if (vehicleType && !Object.values(VehicleType).includes(vehicleType)) {
    return res.status(400).json({
      error: "vehicleType must be one of MOTORBIKE, CAR, VAN",
    });
  }

  if (availabilityStatus && !Object.values(DriverAvailabilityStatus).includes(availabilityStatus)) {
    return res.status(400).json({
      error: "availabilityStatus must be one of OFFLINE, AVAILABLE, ON_TRIP, SUSPENDED",
    });
  }

  const created = await prisma.user.create({
    data: {
      email,
      fullName,
      role: UserRole.DRIVER,
      driverProfile: {
        create: {
          homeZoneId,
          phone: phone ?? null,
          vehicleType: vehicleType ?? null,
          vehiclePlate: vehiclePlate ?? null,
          isActive: typeof isActive === "boolean" ? isActive : true,
          availabilityStatus: availabilityStatus ?? DriverAvailabilityStatus.OFFLINE,
          lastStatusAt: new Date(),
        },
      },
    },
    include: {
      driverProfile: {
        include: {
          homeZone: true,
        },
      },
    },
  });

  res.status(201).json(created);
});

app.get("/v1/admin/drivers", async (_req, res) => {
  const drivers = await prisma.driverProfile.findMany({
    include: {
      user: true,
      homeZone: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.json(drivers);
});

app.post("/v1/admin/trips", async (req, res) => {
  const { type, zoneId, hubId, driverId, status, scheduledFor, startedAt, completedAt } =
    req.body ?? {};

  if (!type || !zoneId || !driverId) {
    return res.status(400).json({
      error: "type, zoneId, and driverId are required",
    });
  }

  if (!Object.values(TripType).includes(type)) {
    return res.status(400).json({
      error: "type must be PICKUP or DELIVERY",
    });
  }

  if (status && !Object.values(TripStatus).includes(status)) {
    return res.status(400).json({
      error: "status must be one of PLANNED, IN_PROGRESS, COMPLETED, CANCELLED",
    });
  }

  const trip = await prisma.trip.create({
    data: {
      type,
      zoneId,
      hubId: hubId ?? null,
      driverId,
      status: status ?? TripStatus.PLANNED,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      startedAt: startedAt ? new Date(startedAt) : null,
      completedAt: completedAt ? new Date(completedAt) : null,
    },
    include: {
      zone: true,
      hub: true,
      driver: {
        include: {
          user: true,
          homeZone: true,
        },
      },
      stops: true,
    },
  });

  res.status(201).json(trip);
});

app.post("/v1/admin/trips/:id/stops", async (req, res) => {
  const { orderId, stopType, sequence, status, notes } = req.body ?? {};

  if (!orderId || !stopType || typeof sequence !== "number") {
    return res.status(400).json({
      error: "orderId, stopType, and numeric sequence are required",
    });
  }

  if (!Object.values(TripStopType).includes(stopType)) {
    return res.status(400).json({
      error: "stopType must be PICKUP or DROPOFF",
    });
  }

  if (status && !Object.values(TripStopStatus).includes(status)) {
    return res.status(400).json({
      error: "status must be one of PENDING, DONE, FAILED, SKIPPED",
    });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
  });

  if (!trip) {
    return res.status(404).json({
      error: "Trip not found",
    });
  }

  const stop = await prisma.tripStop.create({
    data: {
      tripId: req.params.id,
      orderId,
      stopType,
      sequence,
      status: status ?? TripStopStatus.PENDING,
      notes: notes ?? null,
    },
    include: {
      trip: true,
      order: true,
    },
  });

  res.status(201).json(stop);
});

app.get("/v1/admin/trips/:id", async (req, res) => {
  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: {
      zone: true,
      hub: true,
      driver: {
        include: {
          user: true,
          homeZone: true,
        },
      },
      stops: {
        include: {
          order: {
            include: {
              affiliateShop: true,
              orderZone: true,
            },
          },
        },
        orderBy: {
          sequence: "asc",
        },
      },
    },
  });

  if (!trip) {
    return res.status(404).json({
      error: "Trip not found",
    });
  }

  res.json(trip);
});

app.get("/v1/driver/me", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const driver = await prisma.driverProfile.findUnique({
    where: { id: auth.driverProfileId },
    include: {
      user: true,
      homeZone: true,
    },
  });

  if (!driver) {
    return res.status(404).json({
      error: "Driver profile not found",
    });
  }

  res.json(driver);
});

app.get("/v1/driver/trips", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const trips = await prisma.trip.findMany({
    where: {
      driverId: auth.driverProfileId,
    },
    include: {
      zone: true,
      hub: true,
      stops: {
        include: {
          order: true,
        },
        orderBy: {
          sequence: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(trips);
});

app.get("/v1/driver/trips/:id", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: {
      zone: true,
      hub: true,
      stops: {
        include: {
          order: {
            include: {
              affiliateShop: true,
              orderZone: true,
            },
          },
        },
        orderBy: {
          sequence: "asc",
        },
      },
    },
  });

  if (!trip) {
    return res.status(404).json({
      error: "Trip not found",
    });
  }

  if (trip.driverId !== auth.driverProfileId) {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  res.json(trip);
});

app.get("/v1/driver/tasks", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const stops = await prisma.tripStop.findMany({
    where: {
      trip: {
        driverId: auth.driverProfileId,
        status: {
          in: [TripStatus.PLANNED, TripStatus.IN_PROGRESS],
        },
      },
    },
    include: {
      trip: {
        include: {
          zone: true,
          hub: true,
        },
      },
      order: {
        include: {
          affiliateShop: true,
          orderZone: true,
        },
      },
    },
    orderBy: [{ trip: { createdAt: "desc" } }, { sequence: "asc" }],
  });

  res.json(stops);
});

app.get("/api", (_req, res) => {
  res.json({
    name: "Mimo API",
    version: "0.0.1",
    routes: [
      "GET /health",
      "POST /v1/auth/affiliate/login",
      "POST /v1/auth/driver/login",
      "GET /v1/zones",
      "POST /v1/zones",
      "GET /v1/hubs/by-zone/:zoneId",
      "GET /v1/hubs/:id",
      "POST /v1/hubs",
      "GET /v1/affiliate/me",
      "POST /v1/affiliate/orders",
      "GET /v1/affiliate/orders",
      "GET /v1/affiliate/orders/:id",
      "POST /v1/admin/drivers",
      "GET /v1/admin/drivers",
      "POST /v1/admin/trips",
      "POST /v1/admin/trips/:id/stops",
      "GET /v1/admin/trips/:id",
      "GET /v1/driver/me",
      "GET /v1/driver/trips",
      "GET /v1/driver/trips/:id",
      "GET /v1/driver/tasks",
    ],
  });
});

app.listen(3001, () => {
  console.log("Mimo API running on http://localhost:3001");
  console.log("API docs placeholder on http://localhost:3001/api");
});
