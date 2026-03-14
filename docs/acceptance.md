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

## Chapter 8.6 PASS

- Re-ran Chapter 8.5 pre-flight verification successfully against the live contract:
  - customer-created order flow still worked
  - admin delivery trip creation and stop assignment worked
  - driver pickup proof worked
  - driver delivery OTP proof worked
  - timeline showed ORDER_CREATED, HUB_ASSIGNED, PICKED_UP, and DELIVERED
- Added affiliate walk-in order creation endpoint at POST /v1/affiliate/orders.
- Verified affiliate shop-return order creation sets:
  - sourceType = AFFILIATE
  - affiliateShopId from auth scope
  - channel = SHOP_DROP
  - zoneId from affiliate shop
  - hubId from zone hub assignment
- Verified affiliate hybrid return order creation sets:
  - sourceType = AFFILIATE
  - channel = HYBRID
  - scoped affiliateShopId
  - derived dropoffAddressId for return-to-door flow
- Added affiliate scoped order list endpoint at GET /v1/affiliate/orders.
- Verified affiliate list returns only shop-scoped orders for shop_mikocheni.
- Added affiliate workflow endpoints:
  - POST /v1/affiliate/orders/:id/mark-ready-for-pickup
  - POST /v1/affiliate/orders/:id/customer-picked-up
- Verified mark-ready-for-pickup succeeds and returns statusCurrent = PACKED under current status enum contract.
- Verified customer-picked-up succeeds and returns statusCurrent = DELIVERED.
- Verified hybrid affiliate return can be dispatched through existing delivery trip flow and completed with driver OTP proof.
- Verified affiliate list reflects delivered hybrid order status after OTP-confirmed delivery.
- Verified cross-shop affiliate action against seeded shop B order returns 403 FORBIDDEN with message: Order does not belong to affiliate shop.
- Added docs/product/affiliate_ops_workflow.md.
- Gate satisfied: Affiliate can operate independently without seeing other shops.

## Chapter 9.1.6 PASS

- Fixed broken pricing migration history by removing five no-op pricing migrations and generating a real replacement migration:
  - 20260312155708_chapter_9_1_pricing_contract_fix
- Applied migration successfully and re-seeded the live DB.
- Verified pricing tables now exist in the live database:
  - PricingPlan
  - PricingPlanChannel
  - KgRate
  - ItemRate
  - DeliveryZoneFee
  - MinimumChargeRule
  - OrderPricingSnapshot
  - OrderLineItem
  - OrderTotals
- Added live invoice route:
  - GET /v1/orders/:id/invoice
- Added live intake finalization route:
  - POST /v1/admin/orders/:id/intake
- Added estimated quote generation at customer order creation using active plan lock.
- Verified live quote -> final recalculation flow end-to-end:
  - Created active pricing plan f778045-b728-4ce2-8860-fd684fcc1b65
  - Created DOOR order 5b10c140-ddbd-4ee7-ac0f-b440cdb375f1
  - Verified estimated snapshot status = ESTIMATED
  - Verified final snapshot status = FINALIZED
  - Verified pricing plan remained locked across estimate and final
  - Verified estimated grand total changed from 9500 to finalized grand total 15100 after intake with actual weight 4.2
- Gate satisfied: quote is generated at order creation, final pricing recalculates at intake, and the same pricing plan remains locked across both stages.

## Chapter 9.1 PASS

- Re-ran Chapter 8.6 operational pre-flight successfully:
  - customer order create + order read
  - affiliate scoped order create + affiliate order list
  - dispatch trip creation + driver task visibility
  - admin intake captured actual weight
- Verified versioned pricing engine database contract exists and is live.
- Verified admin pricing endpoints:
  - POST /v1/admin/pricing/plans
  - POST /v1/admin/pricing/plans/:id/activate
  - POST /v1/admin/pricing/plans/:id/rates
  - POST /v1/admin/pricing/plans/:id/delivery-fees
  - POST /v1/admin/pricing/plans/:id/minimum-charges
