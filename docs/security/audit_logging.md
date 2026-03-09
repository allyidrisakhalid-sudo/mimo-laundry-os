# Audit Logging

## Purpose

Laundry OS records privileged operational actions in an append-only audit log for investigation, accountability, and change traceability.

## Immutability Rule

- Audit records are append-only.
- Application logic does not expose update or delete endpoints for audit logs.
- Corrections must be recorded as new audit entries, never by mutating historical records.
- DB-level hardening can be added later with restricted production DB permissions.

## Required Fields

Each audit record stores:

- `id`
- `actorUserId` (nullable for system actions)
- `actorRole` (snapshot at time of action)
- `actionCode`
- `targetType`
- `targetId`
- `reason` (nullable generally, but required by application logic for override actions)
- `beforeJson`
- `afterJson`
- `ipAddress`
- `userAgent`
- `occurredAt`

## Action Code Convention

Use uppercase stable codes with domain intent, for example:

- `DEV_OVERRIDE_ASSIGN_HUB`
- `DEV_OVERRIDE_APPEND_EVENT`
- `ZONE_CREATE`
- `HUB_CREATE`
- `AFFILIATE_SHOP_CREATE`
- `TRIP_CREATE`
- `TRIP_ASSIGN_STOP`
- `ORDER_EVENT_APPEND`
- `PRICING_PLAN_CREATE`
- `PRICING_PLAN_UPDATE`
- `PRICING_PLAN_ACTIVATE`
- `PAYOUT_APPROVE`
- `PAYOUT_MARK_PAID`
- `ROLE_CHANGE`
- `REFUND_APPROVE`

Rules:

- uppercase snake case
- stable over time
- action describes business intent, not transport detail

## What Is Audited In Chapter 6.3

Implemented and verified in this chapter:

- DevAdmin override assign hub
- DevAdmin override append event
- Admin audit log list query
- Admin audit log detail query

Framework is ready for later chapters to add:

- pricing actions
- payout actions
- refund actions
- role changes
- zone/hub/shop/trip creation actions when those endpoints are exposed in the current server

## Query Endpoints

Admin-only endpoints:

- `GET /v1/admin/audit`
- `GET /v1/admin/audit/:id`

Compatibility endpoint retained in current dev server:

- `GET /v1/audit-logs`

## Example Audit Entry

```json
{
  "actorUserId": "user_devadmin",
  "actorRole": "DEV_ADMIN",
  "actionCode": "DEV_OVERRIDE_ASSIGN_HUB",
  "targetType": "ORDER",
  "targetId": "order_customer_a",
  "reason": "Manual correction after routing review",
  "beforeJson": { "hubId": "hub_mbagala" },
  "afterJson": { "hubId": "hub_kigamboni" },
  "ipAddress": "::1",
  "userAgent": "WindowsPowerShell verification",
  "occurredAt": "2026-03-09T12:46:21.250Z"
}
```
