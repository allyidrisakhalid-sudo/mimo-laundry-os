# Production provider checklist (operator-run)

## Domains + SSL

- [ ] Configure app.<your-domain> in web hosting provider
- [ ] Configure api.<your-domain> in API hosting provider
- [ ] DNS records created
- [ ] Managed SSL issued
- [ ] HTTPS redirect enforced

## Production resources

- [ ] Separate production Postgres created
- [ ] Separate production Redis created
- [ ] Separate production storage bucket created

## API / Worker env vars

- [ ] DATABASE_URL set
- [ ] REDIS_URL set
- [ ] JWT_ACCESS_SECRET set (new unique value)
- [ ] JWT_REFRESH_SECRET set (new unique value)
- [ ] R2_ACCOUNT_ID set
- [ ] R2_ACCESS_KEY_ID set
- [ ] R2_SECRET_ACCESS_KEY set
- [ ] R2_BUCKET set
- [ ] R2_PUBLIC_BASE_URL set
- [ ] APP_ENV=production
- [ ] CORS_ALLOWED_ORIGINS=https://app.<your-domain>
- [ ] LOG_LEVEL=info or warn

## Web env vars

- [ ] NEXT_PUBLIC_API_BASE_URL=https://api.<your-domain>
- [ ] NEXT_PUBLIC_APP_ENV=production

## Monitoring

- [ ] Uptime monitor for /v1/health
- [ ] Uptime monitor for /v1/health/db
- [ ] Error monitoring enabled
- [ ] Alert channel enabled
- [ ] Controlled alert test executed
