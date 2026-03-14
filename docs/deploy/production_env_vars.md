# Production environment variables (names only)

## API / Worker

- DATABASE_URL
- REDIS_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET
- R2_PUBLIC_BASE_URL
- SENTRY_DSN
- APP_ENV=production
- CORS_ALLOWED_ORIGINS=https://app.mimolaundry.org
- LOG_LEVEL=info

## Web

- NEXT_PUBLIC_API_BASE_URL=https://api.mimolaundry.org
- NEXT_PUBLIC_APP_ENV=production

## Verified production targets

- Web URL: https://app.mimolaundry.org
- API URL: https://api.mimolaundry.org

## Hosting note

- Current Vercel project is used as the production web target.
- Render production API service: mimo-laundry-os-prod-api
