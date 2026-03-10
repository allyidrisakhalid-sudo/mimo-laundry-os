# Walking Skeleton Chapter 8.1

## Goal

Bring up the local end-to-end spine with one root command:

- Docker infra
- API
- Web
- Mobile

## Start

Run from repo root:
pnpm dev

## Local endpoints

- API: http://localhost:3001
- API health: http://localhost:3001/v1/health
- API DB health: http://localhost:3001/v1/health/db
- Swagger UI: http://localhost:3001/api
- Web: http://localhost:3000

## Login test account

Phone: +255712345678
Password: secret123

## Mobile note

If using a physical phone, set EXPO_PUBLIC_API_BASE_URL to your computer LAN IP instead of localhost.

## Troubleshooting

- Check docker compose ps
- Check port 3001 is free
- Check /v1/health responds
