import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import Redis from "ioredis";
import { spawn, execFile, type ChildProcess } from "node:child_process";

const repoRootEnvPath = path.resolve(process.cwd(), "..", "..", ".env");
const serviceEnvPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(serviceEnvPath)) {
  dotenv.config({ path: serviceEnvPath, override: true });
} else if (fs.existsSync(repoRootEnvPath)) {
  dotenv.config({ path: repoRootEnvPath, override: true });
}

const BASE_URL = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3001";
const PNPM_CMD = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

let serverProcess: ChildProcess | null = null;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCommand(args: string[], cwd: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(PNPM_CMD, args, {
      cwd,
      env: process.env,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Command failed: ${PNPM_CMD} ${args.join(" ")} (exit ${code ?? "null"})`));
    });

    child.on("error", reject);
  });
}

async function clearRedisForTests() {
  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
  });

  try {
    await redis.flushdb();
  } finally {
    redis.disconnect();
  }
}

async function waitForHealth(baseUrl: string) {
  let lastError: unknown = null;

  for (let i = 0; i < 120; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/v1/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      lastError = error;
    }
    await delay(500);
  }

  throw new Error(
    `API did not become healthy at ${baseUrl}/v1/health. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

export async function seedAndStartServer() {
  const cwd = process.cwd();

  await clearRedisForTests();
  await runCommand(["exec", "tsx", "prisma/seed.ts"], cwd);

  const proc = spawn(PNPM_CMD, ["exec", "tsx", "src/dev.ts"], {
    cwd,
    env: {
      ...process.env,
      PORT: "3001",
    },
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  serverProcess = proc;

  proc.stdout?.on("data", (chunk) => {
    process.stdout.write(`[test-server][stdout] ${chunk}`);
  });

  proc.stderr?.on("data", (chunk) => {
    process.stderr.write(`[test-server][stderr] ${chunk}`);
  });

  proc.on("error", (error) => {
    console.error("[test-server]", error);
  });

  await waitForHealth(BASE_URL);
}

export async function stopServer() {
  if (!serverProcess) return;

  const proc = serverProcess;
  serverProcess = null;

  if (process.platform === "win32") {
    await new Promise<void>((resolve) => {
      execFile("taskkill", ["/PID", String(proc.pid), "/T", "/F"], () => resolve());
    });
  } else {
    proc.kill("SIGTERM");
  }

  await delay(1500);
}

export async function apiRequest(
  path: string,
  init?: {
    method?: string;
    token?: string;
    body?: unknown;
    headers?: Record<string, string>;
  }
) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.headers ?? {}),
  };

  if (init?.token) {
    headers.Authorization = `Bearer ${init.token}`;
  }

  const requestInit: RequestInit = {
    method: init?.method ?? "GET",
    headers,
  };

  if (init?.body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestInit.body = JSON.stringify(init.body);
  }

  const response = await fetch(`${BASE_URL}${path}`, requestInit);

  const rawText = await response.text();
  let parsed: unknown = null;

  try {
    parsed = rawText ? JSON.parse(rawText) : null;
  } catch {
    parsed = rawText;
  }

  return {
    status: response.status,
    body: parsed as Record<string, unknown> | string | null,
  };
}

export function errorCode(body: Record<string, unknown> | string | null): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const errorValue = record.error;
  if (errorValue && typeof errorValue === "object") {
    const errorRecord = errorValue as Record<string, unknown>;
    if (typeof errorRecord.code === "string") return errorRecord.code;
  }
  if (typeof record.code === "string") return record.code;
  if (typeof record.errorCode === "string") return record.errorCode;
  return null;
}

export async function loginByPhone(phone: string, password = "Pass123!") {
  const response = await apiRequest("/v1/auth/login", {
    method: "POST",
    body: {
      phone,
      password,
    },
  });

  if (response.status !== 200) {
    throw new Error(
      `Login failed for ${phone}: status=${response.status} body=${JSON.stringify(response.body)}`
    );
  }

  const bodyRecord =
    response.body && typeof response.body === "object"
      ? (response.body as Record<string, unknown>)
      : null;
  const dataRecord =
    bodyRecord?.data && typeof bodyRecord.data === "object"
      ? (bodyRecord.data as Record<string, unknown>)
      : null;
  const tokensRecord =
    dataRecord?.tokens && typeof dataRecord.tokens === "object"
      ? (dataRecord.tokens as Record<string, unknown>)
      : null;
  const accessToken =
    tokensRecord?.accessToken && typeof tokensRecord.accessToken === "string"
      ? tokensRecord.accessToken
      : null;

  if (!accessToken) {
    throw new Error(`No access token returned for ${phone}`);
  }

  return accessToken;
}

export const SeedPhones = {
  admin: "+255700000001",
  hubStaffA: "+255700000002",
  driverA: "+255700000003",
  affiliateStaffA: "+255700000004",
  customerA: "+255700000005",
  devAdmin: "+255700000006",
  customerB: "+255700000007",
  driverB: "+255700000008",
} as const;

export const SeedIds = {
  orderCustomerA: "order_customer_a",
  orderScopeB: "order_scope_b",
  tripDriverA: "trip_driver_a",
  tripDriverB: "trip_driver_b",
  tripStopA: "tripstop_0001",
  tripStopB: "tripstop_0002",
  hubKigamboni: "hub_kigamboni",
} as const;
