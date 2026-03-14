# Rollback Strategy

## Purpose

This document defines how Laundry OS rolls back safely after a bad staging or production deployment.

## Decision owner

Rollback decision owner:

- primary: business owner / release approver
- backup: delegated technical operator running the deployment

The operator executes the rollback only after the decision owner confirms rollback is required.

## Evidence to capture before rollback

Capture and store:

- failed workflow URL
- deployment timestamp
- commit SHA
- error logs from migration, deploy, and smoke-test steps
- affected endpoints and observed symptoms
- database migration name if failure happened during migrate step

Record this evidence in the incident notes before making additional changes.

## Golden rule

Stop the bleeding first, restore service second, fix root cause third.

## App rollback

Use the hosting provider dashboard or CLI to redeploy the previous known-good release.

Generic operator sequence:

1. identify the last known-good deployment version
2. open the hosting provider deployment history
3. redeploy or promote the previous good version
4. verify:
   - `GET /v1/health`
   - `GET /v1/health/db`
5. capture proof that service is restored

Provider-specific execution details are added in Chapter 11.2 and 11.3 once hosting is finalized.

## Database rollback policy

Database migrations are forward-only.

Rules:

- do not attempt ad hoc destructive rollback in production
- if a migration is bad, create a corrective forward migration
- if the app must be restored quickly, roll back application code to a version compatible with the current schema, or ship a hotfix immediately after service stabilization

## When migration fails before deploy

If `prisma migrate deploy` fails:

1. deployment stops automatically
2. do not start the new app version
3. inspect the exact migration error
4. correct the migration with a follow-up change
5. re-run pipeline after the fix is committed

## Feature-flag rollback

If a problem is isolated to a feature guarded by configuration or flag:

1. disable the feature first
2. verify service stability
3. only do a full app rollback if disabling the feature is insufficient

## Incident checklist

1. confirm incident scope
2. freeze new deploys
3. decide: feature off, app rollback, or hotfix forward
4. restore service
5. verify health endpoints
6. communicate status
7. create corrective change
8. document root cause and prevention

## Required proof after rollback

The operator must capture:

- restored deployment version
- health endpoint results
- DB health endpoint result
- customer-facing symptom cleared
- follow-up task or incident ticket reference
