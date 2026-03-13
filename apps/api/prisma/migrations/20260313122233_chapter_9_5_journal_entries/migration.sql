-- Chapter 9.5.2 - Journal entries and lines

CREATE TYPE "JournalSourceType" AS ENUM ('INVOICE', 'PAYMENT', 'REFUND', 'COMMISSION', 'PAYOUT', 'ADJUSTMENT');

CREATE TABLE "JournalEntry" (
  "id" TEXT NOT NULL,
  "entryNumber" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "sourceType" "JournalSourceType" NOT NULL,
  "sourceId" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JournalLine" (
  "id" TEXT NOT NULL,
  "journalEntryId" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "debitTzs" INTEGER NOT NULL DEFAULT 0,
  "creditTzs" INTEGER NOT NULL DEFAULT 0,
  "memo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "JournalLine_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JournalEntry_entryNumber_key" ON "JournalEntry"("entryNumber");
CREATE UNIQUE INDEX "JournalEntry_sourceType_sourceId_key" ON "JournalEntry"("sourceType", "sourceId");
CREATE INDEX "JournalEntry_occurredAt_idx" ON "JournalEntry"("occurredAt");
CREATE INDEX "JournalLine_journalEntryId_idx" ON "JournalLine"("journalEntryId");
CREATE INDEX "JournalLine_accountId_idx" ON "JournalLine"("accountId");

ALTER TABLE "JournalLine"
  ADD CONSTRAINT "JournalLine_journalEntryId_fkey"
  FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JournalLine"
  ADD CONSTRAINT "JournalLine_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "Account"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
