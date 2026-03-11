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

## Chapter 4.4 PASS

- Re-ran Chapter 4.3 pre-flight checks before implementation.
- Added DriverProfile linked to Zone with availability and optional vehicle metadata.
- Added Trip and TripStop models for pickup and delivery batches.
- Verified admin can list drivers, create a trip, and attach order-linked stops.
- Verified driver login works and driver profile/trips/tasks are scoped to the authenticated driver only.
- Verified cross-driver trip access returns 403.
- Gate satisfied: Admin can assign tasks; driver sees only assigned tasks.

## Chapter 4.4 PASS

- Re-ran Chapter 4.3 pre-flight checks before implementation.
- Added DriverProfile linked to Zone with availability and optional vehicle metadata.
- Added Trip and TripStop models for pickup and delivery batches.
- Verified admin can list drivers, create a trip, and attach order-linked stops.
- Verified driver login works and driver profile/trips/tasks are scoped to the authenticated driver only.
- Verified cross-driver trip access returns 403.
- Gate satisfied: Admin can assign tasks; driver sees only assigned tasks.

## Chapter 4.5 PASS

- Re-ran prior chapter pre-flight checks: Docker healthy, migrations and seed succeeded, prior driver and affiliate scoping still worked.
- Added Order core truth fields: customerUserId, channel, tier, sourceType, affiliateShopId, zoneId, hubId, pickupAddressId, dropoffAddressId, statusCurrent.
- Added Bag entity with unique tagCode and linked one bag per order in V1.
- Added append-only OrderEvent timeline and verified ordered retrieval through API.
- Added OrderIssue entity with explicit issue types and lifecycle statuses.
- Verified API flow: create order, auto-create bag, append events, read timeline, create issue, resolve issue.
- Verified issue actions append explicit ISSUE_OPENED and ISSUE_RESOLVED events.
- Gate satisfied: Create order append events read timeline reliably.

## Chapter 5.1 PASS

- Re-ran Chapter 4.5 pre-flight: docker healthy, migrations in sync, seed succeeded, Prisma Studio showed Order/Bag/OrderEvent/OrderIssue, and API health returned 200.
- Swagger UI endpoint responded successfully at http://localhost:3001/api.
- OpenAPI JSON endpoint responded successfully at http://localhost:3001/api/openapi.json.
- Verified POST /v1/auth/login succeeded for affiliate.staff.shopa@mimo.local.
- Verified POST /v1/orders created order API-ORDER-0006 successfully with zone-to-hub routing.
- Verified GET /v1/orders/:id/timeline returned immutable ORDER_CREATED event data for the new order.
- Verified validation error responses use standardized schema: errorCode, message, details, traceId, timestamp.
- Verified forbidden responses use standardized schema: errorCode, message, details, traceId, timestamp.
- Documented OpenAPI v1 contract in docs/api/openapi_v1.md.
- Gate satisfied: Swagger UI renders; example requests validate against server.

## Chapter 5.2 PASS

- Re-ran Chapter 5.1 pre-flight and verified Swagger UI at /api, OpenAPI JSON at /api/openapi.json, and health endpoint at /health.
- Generated TypeScript SDK in packages/sdk from saved OpenAPI snapshot using openapi-typescript.
- Added SDK scripts: refresh:openapi, gen, and check.
- Added root scripts: pnpm gen:sdk and pnpm check:sdk.
- Verified apps/web imports @mimo/sdk and builds successfully.
- Verified apps/mobile imports @mimo/sdk and typechecks/builds successfully.
- Proved compile lock by simulating generated-file drift and confirming pnpm check:sdk failed until regeneration restored alignment.
- Gate satisfied: Web and mobile import SDK and build successfully.

## Chapter 6.1 PASS

- Re-ran Chapter 5.2 pre-flight successfully: repo build passed, API reachable, Swagger UI reachable, SDK build passed.
- Added authentication flow for customers and staff using phone number as primary identity in +255 format.
- Implemented POST /v1/auth/register, POST /v1/auth/login, POST /v1/auth/refresh, POST /v1/auth/logout, and protected GET /v1/auth/me.
- Implemented access tokens and refresh tokens with server-side hashed refresh token persistence and rotation.
- Verified customer registration succeeded.
- Verified customer login returned access token and refresh token.
- Verified protected route returned 401 without bearer token.
- Verified protected route returned 200 with valid bearer token.
- Verified refresh rotation revoked the old refresh token.
- Verified logout revoked the active refresh token.
- Verified seeded staff accounts logged in with correct role claims:
  - ADMIN
  - HUB_STAFF
  - DRIVER
  - AFFILIATE_STAFF
- Added docs/security/authentication.md documenting identity rules, token TTLs, rotation, logout behavior, and session revocation rules.
- Gate satisfied: Tokens issued; refresh works; protected routes block without token.

