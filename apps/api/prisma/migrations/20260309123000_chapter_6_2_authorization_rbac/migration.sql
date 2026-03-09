CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "actorUserId" TEXT,
  "actorRole" TEXT,
  "actionCode" TEXT NOT NULL,
  "targetResourceType" TEXT NOT NULL,
  "targetResourceId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "beforeJson" JSONB,
  "afterJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");
CREATE INDEX "AuditLog_targetResourceType_targetResourceId_idx" ON "AuditLog"("targetResourceType", "targetResourceId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
