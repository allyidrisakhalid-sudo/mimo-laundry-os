# Chapter 12.2 Scope Correction Note

## Why this note exists

The pasted Chapter 12.2 instructions require a one-zone-only soft launch with explicit activation control over zones, hubs, affiliate shops, and drivers.

## What live evidence showed

- GET /v1/affiliate-shops?zoneId=zone_a returned active affiliate shop shop_mikocheni
- GET /v1/affiliate-shops?zoneId=zone_b returned active affiliate shop shop_mbagala
- GET /v1/driver/tasks for seeded driver returned a real active task in zone_a
- daily close, driver cash, reconciliation, and commission endpoints worked in production

## What was not found

No existing live admin/config route was discovered for directly activating or deactivating:

- zones
- hubs
- affiliate shops
- drivers

## Strict interpretation

- The real production system evidence does not match the pasted one-zone-only chapter constraint
- Therefore the chapter cannot be considered a strict PASS against that exact rule set

## Correct resolution options

1. Accept the real system scope as multi-zone and rewrite the chapter instructions to match reality
2. Build future admin/config controls for entity activation and then rerun a true one-zone soft launch under those controls

## Current recommendation

Treat the earlier Chapter 12.2 evidence as operationally useful but not a strict pass against the pasted one-zone-only instruction set.