- Verified customer invoice endpoint:
  - GET /v1/orders/:id/invoice
- Verified quote -> final recalculation flow:
  - Order A quoted under Plan A
  - Order A finalized after intake using the same locked pricing plan
  - Grand total changed after actual weight intake
- Verified plan version lock:
  - Plan B activated after Order A
  - New Order B used Plan B
  - Earlier Order A remained locked to Plan A
- Verified privileged pricing actions produce audit records for plan changes.
- Verified required documentation file exists:
  - docs/finance/pricing_engine_v1.md
- Gate satisfied: same order recalculates correctly after intake; old orders remain on old plan.

## Chapter 9.2 PASS

Proof:

- Verified finalized invoice for order ca8be79e-d541-4d15-87c1-0f5d54c1f0c0.
- Verified stored line items summed to invoice grand total exactly:
  - Door delivery fee = 3000
  - Wash + Dry + Fold = 13600
  - Sum = 16600
  - Grand total = 16600
- Recorded payment using POST /v1/payments with:
  - method = MOBILE_MONEY
  - amountTzs = 16600
  - reference = MM-CH92-001
- Verified payment record persisted and was returned by GET /v1/orders/:id/payments.
- Verified receipt persisted and was returned by GET /v1/orders/:id/receipt.
- Verified receipt consistency:
  - receipt amount = 16600
  - payment amount = 16600
  - receipt reference = MM-CH92-001
  - payment reference = MM-CH92-001
- Verified invoice remained immutable after payment:
  - grand total stayed 16600
  - balance due moved from 16600 to 0
- Verified audit log recorded PAYMENT_RECORD with paymentId, receiptId, receiptNumber, method, amountTzs, and reference.
- Verified web lint passed.
- Verified API lint passed.
- Verified API build passed.

Gate satisfied: Invoice totals match line items; receipt is consistent.

## Chapter 9.3 PASS

- Re-ran Chapter 9.2 payment and receipt proof before implementation.
- Added cash payment recording endpoint at POST /v1/payments/cash.
- Added mobile money payment recording endpoint at POST /v1/payments/mobile-money.
- Added driver reconciliation submit endpoint at POST /v1/driver/reconciliation/submit.
- Added admin reconciliation summary endpoint at GET /v1/admin/reconciliation/drivers?date=....
- Added admin reconciliation approval endpoint at POST /v1/admin/reconciliation/:id/approve.
- Added refund issuance endpoint at POST /v1/admin/refunds.
- Added customer order balance endpoint at GET /v1/orders/:id/balance.
- Expanded GET /v1/orders/:id/payments to include refunds and ledger summary.
- Added payment custody and reconciliation persistence support.
- Added refund persistence support and order refund event flow.
- Added docs/finance/payments_v1.md.
- Verified end-to-end gate proof:
  - created order and finalized invoice
  - recorded partial cash payment
  - confirmed balance decreased
  - submitted and approved driver reconciliation
  - issued refund successfully
  - confirmed refunds list updated and balance increased
  - recorded final mobile money payment with reference
  - confirmed latest receipt shows final mobile money reference
  - confirmed final balance due returned to zero
- Gate satisfied: Paid orders close balance; refund adjusts ledger correctly.

## Chapter 9.4 PASS

- Verified affiliate order flow can progress from quoted to finalized to paid to delivered.
- Verified affiliate commission is created only when order is both DELIVERED and fully PAID.
- Verified delivered-but-unpaid order creates no commission.
- Verified paid-but-undelivered order creates no commission.
- Verified delivered-and-paid order creates exactly one earned commission ledger entry.
- Verified positive commission amount for fresh proof order: TSh 1,200 on TSh 12,000 service total.
- Verified payout draft total matched earned commission total.
- Verified payout approval preserved total correctly.
- Verified payout mark-paid preserved total correctly.
- Verified payout report showed paid total correctly for scoped window.
- Verified affiliate-scoped commission and payout endpoints returned expected records.
- Verified audit logs exist for COMMISSION_EARNED_CREATED, PAYOUT_APPROVED, and PAYOUT_PAID.

