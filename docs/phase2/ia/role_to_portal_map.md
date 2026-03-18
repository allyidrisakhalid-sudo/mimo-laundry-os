# Role to Portal Map  Phase 2 Blueprint Lock (P2.0)

System: Mimo Laundry OS  
Direction: Midnight Silk  
Purpose: Lock exact role-to-portal routing, permission boundaries, and first-screen behavior so implementation cannot drift.

## Locked Portal Map

| Role | Portal Home Route | Portal Purpose | Allowed Sections | Forbidden Sections | Primary Action | First Screen After Login | Start-to-Finish Journey Summary |
|---|---|---|---|---|---|---|---|
| CUSTOMER | /app/customer | Personal self-service workspace for placing, tracking, and managing own laundry orders. | Read/write: own dashboard, own orders list, own order detail/tracking, own profile/settings, own addresses if surfaced later within profile. | Must return 403: /app/driver, /app/hub, /app/affiliate, /app/admin, /app/dev. | Create, track, and manage own laundry orders with full visibility and no operational confusion. | /app/customer | Customer logs in, lands on Customer Home, starts a new order or opens an active order, follows timeline updates, resolves payment or delivery actions if needed, and manages profile/settings without seeing any operational portals. |
| DRIVER | /app/driver | Daily execution workspace for assigned pickups and deliveries only. | Read/write: today overview, assigned tasks only, stop/task details, cash summary/reconciliation view, own profile/availability. | Must return 403: customer portal, hub portal, affiliate portal, admin portal, dev portal, any unassigned order/task detail. | Complete assigned pickups and deliveries quickly with proof and cash accountability. | /app/driver | Driver logs in, lands on Driver Today, opens the next assigned task, completes pickup or delivery proof, reviews cash/accountability items, updates availability, and never sees customer, hub, affiliate, admin, or unrelated task data. |
| HUB_STAFF | /app/hub | Operational workspace for hub intake, processing, QC, and dispatch within assigned hub scope. | Read/write: hub dashboard, intake queue, processing board, dispatch-ready list, exception and QC handling for assigned hub scope only. | Must return 403: customer portal, driver portal, affiliate portal, admin portal, dev portal, data outside assigned hub/zone scope. | Move orders from intake to dispatch with clean operational control inside hub scope. | /app/hub | Hub staff logs in, lands on Hub Dashboard, opens the next queue needing action, receives items into intake, advances work through processing and QC, checks dispatch readiness, and updates only orders inside assigned hub/zone scope. |
| AFFILIATE_STAFF | /app/affiliate | Shop operations workspace for walk-in and shop-originated orders inside one affiliate scope. | Read/write: affiliate dashboard, create order for shop walk-in customer, shop orders list, order detail for shop-owned orders only, pickup/return readiness views for own shop. | Must return 403: customer portal, driver portal, hub portal, admin portal, dev portal, finance/admin controls inside affiliate portal, other shops data. | Capture and manage shop-originated customer orders without seeing other shops or admin controls. | /app/affiliate | Affiliate staff logs in, lands on Affiliate Dashboard, creates a shop order, monitors shop-owned orders, prepares handoff or return readiness, supports customer pickup, and stays inside one shop without seeing finance controls or other affiliates data. |
| AFFILIATE_ADMIN | /app/affiliate | Affiliate operations and business workspace for one affiliate with commissions and payout visibility. | Read/write: everything AFFILIATE_STAFF can access, commission summary, payout history, shop performance summary, staff-level management views if already supported. | Must return 403: customer portal, driver portal, hub portal, admin portal, dev portal, other affiliates data. | Run affiliate operations and monitor commissions, payouts, and shop performance in one place. | /app/affiliate | Affiliate admin logs in, lands on Affiliate Dashboard, monitors todays shop flow, opens or creates orders, reviews finance visibility, checks payouts and performance, and manages affiliate-owned activity without crossing into platform admin or other affiliate scopes. |
| ADMIN | /app/admin | Platform-wide business and operations oversight workspace. | Read/write: admin dashboard, global order oversight, zone/hub/affiliate/driver oversight if already supported, payouts/reconciliation/reporting views if already supported, cross-role operational visibility as permitted by RBAC. | Must return 403: /app/dev, internal developer-only controls. | Monitor, control, and resolve platform-wide operations, performance, and business workflows. | /app/admin | Admin logs in, lands on Admin Dashboard, opens issues or queues needing intervention, inspects platform-wide orders, monitors operations and finance, resolves exceptions, and operates across business-facing areas without accessing developer-only tooling. |
| DEV_ADMIN | /app/dev | Controlled internal support workspace for diagnostics, runtime inspection, and internal support tools. | Read/write: developer/admin support tools, system diagnostics, runtime inspection, operational support tools already present. | None inside dev scope, but all actions must remain audited and protected by destructive-action safeguards. | Safely inspect, diagnose, and support the system without mixing developer controls into business-facing admin UX. | /app/dev | Dev admin logs in, lands on Dev Home, reviews diagnostics, opens support tooling, inspects activity logs, performs controlled support actions, and remains fully auditable without mixing technical controls into standard admin workflows. |

## Permission Logic Notes

- Login must route each authenticated user directly to the correct portal home.
- Forbidden route access must return a 403 state, not a redirect loop.
- Shared route access is not allowed unless explicit multi-role product logic exists.
- Affiliate Staff and Affiliate Admin share one portal root but must still receive role-correct navigation and data scope.
- DEV_ADMIN is isolated from business-facing ADMIN UX even when both roles may exist in the same broader organization.

## Mandatory Written Acceptance Examples

- Login as CUSTOMER  lands on /app/customer  /app/admin returns 403.
- Login as DRIVER  lands on /app/driver  /app/hub returns 403.
- Login as HUB_STAFF  lands on /app/hub  /app/affiliate returns 403.
- Login as AFFILIATE_STAFF  lands on /app/affiliate  /app/admin returns 403.
- Login as AFFILIATE_ADMIN  lands on /app/affiliate  other affiliate data remains forbidden.
- Login as ADMIN  lands on /app/admin  /app/dev returns 403.
- Login as DEV_ADMIN  lands on /app/dev  access is audited and developer-only.

## Acceptance Notes

- Portal routing remains aligned with Phase 1 RBAC.
- Zone, hub, affiliate, driver, pricing, and event timeline concepts remain unchanged.
- This artifact locks route ownership and permission expectations only; it does not introduce backend changes.
