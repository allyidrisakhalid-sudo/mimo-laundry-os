# Payments v1

## Scope

Chapter 9.3 delivers operational payment workflows for:

- cash collection
- driver cash reconciliation
- mobile money manual confirmation with reference
- refunds
- balance tracking per order

## Balance formula

Balance due is derived as:

alanceDue = grandTotal - recordedPayments + issuedRefunds - appliedCredits

For current v1 proof:

- cash and mobile money payments reduce balance due
- refund issuance increases balance due again
- final payment can close the balance back to zero

## Cash collection

Endpoint:

- POST /v1/payments/cash

Required fields:

- orderId
- mountTzs
- collectedFrom

Supported custody fields:

- collectedByUserId
- collectedAt
- eceivedAtHubByUserId
- eceivedAtHubAt
- cashBatchId

Rules:

- amount must not exceed current order balance in v1
- payment is stored as immutable transaction
- receipt is issued immediately
- payment action is audited

## Driver reconciliation

Endpoints:

- POST /v1/driver/reconciliation/submit
- GET /v1/admin/reconciliation/drivers?date=YYYY-MM-DD
- POST /v1/admin/reconciliation/:id/approve

Fields:

- expectedCashTzs
- declaredCashTzs
- differenceTzs
- status = OPEN | SUBMITTED | APPROVED

Rules:

- expected cash is derived from recorded driver cash collections
- driver submits declared amount
- admin approves reconciliation
- reconciliation remains traceable

## Mobile money

Endpoint:

- POST /v1/payments/mobile-money

Required fields:

- orderId
- mountTzs
- provider
- eference

Optional integration-ready fields:

- providerTxnId
- erifiedAt
- erifiedByUserId
- awCallbackJson

Supported providers in v1:

- MPESA
- TIGO
- AIRTEL
- HALOPESA
- OTHER

Rules:

- mobile money is recorded manually in v1
- reference is mandatory
- receipt stores the reference
- future webhook verification can be added without schema rewrite

## Refunds

Endpoint:

- POST /v1/admin/refunds

Required fields:

- orderId
- mountTzs
- method
- eason

Optional fields:

- paymentId
- eference

Supported methods:

- CASH
- MOBILE_MONEY
- CREDIT

Rules:

- refund is stored as immutable transaction
- refund issuance appends refund events to order timeline
- refund action is audited
- refund increases balance due relative to already-recorded payments
- customer-visible payment history includes refunds

## Order visibility

Endpoints:

- GET /v1/orders/:id/payments
- GET /v1/orders/:id/balance
- GET /v1/orders/:id/receipt

Customer-visible data includes:

- payments list
- refunds list
- ledger summary
- balance due
- latest receipt

## Event and audit behavior

Financial actions append order events and audit records.

Proof validated in Chapter 9.3:

- cash payment recorded
- reconciliation submitted and approved
- refund issued successfully
- mobile money payment recorded with reference
- final balance due returned to zero

## Error codes used in v1

- VALIDATION_ERROR
- ORDER_NOT_FOUND
- INVOICE_NOT_READY
- PAYMENT_EXCEEDS_BALANCE
- PAYMENT_RECORD_FAILED
- RECONCILIATION_NOT_FOUND
- REFUND_ISSUE_FAILED
- FORBIDDEN

## Future extension plan

Later chapters can extend this with:

- provider webhooks for mobile money verification
- payout batching
- credit application workflows
- stronger reconciliation period isolation
- richer receipt history