## Chapter 6.2 PASS

- Re-ran Chapter 6.1 pre-flight and confirmed protected auth route returned 401 without token.
- Confirmed admin-only endpoint /v1/admin/users returned 403 for AFFILIATE_STAFF and 200 for ADMIN.
- Confirmed Affiliate Staff A cross-shop access to order_scope_b returned 403.
- Confirmed Driver A cross-driver access to rip_driver_b returned 403.
- Confirmed Hub Staff A cross-hub access to order_scope_b returned 403.
- Confirmed Customer A cross-customer access to order_scope_b returned 403.
- Confirmed ADMIN could access order_scope_b and rip_driver_b successfully.
- Confirmed non-DEV_ADMIN could not call dev override endpoint and received 403.
- Confirmed DEV_ADMIN override endpoint required
  eason and returned 400 when omitted.
- Confirmed DEV_ADMIN override assign-hub and append-event endpoints both returned 200 when called with valid reason.
- Confirmed audit logs were created for both DEV_ADMIN overrides and fetched successfully for order_scope_b.
- Gate satisfied: Attempted cross-scope access returns 403 consistently.

## Chapter 6.3 PASS

- Re-verified Chapter 6.2 pre-flight: scoped affiliate access to foreign order returned 403.
- Added Prisma AuditLog contract with actorUserId, actorRole, actionCode, targetType, targetId, reason, beforeJson, afterJson, ipAddress, userAgent, and occurredAt.
- Applied migration chapter_6_3_audit_log_contract successfully after resolving local dev schema drift with migrate reset.
- Verified AuditLog accepts inserted records directly in the database.
- Implemented centralized audit recording helper and request metadata capture in pps/api/src/dev.ts.
- Verified DEV_OVERRIDE_ASSIGN_HUB creates audit entries automatically.
- Verified DEV_OVERRIDE_APPEND_EVENT creates audit entries automatically.
- Added admin-only audit endpoints:
  - GET /v1/admin/audit
  - GET /v1/admin/audit/:id
- Verified admin can query audit logs successfully.
- Verified non-admin access to admin audit endpoints returns 403.
- Final gate proof:
  - Performed 3 privileged actions on order_customer_a
  - Confirmed corresponding audit entries exist with actorUserId, actorRole, actionCode, targetType, targetId, and occurredAt
  - Confirmed request metadata fields ipAddress and userAgent were captured
- Gate satisfied: Key actions create audit entries with actor + timestamp.

## Chapter 7.1 PASS

- Re-ran prior chapter verification gate: repo-wide typecheck, lint, and test all passed before starting Chapter 7.1.
- Implemented shared semantic design tokens in packages/ui for colors, typography, spacing, radii, and subtle shadow baseline.
- Exported web-ready shared styles and token helpers from @mimo/ui.
- Wired pps/web to import @mimo/ui/styles.css and apply shared token-driven base styling.
- Added web demo route at /ui-demo showing color swatches, typography samples, spacing scale, and radii samples.
- Verified pps/mobile imports shared tokens from @mimo/ui without type errors.
- Added docs/ui/design_tokens.md documenting palette, typography, spacing, radii, and naming rules.
- Gate satisfied: UI package renders demo page correctly.

## Chapter 7.2 PASS

- Re-ran previous chapter pre-flight verification successfully:
  - pnpm -r typecheck
  - pnpm -r lint
  - pnpm -r test
  - pnpm --filter web dev and verified /ui-demo
- Implemented component library v1 in packages/ui/src/components
- Added Button with required variants, sizes, loading, and disabled states
- Added Input with label, helper text, error state, and required input types
- Added Card with default, subtle, and clickable variants
- Added Badge with neutral, info, success, warning, and danger variants
- Added Toast system with success/info/error helpers, stacking, and auto-dismiss
- Added controlled Modal with title/body/footer composition
- Added SkeletonLine, SkeletonCard, and SkeletonList
- Added OrderTimeline skeleton with done/current/pending/error states
- Added web component gallery page at /components
- Added docs/ui/component_library_v1.md
- Gate proof required next: verify pnpm --filter ui build and open /components with no runtime errors

## Chapter 7.3 PASS

- Added bilingual EN/SW support for web and mobile using i18next + react-i18next
- Added runtime language toggle for both apps
- Added persisted language preference using localStorage on web and AsyncStorage on mobile
- Replaced user-facing strings on the web component gallery and app home/login placeholders with translation keys
- Added shared locale formatting helpers for TZS, date/time, and +255 phone display
- Added documentation at docs/ui/i18n.md
- Gate target for verification: toggle language; screens update; formats correct

## Chapter 8.1 PASS