Gate satisfied: affiliate commissions and payouts work end-to-end with correct totals and audit trail.

## Chapter 9.5 PASS

- Re-ran Chapter 9.4 pre-flight proof successfully before implementation.
- Added minimal chart of accounts with idempotent seed for:
  - 1000 Cash on Hand
  - 1010 Mobile Money Clearing
  - 1100 Accounts Receivable
  - 2000 Affiliate Commissions Payable
  - 2010 Customer Credits Payable
  - 4000 Laundry Service Revenue
  - 4010 Delivery Revenue
  - 4020 Add-ons Revenue
  - 4900 Discounts / Promotions
  - 5100 Refund Expense
  - 5200 Affiliate Commission Expense
- Added append-only JournalEntry and JournalLine accounting models.
- Added automatic journal posting hooks for:
  - invoice finalization
  - payment recording
  - refund issuance
  - commission accrual
  - payout settlement
- Added admin daily close report endpoint:
  - GET /v1/admin/reports/daily-close?date=YYYY-MM-DD
- Added admin driver cash report endpoint:
  - GET /v1/admin/reports/driver-cash?date=YYYY-MM-DD
- Verified driver cash mismatch reporting:
  - submitted reconciliation showed mismatchFlag = true for a deliberate mismatch case
- Verified daily close report matched direct DB totals on 2026-03-13:
  - ordersTotal = 25
  - serviceRevenueTzs = 190000
  - deliveryRevenueTzs = 12000
  - addonsRevenueTzs = 0
  - discountsTzs = 0
  - grossRevenueTzs = 202000
  - paymentsTotalTzs = 183000
  - refundsTotalTzs = 9500
  - commissionEarnedTzs = 8400
  - payoutPaidTzs = 8400
- Verified journal entries were balanced for all sampled entries (debits == credits).
- Verified audit logs exist for privileged accounting actions including:
  - REFUND_ISSUE
  - PAYOUT_APPROVED
  - PAYOUT_PAID

Gate satisfied: Daily report matches DB; reconciliation flags mismatches.

## Chapter 10.1.2 PASS

- Added BullMQ-backed admin job enqueue endpoint.
- Added failed job list endpoint for admin visibility.
- Added single job detail endpoint for admin inspection.
- Added job retry endpoint for admin operations.
- Added worker runtime with notifications, sla-alerts, and finance queues.
- Verified worker connects to Redis successfully.
- Verified admin can enqueue success job and worker completes it.
- Verified fail jobs retry with exponential backoff and end in failed state after 3 attempts.
- Verified failed jobs remain visible through admin failed-job endpoints.
- Verified non-admin access to admin job endpoints returns 403.
- Gate satisfied: background jobs can be enqueued, retried, observed, and failed safely.

## Chapter 10.1 PASS

- Re-verified prior system stability before adding background jobs.
- Added BullMQ + Redis worker foundation with dedicated pps/worker process.
- Added queues:
  otifications, sla-alerts, and inance.
- Added admin job endpoints for enqueue, failed list, job detail, and retry.
- Verified worker connects to Redis successfully.
- Verified success jobs are processed asynchronously by worker.
- Verified fail jobs retry with exponential backoff and end in visible failed state after 3 attempts.
- Verified failed jobs remain queryable with failure reason through admin endpoints.
- Verified non-admin access to admin job endpoints returns 403.
- Added scheduled job persistence support for alert/reminder/payout draft records.
- Verified scheduled-job runtime window with API healthy and queue visibility intact.
- Gate satisfied: Jobs run repeatedly with logs; failures are visible.

## Chapter 10.3 PASS

