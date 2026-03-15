# SOP Driver Operations

## Scope

This SOP covers pickup, delivery proof, payment/cash handling, and end-of-day reconciliation.

## Roles

- Driver
- Admin
- Hub Supervisor (handoff support)

## System Preconditions

- Driver is logged in using the correct driver account.
- Tasks are assigned to that driver.
- Driver must not use staff/admin accounts.

---

# A. Pickup SOP

## Goal

Complete assigned pickup tasks with traceable proof.

## Preconditions

- Driver has assigned tasks.
- Stop details are visible in driver task list.
- Tag code is available from the customer/shop bag.

## Screen / Tool

- Driver task list
- Stop detail screen
- Pickup confirmation control
- Tag code scan/entry field

## Steps

1. Sign in as driver.
2. Open task list.
3. Select the assigned pickup stop.
4. Review stop details:
   - customer/shop name
   - phone
   - address/location
   - order reference
   - zone
5. Confirm you are at the correct stop.
6. Scan or manually enter the bag tag code.
7. Verify the code matches the order/task details.
8. Mark pickup complete.
9. Confirm the system records pickup successfully.
10. Confirm timeline includes `PICKED_UP`.

## Proof of Completion

- Timeline shows `PICKED_UP`.
- Task status reflects pickup completion.
- Driver identity is attributable in system logs.

## Failure Handling / Escalation

- Tag mismatch: do not collect the wrong bag; contact dispatcher/admin.
- Customer unavailable: follow contact attempt protocol and log failure.
- App/network issue: retry once, capture screenshot, notify supervisor/admin.
- Wrong stop assignment: do not improvise; escalate.

---

# B. Delivery SOP

## Goal

Deliver the order with correct proof and closure.

## Preconditions

- Order is assigned for delivery.
- Driver is at the correct stop.
- OTP is available if required.

## Screen / Tool

- Driver task list
- Delivery stop detail
- OTP entry field
- Delivery confirmation controls
- Proof photo/signature fallback if available in workflow

## Steps

1. Open assigned delivery stop.
2. Confirm recipient identity using order details.
3. Request the delivery OTP from the customer.
4. Enter OTP in the system.
5. If OTP verifies successfully:
   - hand over order
   - mark delivered
6. If OTP is unavailable and approved fallback exists:
   - capture photo/signature per policy
   - record fallback evidence
   - mark delivery using approved exception path only
7. Confirm the timeline includes `DELIVERED`.
8. If payment is due on delivery, follow cash/payment SOP before final closure.

## Proof of Completion

- Timeline shows `DELIVERED`.
- OTP success or approved fallback evidence exists.
- Stop/task status is closed.

## Failure Handling / Escalation

- Invalid OTP: retry carefully; do not hand over order until verified or approved exception path is authorized.
- Customer disputes identity: do not release order; escalate.
- App failure after handoff risk: stop, document evidence, contact admin immediately.
- Unsafe environment: prioritize personal safety and report to supervisor/admin.

---

# C. Cash Handling SOP

## Goal

Collect, record, and reconcile driver-held cash without off-system handling.

## Preconditions

- Order/payment method requires cash collection.
- Driver understands amount due before handoff.

## Screen / Tool

- Order/payment screen
- Receipt confirmation
- Driver reconciliation / end-of-day workflow

## Steps

1. Before handoff, confirm amount due in the system.
2. Collect exact or recorded cash amount from customer.
3. Record payment in system immediately using the approved payment action.
4. Confirm payment status updates.
5. Ensure receipt/evidence is generated or visible.
6. Keep collected cash separate and traceable during route.
7. At end of day, open reconciliation workflow/report.
8. Submit total collected cash as required.
9. Hand over cash per business process.
10. Confirm reconciliation report reflects submitted totals.

## Proof of Completion

- Payment is visible on the order.
- Receipt exists.
- End-of-day reconciliation report includes driver total.

## Failure Handling / Escalation

- Customer claims already paid: verify in system before collecting.
- Partial payment offered: do not invent rules; escalate.
- Payment recorded incorrectly: escalate immediately for audited correction.
- Cash short/over at day end: report difference; do not hide discrepancy.

## End-of-Day Driver Checklist

1. All assigned tasks updated.
2. All cash payments recorded.
3. Reconciliation submitted.
4. Unsuccessful stops documented.
5. Exceptions handed over to admin/supervisor.
