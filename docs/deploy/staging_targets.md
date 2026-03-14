# Staging Targets

## Locked provider choices for Chapter 11.2

This chapter locks the staging hosting targets for Laundry OS.

- Web: Vercel
- API: Render Web Service
- Worker: Render Background Worker
- Database: Neon Postgres
- Redis: Upstash Redis
- Storage: Cloudflare R2

## Staging project/service naming

### Vercel

- Project name: mimo-laundry-os-staging-web

### Render

- API service: mimo-laundry-os-staging-api
- Worker service: mimo-laundry-os-staging-worker

### Neon

- Project / database target: laundryos-staging

### Upstash

- Redis database name: laundryos-staging-redis

### Cloudflare R2

- Bucket name: laundryos-staging

## Isolation rules

- Staging is isolated from production.
- Staging uses separate database, redis, and storage resources.
- Staging uses staging-only secrets.
- Staging URLs must remain stable and documented.
- Staging deploy must run from CI/CD, not manual uploads.

## Notes

These provider choices are locked for this chapter and may only be changed later through a documented change in /docs/deploy.
