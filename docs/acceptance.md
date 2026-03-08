# Acceptance

## Chapter 0.1 PASS

- Verified mission lock exists: docs/product/mission_lock.md
- Verified MVP scope exists: docs/product/mvp_scope.md
- Verified success metrics exists: docs/product/success_metrics.md
- Proof: git status clean and chapter 0.1 docs committed in 650c7b1

## Chapter 0.2 PASS

- Created frozen architecture invariants document: docs/architecture/core_invariants.md
- Verified each invariant is written as a strict must/never rule.
- Verified each invariant includes at least one future test expectation.
- Verified invariants remain consistent with Chapter 0.1 mission, MVP scope, and success metrics.
- Freeze rule: future changes require an architecture change request document and approval before implementation.

## Chapter 1.1 PASS

- Verified Git, Node.js, npm, pnpm, corepack, Docker, Docker Compose, WSL2, and VS Code CLI.
- Verified required VS Code extensions are installed: ESLint, Prettier, Prisma, Docker, and GitLens.
- Verified Docker runtime by successfully running the hello-world container.
- Created docs/setup/workstation_baseline.md with workstation proof and versions.
- Gate satisfied: Version checks all pass; Docker runs containers.

## Chapter 1.2 PASS

- Added .env discipline with root and app-level .env.example templates.
- Confirmed local .env files are ignored by git.
- Added docs/security/env_standard.md, docs/security/secrets_policy.md, and docs/security/repo_standards.md.
- Updated .gitignore with secret and local environment patterns.
- Proved pre-commit enforcement by attempting a commit that was blocked by Husky + lint-staged + Prettier.
- Gate satisfied: No secrets in repo; pre-commit checks enforced.

## Chapter 2.1 PASS

- Created Turborepo workspace root with package.json, pnpm-workspace.yaml, turbo.json, and tsconfig.base.json.
- Created required app workspaces: api, web, mobile, docs.
- Created required shared packages: ui, types, sdk, config.
- Verified pnpm install completed successfully across the workspace.
- Verified repo-wide build, lint, typecheck, and test commands completed successfully.
- Verified smoke-level startup for API, web, and mobile.
- Created docs/repo/monorepo_structure.md documenting the monorepo skeleton.
- Gate satisfied: Install/build/test commands run repo-wide successfully.

- Cleaned generated Turbo cache artifacts from version control and restored clean working tree state.

## Chapter 2.2 PASS

- Enforced repo-wide TypeScript strict mode through shared config in packages/config.
- Added root Prettier and ESLint configuration as the single formatting/lint source of truth.
- Configured Husky, lint-staged, and commitlint for commit-time enforcement.
- Added Vitest baseline with passing sample tests in apps/api and packages/types.
- Added docs/changelog_policy.md and locked chapter-based changelog updates.
- Gate satisfied: lint + format + typecheck + sample tests pass, and commit conventions are enforced.

## Chapter 3.1 PASS

- Added compose.yaml with Postgres and Redis services, explicit ports, healthchecks, and named Postgres volume.
- Added docs/setup/local_infra.md documenting services, ports, volumes, start/stop, verification, and safe reset steps.
- Expanded .env.example with local infrastructure defaults for Postgres and Redis.
- Verified Postgres connectivity to database mimo_laundry_os as user mimo.
- Verified Redis ping returned PONG.
- Verified containers restart cleanly and Postgres data persisted after restart using chapter_3_1_persistence_check.
- Confirmed .env remains untracked; only .env.example is committed.
- Gate satisfied: DB reachable; Redis ping ok; containers restart cleanly.

## Chapter 3.2 PASS

- Pre-flight retest confirmed postgres and redis containers are running from Chapter 3.1.
- Prisma validate passed against apps/api/prisma/schema.prisma.
- Initial migration was created under apps/api/prisma/migrations and applied successfully to local Postgres.
- Dev-only seed completed successfully and reran successfully.
- Prisma Studio opened successfully and displayed the Prisma migration table plus application tables.
- Gate satisfied: Migration applied + seed inserts + Prisma Studio opens.

## Chapter 4.1 PASS

- Re-ran Chapter 3.2 pre-flight verification successfully before implementation.
- Added Zone as a first-class entity in Prisma.
- Added required zone foreign keys for Hub, AffiliateShop, Driver.homeZoneId, and CustomerAddress.
- Added DriverSecondaryZone as schema-ready support for future secondary zone assignment.
- Applied and committed migrations for zone entity and zone assignment links.
- Updated seed to create Zone A and Zone B plus linked Hub A/Hub B, Affiliate Shop A/Affiliate Shop B, Driver A/Driver B, and a customer address in Zone A.
- Verified API returns correct zone mappings for hubs, affiliates, and drivers.
- Verified Prisma Studio shows zone-linked records.
- Gate satisfied: Zones can be created; objects can be linked; queries return correct mappings.

## Chapter 4.1 PASS

- Re-ran Chapter 3.2 pre-flight verification successfully before implementation.
- Added Zone as a first-class entity in Prisma.
- Added required zone foreign keys for Hub, AffiliateShop, Driver.homeZoneId, and CustomerAddress.
- Added DriverSecondaryZone as schema-ready support for future secondary zone assignment.
- Applied and committed migrations for zone entity and zone assignment links.
- Updated seed to create Zone A and Zone B plus linked Hub A/Hub B, Affiliate Shop A/Affiliate Shop B, Driver A/Driver B, and a customer address in Zone A.
- Verified API returns correct zone mappings for hubs, affiliates, and drivers.
- Verified Prisma Studio shows zone-linked records.
- Gate satisfied: Zones can be created; objects can be linked; queries return correct mappings.

## Chapter 4.2 PASS

- Pre-flight retest of Chapter 4.1 passed: Docker healthy, migrations in sync, seed passed, zones API returned records.
- Added Hub model with required zoneId FK and stored capacity/tier support fields.
- Added HubStaffProfile with unique userId and hub linkage; HUB_STAFF role added to UserRole.
- Regenerated Prisma client, reset local dev database, and applied migration 20260308081805_init.
- Seed now creates Zone A and Zone B, Sinza Hub and Mbezi Hub, plus one hub staff user for each hub.
- Verified GET /v1/hubs returned hubs with zone and staff mappings.
- Verified GET /v1/zones/:id/hubs returned the correct hub for the selected zone.
- Verified POST /v1/hubs created Kigamboni Hub successfully under Zone A.
- Gate satisfied: Create multiple hubs; assign to zones; list hubs by zone.

## Chapter 4.3 PASS

- Re-ran Chapter 4.2 pre-flight verification: docker services healthy, migrations in sync, seed succeeded, and zone-to-hub endpoints returned correct mappings.
- Extended AffiliateShop with commission plan linkage, address label, contact phone, and active status fields.
- Added CommissionPlan model with fixed-per-order and percent-of-service support.
- Added AffiliateStaffProfile linking one affiliate staff user to exactly one affiliate shop in V1.
- Added Order attribution fields: sourceType, affiliateShopId, channel, and orderZoneId.
- Seeded SHOP-A and SHOP-B, one affiliate staff user per shop, and one affiliate-sourced sample order per shop.
- Verified affiliate login via /v1/auth/affiliate/login.
- Verified GET /v1/affiliate/me returned affiliate shop and commission plan details.
- Verified POST /v1/affiliate/orders created an order with affiliateShopId and orderZoneId derived server-side from the authenticated affiliate shop.
- Verified GET /v1/affiliate/orders returned only the authenticated shop's orders.
- Verified cross-shop order access attempt returned 403 Forbidden.
- Gate satisfied: Affiliate shop can log in and create/view its own orders only.
