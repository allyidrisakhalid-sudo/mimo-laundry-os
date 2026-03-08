import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  PrismaClient,
  DriverAvailabilityStatus,
  OrderChannel,
  OrderEventType,
  OrderIssueStatus,
  OrderIssueType,
  OrderSourceType,
  OrderStatusCurrent,
  OrderTier,
  TripStatus,
  TripStopStatus,
  TripStopType,
  TripType,
  UserRole,
  VehicleType,
} from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());

type AdminAuth = { userId: string; role: "ADMIN" };
type AffiliateAuth = { userId: string; role: "AFFILIATE_STAFF" };
type DriverAuth = { userId: string; role: "DRIVER" };

type AdminAuthedRequest = express.Request & { adminAuth?: AdminAuth };
type AffiliateAuthedRequest = express.Request & { affiliateAuth?: AffiliateAuth };
type DriverAuthedRequest = express.Request & { driverAuth?: DriverAuth };

function extractBearerToken(req: express.Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

function generateTagCode(orderNumber: string) {
  const safe = orderNumber.replace(/[^A-Z0-9-]/gi, "-").toUpperCase();
  return `BAG-${safe}`;
}

function generateOrderNumber(prefix: string) {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `${prefix}-${stamp}-${rand}`;
}

function eventTypeToStatus(eventType: OrderEventType): OrderStatusCurrent {
  switch (eventType) {
    case OrderEventType.ORDER_CREATED:
      return OrderStatusCurrent.CREATED;
    case OrderEventType.PICKUP_SCHEDULED:
      return OrderStatusCurrent.PICKUP_SCHEDULED;
    case OrderEventType.PICKED_UP:
      return OrderStatusCurrent.PICKED_UP;
    case OrderEventType.RECEIVED_AT_HUB:
      return OrderStatusCurrent.RECEIVED_AT_HUB;
    case OrderEventType.WASHING_STARTED:
      return OrderStatusCurrent.WASHING_STARTED;
    case OrderEventType.DRYING_STARTED:
      return OrderStatusCurrent.DRYING_STARTED;
    case OrderEventType.IRONING_STARTED:
      return OrderStatusCurrent.IRONING_STARTED;
    case OrderEventType.PACKED:
      return OrderStatusCurrent.PACKED;
    case OrderEventType.OUT_FOR_DELIVERY:
      return OrderStatusCurrent.OUT_FOR_DELIVERY;
    case OrderEventType.DELIVERED:
      return OrderStatusCurrent.DELIVERED;
    case OrderEventType.PAYMENT_DUE:
      return OrderStatusCurrent.PAYMENT_DUE;
    case OrderEventType.PAID:
      return OrderStatusCurrent.PAID;
    default:
      return OrderStatusCurrent.CREATED;
  }
}

async function resolveAdminAuth(
  req: AdminAuthedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const token = extractBearerToken(req);
  if (!token?.startsWith("admin:")) {
    return res.status(401).json({ error: "Admin authentication required" });
  }

  const userId = token.slice("admin:".length);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(401).json({ error: "Invalid admin token" });
  }

  req.adminAuth = { userId: user.id, role: "ADMIN" };
  next();
}

async function resolveAffiliateAuth(
  req: AffiliateAuthedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const token = extractBearerToken(req);
  if (!token?.startsWith("affiliate:")) {
    return res.status(401).json({ error: "Affiliate authentication required" });
  }

  const userId = token.slice("affiliate:".length);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== UserRole.AFFILIATE_STAFF) {
    return res.status(401).json({ error: "Invalid affiliate token" });
  }

  req.affiliateAuth = { userId: user.id, role: "AFFILIATE_STAFF" };
  next();
}

