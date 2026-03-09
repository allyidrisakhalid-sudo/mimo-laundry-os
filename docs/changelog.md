# Changelog

## 2026-03-07 Chapter 0.1 Mission Lock

- Added docs/product/mission_lock.md
- Added docs/product/mvp_scope.md
- Added docs/product/success_metrics.md
- Established operational definition of done, explicit MVP exclusions, and launch metrics

## Chapter 0.2 completed

- Added docs/architecture/core_invariants.md
- Locked architectural invariants for multi-hub, zones, immutable order events, versioned pricing, traceable ledgers, and RBAC plus audit logging
- Updated docs/acceptance.md with Chapter 0.2 PASS

## Chapter 1.1 completed

- Added docs/setup/workstation_baseline.md
- Recorded verified workstation toolchain versions for Git, Node.js, pnpm, Docker, WSL2, and VS Code
- Updated docs/acceptance.md with Chapter 1.1 PASS

## Chapter 1.2 completed

- Added local environment file standard and app-level .env.example templates.
- Added security documentation for environment handling, secrets policy, and repository standards.
- Updated .gitignore to block secrets, local env files, and node_modules.
- Enabled Husky pre-commit and commit-msg hooks with lint-staged, Prettier, and commitlint.
- Verified a test commit was blocked by pre-commit checks, proving enforcement is active.

## Chapter 2.1 completed

- Created Turborepo workspace root with package.json, pnpm-workspace.yaml, turbo.json, and tsconfig.base.json.
- Created required app workspaces: api, web, mobile, docs.
- Created required shared packages: ui, types, sdk, config.
- Repaired workspace package manifests and completed scaffold recovery for web and mobile.
- Verified pnpm install completed successfully across the workspace.
- Verified repo-wide build, lint, typecheck, and test commands completed successfully.
- Created docs/repo/monorepo_structure.md documenting the monorepo skeleton.

- Ignored Turbo cache artifacts and removed generated .turbo files from version control.

## Chapter 2.2 completed

- Added shared TypeScript strict config in packages/config and updated workspaces to extend it.
- Added root ESLint and Prettier configuration with repo-wide lint/format scripts.
- Added Vitest baseline tests in apps/api and packages/types.
- Added Husky, lint-staged, and commitlint enforcement for standardized commits.
- Added docs/changelog_policy.md and recorded Chapter 2.2 completion.

- Pre-commit enforcement probe for Chapter 2.2.

## Chapter 3.1 completed

- Added Docker Compose local infrastructure for Postgres and Redis with healthchecks and persistent Postgres volume.
- Added docs/setup/local_infra.md for local infrastructure operations and safe reset guidance.
- Expanded .env.example with Postgres and Redis local defaults.

## Chapter 3.2 completed

- Added Prisma schema, Prisma 7 config, initial migration, and Prisma client generation for apps/api.
- Added dev-only seed system with baseline users and audit log records.
- Added docs/setup/database_prisma.md documenting DATABASE_URL, migrate, seed, studio, and local reset flow.

## Chapter 4.1 completed

- Added Zone model and required zone relationships for Hub, AffiliateShop, Driver, DriverSecondaryZone, CustomerProfile, and CustomerAddress.
- Added migrations for zone entity and zone assignment links.
- Added seed data for Zone A and Zone B with linked hubs, affiliate shops, drivers, and customer address.
- Implemented minimal zone API endpoints and mapping queries in the current API runtime.
- Added docs/architecture/zones.md documenting zone rules and derivation.

## Chapter 4.1 completed

- Added Zone model and required zone relationships for Hub, AffiliateShop, Driver, DriverSecondaryZone, CustomerProfile, and CustomerAddress.
- Added migrations for zone entity and zone assignment links.
- Added seed data for Zone A and Zone B with linked hubs, affiliate shops, drivers, and customer address.
- Implemented minimal zone API endpoints and mapping queries in the current API runtime.
- Added docs/architecture/zones.md documenting zone rules and derivation.

## Chapter 4.2 completed

- Added Hub entity with required zone mapping, location label, stored capacity fields, tier support flags, and active status.
- Added HubStaffProfile and HUB_STAFF role support for one-hub-per-staff assignment in V1.
- Updated seed with multiple hubs across zones and hub staff users.
- Added API endpoints for listing hubs, reading a hub, creating a hub, and listing hubs by zone.
- Added docs/architecture/hubs.md.

