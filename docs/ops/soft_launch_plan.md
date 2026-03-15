# Chapter 12.2 Soft Launch Plan

## Status

- Chapter status: IN PROGRESS
- Pre-flight status: PASSED
- Pre-flight confirmed on: 2026-03-15
- Previous chapter dry-run result: PASS

## Verified production health targets

- Health URL: https://api.mimolaundry.org/v1/health
- DB health URL: https://api.mimolaundry.org/v1/health/db
- Production environment status at pre-flight: healthy

## Locked launch scope

- Ordering is restricted to exactly 1 active zone
- Active hubs allowed: maximum 1
- Active affiliate shops allowed: maximum 2
- Active drivers allowed: maximum 2
- All non-launch zones, hubs, affiliate shops, and drivers must be inactive

## Locked capacity policy

- Daily order cap: 10 orders/day
- Max pickups per driver per day: 5
- Max total active undelivered orders before intake slowdown: 12
- New intake must be reduced or deferred if backlog exceeds cap

## Locked tier policy

- STANDARD_48H: ENABLED
- EXPRESS_24H: DISABLED at launch
- SAME_DAY: DISABLED at launch

## Locked cutoff policy

- Pickup scheduling cutoff: 15:00 Africa/Dar_es_Salaam
- Orders created after cutoff move to the next operating window
- No overbooking beyond driver pickup cap
- No manual promise outside published SLA

## Locked delay / compensation policy

- Delay definition: delivered after the SLA window attached to the order tier
- Minor delay handling: documented goodwill credit review
- Significant delay handling: partial credit or refund review
- Any compensation must be traceable through system records and notes

## Required daily operating routine

### Start of day

- Review backlog count
- Confirm active driver availability
- Confirm hub readiness
- Confirm affiliate readiness
- Confirm launch caps and tier policy remain unchanged

### During day

- Accept orders only inside the chosen launch zone
- Enforce the 10-order daily cap
- Enforce the 5-pickup-per-driver cap
- Follow SOPs without process deviation

### End of day

- Confirm pickups logged
- Confirm deliveries updated
- Confirm payments recorded
- Run daily close report
- Run driver reconciliation report
- Run commissions report
- Log issues and corrective actions

## Locked metrics definitions

### Ops

- On-time % = delivered within promised SLA / total delivered
- Median turnaround = median(createdAt deliveredAt)
- P90 turnaround = p90(createdAt deliveredAt)
- Backlog count = active undelivered orders at day end

### Quality

- Dispute rate = delivered orders with issues / total delivered

### Finance

- Revenue/day = total recognized order revenue for the day
- AOV = revenue / completed paid orders
- Delivery cost proxy = total driver payout or fuel proxy if captured
- Commission ratio = affiliate commissions / affiliate-sourced revenue

### Cash control

- Driver cash mismatch count
- Driver cash mismatch total amount

## Escalation rules

- If backlog grows 2 consecutive days: stop expansion and reduce intake
- If on-time % drops below target: keep express disabled and reduce cap if needed
- If dispute rate rises: audit SOP adherence before increasing volume
- If reconciliation mismatches grow: freeze cash-heavy workflow until root cause is logged

## Evidence required before PASS

- 7-day observation window completed
- Daily close outputs captured
- Driver reconciliation outputs captured
- Commission outputs captured
- Daily metrics log completed using system-derived values
- Weekly summary written from actual trend data
- PASS only after evidence confirms:
  - metrics stable
  - no backlog accumulation
  - reconciliation clean

## Actual live launch scope observed on 2026-03-15

- Active zone evidenced in live daily close: zone_a
- Active hub evidenced in live daily close: hub_kigamboni
- Active order channels evidenced in live daily close: DOOR, HYBRID, SHOP_DROP
- Live group count in daily close: 3
- Note: affiliate shop and driver entity-list endpoints were not discovered in this step, so those must be evidenced later through working scoped endpoints or admin UI screenshots

## Day 1 control decision 2026-03-15

- Production daily close shows 16 total orders for the day
- The configured soft-launch cap is 10 orders/day
- Result: cap was exceeded on Day 1
- Chapter 12.2 status remains IN PROGRESS
- Operational classification for Day 1: WATCH
- Immediate control action required for next operating day:
  - do not expand scope
  - keep launch restricted to one zone
  - keep same-day disabled
  - keep express disabled
  - reduce accepted new intake until daily volume is at or below cap
  - continue collecting evidence toward a HOLD or GO decision

## Strict gap-closure checklist

The following items must be proven before Chapter 12.2 is treated as strictly complete:

- One-zone enforcement proof
- Active hub / affiliate / driver enforcement proof
- Daily backlog measurement from system data
- On-time % measurement from system data
- Turnaround median and p90 from system data
- Dispute rate measurement from system data
- Conservative SLA availability proof
- Evidence that only active drivers receive tasks

## Strict finding zone enforcement

Live affiliate availability probe showed:

- zone_a returned active affiliate shop shop_mikocheni
- zone_b returned active affiliate shop shop_mbagala

Strict interpretation:

- The system was not effectively limited to one active launch zone during Chapter 12.2
- Therefore the "one zone only" proof is not satisfied

## Strict finding driver task enforcement

Live driver task probe showed:

- GET /v1/driver/tasks succeeded for seeded driver +255700000003
- active task returned for:
  - zoneId: zone_a
  - hubId: hub_kigamboni
  - orderNumber: ORD-0001

Strict interpretation:

- Driver task generation for an active driver is proven
- But one-zone enforcement remains unproven and currently contradicted by live affiliate availability

## Strict discovery result repair path

Source and live-route discovery did not reveal an existing admin/config endpoint for:

- activating or deactivating zones
- activating or deactivating hubs
- activating or deactivating affiliate shops
- activating or deactivating drivers

Live evidence still shows:

- zone_a has active affiliate availability
- zone_b has active affiliate availability

Strict conclusion:

- the one-zone-only Chapter 12.2 rule cannot currently be proven through existing live admin/config controls
- therefore Chapter 12.2 cannot be treated as a strict PASS under the pasted instructions
- the correct path is to treat the original chapter instructions as mismatched to the real operated system scope
