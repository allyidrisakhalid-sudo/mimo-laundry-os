# Chapter 12.2 Soft Launch Metrics Daily Log

## Observation window

- Window length: 7 consecutive operating days
- Window start: 2026-03-15
- Window end: 2026-03-21
- Production health URL: https://api.mimolaundry.org/v1/health
- Production DB health URL: https://api.mimolaundry.org/v1/health/db

## Locked launch policy for every day in this window

- Active zones allowed: 1
- Active hubs allowed: 1
- Active affiliate shops allowed: 2 max
- Active drivers allowed: 2 max
- Daily order cap: 10
- STANDARD_48H: enabled
- EXPRESS_24H: disabled at launch
- SAME_DAY: disabled

---

## Day 1 2026-03-15

- Status: live data captured
- Zone evidence: zone_a
- Hub evidence: hub_kigamboni
- Channel evidence: DOOR, HYBRID, SHOP_DROP
- Orders total from daily close: 16
- Gross revenue TZS: 223500
- Payments total TZS: 37000
- Commission earned TZS: 0
- AOV TZS: 13968.75
- Daily order cap status: CAP_EXCEEDED
- Daily close endpoint: /v1/admin/reports/daily-close
- Commissions endpoint: /v1/admin/commissions
- Observation:
  - one zone is evidenced in the live daily close output: zone_a
  - one hub is evidenced in the live daily close output: hub_kigamboni
  - current live order count is 16, which is above the 10-order soft-launch cap
  - this means Day 1 cannot be classified as within-cap
- Decision: WATCH

### Day 1 cash control evidence

- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-15
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-15
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0

## Day 2 2026-03-16

- Status: live data captured
- Zone evidence:
- Hub evidence:
- Channel evidence:
- Orders total from daily close: 0
- Gross revenue TZS: 0
- Payments total TZS: 0
- Commission earned TZS: 0
- AOV TZS: 0
- Daily order cap status: WITHIN_CAP
- Daily close endpoint: /v1/admin/reports/daily-close?date=2026-03-16
- Commissions endpoint: /v1/admin/commissions
- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-16
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-16
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0
- Decision: STABLE

## Day 3 2026-03-17

- Status: live data captured
- Zone evidence:
- Hub evidence:
- Channel evidence:
- Orders total from daily close: 0
- Gross revenue TZS: 0
- Payments total TZS: 0
- Commission earned TZS: 0
- AOV TZS: 0
- Daily order cap status: WITHIN_CAP
- Daily close endpoint: /v1/admin/reports/daily-close?date=2026-03-17
- Commissions endpoint: /v1/admin/commissions
- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-17
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-17
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0
- Decision: STABLE

## Day 4 2026-03-18

- Status: live data captured
- Zone evidence:
- Hub evidence:
- Channel evidence:
- Orders total from daily close: 0
- Gross revenue TZS: 0
- Payments total TZS: 0
- Commission earned TZS: 0
- AOV TZS: 0
- Daily order cap status: WITHIN_CAP
- Daily close endpoint: /v1/admin/reports/daily-close?date=2026-03-18
- Commissions endpoint: /v1/admin/commissions
- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-18
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-18
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0
- Decision: STABLE

## Day 5 2026-03-19

- Status: live data captured
- Zone evidence:
- Hub evidence:
- Channel evidence:
- Orders total from daily close: 0
- Gross revenue TZS: 0
- Payments total TZS: 0
- Commission earned TZS: 0
- AOV TZS: 0
- Daily order cap status: WITHIN_CAP
- Daily close endpoint: /v1/admin/reports/daily-close?date=2026-03-19
- Commissions endpoint: /v1/admin/commissions
- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-19
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-19
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0
- Decision: STABLE

## Day 6 2026-03-20

- Status: live data captured
- Zone evidence:
- Hub evidence:
- Channel evidence:
- Orders total from daily close: 0
- Gross revenue TZS: 0
- Payments total TZS: 0
- Commission earned TZS: 0
- AOV TZS: 0
- Daily order cap status: WITHIN_CAP
- Daily close endpoint: /v1/admin/reports/daily-close?date=2026-03-20
- Commissions endpoint: /v1/admin/commissions
- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-20
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-20
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0
- Decision: STABLE

## Day 7 2026-03-21

- Status: live data captured
- Zone evidence:
- Hub evidence:
- Channel evidence:
- Orders total from daily close: 0
- Gross revenue TZS: 0
- Payments total TZS: 0
- Commission earned TZS: 0
- AOV TZS: 0
- Daily order cap status: WITHIN_CAP
- Daily close endpoint: /v1/admin/reports/daily-close?date=2026-03-21
- Commissions endpoint: /v1/admin/commissions
- Driver cash report endpoint: /v1/admin/reports/driver-cash?date=2026-03-21
- Driver reconciliation endpoint: /v1/admin/reconciliation/drivers?date=2026-03-21
- Driver count: 2
- Submitted reconciliation count: 0
- Approved reconciliation count: 0
- Driver cash mismatch count: 0
- Driver cash mismatch total TZS: 0
- Expected cash TZS: 0
- Declared cash TZS: 0
- Decision: STABLE
