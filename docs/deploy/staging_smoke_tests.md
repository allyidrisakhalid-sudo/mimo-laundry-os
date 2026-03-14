# Staging Smoke Tests

## Minimum required checks

- Web staging URL loads
- API staging GET /v1/health returns 200 with status ok
- API staging GET /v1/health/db returns 200 with db ok
- Worker staging starts and connects to Redis/DB
- Optional: login works with seeded staging credentials
- Optional: create order and read timeline in staging

## Storage expectations

- Provider: Cloudflare R2
- Bucket name: laundryos-staging
- Access policy: private
- Secrets must not be committed
- Use signed/private access for proof photos later

## Notes

- Staging storage must be isolated from production.
- Bucket name and secret names must be documented, but not secret values.
