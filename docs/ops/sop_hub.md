# SOP Hub Operations

## Scope

This SOP covers hub intake, processing, QC, and dispatch for Laundry OS.

## Roles

- Hub Staff
- Hub Supervisor
- Admin
- Driver (dispatch handoff only)

## System Preconditions

- User is logged in with proper hub staff or admin account.
- Order already exists in system.
- Hub is assigned to the order through zone routing.
- Bag tag code is physically attached and readable.
- RBAC is enforced; do not use another person's account.

---

# A. Hub Intake SOP

## Goal

Receive laundry into the hub, confirm traceability, and create intake evidence.

## Preconditions

- Order status is awaiting hub receipt or in inbound flow.
- Bag tag exists.
- Hub staff is on the correct hub account.

## Screen / Tool

- Hub intake screen
- Order detail screen
- Intake action controls for weight, notes, and photos

## Steps

1. Sign in as hub staff.
2. Open the hub intake queue or search the order by tag code / order number.
3. Confirm:
   - customer name
   - source channel (DOOR / SHOP / HYBRID)
   - assigned zone
   - assigned hub
4. Physically verify the bag tag matches the system tagCode.
5. If tag is unreadable or mismatched:
   - stop intake
   - do not proceed with weighing
   - escalate to hub supervisor/admin
   - log the issue in the order notes or exception flow
6. Record bag weight in the intake form.
7. Add notes for visible condition, special instructions, or anomalies.
8. Upload photos if bag condition, damage, or special handling needs evidence.
9. Submit intake confirmation.
10. Confirm the timeline now includes `RECEIVED_AT_HUB`.

## Proof of Completion

- Order timeline shows `RECEIVED_AT_HUB`.
- Weight is stored on the order.
- Notes/photos are visible on the order record.
- Audit trail shows who performed intake.

## Failure Handling / Escalation

- Tag mismatch: hold order and escalate to Hub Supervisor.
- Weight entry failure: retry once, then escalate to Admin if system issue.
- Missing order record: do not create shadow/manual paper flow; escalate to Admin.
- Wrong hub assignment: escalate to Admin for reassignment decision with audit trail.

---

# B. Processing SOP

## Goal

Move the order through operational stages with accurate event history.

## Preconditions

- Order has `RECEIVED_AT_HUB`.
- Intake data exists.
- Hub staff has access to processing board.

## Screen / Tool

- Processing board
- Order detail timeline
- Exception / notes controls if present

## Stages

- WASHING
- DRYING
- IRONING
- PACKED

## Time Expectations by Tier

- STANDARD: follow normal production queue / default SLA
- EXPRESS: prioritize ahead of standard queue
- SAME-DAY: highest urgency; immediate supervisor awareness required

## Steps

1. Open processing board.
2. Identify the order by order number or tag.
3. Move order into washing stage.
4. Confirm event appears in timeline.
5. When washing is complete, move order to drying.
6. Confirm event appears in timeline.
7. When drying is complete, move order to ironing.
8. Confirm event appears in timeline.
9. When ironing is complete, move order to packed.
10. Confirm event appears in timeline.
11. If an issue arises mid-process:

- stop movement
- log notes/evidence
- create or follow exception workflow
- notify supervisor for decision

## Proof of Completion

- Timeline shows all processing stage events in order.
- No stage is skipped without explanation.
- Staff action is attributable by timestamp/user.

## Failure Handling / Escalation

- Stage button fails: refresh once, re-check order timeline, retry once.
- Duplicate stage event: stop further processing and escalate to Admin.
- Garment issue discovered: open damage/missing-item workflow before continuing.
- Same-day risk: alert supervisor immediately.

---

# C. QC SOP

## Goal

Validate finished work before dispatch.

## Preconditions

- Order is in packed or ready-for-QC state.
- All visible garments/items are available for check.

## Screen / Tool

- Order detail
- QC action controls
- Issue / exception controls

## Pass Rules

- Order contents match expected items/bag
- No visible damage introduced
- Cleaning/pressing meets standard
- Packing is correct for dispatch/pickup

## Fail Rules

- Missing item
- Visible damage
- Incomplete cleaning/pressing
- Packaging error
- Count mismatch

## Steps

1. Open order detail as hub staff/supervisor.
2. Review intake notes and any special instructions.
3. Physically inspect the order.
4. If QC passes:
   - mark QC pass
   - confirm timeline/event evidence
5. If QC fails:
   - mark QC fail or log issue
   - capture notes and photo evidence
   - classify issue (damage / missing item / rework / other)
   - block dispatch until resolved
   - escalate to Hub Supervisor/Admin as required
6. After rework/resolution, re-run QC and confirm final status.

## Proof of Completion

- Timeline shows QC pass or QC fail related evidence.
- Failure case contains notes/photos/issue record.
- Dispatch does not proceed while unresolved QC failure exists.

## Failure Handling / Escalation

- System allows dispatch despite open QC fail: stop manually and escalate immediately.
- Missing issue controls: document evidence and escalate to Admin.
- Customer-impacting damage/missing item: supervisor review required before release.

---

# D. Dispatch SOP

## Goal

Release completed orders to the correct delivery path with proof.

## Preconditions

- QC is passed or supervisor-approved exception is resolved.
- Delivery path is known:
  - door delivery
  - affiliate/shop return pickup
  - hybrid return delivery
- Correct zone/driver is available.

## Screen / Tool

- Dispatch batching screen
- Driver selection controls
- OTP generation / delivery prep controls
- Order timeline

## Steps

1. Open dispatch batching screen.
2. Filter for orders ready to leave the hub.
3. Verify each order's zone and return method.
4. Create a dispatch batch if batching is used in the current workflow.
5. Select driver assigned for the relevant zone.
6. Attach the order(s) to the driver/task/batch.
7. Trigger dispatch action.
8. Generate/set delivery OTP if required by the flow.
9. Confirm timeline shows dispatch / out-for-delivery evidence.
10. Hand over the correct package(s) to the correct driver.

## Proof of Completion

- Timeline shows dispatch and/or `OUT_FOR_DELIVERY`.
- Driver task list contains the assigned stop.
- Delivery OTP is available when required.
- Audit trail shows dispatcher identity.

## Failure Handling / Escalation

- No zone-matched driver available: escalate to supervisor/admin before forcing assignment.
- Wrong return method detected: stop and correct before dispatch.
- OTP generation failure: escalate before sending driver out.
- Packaging discrepancy at handoff: stop and re-run QC/packing check.
