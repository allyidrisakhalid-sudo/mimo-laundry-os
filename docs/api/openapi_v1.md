# OpenAPI v1

## Base URL

- Local: `http://localhost:3001`
- API version base path: `/v1`

## Versioning policy

- v1 is the locked executable contract for the current MVP surface.
- Breaking changes must go to `/v2`.
- No silent contract breaks are allowed.

## Auth flows

### Customer auth

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`

### Auth header convention

- `Authorization: Bearer <accessToken>`

### Current chapter verification note

For Chapter 5.1 local verification, privileged role access is simulated with:

- `x-role: admin`
- `x-role: hub_staff`
- `x-role: affiliate_staff`
- `x-role: driver`

This keeps the contract testable while full auth/RBAC enforcement is completed in Chapter 6.

## Core endpoint groups

### Orders

- Create order
- Read order
- Read immutable timeline
- Append staff events
- Create/list/update issues

### Tracking

- Public tracking locked for v1 as `orderNumber + phone`

### Hub

- Intake
- Stage transitions
- Queue read

### Driver

- Current driver profile
- Trips
- Tasks
- Stop arrive
- Stop complete with proof

### Affiliate

- Current affiliate profile
- Create affiliate order
- List affiliate orders
- Read affiliate order

### Admin

- Zones create/list
- Hubs create/list
- Driver create
- Trip create
- Trip stop create

## Error schema

All endpoints standardize on this structure:

```json
{
  "errorCode": "VALIDATION_FAILED",
  "message": "Request validation failed.",
  "details": {
    "missingFields": ["email"]
  },
  "traceId": "trace_1741440300000_ab12cd34",
  "timestamp": "2026-03-08T15:30:00.000Z"
}
```

## Chapter 8.3.2 additions

### GET /v1/affiliate-shops?zoneId=...

Returns active affiliate shops for the supplied zone.

### Order creation enforcement

For `SHOP_DROP` and `HYBRID` orders:

- selected `affiliateShopId` must belong to selected `zoneId`
- mismatch returns error code `AFFILIATE_SHOP_ZONE_MISMATCH`

## Chapter 8.3.3 additions

### POST /v1/admin/trips

Creates a zone-scoped trip for a driver.

Required body:

- `driverId`
- `type` = `PICKUP` or `DELIVERY`
- `zoneId`

Rule:

- driver `homeZoneId` must equal trip `zoneId`
- mismatch returns `ZONE_ASSIGNMENT_MISMATCH`

### POST /v1/admin/trips/:id/stops

Adds an order stop to a trip.

Required body:

- `orderId`
- `stopType` = `PICKUP` or `DROPOFF`
- `sequence`

Rule:

- `trip.zoneId == order.zoneId`
- `driver.homeZoneId == order.zoneId`
- mismatch returns `ZONE_ASSIGNMENT_MISMATCH`
