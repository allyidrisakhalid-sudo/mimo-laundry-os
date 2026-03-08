# Zone System (Chapter 4.1)

## Purpose

Zones are the routing backbone of Laundry OS.

Zones are first-class operational entities used to:

- determine service coverage areas
- link hubs to operating territory
- link affiliate shops to operating territory
- assign drivers to a home operating territory
- link customer addresses to an operating territory
- support future routing, dispatch, pricing, and visibility boundaries

## Core Rule

A zone must exist before operational entities can be assigned.

## V1 Linkage Rules

### Hub

Every Hub must be linked to exactly one Zone in V1.

Field:

- Hub.zoneId required

### Affiliate Shop

Every AffiliateShop must be linked to exactly one Zone in V1.

Field:

- AffiliateShop.zoneId required

### Driver

Every Driver must have exactly one Home Zone in V1.

Field:

- Driver.homeZoneId required

Schema-ready support exists for future secondary zones through:

- DriverSecondaryZone

### Customer Address

Every CustomerAddress must be linked to exactly one Zone.

Field:

- CustomerAddress.zoneId required

## Zone Derivation Rules

### Door pickup

For door pickup, the order zone is derived from the customer address zone.

Source:

- CustomerAddress.zoneId

### Shop pickup

For affiliate shop pickup, the order zone is derived from the affiliate shop zone.

Source:

- AffiliateShop.zoneId

### Hybrid return

For hybrid workflows, the source side uses the affiliate shop zone and delivery-side routing can later use the customer address zone as the dispatch boundary.

## V1 API Proof

The Chapter 4.1 API proof exposes minimal endpoints for zone validation:

- POST /v1/zones
- GET /v1/zones
- GET /v1/zones/:id
- GET /v1/zones/:id/hubs
- GET /v1/zones/:id/affiliates
- GET /v1/zones/:id/drivers

These endpoints prove:

- zones can be created
- linked entities can be queried by zone
- mappings are consistent with the routing backbone rule

## Seed Proof

Seed data creates:

- Zone A
- Zone B
- Hub A linked to Zone A
- Hub B linked to Zone B
- Affiliate Shop A linked to Zone A
- Affiliate Shop B linked to Zone B
- Driver A linked to Zone A
- Driver B linked to Zone B
- a customer address linked to Zone A

## Future Extension

Future chapters may extend zones with:

- polygon geo boundaries
- geofencing
- multi-zone hubs
- driver secondary zones in dispatch logic
- pricing by zone
- SLA and capacity logic by zone

## Invariant Alignment

This design preserves the locked core invariants:

- multi-hub from day 1
- zones are first-class
- routing and visibility can be enforced by zone
- future pricing and dispatch can depend on zone without schema rewrite
