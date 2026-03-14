# Backups & Disaster Recovery v1

## Objective

Provide a repeatable backup and restore process for Laundry OS so the system can recover from database loss or corruption with minimal operator confusion.

## Source of truth

- PostgreSQL database is mandatory to back up.
- Redis is not a source of truth and is not required for correctness restores.
- File storage backups are recommended for proof photos and should follow the storage provider retention rules once production hosting is finalized.

## Backup method in v1

Current proof uses scripted PostgreSQL backups with `pg_dump` in custom format.

Script:

- `scripts/backup_db.ps1`

Inputs:

- `DATABASE_URL` environment variable or `apps/api/.env`
- Optional output directory override

Output:

- Timestamped dump file under `backups/db/`

## Restore method in v1

Current proof uses scripted PostgreSQL restore into a staging-like database.

Script:

- `scripts/restore_db.ps1`

Default target:

- Source database name rewritten to `mimo_laundry_os_staging_restore` unless a target URL is passed explicitly

## Retention policy

- Daily backups retained for 14 days
- Weekly backups retained for 8 weeks
- Production target state: managed provider backups with encryption at rest and point-in-time recovery enabled where available

## Encryption / security note

- Local proof backups are stored on the operator machine for restore rehearsal
- Production target is encrypted managed backups at rest
- Access to backup files must be restricted to operators/admins only
- Do not commit backup files into git

## Restore drill steps

1. Confirm current chapter pre-flight verification is green
2. Create known data in the source database so restore proof is meaningful
3. Run `scripts/backup_db.ps1`
4. Confirm dump file exists and size is non-zero
5. Run `scripts/restore_db.ps1` into a staging/staging-like database
6. Point the API to the restored database
7. Run health checks:
   - `GET /v1/health`
   - `GET /v1/health/db`
8. Spot-check restored data (for example orders count or a known test order reference)

## Incident responsibilities

- Admin / operator:
  - Trigger restore runbook
  - Capture logs and verify health endpoints
- Engineering:
  - Validate migration state
  - Confirm restored data integrity
  - Re-enable normal operations after validation

## Non-engineer emergency note

If production hosting later provides automated backups:

- enable daily backups
- enable PITR if offered
- keep this restore drill document updated to match the hosting provider controls
