import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import http from "node:http";

const repoRootEnvPath = path.resolve(process.cwd(), ".env");
const serviceEnvPath = path.resolve(process.cwd(), "apps/api/.env");
const localServiceEnvPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(serviceEnvPath)) {
  dotenv.config({ path: serviceEnvPath, override: true });
} else if (fs.existsSync(localServiceEnvPath)) {
  dotenv.config({ path: localServiceEnvPath, override: true });
} else if (fs.existsSync(repoRootEnvPath)) {
  dotenv.config({ path: repoRootEnvPath, override: true });
}

import crypto from "node:crypto";
import { URL } from "node:url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/mimo_laundry_os?schema=public";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const DATABASE_URL_SAFE = DATABASE_URL.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
console.log("[mimo-api] DATABASE_URL =", DATABASE_URL_SAFE);

const PORT = Number(process.env.PORT ?? 3001);
const APP_VERSION = process.env.npm_package_version ?? "0.0.1";
const RAW_ENVIRONMENT = process.env.APP_ENV ?? process.env.NODE_ENV ?? "local";
const ENVIRONMENT = RAW_ENVIRONMENT === "development" ? "local" : RAW_ENVIRONMENT;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "dev-access-secret-change-me";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "dev-refresh-secret-change-me";
const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

type Role = "CUSTOMER" | "AFFILIATE_STAFF" | "DRIVER" | "HUB_STAFF" | "ADMIN" | "DEV_ADMIN";

type AuthenticatedUser = {
  id: string;
  phone: string;
  email: string | null;
  fullName: string;
  role: Role;
  status: string;
};

type ScopeContext = {
  userId: string;
  role: Role;
  affiliateShopId: string | null;
  driverId: string | null;
  hubId: string | null;
};

function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

function json(res: http.ServerResponse, statusCode: number, payload: unknown) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendError(
  res: http.ServerResponse,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) {
  json(res, statusCode, {
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (!/^\+255\d{9}$/.test(trimmed)) {
    throw new Error("Phone number must be in +255XXXXXXXXX format");
  }
  return trimmed;
}

function assertOrderChannel(value: string) {
  const allowed = ["DOOR", "SHOP_DROP", "HYBRID"];
  if (!allowed.includes(value)) {
    throw new Error("channel must be one of DOOR, SHOP_DROP, HYBRID");
  }
  return value as "DOOR" | "SHOP_DROP" | "HYBRID";
}

function assertOrderTier(value: string) {
  const allowed = ["STANDARD_48H", "EXPRESS_24H", "SAME_DAY"];
  if (!allowed.includes(value)) {
    throw new Error("tier must be one of STANDARD_48H, EXPRESS_24H, SAME_DAY");
  }
  return value as "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY";
}

function nextOrderNumber() {
  return `ORD-${Date.now()}`;
}

function nextBagTagCode() {
  return `BAG-${Date.now()}`;
}
function parseAuthHeader(req: http.IncomingMessage) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}

function getString(row: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string") return value;
  }
  return null;
}