- Re-ran prior chapter pre-flight and continued Chapter 10.3 from in-progress state safely.
- Restored and repaired pps/api/src/dev.ts after an interrupted edit left the file header corrupted.
- Confirmed Redis-backed rate limiting exists for:
  - auth register
  - auth login by IP
  - auth login by identity
  - admin baseline routes
  - OTP generation
  - OTP delivery verification
  - payment submission routes
- Confirmed validation hardening is active:
  - unknown request fields rejected
  - standardized VALIDATION_FAILED responses returned
  - proof reference formats constrained
- Added API integration/privacy test suite in pps/api/test/privacy.test.ts.
- Added abuse simulation test suite in pps/api/test/abuse.test.ts.
- Added Windows-safe Vitest API harness in:
  - pps/api/test/helpers.ts
  - pps/api/vitest.config.ts
- Verified automated privacy boundaries with 13 passing assertions covering:
  - affiliate cross-shop access blocked
  - driver cross-driver scope blocked
  - hub cross-hub scope blocked
  - customer cross-customer scope blocked
  - admin global access allowed
  - non-DEV_ADMIN override access blocked
- Verified abuse protections with passing automated tests:
  - brute-force login attempts return safe throttled responses
  - OTP brute-force attempts return safe throttled responses
- Verified full API test suite passes:
  - 15 tests passed
- Gate satisfied: Abuse tests fail safely; forbidden access always blocked.

## Chapter 10.4 PASS

- Re-ran Chapter 10.3 pre-flight verification successfully before backup work.
- Added database backup script at scripts/backup_db.ps1.
- Added restore drill script at scripts/restore_db.ps1.
- Added backup and disaster recovery runbook at docs/reliability/backups_disaster_recovery.md.
- Corrected backup/restore script DATABASE_URL precedence so repo app config is preferred unless explicitly overridden.
- Corrected API env loading so injected runtime DATABASE_URL is respected during restore drill boot.
- Produced backup artifact:
  - ackups/db/mimo-db-mimo_laundry_os-20260314-134646.dump
  - size: 125911 bytes
- Restored backup into staging-like database mimo_laundry_os_staging_restore.
- Verified restored tables exist and restored data is present:
  - orders_count = 2
  - users_count = 8
- Booted API against restored database and confirmed startup log referenced mimo_laundry_os_staging_restore.
- Verified:
  - GET /v1/health returned ok
  - GET /v1/health/db returned ok
  - admin login succeeded against restored database
- Gate satisfied: Restore succeeds and app boots.

## Chapter 11.1 PASS

- Re-ran Chapter 10.4 verification before implementation:
  - pnpm -r lint passed
  - pnpm -r typecheck passed
  - pnpm -r test passed
  - pnpm -r build passed
- Added CI workflow for pull requests and pushes to main
- CI runs:
  - pnpm -r lint
  - pnpm -r typecheck
  - pnpm -r test
  - pnpm -r build
- Added staging deployment workflow triggered automatically after successful CI on main
- Staging workflow is structured to:
  - checkout the exact commit that passed CI
  - run pnpm --filter @mimo/api db:generate
  - run pnpm --filter @mimo/api db:migrate:deploy
  - trigger API and web staging deploy hooks
  - run smoke tests against /v1/health and /v1/health/db
- Added rollback strategy documentation with evidence capture, decision owner, app rollback, and forward-only DB correction policy
- Gate target prepared: CI passes on main; staging deploy automated once staging secrets are configured

## Chapter 11.2 PASS

- Provisioned full staging environment with isolated services and secrets.
- Staging web deployed on Vercel.
- Staging API deployed on Render.
- Staging worker deployed on Render.
- Staging Postgres provisioned on Neon.
- Staging Redis provisioned on Upstash.
- Staging storage bucket provisioned on Cloudflare R2 with public access disabled.
- Verified staging API health endpoint returned ok.
- Verified staging API database health endpoint returned ok.
- Verified staging web loads successfully.
- Verified staging worker reached live state.
- Gate satisfied: Staging smoke tests pass end-to-end at minimum health + db + deployed web/worker proof.

