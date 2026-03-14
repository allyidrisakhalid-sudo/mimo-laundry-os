# CI/CD

## Goal

Chapter 11.1 establishes a build-once CI/CD foundation for Laundry OS:

- every push to `main` and every pull request runs validation
- the exact commit that passes CI is the one used by staging deploy automation
- database migrations run in a dedicated deployment job before app deploy
- smoke tests verify the deployed staging API is healthy

## Workflows

### `CI`

Path: `.github/workflows/ci.yml`

Trigger:

- pull requests
- pushes to `main`

Sequence:

1. Checkout repository
2. Setup pnpm
3. Setup Node.js from `.nvmrc`
4. Install dependencies with frozen lockfile
5. Run `pnpm -r lint`
6. Run `pnpm -r typecheck`
7. Run `pnpm -r test`
8. Run `pnpm -r build`

Result:

- failures block merge because the workflow fails
- lockfile drift fails install because CI uses `--frozen-lockfile`

### `Deploy Staging`

Path: `.github/workflows/deploy-staging.yml`

Trigger:

- automatic on successful completion of `CI` for branch `main`

Sequence:

1. Checkout the exact `head_sha` that passed `CI`
2. Run Prisma client generation
3. Run deploy-safe DB migrations with `pnpm --filter @mimo/api db:migrate:deploy`
4. Trigger staging API/worker deploy hook
5. Trigger staging web deploy hook
6. Run smoke tests:
   - `GET /v1/health`
   - `GET /v1/health/db`

## Build-once principle

The staging deploy workflow uses:

- `github.event.workflow_run.head_sha`

That means the deploy workflow checks out the exact commit that already passed CI on `main`. No rebuild from a different commit is allowed in the pipeline definition.

## Required secrets

These are placeholders for Chapter 11.2 / 11.3 environment wiring:

- `STAGING_DATABASE_URL`
- `STAGING_API_DEPLOY_HOOK_URL`
- `STAGING_WEB_DEPLOY_HOOK_URL`
- `STAGING_API_BASE_URL`

## Required scripts

Root helpers:

- `pnpm -r lint`
- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm -r build`
- `pnpm db:generate`
- `pnpm db:migrate:deploy`

API helpers:

- `pnpm --filter @mimo/api db:generate`
- `pnpm --filter @mimo/api db:migrate:deploy`

## Deploy sequence

The controlled deployment order is:

1. CI validates the commit
2. staging migration job runs
3. if migration succeeds, deploy hooks are triggered
4. if deploy succeeds, smoke tests run
5. if smoke tests fail, incident procedure starts and rollback decision is made

## Migration safety rule

Migrations are not run by the API server during normal boot.
They are run in a dedicated workflow job with explicit logs.
If migration fails:

- deploy workflow fails
- API/web deploy steps do not run
- operators investigate before retrying

## Notes for Chapter 11.2

When staging infrastructure is wired:

- add the required repository secrets
- connect provider deploy hooks
- confirm smoke tests pass against the real staging URLs
