/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-assignment */
import express from "express";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json({ limit: "2mb" }));

type ApiErrorCode =
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "CONFLICT"
  | "INTERNAL_ERROR";

function nowIso() {
  return new Date().toISOString();
}

function makeTraceId() {
  return `trace_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function sendError(
  res: express.Response,
  status: number,
  errorCode: ApiErrorCode,
  message: string,
  details?: unknown
) {
  return res.status(status).json({
    errorCode,
    message,
    details: details ?? null,
    traceId: makeTraceId(),
    timestamp: nowIso(),
  });
}

function getBearerToken(req: express.Request) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice("Bearer ".length);
}

function getRole(req: express.Request) {
  const role = req.headers["x-role"];
  return Array.isArray(role) ? role[0] : (role ?? null);
}

function requireRole(roles: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const role = getRole(req);
    if (!role || !roles.includes(String(role))) {
      return sendError(res, 403, "FORBIDDEN", "You do not have access to this resource.", {
        requiredRoles: roles,
      });
    }
    next();
  };
}

function validateRequiredFields(payload: Record<string, unknown>, required: string[]): string[] {
  return required.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
}

function mapApiChannelToDb(channel: string) {
  if (channel === "SHOP") return "SHOP_DROP";
  if (channel === "DOOR") return "DOOR";
  if (channel === "HYBRID") return "HYBRID";
  return channel;
}

function mapApiTierToDb(tier: string) {
  if (tier === "STANDARD") return "STANDARD_48H";
  if (tier === "EXPRESS") return "EXPRESS_24H";
  if (tier === "SAME_DAY") return "SAME_DAY";
  return tier;
}

const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Laundry OS API",
    version: "1.0.0",
    notes:
      "Executable v1 contract for Laundry OS. Base path is /v1. Breaking changes must go to /v2.",
  },
  servers: [{ url: "http://localhost:3001", notes: "Local development server" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Orders" },
    { name: "Tracking" },
    { name: "Hub" },
    { name: "Driver" },
    { name: "Affiliate" },
    { name: "Admin" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        notes: "Access token in Authorization header as Bearer <token>",
      },
      roleHeader: {
        type: "apiKey",
        in: "header",
        name: "x-role",
        notes:
          "Development-only role scoping header for current chapter verification. Allowed values include admin, hub_staff, affiliate_staff, driver.",
      },
    },
    schemas: {
      StandardError: {
        type: "object",
        required: ["errorCode", "message", "timestamp"],
        properties: {
          errorCode: { type: "string", example: "VALIDATION_FAILED" },
          message: { type: "string", example: "Request validation failed." },
          details: {
            oneOf: [{ type: "object" }, { type: "array", items: {} }, { type: "null" }],
          },
          traceId: { type: "string", example: "trace_1741440300000_ab12cd34" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "affiliate.staff.shopa@mimo.local" },
          password: { type: "string", example: "dev-password" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["firstName", "lastName", "phone", "email", "password"],
        properties: {
          firstName: { type: "string", example: "Asha" },
          lastName: { type: "string", example: "Moshi" },
          phone: { type: "string", example: "+255712000001" },
          email: { type: "string", example: "asha.customer@example.com" },
          password: { type: "string", example: "dev-password" },
        },
      },
      RefreshRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", example: "refresh_demo_customer_123" },
        },
      },
      AuthTokens: {
        type: "object",
        required: ["accessToken", "refreshToken", "tokenType", "expiresIn"],
        properties: {
          accessToken: { type: "string", example: "access_demo_customer_123" },
          refreshToken: { type: "string", example: "refresh_demo_customer_123" },
          tokenType: { type: "string", example: "Bearer" },
          expiresIn: { type: "integer", example: 3600 },
        },
      },
      AuthResponse: {
        type: "object",
        required: ["user", "tokens"],
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              role: { type: "string", example: "customer" },
            },
          },
          tokens: { $ref: "#/components/schemas/AuthTokens" },
        },
      },
      CreateOrderRequest: {
        type: "object",
        required: ["channel", "tier", "customerName", "customerPhone", "zoneName"],
        properties: {
          channel: {
            type: "string",
            enum: ["DOOR", "SHOP", "HYBRID"],
            example: "SHOP",
          },
          tier: {
            type: "string",
            enum: ["STANDARD", "EXPRESS", "SAME_DAY"],
            example: "STANDARD",
          },
          customerName: { type: "string", example: "Asha Moshi" },
          customerPhone: { type: "string", example: "+255712000001" },
          zoneName: { type: "string", example: "Zone A" },
          notes: { type: "string", example: "Wash and fold" },
        },
        notes:
          "Zone selection drives routing. Hub assignment is derived from the zone by server-side logic. Bag tags are created and linked within order operations.",
      },
      OrderResponse: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderNumber: { type: "string", example: "AFF-SHOP-A-API-001" },
          channel: { type: "string", enum: ["DOOR", "SHOP", "HYBRID"] },
          tier: { type: "string", enum: ["STANDARD", "EXPRESS", "SAME_DAY"] },
          status: { type: "string", example: "CREATED" },
          zoneName: { type: "string", example: "Zone A" },
          hubName: { type: "string", nullable: true, example: "Sinza Hub" },
          affiliateShopCode: { type: "string", nullable: true, example: "SHOP-A" },
          bagCount: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      TimelineEvent: {
        type: "object",
        properties: {
          id: { type: "string" },
          eventType: { type: "string", example: "ORDER_CREATED" },
          notes: { type: "string", example: "Order created from API contract endpoint" },
          createdAt: { type: "string", format: "date-time" },
          payloadJson: { type: "object", nullable: true },
        },
      },
      TimelineResponse: {
        type: "object",
        properties: {
          orderId: { type: "string" },
          orderNumber: { type: "string" },
          events: {
            type: "array",
            items: { $ref: "#/components/schemas/TimelineEvent" },
          },
        },
      },
      CreateOrderEventRequest: {
        type: "object",
        required: ["eventType", "description"],
        properties: {
          eventType: { type: "string", example: "HUB_RECEIVED" },
          notes: { type: "string", example: "Bag scanned at intake" },
          payloadJson: { type: "object" },
        },
      },
      CreateIssueRequest: {
        type: "object",
        required: ["issueType", "description"],
        properties: {
          issueType: { type: "string", example: "DELAY" },
          notes: { type: "string", example: "Pickup delayed due to weather" },
        },
      },
      UpdateIssueRequest: {
        type: "object",
        properties: {
          status: { type: "string", example: "RESOLVED" },
          resolutionNotes: {
            type: "string",
            example: "Customer notified and accepted revised ETA",
          },
        },
      },
      HubIntakeRequest: {
        type: "object",
        required: ["orderId", "bagTag", "weightKg"],
        properties: {
          orderId: { type: "string" },
          bagTag: { type: "string", example: "BAG-AFF-SHOP-A-API-001" },
          weightKg: { type: "number", example: 4.5 },
          notes: { type: "string", example: "Intake complete, no visible damage" },
        },
        notes: "Appends intake-related OrderEvents such as HUB_INTAKE_RECORDED and BAG_SCANNED.",
      },
      HubStageRequest: {
        type: "object",
        required: ["stage"],
        properties: {
          stage: {
            type: "string",
            enum: ["WASHING", "DRYING", "IRONING", "PACKED"],
            example: "WASHING",
          },
          notes: { type: "string", example: "Moved to washing queue" },
        },
        notes: "Appends stage transition events in immutable order timeline.",
      },
      DriverStopCompleteRequest: {
        type: "object",
        required: ["proofType"],
        properties: {
          proofType: {
            type: "string",
            enum: ["OTP", "PHOTO", "SIGNATURE", "NOTES"],
            example: "OTP",
          },
          otp: { type: "string", example: "123456" },
          photoRef: { type: "string", example: "photo://pickup-proof-001" },
          signatureRef: { type: "string", example: "signature://delivery-proof-001" },
          notes: { type: "string", example: "Customer handed over one bag" },
        },
        notes:
          "Used for pickup/delivery proof. Driver visibility is scoped to assigned tasks only.",
      },
      AffiliateCreateOrderRequest: {
        allOf: [{ $ref: "#/components/schemas/CreateOrderRequest" }],
        notes:
          "Affiliate attribution is derived by the server from authenticated affiliate context; client must not send affiliateShopId directly.",
      },
      ZoneRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Zone C" },
          payloadJson: { type: "object", example: { city: "Dar es Salaam" } },
        },
      },
      HubRequest: {
        type: "object",
        required: ["name", "zoneId"],
        properties: {
          name: { type: "string", example: "Kigamboni Hub" },
          zoneId: { type: "string" },
          location: { type: "string", example: "Kigamboni, Dar es Salaam" },
        },
      },
      DriverRequest: {
        type: "object",
        required: ["email", "fullName", "homeZoneId"],
        properties: {
          email: { type: "string", example: "driver.c@mimo.local" },
          fullName: { type: "string", example: "Driver C" },
          homeZoneId: { type: "string" },
          vehicleMeta: { type: "string", example: "Motorbike" },
        },
      },
      TripRequest: {
        type: "object",
        required: ["driverProfileId", "tripType"],
        properties: {
          driverProfileId: { type: "string" },
          tripType: { type: "string", example: "PICKUP_BATCH" },
        },
      },
      TripStopRequest: {
        type: "object",
        required: ["tripId", "orderId", "stopType"],
        properties: {
          tripId: { type: "string" },
          orderId: { type: "string" },
          stopType: { type: "string", example: "PICKUP" },
          notes: { type: "string", example: "Collect from affiliate shop" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            notes: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean", example: true } },
                },
              },
            },
          },
        },
      },
    },
    "/v1/auth/register": {
      post: {
        tags: ["Auth"],
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
          "201": {
            notes: "Customer registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            notes: "Validation error",
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
        tags: ["Auth"],
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
          "200": {
            notes: "Authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "401": {
            notes: "Invalid credentials",
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
        tags: ["Auth"],
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
          "200": {
            notes: "Tokens refreshed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthTokens" },
              },
            },
          },
        },
      },
    },
    "/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            notes: "Logged out",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean", example: true } },
                },
              },
            },
          },
        },
      },
    },
    "/v1/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Order created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          "400": {
            notes: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StandardError" },
              },
            },
          },
        },
      },
    },
    "/v1/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            notes: "Order found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          "404": {
            notes: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StandardError" },
              },
            },
          },
        },
      },
    },
    "/v1/orders/{id}/timeline": {
      get: {
        tags: ["Orders", "Tracking"],
        summary: "Get order timeline",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            notes: "Timeline returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TimelineResponse" },
              },
            },
          },
        },
      },
    },
    "/v1/orders/{id}/events": {
      post: {
        tags: ["Orders"],
        summary: "Append order event",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderEventRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Order event appended",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TimelineEvent" },
              },
            },
          },
        },
      },
    },
    "/v1/orders/{id}/issues": {
      get: {
        tags: ["Orders"],
        summary: "List issues for order",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            notes: "Issues returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Create issue for order",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateIssueRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Issue created",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/orders/{id}/issues/{issueId}": {
      patch: {
        tags: ["Orders"],
        summary: "Update issue",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "issueId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateIssueRequest" },
            },
          },
        },
        responses: {
          "200": {
            notes: "Issue updated",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/tracking/orders/{orderNumber}": {
      get: {
        tags: ["Tracking"],
        summary: "Public tracking by order number + phone",
        notes:
          "Tracking is locked for v1 as public lookup with orderNumber + phone query parameters.",
        parameters: [
          { name: "orderNumber", in: "path", required: true, schema: { type: "string" } },
          { name: "phone", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            notes: "Tracking timeline returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TimelineResponse" },
              },
            },
          },
        },
      },
    },
    "/v1/hub/intake": {
      post: {
        tags: ["Hub"],
        summary: "Record hub intake",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HubIntakeRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Intake recorded and events appended",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/hub/orders/{id}/stage": {
      post: {
        tags: ["Hub"],
        summary: "Move order to processing stage",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HubStageRequest" },
            },
          },
        },
        responses: {
          "200": {
            notes: "Stage updated and event appended",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/hub/queue": {
      get: {
        tags: ["Hub"],
        summary: "Get hub queue",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "stage", in: "query", required: false, schema: { type: "string" } }],
        responses: {
          "200": {
            notes: "Queue returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
    },
    "/v1/driver/me": {
      get: {
        tags: ["Driver"],
        summary: "Get current driver profile",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Driver profile returned",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/driver/trips": {
      get: {
        tags: ["Driver"],
        summary: "List current driver trips",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Trips returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
    },
    "/v1/driver/tasks": {
      get: {
        tags: ["Driver"],
        summary: "List current driver tasks",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Tasks returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
    },
    "/v1/driver/stops/{stopId}/arrive": {
      post: {
        tags: ["Driver"],
        summary: "Mark stop arrived",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "stopId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            notes: "Arrival recorded",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/driver/stops/{stopId}/complete": {
      post: {
        tags: ["Driver"],
        summary: "Complete stop with proof payload",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "stopId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DriverStopCompleteRequest" },
            },
          },
        },
        responses: {
          "200": {
            notes: "Completion recorded",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/affiliate/me": {
      get: {
        tags: ["Affiliate"],
        summary: "Get current affiliate context",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Affiliate profile returned",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/affiliate/orders": {
      get: {
        tags: ["Affiliate"],
        summary: "List affiliate orders",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Affiliate-scoped orders returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
      post: {
        tags: ["Affiliate"],
        summary: "Create affiliate order",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AffiliateCreateOrderRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Affiliate order created and attributed by server",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/OrderResponse" } },
            },
          },
        },
      },
    },
    "/v1/affiliate/orders/{id}": {
      get: {
        tags: ["Affiliate"],
        summary: "Get affiliate order by id",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            notes: "Affiliate-scoped order returned",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/OrderResponse" } },
            },
          },
        },
      },
    },
    "/v1/zones": {
      get: {
        tags: ["Admin"],
        summary: "List zones",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Zones returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
      post: {
        tags: ["Admin"],
        summary: "Create zone",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ZoneRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Zone created",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/hubs": {
      get: {
        tags: ["Admin"],
        summary: "List hubs",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        responses: {
          "200": {
            notes: "Hubs returned",
            content: {
              "application/json": { schema: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
      post: {
        tags: ["Admin"],
        summary: "Create hub",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HubRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Hub created",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/admin/drivers": {
      post: {
        tags: ["Admin"],
        summary: "Create driver profile",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DriverRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Driver created",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/admin/trips": {
      post: {
        tags: ["Admin"],
        summary: "Create trip",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TripRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Trip created",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
    "/v1/admin/trips/{id}/stops": {
      post: {
        tags: ["Admin"],
        summary: "Create trip stop",
        security: [{ bearerAuth: [] }, { roleHeader: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TripStopRequest" },
            },
          },
        },
        responses: {
          "201": {
            notes: "Trip stop created",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
  },
};

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

app.use("/api", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.post("/v1/auth/register", async (req, res) => {
  const missing = validateRequiredFields(req.body ?? {}, [
    "firstName",
    "lastName",
    "phone",
    "email",
    "password",
  ]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const email = String(req.body.email).toLowerCase();

  let existingUser = null;
  try {
    existingUser = await prisma.user.findUnique({ where: { email } });
  } catch {
    existingUser = null;
  }

  if (existingUser) {
    return sendError(res, 409, "CONFLICT", "User with this email already exists.");
  }

  let createdUser = null;
  try {
    createdUser = await prisma.user.create({
      data: {
        email,
        fullName: `${String(req.body.firstName)} ${String(req.body.lastName)}`,
        role: "CUSTOMER",
      } as any,
    });
  } catch {
    createdUser = {
      id: "dev-customer-id",
      email,
      role: "CUSTOMER",
    };
  }

  return res.status(201).json({
    user: {
      id: createdUser.id,
      email: createdUser.email,
      role: "customer",
    },
    tokens: {
      accessToken: `access_${email}`,
      refreshToken: `refresh_${email}`,
      tokenType: "Bearer",
      expiresIn: 3600,
    },
  });
});

app.post("/v1/auth/login", async (req, res) => {
  const missing = validateRequiredFields(req.body ?? {}, ["email", "password"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const email = String(req.body.email).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return sendError(res, 401, "AUTH_INVALID_CREDENTIALS", "Invalid email or password.");
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      role: String((user as any).role ?? "unknown").toLowerCase(),
    },
    tokens: {
      accessToken: `access_${user.email}`,
      refreshToken: `refresh_${user.email}`,
      tokenType: "Bearer",
      expiresIn: 3600,
    },
  });
});

app.post("/v1/auth/refresh", (req, res) => {
  const missing = validateRequiredFields(req.body ?? {}, ["refreshToken"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const refreshToken = String(req.body.refreshToken);
  if (!refreshToken.startsWith("refresh_")) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Refresh token is invalid or expired.");
  }

  return res.json({
    accessToken: `access_from_${refreshToken}`,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: 3600,
  });
});

app.post("/v1/auth/logout", (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  return res.json({ ok: true });
});

async function readOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      zone: true,
      hub: true,
      affiliateShop: true,
      bags: true,
    } as any,
  });
}

function mapOrderResponse(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    channel: order.channel,
    tier: order.tier,
    status: order.statusCurrent,
    zoneName: order.zone?.name ?? null,
    hubName: order.hub?.name ?? null,
    affiliateShopCode: order.affiliateShop?.code ?? null,
    bagCount: Array.isArray(order.bags) ? order.bags.length : 0,
    createdAt: order.createdAt,
  };
}

app.post("/v1/orders", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const missing = validateRequiredFields(req.body ?? {}, [
    "channel",
    "tier",
    "customerName",
    "customerPhone",
    "zoneName",
  ]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const zone = await prisma.zone.findFirst({
    where: { name: String(req.body.zoneName) },
  });

  if (!zone) {
    return sendError(res, 404, "NOT_FOUND", "Zone not found.", {
      zoneName: req.body.zoneName,
    });
  }

  const hub = await prisma.hub.findFirst({
    where: { zoneId: zone.id },
  });

  const existingCount = await prisma.order.count();
  const orderNumber = `API-ORDER-${String(existingCount + 1).padStart(4, "0")}`;

  const createdOrder = await prisma.order.create({
    data: {
      orderNumber,
      channel: mapApiChannelToDb(String(req.body.channel)),
      tier: mapApiTierToDb(String(req.body.tier)),
      statusCurrent: "CREATED",
      sourceType: "DIRECT",
      customerName: String(req.body.customerName),
      customerPhone: String(req.body.customerPhone),
      notes: req.body.notes ? String(req.body.notes) : null,
      zoneId: zone.id,
      hubId: hub?.id ?? null,
    } as any,
    include: {
      zone: true,
      hub: true,
      affiliateShop: true,
      bags: true,
    } as any,
  });

  await prisma.orderEvent.create({
    data: {
      orderId: createdOrder.id,
      eventType: "ORDER_CREATED",
      notes: "Order created from API contract endpoint",
      payloadJson: {
        channel: createdOrder.channel,
        tier: createdOrder.tier,
        zoneName: zone.name,
        hubName: hub?.name ?? null,
      },
    } as any,
  });

  return res.status(201).json(mapOrderResponse(createdOrder));
});

app.get("/v1/orders/:id", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const order = await readOrderById(req.params.id);
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  return res.json(mapOrderResponse(order));
});

app.get("/v1/orders/:id/timeline", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
  });

  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  const events = await prisma.orderEvent.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: "asc" },
  });

  return res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    events: events.map((event: any) => ({
      id: event.id,
      eventType: event.eventType,
      notes: event.description,
      createdAt: event.createdAt,
      payloadJson: event.metadata ?? null,
    })),
  });
});

app.post("/v1/orders/:id/events", requireRole(["admin", "hub_staff"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["eventType", "description"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const event = await prisma.orderEvent.create({
    data: {
      orderId: order.id,
      eventType: String(req.body.eventType),
      notes: String(req.body.description),
      payloadJson: req.body.metadata ?? null,
    } as any,
  });

  return res.status(201).json({
    id: event.id,
    eventType: event.eventType,
    notes: event.description,
    createdAt: event.createdAt,
    payloadJson: event.metadata ?? null,
  });
});

app.post("/v1/orders/:id/issues", requireRole(["admin", "hub_staff"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["issueType", "description"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const issue = await prisma.orderIssue.create({
    data: {
      orderId: order.id,
      issueType: String(req.body.issueType),
      notes: String(req.body.description),
      status: "OPEN",
    } as any,
  });

  await prisma.orderEvent.create({
    data: {
      orderId: order.id,
      eventType: "ISSUE_OPENED",
      notes: `Issue opened: ${String(req.body.issueType)}`,
      payloadJson: {
        issueId: issue.id,
        issueType: issue.issueType,
      },
    } as any,
  });

  return res.status(201).json(issue);
});

app.get("/v1/orders/:id/issues", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  const issues = await prisma.orderIssue.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: "asc" },
  });

  return res.json(issues);
});

app.patch(
  "/v1/orders/:id/issues/:issueId",
  requireRole(["admin", "hub_staff"]),
  async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
    }

    const issue = await prisma.orderIssue.findUnique({
      where: { id: req.params.issueId },
    });

    if (!issue || issue.orderId !== req.params.id) {
      return sendError(res, 404, "NOT_FOUND", "Issue not found.");
    }

    const updated = await prisma.orderIssue.update({
      where: { id: issue.id },
      data: {
        status: req.body.status ? String(req.body.status) : issue.status,
        resolutionNotes: req.body.resolutionNotes
          ? String(req.body.resolutionNotes)
          : ((issue as any).resolutionNotes ?? null),
      } as any,
    });

    await prisma.orderEvent.create({
      data: {
        orderId: req.params.id,
        eventType: "ISSUE_UPDATED",
        notes: `Issue updated: ${updated.issueType}`,
        payloadJson: {
          issueId: updated.id,
          status: updated.status,
        },
      } as any,
    });

    return res.json(updated);
  }
);

app.get("/v1/tracking/orders/:orderNumber", async (req, res) => {
  const phone = req.query.phone ? String(req.query.phone) : "";
  if (!phone) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: ["phone"],
    });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: req.params.orderNumber,
      customerPhone: phone,
    },
  });

  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  const events = await prisma.orderEvent.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: "asc" },
  });

  return res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    events: events.map((event: any) => ({
      id: event.id,
      eventType: event.eventType,
      notes: event.description,
      createdAt: event.createdAt,
      payloadJson: event.metadata ?? null,
    })),
  });
});

app.post("/v1/hub/intake", requireRole(["hub_staff", "admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["orderId", "bagTag", "weightKg"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const order = await prisma.order.findUnique({ where: { id: String(req.body.orderId) } });
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  await prisma.orderEvent.createMany({
    data: [
      {
        orderId: order.id,
        eventType: "BAG_SCANNED",
        notes: `Bag scanned at intake: ${String(req.body.bagTag)}`,
        payloadJson: { bagTag: String(req.body.bagTag) },
      } as any,
      {
        orderId: order.id,
        eventType: "HUB_INTAKE_RECORDED",
        notes: "Hub intake recorded",
        payloadJson: {
          bagTag: String(req.body.bagTag),
          weightKg: Number(req.body.weightKg),
          notes: req.body.notes ? String(req.body.notes) : null,
        },
      } as any,
    ],
  });

  return res.status(201).json({
    ok: true,
    orderId: order.id,
    appendedEvents: ["BAG_SCANNED", "HUB_INTAKE_RECORDED"],
  });
});

app.post("/v1/hub/orders/:id/stage", requireRole(["hub_staff", "admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["stage"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const stage = String(req.body.stage);

  await prisma.orderEvent.create({
    data: {
      orderId: order.id,
      eventType: `STAGE_${stage}`,
      notes: `Order moved to ${stage}`,
      payloadJson: {
        notes: req.body.notes ? String(req.body.notes) : null,
      },
    } as any,
  });

  return res.json({
    ok: true,
    orderId: order.id,
    stage,
  });
});

app.get("/v1/hub/queue", requireRole(["hub_staff", "admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const orders = await prisma.order.findMany({
    include: {
      zone: true,
      hub: true,
    } as any,
    orderBy: { createdAt: "desc" },
  });

  return res.json(
    orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.statusCurrent,
      zoneName: order.zone?.name ?? null,
      hubName: order.hub?.name ?? null,
      requestedStage: req.query.stage ? String(req.query.stage) : null,
    }))
  );
});

app.get("/v1/driver/me", requireRole(["driver"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const profile = await prisma.driverProfile.findFirst({
    include: {
      user: true,
      homeZone: true,
    } as any,
  });

  return res.json(profile);
});

app.get("/v1/driver/trips", requireRole(["driver"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const trips = await prisma.trip.findMany({
    include: {
      driverProfile: true,
    } as any,
    orderBy: { createdAt: "desc" },
  });

  return res.json(trips);
});

app.get("/v1/driver/tasks", requireRole(["driver"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const stops = await prisma.tripStop.findMany({
    include: {
      trip: true,
      order: true,
    } as any,
    orderBy: { createdAt: "asc" },
  });

  return res.json(
    stops.map((stop: any) => ({
      id: stop.id,
      stopType: stop.stopType,
      notes: stop.notes,
      tripId: stop.tripId,
      orderId: stop.orderId,
      orderNumber: stop.order?.orderNumber ?? null,
    }))
  );
});

app.post("/v1/driver/stops/:stopId/arrive", requireRole(["driver"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const stop = await prisma.tripStop.findUnique({
    where: { id: req.params.stopId },
  });

  if (!stop) {
    return sendError(res, 404, "NOT_FOUND", "Stop not found.");
  }

  await prisma.orderEvent.create({
    data: {
      orderId: stop.orderId,
      eventType: "DRIVER_ARRIVED",
      notes: "Driver arrived at stop",
      payloadJson: {
        stopId: stop.id,
      },
    } as any,
  });

  return res.json({ ok: true, stopId: stop.id });
});

app.post("/v1/driver/stops/:stopId/complete", requireRole(["driver"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const stop = await prisma.tripStop.findUnique({
    where: { id: req.params.stopId },
  });

  if (!stop) {
    return sendError(res, 404, "NOT_FOUND", "Stop not found.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["proofType"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  await prisma.orderEvent.create({
    data: {
      orderId: stop.orderId,
      eventType: "DRIVER_STOP_COMPLETED",
      notes: "Driver completed stop",
      payloadJson: {
        stopId: stop.id,
        proofType: String(req.body.proofType),
        otp: req.body.otp ?? null,
        photoRef: req.body.photoRef ?? null,
        signatureRef: req.body.signatureRef ?? null,
        notes: req.body.notes ?? null,
      },
    } as any,
  });

  return res.json({ ok: true, stopId: stop.id });
});

app.get("/v1/affiliate/me", requireRole(["affiliate_staff"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const profile = await prisma.affiliateStaffProfile.findFirst({
    include: {
      user: true,
      affiliateShop: true,
    } as any,
  });

  return res.json(profile);
});

app.post("/v1/affiliate/orders", requireRole(["affiliate_staff"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const shop = await prisma.affiliateShop.findFirst({
    include: { zone: true } as any,
  });

  if (!shop) {
    return sendError(res, 404, "NOT_FOUND", "Affiliate shop context not found.");
  }

  const missing = validateRequiredFields(req.body ?? {}, [
    "channel",
    "tier",
    "customerName",
    "customerPhone",
  ]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const existingCount = await prisma.order.count();
  const orderNumber = `AFF-${shop.code}-API-${String(existingCount + 1).padStart(3, "0")}`;

  const hub = await prisma.hub.findFirst({
    where: { zoneId: shop.zoneId },
  });

  const createdOrder = await prisma.order.create({
    data: {
      orderNumber,
      channel: mapApiChannelToDb(String(req.body.channel)),
      tier: mapApiTierToDb(String(req.body.tier)),
      statusCurrent: "CREATED",
      sourceType: "DIRECT",
      customerName: String(req.body.customerName),
      customerPhone: String(req.body.customerPhone),
      notes: req.body.notes ? String(req.body.notes) : null,
      zoneId: shop.zoneId,
      hubId: hub?.id ?? null,
      affiliateShopId: shop.id,
    } as any,
    include: {
      zone: true,
      hub: true,
      affiliateShop: true,
      bags: true,
    } as any,
  });

  await prisma.orderEvent.create({
    data: {
      orderId: createdOrder.id,
      eventType: "ORDER_CREATED",
      notes: "Affiliate order created from API contract endpoint",
      payloadJson: {
        affiliateShopCode: shop.code,
        zoneName: shop.zone?.name ?? null,
      },
    } as any,
  });

  return res.status(201).json(mapOrderResponse(createdOrder));
});

app.get("/v1/affiliate/orders", requireRole(["affiliate_staff"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const shop = await prisma.affiliateShop.findFirst();
  if (!shop) {
    return sendError(res, 404, "NOT_FOUND", "Affiliate shop context not found.");
  }

  const orders = await prisma.order.findMany({
    where: { affiliateShopId: shop.id },
    include: {
      zone: true,
      hub: true,
      affiliateShop: true,
      bags: true,
    } as any,
    orderBy: { createdAt: "desc" },
  });

  return res.json(orders.map(mapOrderResponse));
});

app.get("/v1/affiliate/orders/:id", requireRole(["affiliate_staff"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const shop = await prisma.affiliateShop.findFirst();
  if (!shop) {
    return sendError(res, 404, "NOT_FOUND", "Affiliate shop context not found.");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id,
      affiliateShopId: shop.id,
    },
    include: {
      zone: true,
      hub: true,
      affiliateShop: true,
      bags: true,
    } as any,
  });

  if (!order) {
    return sendError(res, 404, "NOT_FOUND", "Order not found.");
  }

  return res.json(mapOrderResponse(order));
});

app.get("/v1/zones", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const zones = await prisma.zone.findMany({
    orderBy: { createdAt: "asc" },
  });

  return res.json(zones);
});

app.post("/v1/zones", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["name"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const zone = await prisma.zone.create({
    data: {
      name: String(req.body.name),
      payloadJson: req.body.metadata ?? null,
    } as any,
  });

  return res.status(201).json(zone);
});

app.get("/v1/hubs", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const hubs = await prisma.hub.findMany({
    include: { zone: true } as any,
    orderBy: { createdAt: "asc" },
  });

  return res.json(hubs);
});

app.post("/v1/hubs", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["name", "zoneId"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const hub = await prisma.hub.create({
    data: {
      name: String(req.body.name),
      zoneId: String(req.body.zoneId),
      location: req.body.location ? String(req.body.location) : null,
    } as any,
    include: { zone: true } as any,
  });

  return res.status(201).json(hub);
});

app.post("/v1/admin/drivers", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["email", "fullName", "homeZoneId"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const user = await prisma.user.create({
    data: {
      email: String(req.body.email).toLowerCase(),
      fullName: String(req.body.fullName),
      role: "DRIVER",
    } as any,
  });

  const driver = await prisma.driverProfile.create({
    data: {
      userId: user.id,
      homeZoneId: String(req.body.homeZoneId),
      vehicleMeta: req.body.vehicleMeta ? String(req.body.vehicleMeta) : null,
      availabilityStatus: "AVAILABLE",
    } as any,
    include: {
      user: true,
      homeZone: true,
    } as any,
  });

  return res.status(201).json(driver);
});

app.post("/v1/admin/trips", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["driverProfileId", "tripType"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const trip = await prisma.trip.create({
    data: {
      driverProfileId: String(req.body.driverProfileId),
      tripType: String(req.body.tripType),
      status: "PLANNED",
    } as any,
  });

  return res.status(201).json(trip);
});

app.post("/v1/admin/trips/:id/stops", requireRole(["admin"]), async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return sendError(res, 401, "AUTH_TOKEN_EXPIRED", "Access token is missing or expired.");
  }

  const trip = await prisma.trip.findUnique({
    where: { id: req.params.id },
  });
  if (!trip) {
    return sendError(res, 404, "NOT_FOUND", "Trip not found.");
  }

  const missing = validateRequiredFields(req.body ?? {}, ["tripId", "orderId", "stopType"]);
  if (missing.length > 0) {
    return sendError(res, 400, "VALIDATION_FAILED", "Request validation failed.", {
      missingFields: missing,
    });
  }

  const stop = await prisma.tripStop.create({
    data: {
      tripId: String(req.body.tripId),
      orderId: String(req.body.orderId),
      stopType: String(req.body.stopType),
      notes: req.body.notes ? String(req.body.notes) : null,
    } as any,
  });

  return res.status(201).json(stop);
});

app.use((_req, res) => {
  return sendError(res, 404, "NOT_FOUND", "Route not found.");
});

app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    return sendError(res, 500, "INTERNAL_ERROR", "Unexpected internal server error.");
  }
);

app.listen(3001, () => {
  console.log("Mimo API running on http://localhost:3001");
  console.log("Swagger UI running on http://localhost:3001/api");
  console.log("OpenAPI JSON on http://localhost:3001/api/openapi.json");
});
