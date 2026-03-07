# Core Invariants

Status: Frozen after Chapter 0.2 PASS  
Change rule: Any future change requires an explicit architecture change request document and approval before implementation.

## 0.2.1 Multi-hub from day 1

Rule:
- The data model, API, and authorization model must support multiple hubs from day 1.
- The system must never assume a single hub in code, schema, API contracts, or permission rules.
- A Hub entity must exist even if operations start with only one hub.
- Orders must always reference a hub directly or through a formal assignment rule that resolves to a hub.
- Hub staff visibility must be scoped by assigned hub or assigned hub zone through policy enforcement.
- Adding hub #2 must be an admin or configuration operation, never a code rewrite.

Future test expectation:
- Create hub #2 through configuration or admin flows and confirm orders, permissions, and listings work without code changes.

## 0.2.2 Zones are the routing backbone

Rule:
- Zones must be first-class routing entities across operations.
- The system must never treat zones as optional metadata for routing decisions.
- Every hub must link to at least one zone.
- Every affiliate shop must link to exactly one zone in MVP.
- Every driver must link to one home zone; secondary zones may be added later.
- Every customer address used for door pickup or delivery must resolve to a zone.
- Every order must resolve to a zone through the pickup method, either from the customer address zone or the affiliate shop zone.
- Hub assignment and driver assignment must be zone-aware.

Future test expectation:
- Create multiple zones and verify hub assignment, affiliate mapping, and driver task assignment all follow zone resolution rules.

## 0.2.3 Order timeline is immutable (event truth)

Rule:
- Order state must be derived from an append-only OrderEvents timeline.
- OrderEvents must never be edited or deleted once recorded.
- Corrections must always be recorded as new events, never as silent mutation of prior events.
- Customers, drivers, hub staff, admins, and affiliate staff must read the same timeline truth, filtered only by permission where required.
- Exceptions such as damage, missing item, delay, refund request, or failed delivery must be recorded as explicit events.
- Operational notes must never replace event truth for state transitions.

Future test expectation:
- Perform order creation, intake, processing, exception logging, dispatch, and delivery actions and confirm each action appends at least one immutable event.

## 0.2.4 Versioned pricing locked per order

Rule:
- Pricing must be versioned and tied to effective dates.
- The system must never recalculate an existing order against a newer pricing plan version.
- Every order must store the pricing plan identifier and sufficient version snapshot data to preserve pricing truth.
- A quote may be produced before intake.
- A final invoice may recalculate after intake, but it must use the same pricing plan version locked to the order.
- Final invoice line items must be stored permanently for traceability.

Future test expectation:
- Activate a new pricing plan version and confirm existing orders retain old pricing while new orders use the new plan.

## 0.2.5 Payments and accounting are traceable ledgers

Rule:
- Every financial movement must be recorded as traceable ledger entries.
- The system must never rely on manual off-system adjustments as the source of truth.
- Payments, refunds, credits, and adjustments must carry references to their originating business action.
- Affiliate commissions must be recorded as liabilities until payout completion.
- Daily close outputs and cash reconciliation outputs must be generated from system records.
- Dashboard totals must always be traceable back to immutable financial records.

Future test expectation:
- Record payment, refund, commission accrual, payout, and daily close, then trace every reported total back to stored ledger entries.

## 0.2.6 RBAC and audit logs for privileged actions

Rule:
- Every privileged action must be both authorized and auditable.
- The system must define and enforce at least these roles: Customer, Driver, HubStaff, AffiliateStaff, Admin, DevAdmin.
- Affiliate staff must only access orders and records for their own shop.
- Drivers must only access tasks assigned to them.
- Hub staff must only access orders and operational records assigned to their hub or permitted hub zone.
- Admins may access global business data according to policy.
- DevAdmin overrides must be limited and must always be audited.
- Price plan edits, payout approvals, overrides, refunds, and role changes must always create audit records with actor and timestamp.
- A privileged change must never be unattributed.

Future test expectation:
- Attempt cross-scope access for each role and verify denial behavior, then perform privileged actions and verify audit records capture actor, action, target, and timestamp.
