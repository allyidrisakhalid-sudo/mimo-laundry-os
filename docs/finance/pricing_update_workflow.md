# Pricing Update Workflow

## Purpose

Protect old orders from pricing drift while allowing safe future pricing changes.

## Non-negotiable rules

- Existing orders never change pricing plan retroactively.
- New pricing is introduced as a new plan version.
- Activation is controlled by effective date/time.
- Create, update, and activation actions must be auditable.

## Workflow

### 1. Draft

Create a new PricingPlan record with:

- status = DRAFT
- copied rates from current active plan
- only required changes applied
- clear notes describing why the change exists

### 2. Stage

In staging:

- activate the draft plan in staging only
- create test orders before and after intake
- verify quote and final totals
- verify invoice line items persist correctly
- verify prior test orders remain on prior pricing version

### 3. Schedule

In production:

- set effectiveFrom to a future activation point
- keep old plan active until that moment
- do not edit old plan rows after release note is approved

### 4. Activate

At effectiveFrom:

- plan becomes ACTIVE
- new orders created after activation use new plan
- old orders remain bound to the previous plan version

### 5. Post-activation verification

Verify:

- new order uses new plan version
- old order remains locked to old plan version
- invoice totals and line items are unchanged for old orders
- audit logs show create/update/activate actions

## Release evidence required

- before/after pricing screenshots or query outputs
- one old order proof
- one new order proof
- audit log proof
- release note entry

## Rollback

If activation is incorrect:

- do not edit old plans
- create corrected replacement plan version
- disable future activation of the wrong draft if not yet active
- if already active, create superseding plan with corrected values and a new effectiveFrom