## Chapter 4.3 completed

- Extended Prisma schema with CommissionPlan, AffiliateStaffProfile, and Order attribution fields for affiliate-sourced orders.
- Added migrations for affiliate staff linkage and affiliate order attribution.
- Updated seed data with commission plans, affiliate staff users, and affiliate-sourced sample orders.
- Implemented affiliate login, affiliate profile, and shop-scoped affiliate order endpoints in the API.
- Added docs/architecture/affiliates.md documenting affiliate shop, staff linkage, attribution, and scoping rules.

## Chapter 4.4 completed

- Added DriverProfile, Trip, and TripStop domain entities with availability and trip status enums.
- Added admin driver and trip assignment endpoints plus driver-scoped trip/task endpoints.
- Updated seed data with drivers, trips, and stops across zones.
- Added docs/architecture/drivers_dispatch.md.

## Chapter 4.4 completed

- Added DriverProfile, Trip, and TripStop domain entities with availability and trip status enums.
- Added admin driver and trip assignment endpoints plus driver-scoped trip/task endpoints.
- Updated seed data with drivers, trips, and stops across zones.
- Added docs/architecture/drivers_dispatch.md.

## Chapter 4.5 completed

- Added Order truth model fields for channel, tier, zone, hub, addresses, and statusCurrent.
- Added Bag, OrderEvent, and OrderIssue models with supporting enums and migrations.
- Updated seed with sample orders, bags, timeline events, and delay issue data.
- Added admin order/timeline/issue API endpoints and verified append-only event flow.
- Added docs/architecture/orders_timeline.md documenting order truth rules and issue lifecycle.

## Chapter 5.1 completed

- Added executable OpenAPI v1 contract and Swagger UI at /api.
- Added OpenAPI JSON endpoint at /api/openapi.json.
- Documented auth, orders, tracking, hub, driver, affiliate, and admin endpoint groups in docs/api/openapi_v1.md.
- Implemented standardized API error schema with errorCode, message, details, traceId, and timestamp.
- Added contract-to-database enum mapping for order channel/tier compatibility with current Prisma schema.
- Verified login, create order, and read timeline requests against the running API.

## Chapter 5.2 completed

- Added generated OpenAPI SDK package under packages/sdk with saved openapi.json snapshot and generated TypeScript types.
- Added typed client factory export for shared API access from web and mobile.
- Wired apps/web and apps/mobile to consume @mimo/sdk with minimal health endpoint placeholders.
- Added repeatable SDK generation and verification commands: refresh:openapi, gen, check, gen:sdk, and check:sdk.
- Documented SDK workflow in docs/api/sdk_generation.md.
- Added compile-lock enforcement so stale generated SDK output fails loudly until regenerated.

- Completed Chapter 6.1 authentication with phone-based login, JWT access/refresh tokens, refresh rotation, logout revocation, protected auth route proof, and seeded staff/customer accounts.

## Chapter 6.2 completed

- Added role-based authorization enforcement and scoped resource access checks in the API.
- Added admin-only endpoint protection and explicit 403 behavior for unauthorized roles.
- Added server-derived scope resolution for affiliate staff, drivers, hub staff, and customers.
- Added DEV_ADMIN override endpoints with mandatory reason field and audit logging.
- Added AuditLog persistence and documentation in docs/security/authorization_rbac.md.
- Added DEV_ADMIN and cross-scope seed data for repeatable authorization verification.
- Fixed API workspace typecheck by adding itest as a dev dependency.

## Chapter 6.3 completed

- Added AuditLog contract fields for actor, target, reason, before/after snapshots, request metadata, and occurredAt timestamp.
- Added centralized audit recording helper in the API dev server.
- Wired audit recording for existing DevAdmin override actions: assign hub and append order event.
- Added admin-only audit query endpoints: GET /v1/admin/audit and GET /v1/admin/audit/:id.
- Verified privileged actions create audit entries with actor + timestamp and that non-admin users receive 403 on admin audit endpoints.

## Chapter 7.1 completed

- Added shared UI design tokens in packages/ui for semantic colors, typography, spacing, radii, and baseline shadows.
- Wired pps/web global styling to consume shared UI tokens and added /ui-demo token showcase page.
- Verified pps/mobile can import and use the same shared tokens package.
- Added docs/ui/design_tokens.md.
