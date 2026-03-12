# Pricing Engine v1

## Purpose

Pricing Engine v1 provides versioned pricing for orders so that quotes and final invoices are reproducible and locked to the pricing plan active at the time the order was quoted.

## Versioning model

- Pricing plans are stored in `PricingPlan`
- Plans move through statuses:
  - `DRAFT`
  - `ACTIVE`
  - `RETIRED`
- Activation is controlled by:
  - `effectiveFrom`
  - `effectiveTo`
- Orders lock to one pricing plan through `OrderPricingSnapshot.pricingPlanId`
- In v1, quote and final must use the same pricing plan
- Changing an existing order to a different plan is not allowed in v1

## Supported pricing inputs

- Channel:
  - `DOOR`
  - `SHOP_DROP`
  - `HYBRID`
- Tier:
  - `STANDARD_48H`
  - `EXPRESS_24H`
  - `SAME_DAY`
- Weight-based services:
  - `WASH_DRY_FOLD`
  - `IRONING`
  - `ADDON_SCENT`
- Item pricing:
  - `DUVET`
  - `SUIT`
  - `CURTAIN_HEAVY`

## Core tables

- `PricingPlan`
- `PricingPlanChannel`
- `KgRate`
- `ItemRate`
- `DeliveryZoneFee`
- `MinimumChargeRule`
- `OrderPricingSnapshot`
- `OrderLineItem`
- `OrderTotals`

## Quote vs final flow

### Quote

On order creation:

1. Resolve the active pricing plan for the order channel at current time
2. Lock that plan into `OrderPricingSnapshot`
3. Generate an estimated quote
4. Persist stored invoice line items in `OrderLineItem`
5. Persist totals in `OrderTotals`
6. Mark snapshot as `ESTIMATED`

### Final

On hub intake:

1. Read the existing `OrderPricingSnapshot`
2. Recompute invoice using actual weight and the same locked plan
3. Replace persisted line items and totals
4. Mark snapshot as `FINALIZED`
5. Preserve the original locked `pricingPlanId`

## Delivery fee logic by channel and zone

### DOOR

- Delivery fee applies from `DeliveryZoneFee` by `zoneId`
- If a free threshold exists and subtotal reaches threshold, delivery fee may become zero

### SHOP_DROP

- Customer delivery fee is zero

### HYBRID

- Return-to-door pricing uses zone delivery fee rules
- Shop pickup return has zero customer delivery fee

## Minimum charge rules

- `MinimumChargeRule` applies by plan, tier, and optional channel
- If service subtotal is below the configured minimum:
  - add a stored line item named `Minimum order adjustment`
- This adjustment is persisted in `OrderLineItem`
- Totals are persisted in `OrderTotals`

## Stored invoice rules

- Pricing is not treated as display-only computation
- Invoice line items are persisted and then read back through the invoice endpoint
- Totals are persisted and returned as stored values
- This allows historical orders to remain stable after future pricing changes

## Safe pricing update procedure

1. Create a new pricing plan in `DRAFT`
2. Add channels, KG rates, item rates, delivery fees, and minimum charge rules
3. Activate the plan with `effectiveFrom` and optional `effectiveTo`
4. New orders use the newly active plan
5. Existing orders remain locked to their earlier plan snapshot

## API surface in v1

### Admin

- `POST /v1/admin/pricing/plans`
- `POST /v1/admin/pricing/plans/:id/activate`
- `POST /v1/admin/pricing/plans/:id/rates`
- `POST /v1/admin/pricing/plans/:id/delivery-fees`
- `POST /v1/admin/pricing/plans/:id/minimum-charges`

### Customer

- `GET /v1/orders/:id/invoice`

## Audit expectations

Pricing plan changes are privileged actions and must create audit records for:

- plan creation
- plan activation
- rate changes
- delivery fee changes
- minimum charge changes
