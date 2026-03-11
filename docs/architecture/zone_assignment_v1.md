# Zone Assignment v1

## Purpose

Zone-derived assignment is the v1 routing backbone for Laundry OS.

## Zone derivation

- `order.zoneId` is mandatory on every order.
- Zone is derived during order creation using the existing zone-resolution logic.
- All downstream assignment decisions use `order.zoneId` as the source of truth.

## Hub assignment rule (v1 deterministic)

On order creation, the server auto-assigns the order hub using this rule:

1. Find active hubs where `hub.zoneId == order.zoneId`
2. Sort by `createdAt` ascending
3. Select the first hub
4. Persist `order.hubId`
5. Append `HUB_ASSIGNED` event with `hubId` in payload

If no active hub exists in the order zone, order creation is rejected with error code:

- `HUB_NOT_AVAILABLE_IN_ZONE`

## Shop filtering and mismatch enforcement

For `SHOP_DROP` and `HYBRID` orders:

- Client requests shops by zone using:
  - `GET /v1/affiliate-shops?zoneId=...`
- Server only returns shops belonging to that zone
- Server validates `affiliateShopId` belongs to the same zone as the order

If shop zone does not match order zone, order creation is rejected with error code:

- `AFFILIATE_SHOP_ZONE_MISMATCH`

## Manual driver assignment rules (v1 strict)

Admin can create zone-specific trips and add order stops.

Trip creation:

- Driver is selected for a zone trip
- v1 strict rule requires driver home zone to match trip zone

Stop assignment:

- `trip.zoneId` must equal `order.zoneId`
- `driver.homeZoneId` must equal `order.zoneId`

If either check fails, stop assignment is rejected with error code:

- `ZONE_ASSIGNMENT_MISMATCH`

## Event types introduced

- `HUB_ASSIGNED`

## Error codes introduced

- `HUB_NOT_AVAILABLE_IN_ZONE`
- `AFFILIATE_SHOP_ZONE_MISMATCH`
- `ZONE_ASSIGNMENT_MISMATCH`
