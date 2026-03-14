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
- CORS_ALLOWED_ORIGINS=https://www.mimolaundry.org,https://app.mimolaundry.org
- LOG_LEVEL=info

## Web

- NEXT_PUBLIC_API_BASE_URL=https://api.mimolaundry.org
- NEXT_PUBLIC_APP_ENV=production

## Correction note

- Production web must not reference staging API.
- Any old value such as https://mimo-laundry-os-staging-api.onrender.com is invalid for production.
