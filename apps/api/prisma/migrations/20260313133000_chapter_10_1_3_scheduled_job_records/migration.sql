CREATE TABLE "ScheduledJobRun" (
  "id" TEXT NOT NULL,
  "jobKey" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "detailsJson" JSONB,
  "startedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "finishedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "ScheduledJobRun_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ScheduledJobRun_jobKey_startedAt_idx"
  ON "ScheduledJobRun" ("jobKey", "startedAt" DESC);

CREATE TABLE "OpsAlert" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "orderId" TEXT,
  "severity" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "metaJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "OpsAlert_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OpsAlert_type_createdAt_idx"
  ON "OpsAlert" ("type", "createdAt" DESC);

CREATE TABLE "ReminderLog" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "reminderType" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "metaJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "ReminderLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReminderLog_orderId_createdAt_idx"
  ON "ReminderLog" ("orderId", "createdAt" DESC);

CREATE TABLE "PayoutDraftRun" (
  "id" TEXT NOT NULL,
  "periodKey" TEXT NOT NULL,
  "shopId" TEXT NOT NULL,
  "entryCount" INTEGER NOT NULL DEFAULT 0,
  "totalAmountTzs" INTEGER NOT NULL DEFAULT 0,
  "metaJson" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "PayoutDraftRun_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PayoutDraftRun_periodKey_createdAt_idx"
  ON "PayoutDraftRun" ("periodKey", "createdAt" DESC);
