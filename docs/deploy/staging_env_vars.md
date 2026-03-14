# Staging Environment Variables

This file documents staging environment variable names only.
Do not store secret values in git.

## Shared / app environment

- APP_ENV
- NODE_ENV

## API / Worker

- DATABASE_URL
- REDIS_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- CORS_ORIGIN_WEB
- API_BASE_URL
- WEB_BASE_URL

## Storage

- STORAGE_PROVIDER
- STORAGE_BUCKET
- STORAGE_REGION
- STORAGE_ENDPOINT
- STORAGE_ACCESS_KEY_ID
- STORAGE_SECRET_ACCESS_KEY

## Optional app/runtime

- PORT
- LOG_LEVEL

## Notes

- All values must be staging-specific.
- Staging secrets must be stored only in provider dashboards and/or GitHub Actions secrets.
- No secret values may be committed.
