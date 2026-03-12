# Invoicing & Receipts

## Invoice structure

Invoice data for an order is read from stored records, not recomputed-only display values:

- `OrderPricingSnapshot`
- `OrderLineItem`
- `OrderTotals`

Endpoint:

- `GET /v1/orders/:id/invoice`

Returned shape:

- order summary
- pricing snapshot
- permanent line items
- stored totals

## Immutability rule

Once pricing is finalized at intake, invoice line items are treated as stored truth for the order.
In v1 there is no normal mutation endpoint for final invoices.
Future changes must use adjustment-style entries rather than overwriting finalized history.

## Payment methods

Supported methods:

- `CASH`
- `MOBILE_MONEY`
- `CARD`

Reference rules:

- `MOBILE_MONEY` requires `reference`
- `CASH` may omit `reference`; server generates a cash reference
- `CARD` may include reference if available

## Receipt number format

Receipts use this stored format:

- `RCP-YYYYMMDD-0001` style

Current implementation uses:

- `RCP-YYYYMMDD-<last 4 digits derived from current timestamp>`

## API endpoints

- `POST /v1/payments`
- `GET /v1/orders/:id/payments`
- `GET /v1/orders/:id/receipt`

## Consistency rules

- `Receipt.amountTzs == Payment.amountTzs`
- `Receipt.reference == Payment.reference` or generated cash reference
- In v1, payment amount must equal current `balanceDue`
- Recording payment reduces `OrderTotals.balanceDue`
- Recording payment appends `PAID` order event and audit log action

## Sample JSON

### POST /v1/payments request

```json
{
  "orderId": "ca8be79e-d541-4d15-87c1-0f5d54c1f0c0",
  "method": "MOBILE_MONEY",
  "amountTzs": 16600,
  "reference": "MPESA-REF-001"
}
```
