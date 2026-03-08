import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { OrderChannel, OrderSourceType, PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json());

type AffiliateAuthContext = {
  userId: string;
  email: string;
  role: UserRole;
  affiliateShopId: string;
};

type AffiliateAuthedRequest = Request & {
  affiliateAuth?: AffiliateAuthContext;
};

function buildAffiliateToken(userId: string) {
  return `affiliate:${userId}`;
}

async function resolveAffiliateAuth(
  req: AffiliateAuthedRequest,
  res: Response,
  next: NextFunction
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  if (
    !user ||
    user.role !== UserRole.AFFILIATE_STAFF ||
    !user.isActive ||
    !user.affiliateStaffProfile ||
    !user.affiliateStaffProfile.isActive
  ) {
    return res.status(401).json({
      error: "Affiliate staff account not authorized",
    });
  }

  req.affiliateAuth = {
    userId: user.id,
    email: user.email,
    role: user.role,
    affiliateShopId: user.affiliateStaffProfile.affiliateShopId,
  };

  next();
}

app.get("/health", async (_req, res) => {
  res.json({ ok: true });
});

app.post("/v1/auth/affiliate/login", async (req, res) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({
      error: "email is required",
    });
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

  if (
    !user ||
    user.role !== UserRole.AFFILIATE_STAFF ||
    !user.isActive ||
    !user.affiliateStaffProfile ||
    !user.affiliateStaffProfile.isActive
  ) {
    return res.status(401).json({
      error: "Invalid affiliate staff credentials",
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

  const orders = await prisma.order.findMany({
    where: {
      affiliateShopId: auth.affiliateShopId,
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

    if (order.affiliateShopId !== auth.affiliateShopId) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    res.json(order);
  }
);

app.get("/api", async (_req, res) => {
  res.json({
    name: "Mimo API",
    chapter: "4.3",
    routes: {
      health: "GET /health",
      zones: "GET /v1/zones",
      hubs: ["GET /v1/hubs", "GET /v1/hubs/:id", "POST /v1/hubs", "GET /v1/zones/:id/hubs"],
      affiliate: [
        "POST /v1/auth/affiliate/login",
        "GET /v1/affiliate/me",
        "POST /v1/affiliate/orders",
        "GET /v1/affiliate/orders",
        "GET /v1/affiliate/orders/:id",
      ],
    },
  });
});

app.listen(3001, () => {
  console.log("Mimo API running on http://localhost:3001");
  console.log("API docs placeholder on http://localhost:3001/api");
});