- Re-ran prior chapter verification successfully before implementation.
- Added API health endpoint at GET /v1/health.
- Added DB connectivity proof endpoint at GET /v1/health/db.
- Updated API contract snapshot and regenerated SDK to match auth request/response shapes.
- Added root one-command dev startup script in scripts/dev.mjs and wired root pnpm dev.
- Added web login shell with EN/SW toggle, token storage, and API connected indicator.
- Added mobile login shell with EN/SW toggle, token storage, and API connected indicator.
- Verified pnpm -r build passed.
- Verified pnpm -r lint passed.
- Verified pnpm -r typecheck passed.
- Verified GET /v1/health returned ok.
- Verified GET /v1/health/db returned ok.
- Verified web login succeeded and showed API connected state.
- Verified mobile login succeeded in Expo web and showed API connected state.
- Noted local environment limitation: physical-device Expo Go / Android SDK setup was not fully validated in this chapter.
- Gate satisfied: One command starts the local system spine, and all core app surfaces reach backend for the walking skeleton proof.

## Chapter 8.2 PASS

- Added customer order creation endpoint at POST /v1/orders.
- Added order timeline endpoint at GET /v1/orders/:id/timeline.
- Verified customer can create DOOR, SHOP_DROP, and HYBRID orders.
- Verified derived zone and hub assignment on order creation.
- Verified automatic bag creation and initial ORDER_CREATED timeline event.
- Added web customer order form and timeline view.
- Verified web customer can create an order and view latest order details plus timeline.
- Added mobile customer order form and timeline view.
- Verified mobile customer can create an order and view latest order details plus timeline.
- Verified timeline endpoint returned appended events including PICKUP_SCHEDULED for the exact order under test.
- Gate satisfied: customer can place an order and see initial order status/timeline on web and mobile.

## Chapter 8.3 PASS

- Re-ran previous chapter verification successfully before implementation.
- Added deterministic hub assignment by zone at order creation using first active hub in zone ordered by createdAt ascending.
- Added rejection for missing active hub in zone with stable error code HUB_NOT_AVAILABLE_IN_ZONE.
- Added HUB_ASSIGNED order event and applied Prisma migration for enum update.
- Added affiliate shop lookup endpoint GET /v1/affiliate-shops?zoneId=....
- Added server-side shop-zone enforcement for SHOP_DROP and HYBRID with stable error code AFFILIATE_SHOP_ZONE_MISMATCH.
- Updated web and mobile order creation flows to use zone-driven affiliate shop selection inputs.
- Added admin trip creation endpoint POST /v1/admin/trips.
- Added admin trip stop assignment endpoint POST /v1/admin/trips/:id/stops.
- Enforced strict zone consistency for trip creation and stop assignment with stable error code ZONE_ASSIGNMENT_MISMATCH.
- Verified Zone A order auto-assigned to Hub A and Zone B order auto-assigned to Hub B.
- Verified timelines include both ORDER_CREATED and HUB_ASSIGNED.
- Verified zone-filtered affiliate shop lookup returns only matching shops.
- Verified cross-zone shop assignment is rejected with AFFILIATE_SHOP_ZONE_MISMATCH.
- Verified Admin can assign Zone A order to Driver A and Zone B order to Driver B.
- Verified cross-zone driver trip/stop assignment is rejected with ZONE_ASSIGNMENT_MISMATCH.
- Verified Driver A sees only Zone A assigned trip/order and Driver B sees only Zone B assigned trip/order.
- Gate satisfied: Orders correctly attach to zone + hub; tasks show for correct driver.

## Chapter 8.4 PASS

- Re-ran Chapter 8.3 pre-flight verification successfully using PowerShell/API proof.
- Added driver task list endpoint: GET /v1/driver/tasks.
- Added driver stop detail endpoint: GET /v1/driver/stops/:stopId.
- Verified driver task list returns assigned active stops only.
- Verified stop detail returns privacy-safe customer contact, location label, masked bag tag, and action label.
- Added pickup confirmation endpoint: POST /v1/driver/stops/:stopId/pickup.
- Verified wrong pickup tag fails with BAG_TAG_MISMATCH.
- Verified correct pickup tag succeeds, marks stop done, appends PICKED_UP, and updates Order.statusCurrent.
- Added OrderDeliveryOtp persistence model and migration.
- Added delivery OTP generator endpoint for controlled verification: POST /v1/dev/orders/:orderId/delivery-otp.
- Added delivery confirmation endpoint: POST /v1/driver/stops/:stopId/deliver.
- Verified wrong OTP fails with OTP_INVALID.
- Verified expired OTP fails with OTP_EXPIRED.
- Verified correct OTP succeeds, marks stop done, appends DELIVERED, updates Order.statusCurrent, and invalidates OTP.
- Verified customer timeline shows PICKED_UP and DELIVERED after proof actions.
- Verified repeat delivery on completed stop is blocked with STOP_ALREADY_COMPLETED.
- Gate satisfied: Proof updates timeline; customer sees updates.