async function resolveDriverAuth(
  req: DriverAuthedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const token = extractBearerToken(req);
  if (!token?.startsWith("driver:")) {
    return res.status(401).json({ error: "Driver authentication required" });
  }

  const userId = token.slice("driver:".length);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== UserRole.DRIVER) {
    return res.status(401).json({ error: "Invalid driver token" });
  }

  req.driverAuth = { userId: user.id, role: "DRIVER" };
  next();
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
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
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    tokenType: "Bearer",
    accessToken: `driver:${user.id}`,
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
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    tokenType: "Bearer",
    accessToken: `affiliate:${user.id}`,
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

app.post("/v1/auth/admin/login", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    tokenType: "Bearer",
    accessToken: `admin:${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

app.get("/v1/affiliate/me", resolveAffiliateAuth, async (req: AffiliateAuthedRequest, res) => {
  const auth = req.affiliateAuth!;

  const profile = await prisma.affiliateStaffProfile.findUnique({
    where: { userId: auth.userId },
    include: {
      user: true,
      affiliateShop: {
        include: {
          commissionPlan: true,
          zone: true,
        },
      },
    },
  });

  if (!profile) {
    return res.status(404).json({ error: "Affiliate profile not found" });
  }

  return res.json({
    user: {
      id: profile.user.id,
      email: profile.user.email,
      fullName: profile.user.fullName,
      role: profile.user.role,
    },
    affiliateStaffProfile: {
      id: profile.id,
      jobTitle: profile.jobTitle,
      isActive: profile.isActive,
    },
    shop: profile.affiliateShop,
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
    return res.status(400).json({ error: "Invalid order channel" });
  }

  const affiliateProfile = await prisma.affiliateStaffProfile.findUnique({
    where: { userId: auth.userId },
    include: {
      affiliateShop: true,
    },
  });

  if (!affiliateProfile) {
    return res.status(404).json({ error: "Affiliate profile not found" });
  }

  const hub = await prisma.hub.findFirst({
    where: {
      zoneId: affiliateProfile.affiliateShop.zoneId,
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  if (!hub) {
    return res.status(400).json({ error: "No active hub found for affiliate shop zone" });
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      sourceType: OrderSourceType.AFFILIATE,
      affiliateShopId: affiliateProfile.affiliateShopId,
      channel,
      tier: OrderTier.STANDARD_48H,
      zoneId: affiliateProfile.affiliateShop.zoneId,
      hubId: hub.id,
      statusCurrent: OrderStatusCurrent.CREATED,
      customerName,
      customerPhone: customerPhone ?? null,
      notes: notes ?? null,
    },
    include: {
      affiliateShop: true,
      zone: true,
      hub: true,
    },
  });

  return res.status(201).json(order);
});

app.get("/v1/affiliate/orders", resolveAffiliateAuth, async (req: AffiliateAuthedRequest, res) => {
  const auth = req.affiliateAuth!;

  const affiliateProfile = await prisma.affiliateStaffProfile.findUnique({
    where: { userId: auth.userId },
  });

  if (!affiliateProfile) {
    return res.status(404).json({ error: "Affiliate profile not found" });
  }

  const orders = await prisma.order.findMany({
    where: { affiliateShopId: affiliateProfile.affiliateShopId },
    include: {
      affiliateShop: true,
      zone: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(orders);
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
      return res.status(404).json({ error: "Affiliate profile not found" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        affiliateShopId: affiliateProfile.affiliateShopId,
      },
      include: {
        affiliateShop: true,
        zone: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  }
);

app.get("/v1/driver/me", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const profile = await prisma.driverProfile.findUnique({
    where: { userId: auth.userId },
    include: {
      user: true,
      homeZone: true,
    },
  });

  if (!profile) {
    return res.status(404).json({ error: "Driver profile not found" });
  }

  return res.json(profile);
});

app.get("/v1/driver/trips", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const profile = await prisma.driverProfile.findUnique({
    where: { userId: auth.userId },
  });

  if (!profile) {
    return res.status(404).json({ error: "Driver profile not found" });
  }

  const trips = await prisma.trip.findMany({
    where: {
      driverId: profile.id,
    },
    include: {
      zone: true,
      hub: true,
      stops: {
        include: {
          order: {
            include: {
              affiliateShop: true,
              zone: true,
            },
          },
        },
        orderBy: { sequence: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(trips.length === 1 ? trips[0] : trips);
});

app.get("/v1/driver/trips/:id", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const profile = await prisma.driverProfile.findUnique({
    where: { userId: auth.userId },
  });

  if (!profile) {
    return res.status(404).json({ error: "Driver profile not found" });
  }

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
              zone: true,
            },
          },
        },
        orderBy: { sequence: "asc" },
      },
    },
  });

  if (!trip || trip.driverId !== profile.id) {
    return res.status(404).json({ error: "Trip not found" });
  }

  return res.json(trip);
});

app.get("/v1/driver/tasks", resolveDriverAuth, async (req: DriverAuthedRequest, res) => {
  const auth = req.driverAuth!;

  const profile = await prisma.driverProfile.findUnique({
    where: { userId: auth.userId },
  });

  if (!profile) {
    return res.status(404).json({ error: "Driver profile not found" });
  }

  const stops = await prisma.tripStop.findMany({
    where: {
      trip: {
        driverId: profile.id,
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
          zone: true,
        },
      },
    },
    orderBy: [{ trip: { createdAt: "desc" } }, { sequence: "asc" }],
  });

  return res.json(stops.length === 1 ? stops[0] : stops);
});

app.get("/v1/admin/drivers", async (_req, res) => {
  const drivers = await prisma.driverProfile.findMany({
    include: {
      user: true,
      homeZone: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return res.json(drivers);
});

app.post("/v1/admin/drivers", async (req, res) => {
  const { email, fullName, phone, homeZoneId, vehicleType, vehiclePlate, availabilityStatus } =
    req.body ?? {};

  if (!email || !fullName || !homeZoneId) {
    return res.status(400).json({
      error: "email, fullName, and homeZoneId are required",
    });
  }

  if (vehicleType && !Object.values(VehicleType).includes(vehicleType)) {
    return res.status(400).json({ error: "Invalid vehicleType" });
  }

  if (availabilityStatus && !Object.values(DriverAvailabilityStatus).includes(availabilityStatus)) {
    return res.status(400).json({ error: "Invalid availabilityStatus" });
  }

  const zone = await prisma.zone.findUnique({ where: { id: homeZoneId } });
  if (!zone) {
    return res.status(404).json({ error: "Home zone not found" });
  }

  const driver = await prisma.driverProfile.create({
    data: {
      user: {
        create: {
          email,
          fullName,
          role: UserRole.DRIVER,
        },
      },
      homeZoneId,
      phone: phone ?? null,
      vehicleType: vehicleType ?? null,
      vehiclePlate: vehiclePlate ?? null,
      availabilityStatus: availabilityStatus ?? DriverAvailabilityStatus.OFFLINE,
      lastStatusAt: new Date(),
    },
    include: {
      user: true,
      homeZone: true,
    },
  });

  return res.status(201).json(driver);
});

app.post("/v1/admin/trips", async (req, res) => {
  const { type, zoneId, hubId, driverId, status, scheduledFor } = req.body ?? {};

  if (!type || !zoneId || !driverId) {
    return res.status(400).json({
      error: "type, zoneId, and driverId are required",
    });
  }

  if (!Object.values(TripType).includes(type)) {
    return res.status(400).json({ error: "Invalid trip type" });
  }

  if (status && !Object.values(TripStatus).includes(status)) {
    return res.status(400).json({ error: "Invalid trip status" });
  }

  const [zone, driver] = await Promise.all([
    prisma.zone.findUnique({ where: { id: zoneId } }),
    prisma.driverProfile.findUnique({ where: { id: driverId } }),
  ]);

  if (!zone) {
    return res.status(404).json({ error: "Zone not found" });
  }

  if (!driver) {
    return res.status(404).json({ error: "Driver not found" });
  }

  if (hubId) {
    const hub = await prisma.hub.findUnique({ where: { id: hubId } });
    if (!hub) {
      return res.status(404).json({ error: "Hub not found" });
    }
  }

  const trip = await prisma.trip.create({
    data: {
      type,
      zoneId,
      hubId: hubId ?? null,
      driverId,
      status: status ?? TripStatus.PLANNED,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
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
    },
  });

  return res.status(201).json(trip);
});

app.post("/v1/admin/trips/:id/stops", async (req, res) => {
  const { orderId, stopType, sequence, status, notes } = req.body ?? {};

  if (!orderId || !stopType || sequence == null) {
    return res.status(400).json({
      error: "orderId, stopType, and sequence are required",
    });
  }

  if (!Object.values(TripStopType).includes(stopType)) {
    return res.status(400).json({ error: "Invalid stopType" });
  }

  if (status && !Object.values(TripStopStatus).includes(status)) {
    return res.status(400).json({ error: "Invalid stop status" });
  }

  const [trip, order] = await Promise.all([
    prisma.trip.findUnique({ where: { id: req.params.id } }),
    prisma.order.findUnique({ where: { id: orderId } }),
  ]);

  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const stop = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      orderId,
      stopType,
      sequence: Number(sequence),
      status: status ?? TripStopStatus.PENDING,
      notes: notes ?? null,
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
          zone: true,
        },
      },
    },
  });

  return res.status(201).json(stop);
});

app.post("/v1/orders", resolveAdminAuth, async (req: AdminAuthedRequest, res) => {
  const auth = req.adminAuth!;
  const {
    orderNumber,
    customerUserId,
    channel,
    tier,
    sourceType,
    affiliateShopId,
    pickupAddressId,
    dropoffAddressId,
    customerName,
    customerPhone,
    notes,
  } = req.body ?? {};

  if (!channel || !tier || !sourceType || !customerName) {
    return res.status(400).json({
      error: "channel, tier, sourceType, and customerName are required",
    });
  }

  if (!Object.values(OrderChannel).includes(channel)) {
    return res.status(400).json({ error: "Invalid order channel" });
  }

  if (!Object.values(OrderTier).includes(tier)) {
    return res.status(400).json({ error: "Invalid order tier" });
  }

  if (!Object.values(OrderSourceType).includes(sourceType)) {
    return res.status(400).json({ error: "Invalid sourceType" });
  }

  if (sourceType === OrderSourceType.AFFILIATE && !affiliateShopId) {
    return res.status(400).json({ error: "affiliateShopId is required for AFFILIATE orders" });
  }

  if (channel === OrderChannel.DOOR && !pickupAddressId) {
    return res.status(400).json({ error: "pickupAddressId is required for DOOR orders" });
  }

  if (channel === OrderChannel.SHOP_DROP && !affiliateShopId) {
    return res.status(400).json({ error: "affiliateShopId is required for SHOP_DROP orders" });
  }

  if (channel === OrderChannel.HYBRID && !dropoffAddressId) {
    return res.status(400).json({ error: "dropoffAddressId is required for HYBRID orders" });
  }

  const affiliateShop = affiliateShopId
    ? await prisma.affiliateShop.findUnique({ where: { id: affiliateShopId } })
    : null;

  if (affiliateShopId && !affiliateShop) {
    return res.status(404).json({ error: "Affiliate shop not found" });
  }

  const pickupAddress = pickupAddressId
    ? await prisma.customerAddress.findUnique({ where: { id: pickupAddressId } })
    : null;

  if (pickupAddressId && !pickupAddress) {
    return res.status(404).json({ error: "Pickup address not found" });
  }

  const dropoffAddress = dropoffAddressId
    ? await prisma.customerAddress.findUnique({ where: { id: dropoffAddressId } })
    : null;

  if (dropoffAddressId && !dropoffAddress) {
    return res.status(404).json({ error: "Dropoff address not found" });
  }

  let zoneId: string | null = null;

  if (channel === OrderChannel.DOOR || channel === OrderChannel.HYBRID) {
    zoneId = pickupAddress?.zoneId ?? null;
  }

  if (channel === OrderChannel.SHOP_DROP && affiliateShop) {
    zoneId = affiliateShop.zoneId;
  }

  if (!zoneId) {
    return res.status(400).json({ error: "Unable to derive zoneId from channel rules" });
  }

  const hub = await prisma.hub.findFirst({
    where: {
      zoneId,
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  if (!hub) {
    return res.status(400).json({ error: "No active hub found for derived zone" });
  }

  const finalOrderNumber = orderNumber || generateOrderNumber("ORD");

  try {
    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: finalOrderNumber,
          customerUserId: customerUserId ?? null,
          channel,
          tier,
          sourceType,
          affiliateShopId: affiliateShopId ?? null,
          zoneId,
          hubId: hub.id,
          pickupAddressId: pickupAddressId ?? null,
          dropoffAddressId: dropoffAddressId ?? null,
          statusCurrent: OrderStatusCurrent.CREATED,
          customerName,
          customerPhone: customerPhone ?? null,
          notes: notes ?? null,
        },
      });

      const bag = await tx.bag.create({
        data: {
          orderId: order.id,
          tagCode: generateTagCode(order.orderNumber),
          bagStatus: "CREATED",
        },
      });

      const event = await tx.orderEvent.create({
        data: {
          orderId: order.id,
          eventType: OrderEventType.ORDER_CREATED,
          actorUserId: auth.userId,
          actorRole: auth.role,
          notes: "Order created",
          payloadJson: {
            sourceType,
            channel,
            tier,
            bagTagCode: bag.tagCode,
          },
        },
      });

      const fullOrder = await tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: {
          affiliateShop: true,
          zone: true,
          hub: true,
          pickupAddress: true,
          dropoffAddress: true,
          bags: true,
          events: { orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }] },
          issues: true,
        },
      });

      return { order: fullOrder, bag, event };
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create order",
    });
  }
});

app.get("/v1/orders/:id", resolveAdminAuth, async (req: AdminAuthedRequest, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      affiliateShop: true,
      zone: true,
      hub: true,
      pickupAddress: true,
      dropoffAddress: true,
      bags: true,
      issues: true,
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  return res.json(order);
});

app.get("/v1/orders/:id/timeline", resolveAdminAuth, async (req: AdminAuthedRequest, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const timeline = await prisma.orderEvent.findMany({
    where: { orderId: order.id },
    orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
  });

  return res.json(timeline);
});

app.post("/v1/orders/:id/events", resolveAdminAuth, async (req: AdminAuthedRequest, res) => {
  const auth = req.adminAuth!;
  const { eventType, notes, payloadJson } = req.body ?? {};

  if (!eventType) {
    return res.status(400).json({ error: "eventType is required" });
  }

  if (!Object.values(OrderEventType).includes(eventType)) {
    return res.status(400).json({ error: "Invalid eventType" });
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.orderEvent.create({
      data: {
        orderId: order.id,
        eventType,
        actorUserId: auth.userId,
        actorRole: auth.role,
        notes: notes ?? null,
        payloadJson: payloadJson ?? null,
      },
    });

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        statusCurrent: eventTypeToStatus(eventType),
      },
      include: {
        affiliateShop: true,
        zone: true,
        hub: true,
        bags: true,
      },
    });

    return { event, order: updatedOrder };
  });

  return res.status(201).json(result);
});

app.get("/v1/orders/:id/issues", resolveAdminAuth, async (req: AdminAuthedRequest, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const issues = await prisma.orderIssue.findMany({
    where: { orderId: order.id },
    orderBy: [{ reportedAt: "asc" }, { createdAt: "asc" }],
  });

  return res.json(issues);
});

app.post("/v1/orders/:id/issues", resolveAdminAuth, async (req: AdminAuthedRequest, res) => {
  const auth = req.adminAuth!;
  const { type, description } = req.body ?? {};

  if (!type || !description) {
    return res.status(400).json({ error: "type and description are required" });
  }

  if (!Object.values(OrderIssueType).includes(type)) {
    return res.status(400).json({ error: "Invalid issue type" });
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const issue = await tx.orderIssue.create({
      data: {
        orderId: order.id,
        type,
        status: OrderIssueStatus.OPEN,
        reportedByUserId: auth.userId,
        description,
      },
    });

    const event = await tx.orderEvent.create({
      data: {
        orderId: order.id,
        eventType: OrderEventType.ISSUE_OPENED,
        actorUserId: auth.userId,
        actorRole: auth.role,
        notes: "ISSUE_OPENED",
        payloadJson: {
          issueId: issue.id,
          issueType: issue.type,
          issueStatus: issue.status,
        },
      },
    });

    return { issue, event };
  });

  return res.status(201).json(result);
});

app.patch(
  "/v1/orders/:id/issues/:issueId",
  resolveAdminAuth,
  async (req: AdminAuthedRequest, res) => {
    const auth = req.adminAuth!;
    const { status, resolutionNotes } = req.body ?? {};

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    if (!Object.values(OrderIssueStatus).includes(status)) {
      return res.status(400).json({ error: "Invalid issue status" });
    }

    const issue = await prisma.orderIssue.findFirst({
      where: {
        id: req.params.issueId,
        orderId: req.params.id,
      },
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const nextIssue = await tx.orderIssue.update({
        where: { id: issue.id },
        data: {
          status,
          resolutionNotes: resolutionNotes ?? null,
          resolvedAt:
            status === OrderIssueStatus.RESOLVED || status === OrderIssueStatus.REJECTED
              ? new Date()
              : null,
        },
      });

      const event = await tx.orderEvent.create({
        data: {
          orderId: req.params.id,
          eventType:
            status === OrderIssueStatus.RESOLVED || status === OrderIssueStatus.REJECTED
              ? OrderEventType.ISSUE_RESOLVED
              : OrderEventType.ISSUE_UPDATED,
          actorUserId: auth.userId,
          actorRole: auth.role,
          notes:
            status === OrderIssueStatus.RESOLVED || status === OrderIssueStatus.REJECTED
              ? "ISSUE_RESOLVED"
              : "ISSUE_UPDATED",
          payloadJson: {
            issueId: nextIssue.id,
            issueType: nextIssue.type,
            issueStatus: nextIssue.status,
          },
        },
      });

      return { issue: nextIssue, event };
    });

    return res.json(updated);
  }
);

app.get("/api", (_req, res) => {
  res.json({
    name: "Mimo Laundry OS API",
    version: "0.0.1",
    routes: [
      "GET /health",
      "POST /v1/auth/admin/login",
      "POST /v1/auth/affiliate/login",
      "POST /v1/auth/driver/login",
      "GET /v1/affiliate/me",
      "POST /v1/affiliate/orders",
      "GET /v1/affiliate/orders",
      "GET /v1/affiliate/orders/:id",
      "GET /v1/admin/drivers",
      "POST /v1/admin/drivers",
      "POST /v1/admin/trips",
      "POST /v1/admin/trips/:id/stops",
      "GET /v1/driver/me",
      "GET /v1/driver/trips",
      "GET /v1/driver/trips/:id",
      "GET /v1/driver/tasks",
      "POST /v1/orders",
      "GET /v1/orders/:id",
      "GET /v1/orders/:id/timeline",
      "POST /v1/orders/:id/events",
      "GET /v1/orders/:id/issues",
      "POST /v1/orders/:id/issues",
      "PATCH /v1/orders/:id/issues/:issueId",
    ],
  });
});

app.listen(3001, () => {
  console.log("Mimo API running on http://localhost:3001");
  console.log("API docs placeholder on http://localhost:3001/api");
});
