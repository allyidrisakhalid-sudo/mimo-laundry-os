import http from "node:http";
import { URL } from "node:url";
import dotenv from "dotenv";
import path from "node:path";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function sendHtml(res: http.ServerResponse, statusCode: number, html: string): void {
  res.writeHead(statusCode, { "Content-Type": "text/html" });
  res.end(html);
}

async function readJsonBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  return await new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body) as Record<string, unknown>);
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

const docsHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Mimo API</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.5; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Mimo Laundry OS API</h1>
    <p>Chapter 4.1 minimal zone API is active.</p>
    <h2>Available endpoints</h2>
    <ul>
      <li><code>GET /health</code></li>
      <li><code>GET /api</code></li>
      <li><code>GET /swagger</code></li>
      <li><code>POST /v1/zones</code></li>
      <li><code>GET /v1/zones</code></li>
      <li><code>GET /v1/zones/:id</code></li>
      <li><code>GET /v1/zones/:id/hubs</code></li>
      <li><code>GET /v1/zones/:id/affiliates</code></li>
      <li><code>GET /v1/zones/:id/drivers</code></li>
    </ul>
    <p>Swagger UI remains scheduled for Chapter 5.1.</p>
  </body>
</html>
`;

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url ?? "/", "http://localhost:3001");
    const pathname = requestUrl.pathname;
    const method = req.method ?? "GET";

    if (pathname === "/health" && method === "GET") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if ((pathname === "/swagger" || pathname === "/api") && method === "GET") {
      sendHtml(res, 200, docsHtml);
      return;
    }

    if (pathname === "/v1/zones" && method === "POST") {
      const body = await readJsonBody(req);
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const boundaries = body.boundaries;
      const metadata = body.metadata ?? null;

      if (!name) {
        sendJson(res, 400, { message: "name is required" });
        return;
      }

      if (boundaries === undefined) {
        sendJson(res, 400, { message: "boundaries is required" });
        return;
      }

      const createdZone = await prisma.zone.create({
        data: {
          name,
          boundaries,
          metadata,
        },
      });

      sendJson(res, 201, createdZone);
      return;
    }

    if (pathname === "/v1/zones" && method === "GET") {
      const zones = await prisma.zone.findMany({
        orderBy: { createdAt: "asc" },
      });

      sendJson(res, 200, zones);
      return;
    }

    const zoneIdMatch = pathname.match(/^\/v1\/zones\/([^/]+)$/);
    if (zoneIdMatch && method === "GET") {
      const zone = await prisma.zone.findUnique({
        where: { id: zoneIdMatch[1] },
      });

      if (!zone) {
        sendJson(res, 404, { message: "Zone not found" });
        return;
      }

      sendJson(res, 200, zone);
      return;
    }

    const hubsMatch = pathname.match(/^\/v1\/zones\/([^/]+)\/hubs$/);
    if (hubsMatch && method === "GET") {
      const hubs = await prisma.hub.findMany({
        where: { zoneId: hubsMatch[1] },
        orderBy: { createdAt: "asc" },
      });

      sendJson(res, 200, hubs);
      return;
    }

    const affiliatesMatch = pathname.match(/^\/v1\/zones\/([^/]+)\/affiliates$/);
    if (affiliatesMatch && method === "GET") {
      const affiliates = await prisma.affiliateShop.findMany({
        where: { zoneId: affiliatesMatch[1] },
        orderBy: { createdAt: "asc" },
      });

      sendJson(res, 200, affiliates);
      return;
    }

    const driversMatch = pathname.match(/^\/v1\/zones\/([^/]+)\/drivers$/);
    if (driversMatch && method === "GET") {
      const drivers = await prisma.driver.findMany({
        where: { homeZoneId: driversMatch[1] },
        orderBy: { createdAt: "asc" },
      });

      sendJson(res, 200, drivers);
      return;
    }

    sendJson(res, 404, { message: "Not found" });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      sendJson(res, 409, { message: "Unique constraint violation" });
      return;
    }

    sendJson(res, 500, {
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

server.listen(3001, () => {
  console.log("Mimo API running on http://localhost:3001");
  console.log("API docs placeholder on http://localhost:3001/api");
});
