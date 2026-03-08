import "dotenv/config";
import http from "node:http";
import crypto from "node:crypto";
import { URL } from "node:url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/vintage_laundry?schema=public";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const PORT = Number(process.env.PORT ?? 3001);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "dev-access-secret-change-me";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "dev-refresh-secret-change-me";
const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

function json(res: http.ServerResponse, statusCode: number, payload: unknown) {
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

function parseAuthHeader(req: http.IncomingMessage) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
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

function signAccessToken(user: { id: string; phone: string; role: string }) {
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

async function issueTokens(
  user: { id: string; phone: string; role: string },
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

async function authenticate(req: http.IncomingMessage) {
  const token = parseAuthHeader(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    if (payload.typ !== "access" || typeof payload.sub !== "string") return null;

    const result = await pool.query(
      `
      SELECT "id", "phone", "email", "fullName", "role", "status"
      FROM "User"
      WHERE "id" = $1
      LIMIT 1
      `,
      [payload.sub]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    if (user.status !== "ACTIVE") return null;

    return user;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (method === "GET" && url.pathname === "/health") {
      return json(res, 200, { ok: true });
    }

    if (method === "GET" && url.pathname === "/api") {
      res.writeHead(302, { location: "/api/" });
      return res.end();
    }

    if (method === "GET" && url.pathname === "/api/openapi.json") {
      return json(res, 200, {
        openapi: "3.1.0",
        info: { title: "Mimo API", version: "v1" },
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
        FROM "User"
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
        INSERT INTO "User" ("id", "email", "phone", "fullName", "passwordHash", "role", "status", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, 'CUSTOMER', 'ACTIVE', NOW(), NOW())
        RETURNING "id", "phone", "email", "fullName", "role", "status"
        `,
        [id, email, phone, fullName, passwordHash]
      );

      return json(res, 201, { data: { user: created.rows[0] } });
    }

    if (method === "POST" && url.pathname === "/v1/auth/login") {
      const body = await readJsonBody(req);
      const phone = normalizePhone(String(body.phone ?? ""));
      const password = String(body.password ?? "");

      const result = await pool.query(
        `
        SELECT "id", "phone", "email", "fullName", "passwordHash", "role", "status"
        FROM "User"
        WHERE "phone" = $1
        LIMIT 1
        `,
        [phone]
      );

      if (result.rows.length === 0) {
        return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid phone or password");
      }

      const user = result.rows[0];

      if (user.status !== "ACTIVE") {
        return sendError(res, 403, "ACCOUNT_DISABLED", "User account is disabled");
      }

      const ok = await bcrypt.compare(password, user.passwordhash ?? user.passwordHash);
      if (!ok) {
        return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid phone or password");
      }

      const tokens = await issueTokens(
        {
          id: user.id,
          phone: user.phone,
          role: user.role,
        },
        req
      );

      return json(res, 200, {
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
            fullName: user.fullName ?? user.fullname,
            role: user.role,
            status: user.status,
          },
          tokens,
        },
      });
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
        FROM "User"
        WHERE "id" = $1
        LIMIT 1
        `,
        [payload.sub]
      );

      if (userResult.rows.length === 0 || userResult.rows[0].status !== "ACTIVE") {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN", "User is not active");
      }

      const user = userResult.rows[0];
      const newRefreshToken = signRefreshToken({ id: user.id });
      const replacementId = crypto.randomUUID();

      await pool.query(
        `
        INSERT INTO "RefreshToken" ("id", "userId", "tokenHash", "createdAt", "expiresAt", "revokedAt", "replacedByTokenId", "userAgent", "ipAddress")
        VALUES ($1, $2, $3, NOW(), $4, NULL, NULL, $5, $6)
        `,
        [
          replacementId,
          user.id,
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

      const accessToken = signAccessToken({ id: user.id, phone: user.phone, role: user.role });

      return json(res, 200, {
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
            fullName: user.fullName ?? user.fullname,
            role: user.role,
            status: user.status,
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

      return json(res, 200, { data: { loggedOut: true } });
    }

    if (method === "GET" && url.pathname === "/v1/auth/me") {
      const user = await authenticate(req);
      if (!user) {
        return sendError(res, 401, "UNAUTHORIZED", "Bearer access token is required");
      }

      return json(res, 200, {
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
            fullName: user.fullName ?? user.fullname,
            role: user.role,
            status: user.status,
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
