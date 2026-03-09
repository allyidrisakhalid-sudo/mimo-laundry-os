# Authorization RBAC Chapter 6.2

## Role definitions

- CUSTOMER
- AFFILIATE_STAFF
- DRIVER
- HUB_STAFF
- ADMIN
- DEV_ADMIN

## Enforcement rules

- Every protected endpoint requires a bearer token.
- Authorization is explicit and role-based.
- Resource scope is derived from the authenticated user profile on the server.
- Clients cannot pass arbitrary scope ids to widen access.
- Cross-scope access returns **403** consistently.
- Admin can access all resources.
- DevAdmin can access all resources and limited override endpoints only.

## Scope rules by role

### CUSTOMER

- Can only access orders where `order.customerUserId = auth.userId`.

### AFFILIATE_STAFF

- Server resolves `affiliateShopId` from `AffiliateStaffProfile`.
- Can only access orders where `order.affiliateShopId = resolved affiliateShopId`.

### DRIVER

- Server resolves `driverId` from `DriverProfile`.
- Can only access trips where `trip.driverId = resolved driverId`.
- Can only access orders attached to stops on trips assigned to that driver.

### HUB_STAFF

- Server resolves `hubId` from `HubStaffProfile`.
- Can only access orders where `order.hubId = resolved hubId`.

### ADMIN

- Full read access to protected business resources.
- Can access admin-only endpoints.

### DEV_ADMIN

- Full read access to protected business resources.
- Can use explicit override endpoints only.
- Every override requires a non-empty `reason`.
- Every override writes an `AuditLog` record.

## Allowed / forbidden examples

### Allowed

- Customer A reads `order_customer_a`
- Driver B reads `trip_driver_b`
- Admin reads `order_scope_b`
- DevAdmin appends an event with a reason

### Forbidden

- Affiliate Staff A reads `order_scope_b` belonging to Affiliate B 403
- Driver A reads `trip_driver_b` assigned to Driver B 403
- Hub Staff A reads `order_scope_b` assigned to Hub B 403
- Customer A reads `order_scope_b` belonging to Customer B 403
- Non-admin calls `/v1/admin/users` 403
- Non-devadmin calls `/v1/dev/override/...` 403

## DevAdmin override endpoints

### Assign hub

`POST /v1/dev/override/orders/:id/assign-hub`

Body:

- `hubId` required
- `reason` required

Audit action code:

- `DEV_OVERRIDE_ASSIGN_HUB`

### Append event

`POST /v1/dev/override/orders/:id/append-event`

Body:

- `eventType` required
- `reason` required
- `notes` optional

Audit action code:

- `DEV_OVERRIDE_APPEND_EVENT`

## Audit log fields

Each override writes:

- actor userId
- actor role
- action code
- target resource type
- target resource id
- reason
- before snapshot JSON
- after snapshot JSON
- createdAt timestamp
