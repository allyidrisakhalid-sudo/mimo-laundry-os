# Background Jobs

## Purpose

Chapter 10.1 adds a BullMQ + Redis background job system so work can run outside the request/response path.

## Queues

### notifications

Used for notification-oriented async work such as reminders and customer-facing message placeholders.

### sla-alerts

Used for service-level monitoring jobs that detect orders stuck too long in an operational stage.

### finance

Used for finance-oriented background work such as payout draft generation.

## Local runtime

### API

Run:

- `pnpm --filter @mimo/api dev`

### Worker

Run:

- `pnpm run worker:dev`

### Combined dev

Root `pnpm dev` starts API and worker in parallel.

## Redis config

The worker and API use `REDIS_URL` from environment.
Default local fallback:

- `redis://localhost:6379`

## Retry policy

Jobs are configured with:

- attempts: `3`
- backoff: exponential
- default delay: `1000ms`

## Failure visibility

Failed jobs remain queryable and keep their failure reason.

Admin endpoints:

- `POST /v1/admin/jobs/enqueue`
- `GET /v1/admin/jobs/failed?queue=...`
- `GET /v1/admin/jobs/:id?queue=...`
- `POST /v1/admin/jobs/:id/retry?queue=...`

Non-admin users are blocked with `403`.

## Scheduled jobs

### SLA alerts

Scans for orders stuck too long in a stage and records/logs alert activity.

### Payment reminders

Scans unpaid finalized invoices and records/logs reminder activity.

### Payout draft runs

Builds draft payout recommendations for affiliates for admin review only; no auto-pay.

## Local schedule intervals

For local development, jobs run on short predictable intervals so repeated execution can be verified in a short session.

Recommended pattern:

- about every 1 minute for reminder and SLA checks
- about every 2 minutes for payout draft generation

Production intervals should be slower and aligned to operations policy.

## Runtime proof expectations

A valid local proof for Chapter 10.1 shows:

- worker connects to Redis
- success jobs complete
- fail jobs retry and end in failed state
- failed jobs remain visible in admin endpoints
- scheduled jobs run repeatedly over time with logs and/or records
