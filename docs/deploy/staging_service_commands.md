# Staging Service Commands

## Render API service

- Service type: Web Service
- Service name: mimo-laundry-os-staging-api
- Root directory: repo root
- Runtime: Node
- Build command: pnpm install --no-frozen-lockfile && pnpm --filter @mimo/api db:generate
- Start command: pnpm --filter @mimo/api dev

## Render Worker service

- Service type: Background Worker
- Service name: mimo-laundry-os-staging-worker
- Root directory: repo root
- Runtime: Node
- Build command: pnpm install --no-frozen-lockfile && pnpm --filter @mimo/api db:generate
- Start command: pnpm --filter @mimo/worker dev

## Required staging secrets

- APP_ENV=staging
- NODE_ENV=production
- DATABASE_URL
- REDIS_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- STORAGE_PROVIDER
- STORAGE_BUCKET
- STORAGE_REGION
- STORAGE_ENDPOINT
- STORAGE_ACCESS_KEY_ID
- STORAGE_SECRET_ACCESS_KEY
- WEB_BASE_URL
- API_BASE_URL
- CORS_ORIGIN_WEB

## Notes

- Do not commit secret values.
- Use staging-only secret values.
- We will verify /v1/health and /v1/health/db after service deploy.