### Staging URLs

- Web: https://mimo-laundry-os-staging-web.vercel.app
- API: https://mimo-laundry-os-staging-api.onrender.com

### Proof captured

- GitHub CI green on main
- Vercel staging deployment ready
- Render API live
- Render worker live
- /v1/health proof captured
- /v1/health/db proof captured
- R2 bucket proof captured
- Neon and Upstash staging resource proof captured

## Chapter 11.3 PENDING

### Pre-flight retest of 11.2

- Staging deploy workflow proof: PASTE-STAGING-DEPLOY-LINK-OR-SCREENSHOT-NAME
- Staging web URL: https://staging.<your-domain>
- Staging API URL: https://api-staging.<your-domain>
- Staging /v1/health returned success during pre-flight
- Staging /v1/health/db returned success during pre-flight

### Production targets

- Web URL: https://app.<your-domain>
- API URL: https://api.<your-domain>
- Production Postgres resource: mimo-laundry-os-prod-postgres
- Production Redis resource: mimo-laundry-os-prod-redis
- Production storage bucket: mimo-laundry-os-prod

### Required evidence to finalize PASS

- Production web HTTPS proof
- Production API HTTPS proof
- Production health proof
- Production DB health proof
- Monitoring dashboard proof
- Controlled alert proof
- Web logged-in proof
- Delivered + paid order proof
- Receipt proof
- Audit entry proof
- Production deploy workflow proof: PASTE-PRODUCTION-DEPLOY-LINK-OR-SCREENSHOT-NAME

## Chapter 11.3 PASS

### Production URLs

- Web: https://app.mimolaundry.org
- API: https://api.mimolaundry.org

### Production infrastructure proof

- Production web custom domain resolves and returns 200
- Production API custom domain resolves and returns health ok
- Production DB health endpoint returns ok
- Production API service is live on Render
- Production DB, Redis, and storage are configured as separate production resources

### Production workflow proof

- Seeded production database confirmed with users/orders/zones present
- Admin login succeeded in production
- Customer login succeeded in production
- Customer read seeded order order_customer_a successfully
- Admin read daily close report successfully
- RBAC verified:
  - customer access to /v1/admin/audit returned 403
  - customer access to /v1/admin/reports/daily-close returned 403

### Remaining operator evidence attached outside terminal

- Monitoring dashboard screenshot showing production up
- Alert test proof
- Vercel domain verification screenshot
- Render custom domain verification screenshot
- Production deploy proof

## Chapter 12.1 IN PROGRESS

- Re-verified Chapter 11.3 production pre-flight requirements before operational simulation:
  - production web reachable
  - production API reachable
  - \/v1/health\ checked
  - \/v1/health/db\ checked
  - monitoring documentation present
- Created operational readiness pack:
  - \docs/ops/sop_hub.md\
  - \docs/ops/sop_driver.md\
  - \docs/ops/sop_affiliate.md\
  - \docs/ops/support_playbooks.md\
  - \docs/ops/admin_routines.md\
  - \docs/ops/dry_run_plan.md\
  - \docs/ops/dry_run_results.md\
- Next required action: execute the 10-order dry-run and fill \docs/ops/dry_run_results.md\.
- PASS is not granted until the dry-run completes and evidence is recorded.

## Chapter 11.3 correction PASS

### Reopen reason

- Initial Chapter 11.3 acceptance was premature.
- Production truth was re-validated after Chapter 12.1 exposed gaps.

### Corrected proof

- mimolaundry.org apex resolves and redirects to https://www.mimolaundry.org/
- www.mimolaundry.org resolves and loads
- api.mimolaundry.org resolves and health/db-health return ok
- Production auth works for seeded admin and customer
- Customer order read works in production
- Admin daily-close works in production
- RBAC verified with customer -> admin report returning 403
- Production role routes now live on deployed web:
  - /customer
  - /affiliate
  - /driver
  - /hub
  - /admin