async function readJsonBody(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function signAccessToken(user: { id: string; phone: string; role: Role }) {
  return jwt.sign(
    {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      typ: "access",
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
}

function signRefreshToken(user: { id: string }) {
  return jwt.sign(
    {
      sub: user.id,
      typ: "refresh",
      jti: crypto.randomUUID(),
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL_SECONDS }
  );
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function toUserDto(user: Record<string, unknown>) {
  return {
    id: getString(user, "id"),
    phone: getString(user, "phone"),
    email: getString(user, "email"),
    fullName: getString(user, "fullName", "fullname"),
    role: getString(user, "role"),
    status: getString(user, "status"),
  };
}

async function issueTokens(
  user: { id: string; phone: string; role: Role },
  req: http.IncomingMessage
) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken({ id: user.id });

  await pool.query(
    `
    INSERT INTO "RefreshToken" ("id", "userId", "tokenHash", "createdAt", "expiresAt", "revokedAt", "replacedByTokenId", "userAgent", "ipAddress")
    VALUES ($1, $2, $3, NOW(), $4, NULL, NULL, $5, $6)
    `,
    [
      crypto.randomUUID(),
      user.id,
      hashToken(refreshToken),
      new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
      req.headers["user-agent"]?.toString() ?? null,
      req.socket.remoteAddress ?? null,
    ]
  );

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenExpiresInSeconds: REFRESH_TOKEN_TTL_SECONDS,
  };
}

async function authenticate(req: http.IncomingMessage): Promise<AuthenticatedUser | null> {
  const token = parseAuthHeader(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    if (
      payload.typ !== "access" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    const result = await pool.query(
      `
      SELECT "id", "phone", "email", "fullName", "role", "status"
      FROM public."User"
      WHERE "id" = $1
      LIMIT 1
      `,
      [payload.sub]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as Record<string, unknown>;
    const role = getString(row, "role");
    const status = getString(row, "status");
    const fullName = getString(row, "fullName", "fullname");
    const phone = getString(row, "phone");

    if (!role || !status || !fullName || !phone) return null;
    if (status !== "ACTIVE") return null;
    if (role !== payload.role) return null;

    return {
      id: getString(row, "id") ?? "",
      phone,
      email: getString(row, "email"),
      fullName,
      role: role as Role,
      status,
    };
  } catch {
    return null;
  }
}

async function requireAuth(req: http.IncomingMessage, res: http.ServerResponse) {
  const user = await authenticate(req);
  if (!user) {
    sendError(res, 401, "UNAUTHORIZED", "Bearer access token is required");
    return null;
  }
  return user;
}

function hasAnyRole(user: AuthenticatedUser, roles: Role[]) {
  return roles.includes(user.role);
}

function requireRoles(
  user: AuthenticatedUser,
  res: http.ServerResponse,
  roles: Role[],
  action = "perform this action"
) {
  if (!hasAnyRole(user, roles)) {
    sendError(res, 403, "FORBIDDEN", `Role ${user.role} is not allowed to ${action}`);
    return false;
  }
  return true;
}

async function resolveScope(user: AuthenticatedUser): Promise<ScopeContext> {
  const scope: ScopeContext = {
    userId: user.id,
    role: user.role,
    affiliateShopId: null,
    driverId: null,
    hubId: null,
  };

  if (user.role === "AFFILIATE_STAFF") {
    const result = await pool.query(
      `
      SELECT "affiliateShopId"
      FROM "AffiliateStaffProfile"
      WHERE "userId" = $1 AND "isActive" = TRUE
      LIMIT 1
      `,
      [user.id]
    );
    scope.affiliateShopId = getString(result.rows[0] ?? {}, "affiliateShopId", "affiliateshopid");
  }

  if (user.role === "DRIVER") {
    const result = await pool.query(
      `
      SELECT "id"
      FROM "DriverProfile"
      WHERE "userId" = $1 AND "isActive" = TRUE
      LIMIT 1
      `,
      [user.id]
    );
    scope.driverId = getString(result.rows[0] ?? {}, "id");
  }

  if (user.role === "HUB_STAFF") {
    const result = await pool.query(
      `
      SELECT "hubId"
      FROM "HubStaffProfile"
      WHERE "userId" = $1 AND "isActive" = TRUE
      LIMIT 1
      `,
      [user.id]
    );
    scope.hubId = getString(result.rows[0] ?? {}, "hubId", "hubid");
  }

  return scope;
}

function getRequestMeta(req: http.IncomingMessage) {
  return {
    ipAddress: req.socket.remoteAddress ?? null,
    userAgent: req.headers["user-agent"]?.toString() ?? null,
  };
}

async function recordAudit(input: {
  actorUserId?: string | null;
  actorRole?: string | null;
  actionCode: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  before?: unknown;
  after?: unknown;
  requestMeta?: {
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}) {
  await pool.query(
    `
    INSERT INTO "AuditLog" (
      "id",
      "actorUserId",
      "actorRole",
      "actionCode",
      "targetType",
      "targetId",
      "reason",
      "beforeJson",
      "afterJson",
      "ipAddress",
      "userAgent",
      "occurredAt"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11, NOW())
    `,
    [
      crypto.randomUUID(),
      input.actorUserId ?? null,
      input.actorRole ?? null,
      input.actionCode,
      input.targetType,
      input.targetId,
      input.reason ?? null,
      input.before === undefined ? null : JSON.stringify(input.before),
      input.after === undefined ? null : JSON.stringify(input.after),
      input.requestMeta?.ipAddress ?? null,
      input.requestMeta?.userAgent ?? null,
    ]
  );
}

async function fetchOrderById(orderId: string) {
  const result = await pool.query(
    `
    SELECT
      o."id",
      o."orderNumber",
      o."sourceType",
      o."affiliateShopId",
      o."channel",
      o."customerName",
      o."customerPhone",
      o."notes",
      o."createdAt",
      o."updatedAt",
      o."customerUserId",
      o."tier",
      o."zoneId",
      o."hubId",
      o."pickupAddressId",
      o."dropoffAddressId",
      o."statusCurrent"
    FROM "Order" o
    WHERE o."id" = $1
    LIMIT 1
    `,
    [orderId]
  );

  return result.rows[0] ?? null;
}

async function fetchTripById(tripId: string) {
  const result = await pool.query(
    `
    SELECT
      t."id",
      t."type",
      t."zoneId",
      t."hubId",
      t."driverId",
      t."status",
      t."scheduledFor",
      t."startedAt",
      t."completedAt",
      t."createdAt",
      t."updatedAt"
    FROM "Trip" t
    WHERE t."id" = $1
    LIMIT 1
    `,
    [tripId]
  );

  return result.rows[0] ?? null;
}

async function canReadOrder(user: AuthenticatedUser, scope: ScopeContext, orderId: string) {
  const order = await fetchOrderById(orderId);
  if (!order) {
    return { order: null, allowed: false, reason: "NOT_FOUND" as const };
  }

  if (user.role === "ADMIN" || user.role === "DEV_ADMIN") {
    return { order, allowed: true, reason: "ALLOWED" as const };
  }

  const affiliateShopId = getString(order, "affiliateShopId", "affiliateshopid");
  const customerUserId = getString(order, "customerUserId", "customeruserid");
  const hubId = getString(order, "hubId", "hubid");

  if (user.role === "CUSTOMER") {
    return { order, allowed: customerUserId === user.id, reason: "SCOPED" as const };
  }

  if (user.role === "AFFILIATE_STAFF") {
    return {
      order,
      allowed: !!scope.affiliateShopId && affiliateShopId === scope.affiliateShopId,
      reason: "SCOPED" as const,
    };
  }

  if (user.role === "HUB_STAFF") {
    return { order, allowed: !!scope.hubId && hubId === scope.hubId, reason: "SCOPED" as const };
  }

  if (user.role === "DRIVER") {
    const stopResult = await pool.query(
      `
      SELECT ts."id"
      FROM "TripStop" ts
      INNER JOIN "Trip" t ON t."id" = ts."tripId"
      WHERE ts."orderId" = $1
        AND t."driverId" = $2
      LIMIT 1
      `,
      [orderId, scope.driverId]
    );

    return { order, allowed: stopResult.rows.length > 0, reason: "SCOPED" as const };
  }

  return { order, allowed: false, reason: "SCOPED" as const };
}

async function canReadTrip(user: AuthenticatedUser, scope: ScopeContext, tripId: string) {
  const trip = await fetchTripById(tripId);
  if (!trip) {
    return { trip: null, allowed: false, reason: "NOT_FOUND" as const };
  }

  if (user.role === "ADMIN" || user.role === "DEV_ADMIN") {
    return { trip, allowed: true, reason: "ALLOWED" as const };
  }

  if (user.role === "DRIVER") {
    return {
      trip,
      allowed: !!scope.driverId && getString(trip, "driverId", "driverid") === scope.driverId,
      reason: "SCOPED" as const,
    };
  }

  return { trip, allowed: false, reason: "SCOPED" as const };
}

function pathParam(pathname: string, expression: RegExp) {
  const match = pathname.match(expression);
  return match ? match[1] : null;
}

const server = http.createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (method === "OPTIONS") {
      setCorsHeaders(res);
      res.writeHead(204);
      return res.end();
    }

    if (method === "GET" && url.pathname === "/health") {
      console.log("[login] tokens issued");

      return json(res, 200, { ok: true });
    }

    if (method === "GET" && url.pathname === "/v1/health") {
      try {
        await pool.query("SELECT 1");
        console.log("[login] tokens issued");

        return json(res, 200, {
          status: "ok",
          version: APP_VERSION,
          timestamp: new Date().toISOString(),
          environment: ENVIRONMENT,
          db: "ok",
        });
      } catch {
        console.log("[login] tokens issued");

        return json(res, 200, {
          status: "ok",
          version: APP_VERSION,
          timestamp: new Date().toISOString(),
          environment: ENVIRONMENT,
          db: "down",
        });
      }
    }

    if (method === "GET" && url.pathname === "/v1/health/db") {
      try {
        await pool.query("SELECT 1 AS result");
        console.log("[login] tokens issued");

        return json(res, 200, {
          status: "ok",
          db: "ok",
          timestamp: new Date().toISOString(),
          check: "SELECT 1",
        });
      } catch (error) {
        return sendError(
          res,
          500,
          "DB_DOWN",
          error instanceof Error ? error.message : "Database check failed"
        );
      }
    }

    if (method === "GET" && url.pathname === "/api") {
      setCorsHeaders(res);
      res.writeHead(302, { location: "/api/" });
      return res.end();
    }

    if (method === "GET" && url.pathname === "/api/openapi.json") {
      console.log("[login] tokens issued");

      return json(res, 200, {
        openapi: "3.1.0",
        info: { title: "Mimo API", version: "v1" },
        paths: {
          "/health": {
            get: {
              summary: "Health check",
              responses: {
                200: {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          ok: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "/v1/health": {
            get: {
              summary: "App health",
              responses: {
                200: {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          status: { type: "string", example: "ok" },
                          version: { type: "string", example: "0.0.1" },
                          timestamp: { type: "string", format: "date-time" },
                          environment: { type: "string", example: "local" },
                          db: { type: "string", enum: ["ok", "down"] },
                        },
                        required: ["status", "version", "timestamp", "environment", "db"],
                      },
                    },
                  },
                },
              },
            },
          },
          "/v1/health/db": {
            get: {
              summary: "Database health",
              responses: {
                200: {
                  description: "DB OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          status: { type: "string", example: "ok" },
                          db: { type: "string", example: "ok" },
                          timestamp: { type: "string", format: "date-time" },
                          check: { type: "string", example: "SELECT 1" },
                        },
                        required: ["status", "db", "timestamp", "check"],
                      },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/register": {
            post: {
              summary: "Register customer",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RegisterRequest" },
                  },
                },
              },
              responses: {
                201: {
                  description: "Created",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AuthResponse" },
                    },
                  },
                },
                400: {
                  description: "Validation error",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/StandardError" },
                    },
                  },
                },
                409: {
                  description: "Conflict",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/StandardError" },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/login": {
            post: {
              summary: "Login",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginRequest" },
                  },
                },
              },
              responses: {
                200: {
                  description: "Authenticated",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AuthResponse" },
                    },
                  },
                },
                401: {
                  description: "Invalid credentials",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/StandardError" },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/refresh": {
            post: {
              summary: "Refresh token",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RefreshRequest" },
                  },
                },
              },
              responses: {
                200: {
                  description: "Refreshed",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AuthResponse" },
                    },
                  },
                },
              },
            },
          },
          "/v1/auth/logout": {
            post: {
              summary: "Logout",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RefreshRequest" },
                  },
                },
              },
              responses: {
                200: {
                  description: "Logged out",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              loggedOut: { type: "boolean", example: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            LoginRequest: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+255712345678" },
                password: { type: "string", example: "secret123" },
              },
              required: ["phone", "password"],
            },
            RegisterRequest: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+255712345678" },
                fullName: { type: "string", example: "Walking Skeleton Customer" },
                email: {
                  type: "string",
                  format: "email",
                  nullable: true,
                  example: "customer@mimo.local",
                },
                password: { type: "string", example: "secret123" },
              },
              required: ["phone", "fullName", "password"],
            },
            RefreshRequest: {
              type: "object",
              properties: {
                refreshToken: { type: "string", example: "refresh-token" },
              },
              required: ["refreshToken"],
            },
            AuthUser: {
              type: "object",
              properties: {
                id: { type: "string" },
                phone: { type: "string" },
                email: { type: "string", nullable: true },
                fullName: { type: "string" },
                role: { type: "string" },
                status: { type: "string" },
              },
              required: ["id", "phone", "fullName", "role", "status"],
            },
            AuthTokens: {
              type: "object",
              properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
                accessTokenExpiresInSeconds: { type: "number" },
                refreshTokenExpiresInSeconds: { type: "number" },
              },
              required: [
                "accessToken",
                "refreshToken",
                "accessTokenExpiresInSeconds",
                "refreshTokenExpiresInSeconds",
              ],
            },
            AuthResponse: {
              type: "object",
              properties: {
                data: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/AuthUser" },
                    tokens: { $ref: "#/components/schemas/AuthTokens" },
                  },
                  required: ["user", "tokens"],
                },
              },
              required: ["data"],
            },
            StandardError: {
              type: "object",
              properties: {
                error: {
                  type: "object",
                  properties: {
                    code: { type: "string" },
                    message: { type: "string" },
                  },
                  required: ["code", "message"],
                },
              },
              required: ["error"],
            },
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/auth/register") {
      const body = await readJsonBody(req);
      const phone = normalizePhone(String(body.phone ?? ""));
      const fullName = String(body.fullName ?? "").trim();
      const password = String(body.password ?? "");
      const email = body.email ? String(body.email).trim() : null;

      if (!fullName || password.length < 6) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "fullName is required and password must be at least 6 characters"
        );
      }

      const existing = await pool.query(
        `
        SELECT "id"
        FROM public."User"
        WHERE "phone" = $1 OR ($2::text IS NOT NULL AND "email" = $2)
        LIMIT 1
        `,
        [phone, email]
      );

      if (existing.rows.length > 0) {
        return sendError(
          res,
          409,
          "IDENTITY_ALREADY_EXISTS",
          "A user with that phone or email already exists"
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = crypto.randomUUID();

      const created = await pool.query(
        `
        INSERT INTO public."User" ("id", "email", "phone", "fullName", "passwordHash", "role", "status", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, 'CUSTOMER', 'ACTIVE', NOW(), NOW())
        RETURNING "id", "phone", "email", "fullName", "role", "status"
        `,
        [id, email, phone, fullName, passwordHash]
      );

      return json(res, 201, { data: { user: created.rows[0] } });
    }

    if (method === "POST" && url.pathname === "/v1/auth/login") {
      try {
        const body = await readJsonBody(req);
        const phone = normalizePhone(String(body.phone ?? ""));
        const password = String(body.password ?? "");

        let result;
        try {
          result = await pool.query(
            `
            SELECT "id", "phone", "email", "fullName", "passwordHash", "role", "status"
            FROM public."User"
            ORDER BY "createdAt" ASC
            `
          );
        } catch (error) {
          return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_USER_QUERY_FAILED", {
            stage: "user_query",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        const user = result.rows.find((row) => getString(row, "phone") === phone) ?? null;

        if (!user) {
          return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid phone or password");
        }

        if (getString(user, "status") !== "ACTIVE") {
          return sendError(res, 403, "ACCOUNT_DISABLED", "User account is disabled");
        }

        let ok = false;
        try {
          ok = await bcrypt.compare(
            password,
            getString(user, "passwordhash", "passwordHash") ?? ""
          );
        } catch (error) {
          return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_PASSWORD_COMPARE_FAILED", {
            stage: "password_compare",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        if (!ok) {
          return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid phone or password");
        }

        let tokens;
        try {
          tokens = await issueTokens(
            {
              id: getString(user, "id") ?? "",
              phone: getString(user, "phone") ?? "",
              role: (getString(user, "role") ?? "CUSTOMER") as Role,
            },
            req
          );
        } catch (error) {
          return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_ISSUE_TOKENS_FAILED", {
            stage: "issue_tokens",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        return json(res, 200, {
          data: {
            user: {
              id: getString(user, "id"),
              phone: getString(user, "phone"),
              email: getString(user, "email"),
              fullName: getString(user, "fullName", "fullname"),
              role: getString(user, "role"),
              status: getString(user, "status"),
            },
            tokens,
          },
        });
      } catch (error) {
        return sendError(res, 500, "LOGIN_STAGE_FAILED", "LOGIN_TOP_LEVEL_FAILED", {
          stage: "top_level",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    if (method === "POST" && url.pathname === "/v1/auth/refresh") {
      const body = await readJsonBody(req);
      const refreshToken = String(body.refreshToken ?? "");

      if (!refreshToken) {
        return sendError(res, 400, "VALIDATION_ERROR", "refreshToken is required");
      }

      let payload: jwt.JwtPayload;
      try {
        payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
      } catch {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
      }

      if (payload.typ !== "refresh" || typeof payload.sub !== "string") {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid");
      }

      const tokenHash = hashToken(refreshToken);

      const existingResult = await pool.query(
        `
        SELECT "id", "userId", "expiresAt", "revokedAt"
        FROM "RefreshToken"
        WHERE "tokenHash" = $1
        LIMIT 1
        `,
        [tokenHash]
      );

      if (existingResult.rows.length === 0) {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "Refresh token was not recognized");
      }

      const existing = existingResult.rows[0];

      if (existing.revokedAt) {
        return sendError(res, 401, "REFRESH_TOKEN_REVOKED", "Refresh token has been revoked");
      }

      if (new Date(existing.expiresAt).getTime() <= Date.now()) {
        return sendError(res, 401, "REFRESH_TOKEN_EXPIRED", "Refresh token has expired");
      }

      const userResult = await pool.query(
        `
        SELECT "id", "phone", "email", "fullName", "role", "status"
        FROM public."User"
        WHERE "id" = $1
        LIMIT 1
        `,
        [payload.sub]
      );

      if (userResult.rows.length === 0 || getString(userResult.rows[0], "status") !== "ACTIVE") {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "User is not active");
      }

      const user = userResult.rows[0];
      const newRefreshToken = signRefreshToken({ id: getString(user, "id") ?? "" });
      const replacementId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "RefreshToken" ("id", "userId", "tokenHash", "createdAt", "expiresAt", "revokedAt", "replacedByTokenId", "userAgent", "ipAddress")
        VALUES ($1, $2, $3, NOW(), $4, NULL, NULL, $5, $6)
        `,
        [
          replacementId,
          getString(user, "id"),
          hashToken(newRefreshToken),
          new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
          req.headers["user-agent"]?.toString() ?? null,
          req.socket.remoteAddress ?? null,
        ]
      );

      await pool.query(
        `
        UPDATE "RefreshToken"
        SET "revokedAt" = NOW(), "replacedByTokenId" = $2
        WHERE "id" = $1
        `,
        [existing.id, replacementId]
      );

      const accessToken = signAccessToken({
        id: getString(user, "id") ?? "",
        phone: getString(user, "phone") ?? "",
        role: (getString(user, "role") ?? "CUSTOMER") as Role,
      });

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          user: {
            id: getString(user, "id"),
            phone: getString(user, "phone"),
            email: getString(user, "email"),
            fullName: getString(user, "fullName", "fullname"),
            role: getString(user, "role"),
            status: getString(user, "status"),
          },
          tokens: {
            accessToken,
            refreshToken: newRefreshToken,
            accessTokenExpiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
            refreshTokenExpiresInSeconds: REFRESH_TOKEN_TTL_SECONDS,
          },
        },
      });
    }

    if (method === "POST" && url.pathname === "/v1/orders") {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role !== "CUSTOMER") {
        return sendError(res, 403, "FORBIDDEN", "Only customers can create customer orders");
      }

      const body = await readJsonBody(req);

      let channel: "DOOR" | "SHOP_DROP" | "HYBRID";
      let tier: "STANDARD_48H" | "EXPRESS_24H" | "SAME_DAY";

      try {
        channel = assertOrderChannel(String(body.channel ?? "").trim());
        tier = assertOrderTier(String(body.tier ?? "").trim());
      } catch (error) {
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          error instanceof Error ? error.message : "Invalid order input"
        );
      }

      const affiliateShopId =
        body.affiliateShopId === null || body.affiliateShopId === undefined
          ? null
          : String(body.affiliateShopId).trim() || null;

      const pickupAddressId =
        body.pickupAddressId === null || body.pickupAddressId === undefined
          ? null
          : String(body.pickupAddressId).trim() || null;

      const dropoffAddressId =
        body.dropoffAddressId === null || body.dropoffAddressId === undefined
          ? null
          : String(body.dropoffAddressId).trim() || null;

      if (channel === "DOOR") {
        if (!pickupAddressId) {
          return sendError(res, 400, "VALIDATION_ERROR", "pickupAddressId is required for DOOR");
        }
        if (affiliateShopId) {
          return sendError(res, 400, "VALIDATION_ERROR", "affiliateShopId must be null for DOOR");
        }
      }

      if (channel === "SHOP_DROP") {
        if (!affiliateShopId) {
          return sendError(
            res,
            400,
            "VALIDATION_ERROR",
            "affiliateShopId is required for SHOP_DROP"
          );
        }
      }

      if (channel === "HYBRID") {
        if (!affiliateShopId) {
          return sendError(res, 400, "VALIDATION_ERROR", "affiliateShopId is required for HYBRID");
        }
        if (!dropoffAddressId) {
          return sendError(res, 400, "VALIDATION_ERROR", "dropoffAddressId is required for HYBRID");
        }
      }

      const userResult = await pool.query(
        `
        SELECT "id", "phone", "fullName", "status"
        FROM public."User"
        WHERE "id" = $1
        LIMIT 1
        `,
        [authUser.id]
      );

      if (userResult.rows.length === 0) {
        return sendError(res, 404, "USER_NOT_FOUND", "Customer user was not found");
      }

      const customerUser = userResult.rows[0];

      let zoneId: string | null = null;
      let resolvedPickupAddressId: string | null = pickupAddressId;
      let resolvedDropoffAddressId: string | null = dropoffAddressId;
      let sourceType: "DIRECT" | "AFFILIATE" = "DIRECT";

      if (channel === "DOOR") {
        const addressResult = await pool.query(
          `
          SELECT "id", "zoneId", "userId"
          FROM "CustomerAddress"
          WHERE "id" = $1
          LIMIT 1
          `,
          [pickupAddressId]
        );

        if (addressResult.rows.length === 0) {
          return sendError(res, 404, "ADDRESS_NOT_FOUND", "Pickup address was not found");
        }

        const address = addressResult.rows[0];
        if (getString(address, "userId", "userid") !== authUser.id) {
          return sendError(res, 403, "FORBIDDEN", "Pickup address does not belong to customer");
        }

        zoneId = getString(address, "zoneId", "zoneid");
        resolvedDropoffAddressId = pickupAddressId;
      }

      if (channel === "SHOP_DROP" || channel === "HYBRID") {
        const shopResult = await pool.query(
          `
          SELECT "id", "zoneId"
          FROM "AffiliateShop"
          WHERE "id" = $1
          LIMIT 1
          `,
          [affiliateShopId]
        );

        if (shopResult.rows.length === 0) {
          return sendError(res, 404, "AFFILIATE_SHOP_NOT_FOUND", "Affiliate shop was not found");
        }

        const shop = shopResult.rows[0];
        zoneId = getString(shop, "zoneId", "zoneid");
        sourceType = "AFFILIATE";

        if (channel === "SHOP_DROP") {
          const defaultAddressResult = await pool.query(
            `
            SELECT "id"
            FROM "CustomerAddress"
            WHERE "userId" = $1
            ORDER BY "createdAt" ASC
            LIMIT 1
            `,
            [authUser.id]
          );

          if (defaultAddressResult.rows.length > 0) {
            resolvedPickupAddressId = getString(defaultAddressResult.rows[0], "id");
            resolvedDropoffAddressId = getString(defaultAddressResult.rows[0], "id");
          } else {
            resolvedPickupAddressId = null;
            resolvedDropoffAddressId = null;
          }
        }
      }

      if (channel === "HYBRID") {
        const addressResult = await pool.query(
          `
          SELECT "id", "userId"
          FROM "CustomerAddress"
          WHERE "id" = $1
          LIMIT 1
          `,
          [dropoffAddressId]
        );

        if (addressResult.rows.length === 0) {
          return sendError(res, 404, "ADDRESS_NOT_FOUND", "Dropoff address was not found");
        }

        const address = addressResult.rows[0];
        if (getString(address, "userId", "userid") !== authUser.id) {
          return sendError(res, 403, "FORBIDDEN", "Dropoff address does not belong to customer");
        }

        resolvedDropoffAddressId = getString(address, "id");
      }

      if (!zoneId) {
        return sendError(res, 400, "ZONE_DERIVATION_FAILED", "Could not derive zone for order");
      }

      const hubResult = await pool.query(
        `
        SELECT "id"
        FROM "Hub"
        WHERE "zoneId" = $1
        ORDER BY "createdAt" ASC
        LIMIT 1
        `,
        [zoneId]
      );

      if (hubResult.rows.length === 0) {
        return sendError(res, 400, "HUB_ASSIGNMENT_FAILED", "No hub found for derived zone");
      }

      const hubId = getString(hubResult.rows[0], "id");
      const orderId = crypto.randomUUID();
      const bagId = crypto.randomUUID();
      const eventId = crypto.randomUUID();
      const orderNumber = nextOrderNumber();
      const tagCode = nextBagTagCode();

      await pool.query("BEGIN");

      try {
        await pool.query(
          `
          INSERT INTO "Order" (
            "id", "orderNumber", "sourceType", "affiliateShopId", "channel",
            "customerName", "customerPhone", "notes", "createdAt", "updatedAt",
            "customerUserId", "tier", "zoneId", "hubId", "pickupAddressId",
            "dropoffAddressId", "statusCurrent"
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, NULL, NOW(), NOW(),
            $8, $9, $10, $11, $12,
            $13, 'CREATED'
          )
          `,
          [
            orderId,
            orderNumber,
            sourceType,
            affiliateShopId,
            channel,
            getString(customerUser, "fullName", "fullname"),
            getString(customerUser, "phone"),
            authUser.id,
            tier,
            zoneId,
            hubId,
            resolvedPickupAddressId,
            resolvedDropoffAddressId,
          ]
        );

        await pool.query(
          `
          INSERT INTO "Bag" ("id", "orderId", "tagCode", "bagStatus", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, 'CREATED', NOW(), NOW())
          `,
          [bagId, orderId, tagCode]
        );

        await pool.query(
          `
          INSERT INTO "OrderEvent" (
            "id", "orderId", "eventType", "occurredAt", "actorUserId",
            "actorRole", "notes", "payloadJson", "createdAt"
          )
          VALUES (
            $1, $2, 'ORDER_CREATED', NOW(), $3,
            $4, $5, $6::jsonb, NOW()
          )
          `,
          [
            eventId,
            orderId,
            authUser.id,
            authUser.role,
            "Customer order created",
            JSON.stringify({
              channel,
              tier,
              zoneId,
              hubId,
              affiliateShopId,
              pickupAddressId: resolvedPickupAddressId,
              dropoffAddressId: resolvedDropoffAddressId,
              tagCode,
            }),
          ]
        );

        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return sendError(
          res,
          500,
          "ORDER_CREATE_FAILED",
          error instanceof Error ? error.message : "Order creation failed"
        );
      }

      return json(res, 201, {
        data: {
          order: {
            id: orderId,
            orderNumber,
            statusCurrent: "CREATED",
            createdAt: new Date().toISOString(),
            zoneId,
            hubId,
            bagTagCode: tagCode,
          },
        },
      });
    }
    if (method === "POST" && url.pathname === "/v1/auth/logout") {
      const body = await readJsonBody(req);
      const refreshToken = String(body.refreshToken ?? "");

      if (!refreshToken) {
        return sendError(res, 400, "VALIDATION_ERROR", "refreshToken is required");
      }

      const tokenHash = hashToken(refreshToken);

      const existingResult = await pool.query(
        `
        SELECT "id", "revokedAt"
        FROM "RefreshToken"
        WHERE "tokenHash" = $1
        LIMIT 1
        `,
        [tokenHash]
      );

      if (existingResult.rows.length === 0 || existingResult.rows[0].revokedAt) {
        return sendError(
          res,
          401,
          "INVALID_REFRESH_TOKEN",
          "Refresh token is invalid or already revoked"
        );
      }

      await pool.query(
        `
        UPDATE "RefreshToken"
        SET "revokedAt" = NOW()
        WHERE "id" = $1
        `,
        [existingResult.rows[0].id]
      );

      console.log("[login] tokens issued");

      return json(res, 200, { data: { loggedOut: true } });
    }

    if (method === "GET" && url.pathname === "/v1/auth/me") {
      const user = await requireAuth(req, res);
      if (!user) return;
      console.log("[login] tokens issued");

      return json(res, 200, { data: { user } });
    }

    if (method === "GET" && url.pathname === "/v1/admin/users") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "access admin-only users list")) return;

      const result = await pool.query(
        `
        SELECT "id", "phone", "email", "fullName", "role", "status"
        FROM public."User"
        ORDER BY "createdAt" ASC
        `
      );

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          users: result.rows.map((row) => toUserDto(row)),
        },
      });
    }

    const orderTimelineId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)\/timeline$/);
    if (method === "GET" && orderTimelineId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const scope = await resolveScope(user);
      const decision = await canReadOrder(user, scope, orderTimelineId);

      if (!decision.order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (!decision.allowed) {
        return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this order");
      }

      const eventsResult = await pool.query(
        `
        SELECT
          "id",
          "orderId",
          "eventType",
          "occurredAt",
          "actorUserId",
          "actorRole",
          "notes",
          "payloadJson",
          "createdAt"
        FROM "OrderEvent"
        WHERE "orderId" = $1
        ORDER BY "occurredAt" ASC, "createdAt" ASC
        `,
        [orderTimelineId]
      );

      return json(res, 200, {
        data: {
          order: {
            id: getString(decision.order, "id"),
            orderNumber: getString(decision.order, "orderNumber", "ordernumber"),
            statusCurrent: getString(decision.order, "statusCurrent", "statuscurrent"),
            zoneId: getString(decision.order, "zoneId", "zoneid"),
            hubId: getString(decision.order, "hubId", "hubid"),
          },
          timeline: eventsResult.rows,
        },
      });
    }
    const orderId = pathParam(url.pathname, /^\/v1\/orders\/([^/]+)$/);
    if (method === "GET" && orderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const scope = await resolveScope(user);
      const decision = await canReadOrder(user, scope, orderId);

      if (!decision.order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      if (!decision.allowed) {
        return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this order");
      }

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          order: decision.order,
          scope: {
            role: scope.role,
            affiliateShopId: scope.affiliateShopId,
            driverId: scope.driverId,
            hubId: scope.hubId,
          },
        },
      });
    }

    const tripId = pathParam(url.pathname, /^\/v1\/trips\/([^/]+)$/);
    if (method === "GET" && tripId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const scope = await resolveScope(user);
      const decision = await canReadTrip(user, scope, tripId);

      if (!decision.trip) {
        return sendError(res, 404, "TRIP_NOT_FOUND", "Trip was not found");
      }

      if (!decision.allowed) {
        return sendError(res, 403, "FORBIDDEN", "You are not allowed to access this trip");
      }

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          trip: decision.trip,
          scope: {
            role: scope.role,
            driverId: scope.driverId,
          },
        },
      });
    }

    if (method === "GET" && url.pathname === "/v1/audit-logs") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN", "DEV_ADMIN"], "access audit logs")) return;

      const targetType =
        url.searchParams.get("targetType") ?? url.searchParams.get("targetResourceType");
      const targetId = url.searchParams.get("targetId") ?? url.searchParams.get("targetResourceId");

      let query = `
        SELECT
          "id",
          "actorUserId",
          "actorRole",
          "actionCode",
          "targetType",
          "targetId",
          "reason",
          "beforeJson",
          "afterJson",
          "ipAddress",
          "userAgent",
          "occurredAt"
        FROM "AuditLog"
      `;
      const params: string[] = [];

      if (targetType && targetId) {
        query += ` WHERE "targetType" = $1 AND "targetId" = $2`;
        params.push(targetType, targetId);
      }

      query += ` ORDER BY "occurredAt" DESC`;

      const result = await pool.query(query, params);
      console.log("[login] tokens issued");

      return json(res, 200, { data: { auditLogs: result.rows } });
    }

    if (method === "GET" && url.pathname === "/v1/admin/audit") {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "access admin audit logs")) return;

      const actorUserId = url.searchParams.get("actorUserId");
      const targetType = url.searchParams.get("targetType");
      const targetId = url.searchParams.get("targetId");
      const occurredFrom = url.searchParams.get("occurredFrom");
      const occurredTo = url.searchParams.get("occurredTo");

      let query = `
        SELECT
          "id",
          "actorUserId",
          "actorRole",
          "actionCode",
          "targetType",
          "targetId",
          "reason",
          "beforeJson",
          "afterJson",
          "ipAddress",
          "userAgent",
          "occurredAt"
        FROM "AuditLog"
      `;

      const conditions: string[] = [];
      const params: string[] = [];

      if (actorUserId) {
        params.push(actorUserId);
        conditions.push(`"actorUserId" = $${params.length}`);
      }

      if (targetType) {
        params.push(targetType);
        conditions.push(`"targetType" = $${params.length}`);
      }

      if (targetId) {
        params.push(targetId);
        conditions.push(`"targetId" = $${params.length}`);
      }

      if (occurredFrom) {
        params.push(occurredFrom);
        conditions.push(`"occurredAt" >= $${params.length}::timestamptz`);
      }

      if (occurredTo) {
        params.push(occurredTo);
        conditions.push(`"occurredAt" <= $${params.length}::timestamptz`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }

      query += ` ORDER BY "occurredAt" DESC`;

      const result = await pool.query(query, params);
      console.log("[login] tokens issued");

      return json(res, 200, { data: { auditLogs: result.rows } });
    }

    const auditLogId = pathParam(url.pathname, /^\/v1\/admin\/audit\/([^/]+)$/);
    if (method === "GET" && auditLogId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["ADMIN"], "access admin audit log detail")) return;

      const result = await pool.query(
        `
        SELECT
          "id",
          "actorUserId",
          "actorRole",
          "actionCode",
          "targetType",
          "targetId",
          "reason",
          "beforeJson",
          "afterJson",
          "ipAddress",
          "userAgent",
          "occurredAt"
        FROM "AuditLog"
        WHERE "id" = $1
        LIMIT 1
        `,
        [auditLogId]
      );

      if (result.rows.length === 0) {
        return sendError(res, 404, "AUDIT_LOG_NOT_FOUND", "Audit log was not found");
      }

      console.log("[login] tokens issued");

      return json(res, 200, { data: { auditLog: result.rows[0] } });
    }

    const assignHubOrderId = pathParam(
      url.pathname,
      /^\/v1\/dev\/override\/orders\/([^/]+)\/assign-hub$/
    );
    if (method === "POST" && assignHubOrderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DEV_ADMIN"], "use DevAdmin override assign-hub")) return;

      const body = await readJsonBody(req);
      const hubId = String(body.hubId ?? "").trim();
      const reason = String(body.reason ?? "").trim();

      if (!hubId || !reason) {
        return sendError(res, 400, "VALIDATION_ERROR", "hubId and reason are required");
      }

      const order = await fetchOrderById(assignHubOrderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const hubCheck = await pool.query(`SELECT "id" FROM "Hub" WHERE "id" = $1 LIMIT 1`, [hubId]);
      if (hubCheck.rows.length === 0) {
        return sendError(res, 404, "HUB_NOT_FOUND", "Hub was not found");
      }

      const beforeHubId = getString(order, "hubId", "hubid");

      await pool.query(
        `
        UPDATE "Order"
        SET "hubId" = $2, "updatedAt" = NOW()
        WHERE "id" = $1
        `,
        [assignHubOrderId, hubId]
      );

      await recordAudit({
        actorUserId: user.id,
        actorRole: user.role,
        actionCode: "DEV_OVERRIDE_ASSIGN_HUB",
        targetType: "ORDER",
        targetId: assignHubOrderId,
        reason,
        before: { hubId: beforeHubId },
        after: { hubId },
        requestMeta: getRequestMeta(req),
      });

      const updatedOrder = await fetchOrderById(assignHubOrderId);

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          order: updatedOrder,
          override: {
            actionCode: "DEV_OVERRIDE_ASSIGN_HUB",
            reason,
          },
        },
      });
    }

    const appendEventOrderId = pathParam(
      url.pathname,
      /^\/v1\/dev\/override\/orders\/([^/]+)\/append-event$/
    );
    if (method === "POST" && appendEventOrderId) {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!requireRoles(user, res, ["DEV_ADMIN"], "use DevAdmin override append-event")) return;

      const body = await readJsonBody(req);
      const eventType = String(body.eventType ?? "").trim();
      const notes = String(body.notes ?? "").trim();
      const reason = String(body.reason ?? "").trim();

      if (!eventType || !reason) {
        return sendError(res, 400, "VALIDATION_ERROR", "eventType and reason are required");
      }

      const validEventTypes = new Set([
        "ORDER_CREATED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "RECEIVED_AT_HUB",
        "WASHING_STARTED",
        "DRYING_STARTED",
        "IRONING_STARTED",
        "PACKED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "PAYMENT_DUE",
        "PAID",
        "ISSUE_OPENED",
        "ISSUE_UPDATED",
        "ISSUE_RESOLVED",
      ]);

      if (!validEventTypes.has(eventType)) {
        return sendError(res, 400, "VALIDATION_ERROR", "eventType is not supported");
      }

      const order = await fetchOrderById(appendEventOrderId);
      if (!order) {
        return sendError(res, 404, "ORDER_NOT_FOUND", "Order was not found");
      }

      const eventId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "OrderEvent" (
          "id", "orderId", "eventType", "occurredAt", "actorUserId", "actorRole", "notes", "payloadJson", "createdAt"
        )
        VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7::jsonb, NOW())
        `,
        [
          eventId,
          appendEventOrderId,
          eventType,
          user.id,
          user.role,
          notes || null,
          JSON.stringify({ source: "dev_override", reason }),
        ]
      );

      await recordAudit({
        actorUserId: user.id,
        actorRole: user.role,
        actionCode: "DEV_OVERRIDE_APPEND_EVENT",
        targetType: "ORDER",
        targetId: appendEventOrderId,
        reason,
        before: { appendedEvent: null },
        after: { appendedEvent: { id: eventId, eventType, notes: notes || null } },
        requestMeta: getRequestMeta(req),
      });

      console.log("[login] tokens issued");

      return json(res, 200, {
        data: {
          appendedEvent: {
            id: eventId,
            orderId: appendEventOrderId,
            eventType,
            notes: notes || null,
          },
          override: {
            actionCode: "DEV_OVERRIDE_APPEND_EVENT",
            reason,
          },
        },
      });
    }

    return sendError(res, 404, "NOT_FOUND", "Route not found");
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

server.listen(PORT, () => {
  console.log(`Mimo API running on http://localhost:${PORT}`);
  console.log(`Swagger UI running on http://localhost:${PORT}/api`);
  console.log(`OpenAPI JSON on http://localhost:${PORT}/api/openapi.json`);
});
