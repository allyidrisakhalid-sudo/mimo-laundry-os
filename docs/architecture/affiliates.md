# Affiliate Architecture

## Purpose

Affiliate shops are first-class operating entities in Laundry OS. In V1, each affiliate shop belongs to exactly one zone and each affiliate staff user belongs to exactly one affiliate shop.

## Core entities

### AffiliateShop

AffiliateShop stores the operating identity of an affiliate pickup shop.

Minimum V1 fields:

- `id`
- `code`
- `name`
- `zoneId`
- `commissionPlanId`
- `addressLabel`
- `locationLat`
- `locationLng`
- `contactPhone`
- `isActive`
- `createdAt`
- `updatedAt`

Rules:

- Every AffiliateShop belongs to exactly one Zone in V1.
- Every AffiliateShop references one commission plan in seeded operating data.
- AffiliateShop acts as an order source when orders are created by affiliate staff.

### CommissionPlan

CommissionPlan defines how an affiliate shop earns commission.

Supported V1 types:

- `FIXED_PER_ORDER`
- `PERCENT_OF_SERVICE`

Supported V1 applies-to values:

- `SHOP_ONLY`
- `ALL_CHANNELS`

### AffiliateStaffProfile

AffiliateStaffProfile links a User to exactly one AffiliateShop.

Fields:

- `id`
- `userId` (unique)
- `affiliateShopId`
- `jobTitle`
- `isActive`
- `createdAt`
- `updatedAt`

Rules:

- User role must be `AFFILIATE_STAFF`.
- One affiliate staff user belongs to one affiliate shop in V1.
- Affiliate staff scope is derived from AffiliateStaffProfile, not from client input.

## Attribution rules

Order attribution uses:

- `sourceType`
- `affiliateShopId`
- `channel`
- `orderZoneId`

### SourceType

Supported V1 values:

- `DIRECT`
- `AFFILIATE`

### Channel

Supported V1 values:

- `DOOR`
- `SHOP_DROP`
- `HYBRID`

### Affiliate attribution rule

If an order is created by affiliate staff:

- `sourceType = AFFILIATE`
- `affiliateShopId` must be set by the server
- `orderZoneId` must be derived from `AffiliateShop.zoneId`
- the client must not choose another affiliate shop

For seeded affiliate orders:

- `AFF-SHOP-A-001` belongs to `SHOP-A`
- `AFF-SHOP-B-001` belongs to `SHOP-B`

For API-created affiliate orders:

- the authenticated affiliate staff token determines the shop
- the server derives the zone from that shop

## Scoping rules

Affiliate staff can:

- log in as affiliate staff
- read their own affiliate profile and shop
- create orders only for their own shop
- list orders only for their own shop
- read an individual order only if it belongs to their own shop

Affiliate staff cannot:

- provide `affiliateShopId` in a trusted way
- create orders for another shop
- read another shop's orders

## Enforcement approach in Chapter 4.3

V1 enforcement is implemented at the service and route layer:

- dev auth token format: `affiliate:<userId>`
- `AffiliateStaffProfile` resolves the effective shop
- order creation ignores cross-shop intent by deriving `affiliateShopId` from auth context
- order reads compare `order.affiliateShopId` to authenticated `affiliateShopId`
- mismatched access returns `403 Forbidden`

## Example flows

### Affiliate login

1. Affiliate staff posts email to `/v1/auth/affiliate/login`
2. Server verifies user role is `AFFILIATE_STAFF`
3. Server loads AffiliateStaffProfile
4. Server returns a bearer token and shop identity

### Affiliate order creation

1. Affiliate staff calls `POST /v1/affiliate/orders`
2. Server resolves the authenticated affiliate shop
3. Server sets:
   - `sourceType = AFFILIATE`
   - `affiliateShopId = authenticated shop id`
   - `orderZoneId = authenticated shop zoneId`
4. Order is stored with affiliate attribution

### Cross-shop access attempt

1. SHOP-A staff requests a SHOP-B order
2. Server compares order affiliateShopId with authenticated affiliateShopId
3. Server returns `403 Forbidden`

## Invariant alignment

This chapter preserves the locked project invariants:

- zones remain first-class routing boundaries
- affiliate shops are zone-bound in V1
- affiliate visibility is scoped by business ownership
- order attribution is explicit and traceable
