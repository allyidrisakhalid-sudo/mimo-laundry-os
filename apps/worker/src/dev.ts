import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { Queue, Worker } from "bullmq";

const repoRootEnvPath = path.resolve(process.cwd(), ".env");
const workerEnvPath = path.resolve(process.cwd(), "apps/worker/.env");
const apiEnvPath = path.resolve(process.cwd(), "apps/api/.env");

if (fs.existsSync(workerEnvPath)) {
  dotenv.config({ path: workerEnvPath, override: true });
} else if (fs.existsSync(apiEnvPath)) {
  dotenv.config({ path: apiEnvPath, override: true });
} else if (fs.existsSync(repoRootEnvPath)) {
  dotenv.config({ path: repoRootEnvPath, override: true });
}

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const redisUrl = new URL(REDIS_URL);

const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null as null,
};

console.log("[worker] REDIS_URL =", REDIS_URL);
console.log("[worker] connection =", JSON.stringify(connection));
const notificationsQueue = new Queue("notifications", { connection });

const slaAlertsQueue = new Queue("sla-alerts", { connection });
const financeQueue = new Queue("finance", { connection });

function summarizePayload(data: unknown) {
  if (!data || typeof data !== "object") return data;
  const record = data as Record<string, unknown>;
  return Object.fromEntries(Object.entries(record).slice(0, 8));
}

async function handleJob(queueName: string, jobName: string, data: unknown) {
  console.log(
    `[worker] start queue=${queueName} job=${jobName} payload=${JSON.stringify(summarizePayload(data))}`
  );

  if (jobName === "test.success") {
    return {
      ok: true,
      queueName,
      processedAt: new Date().toISOString(),
    };
  }

  if (jobName === "test.fail") {
    throw new Error("Intentional worker failure for retry/dead-letter verification");
  }

  if (jobName === "schedule.sla-check") {
    return {
      ok: true,
      queueName,
      alertType: "SLA_ALERT_SCAN",
      processedAt: new Date().toISOString(),
    };
  }

  if (jobName === "schedule.payment-reminder") {
    return {
      ok: true,
      queueName,
      reminderType: "PAYMENT_DUE_REMINDER_SCAN",
      processedAt: new Date().toISOString(),
    };
  }

  if (jobName === "schedule.payout-draft") {
    return {
      ok: true,
      queueName,
      payoutType: "PAYOUT_DRAFT_SCAN",
      processedAt: new Date().toISOString(),
    };
  }

  return {
    ok: true,
    queueName,
    processedAt: new Date().toISOString(),
  };
}

function createLoggedWorker(queueName: string) {
  const worker = new Worker(
    queueName,
    async (job) => {
      console.log(
        `[worker] picked queue=${queueName} jobId=${job.id} job=${job.name} attemptsMade=${job.attemptsMade} attemptsConfigured=${job.opts.attempts ?? 1}`
      );

      return handleJob(queueName, job.name, job.data);
    },
    { connection }
  );

  worker.on("completed", (job, result) => {
    console.log(
      `[worker] success queue=${queueName} jobId=${job.id} job=${job.name} result=${JSON.stringify(result)}`
    );
  });

  worker.on("failed", (job, error) => {
    console.log(
      `[worker] fail queue=${queueName} jobId=${job?.id ?? "unknown"} job=${job?.name ?? "unknown"} attemptsMade=${job?.attemptsMade ?? "unknown"} attemptsConfigured=${job?.opts.attempts ?? "unknown"} error=${error.message}`
    );
  });

  worker.on("error", (error) => {
    console.error(`[worker] error queue=${queueName} error=${error.message}`);
  });

  return worker;
}

createLoggedWorker("notifications");
createLoggedWorker("sla-alerts");
createLoggedWorker("finance");

async function boot() {
  await notificationsQueue.waitUntilReady();
  await slaAlertsQueue.waitUntilReady();
  await financeQueue.waitUntilReady();

  console.log(`[worker] connected redis=${REDIS_URL}`);

  const startupJob = await notificationsQueue.add(
    "test.success",
    { source: "worker-startup", createdAt: new Date().toISOString() },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: 20,
      removeOnFail: false,
    }
  );

  console.log(`[worker] startup job enqueued queue=notifications jobId=${startupJob.id}`);
}

boot().catch((error) => {
  console.error("[worker] fatal", error);
  process.exit(1);
});
