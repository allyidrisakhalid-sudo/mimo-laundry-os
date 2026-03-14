# SOP Affiliate Shop Operations

## Scope

This SOP covers affiliate walk-in order capture, shop drop/pickup flow, and hybrid return handling.

## Roles

- Affiliate Staff
- Affiliate Manager
- Admin
- Driver (handoff portions only)

## System Preconditions

- Affiliate user is logged in with the correct shop account.
- Shop can only see its own orders.
- Commission logic depends on delivered + paid outcomes.

---

# A. Walk-in Order Capture SOP

## Goal

Capture affiliate-sourced orders accurately and preserve attribution/commission eligibility.

## Preconditions

- Customer is physically present or order details are available.
- Affiliate staff is using the correct shop account.

## Screen / Tool

- Affiliate create-order screen
- Customer/order detail input fields
- Return method selector
- Tag code generation/record field if used

## Steps

1. Sign in as affiliate staff.
2. Open create-order flow.
3. Enter customer details accurately.
4. Confirm source is the affiliate shop.
5. Select correct order channel / return method.
6. Choose service tier as requested.
7. Confirm zone/shop association is correct.
8. Generate, print, or record the tagCode.
9. Attach the tag to the physical bag.
10. Confirm order creation succeeded.
11. If customer messaging is used, send/confirm the order reference.

## Proof of Completion

- Order appears in affiliate order list.
- Affiliate can view only its own orders.
- Tag code is attached/recorded.
- Timeline includes affiliate/shop-origin evidence where applicable.

## Failure Handling / Escalation

- Wrong return method selected: correct immediately before further movement.
- Cannot see created order: refresh once, then escalate.
- Shop account sees another shop's order: stop and escalate immediately.
- Tag cannot be produced: do not continue without traceability.

---

# B. Shop Drop / Pickup SOP

## Goal

Handle shop-based customer handoff cleanly.

## Preconditions

- Affiliate order exists.
- Customer/shop handoff is happening at the affiliate location.

## Screen / Tool

- Affiliate order list/detail
- Shop handoff status controls

## Steps

1. Locate the order in affiliate screen.
2. Confirm customer/order identity.
3. For shop drop intake:
   - confirm bag/tag
   - mark received at shop if supported in current process
4. Hold the item securely for onward flow.
5. When returned and ready for customer pickup:
   - locate order
   - confirm ready-for-pickup status
6. When customer arrives:
   - verify identity/order reference
   - hand over correct order
   - complete pickup/closure in system

## Proof of Completion

- Timeline includes shop-related events.
- Order closes correctly after customer pickup.
- Affiliate scoping remains correct.

## Failure Handling / Escalation

- Wrong order presented at pickup: stop and re-verify.
- Customer disputes contents/payment: escalate per support playbooks.
- System cannot close pickup: capture evidence and escalate.

---

# C. Hybrid Return SOP

## Goal

Support affiliate-origin orders that return to the customer by door delivery.

## Preconditions

- Order was created by affiliate.
- Return method is hybrid / door return.

## Screen / Tool

- Affiliate order detail
- Tracking/timeline view
- Dispatch visibility if exposed to affiliate/admin

## Steps

1. Create the order as affiliate-sourced.
2. Confirm return method is hybrid / door delivery.
3. Ensure the order follows normal processing path.
4. Do not mark as shop pickup when final return is by driver.
5. When dispatch begins, confirm door-delivery flow is visible in timeline/status.
6. On final delivery, confirm delivered status and payment status if applicable.

## Proof of Completion

- Timeline shows affiliate source plus delivery completion.
- Final method matches hybrid door return.
- Commission eligibility is preserved because source attribution remains intact.

## Failure Handling / Escalation

- Order accidentally routed to shop pickup: escalate before customer communication.
- Affiliate cannot track its own order: escalate.
- Commission not appearing after delivered+paid: log issue for admin review.
