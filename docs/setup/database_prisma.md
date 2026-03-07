# Database Prisma Setup

## Scope

Chapter 3.2 establishes Prisma as the single source of truth for local database structure and migrations.

## Environment

Set DATABASE_URL in pps/api/.env for local development.

Example format:

postgresql://postgres:postgres@localhost:5432/mimo_laundry_os?schema=public

Only placeholder values belong in .env.example. Real secrets stay in ignored .env files.

## Prisma 7 configuration

Prisma 7 reads the database URL from aapps/api/prisma.config.ts.
The schema file remains at aapps/api/prisma/schema.prisma.

## Commands

From repo root:

- pnpm --filter @mimo/api exec prisma validate
- pnpm --filter @mimo/api db:migrate
- pnpm --filter @mimo/api db:seed
- pnpm --filter @mimo/api db:studio

## Reset procedure (local only)

1. Stop app processes.
2. Run:
   - pnpm --filter @mimo/api exec prisma migrate reset --force
3. Rerun seed:
   - pnpm --filter @mimo/api db:seed

## Notes

- Prisma schema lives at aapps/api/prisma/schema.prisma
- Prisma config lives at aapps/api/prisma.config.ts
- Migration artifacts live at aapps/api/prisma/migrations
- Seed script lives at aapps/api/prisma/seed.ts
- Manual database editing is not allowed; schema changes must go through Prisma migrations
