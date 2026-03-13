# Accounting v1

## Scope

Accounting v1 provides minimal operational bookkeeping for Laundry OS. It is designed for traceability, not advanced finance workflows.

This chapter introduces:

- chart of accounts
- automatic journals from operational transactions
- driver cash reconciliation reporting
- daily close reporting by hub, zone, and channel

## Minimal chart of accounts

### Assets

- `1000` Cash on Hand
- `1010` Mobile Money Clearing
- `1100` Accounts Receivable

### Liabilities

- `2000` Affiliate Commissions Payable
- `2010` Customer Credits Payable

### Revenue

- `4000` Laundry Service Revenue
- `4010` Delivery Revenue
- `4020` Add-ons Revenue

### Expenses / contra handling

- `4900` Discounts / Promotions
- `5000` Payment Fees
- `5100` Refund Expense
- `5200` Affiliate Commission Expense

## Step 9.5.1 status

Implemented in this step:

- `AccountType` enum
- `Account` table
- idempotent seed for minimal chart of accounts

Planned next:

- journal entry + journal line models
- posting rules for invoice, payment, refund, commission, payout
- driver cash reconciliation report endpoint
- daily close report endpoint

## Traceability rule

Every accounting report total must trace back to stored operational records:

- order totals and line items
- payments
- refunds
- commission ledger entries
- payouts
- cash reconciliations

This chapter keeps accounting append-only. Corrections must be new entries, never silent edits.

## Posting rules

### Invoice finalization

- Debit `1100 Accounts Receivable`
- Credit `4000 Laundry Service Revenue` for service lines
- Credit `4010 Delivery Revenue` for delivery fee lines
- Credit `4020 Add-ons Revenue` for add-on/item lines
- Debit `4900 Discounts / Promotions` for discount lines if present

### Payment recorded

- `CASH` -> debit `1000 Cash on Hand`
- `MOBILE_MONEY` and `CARD` -> debit `1010 Mobile Money Clearing`
- Credit `1100 Accounts Receivable`

### Refund issued

- Debit `5100 Refund Expense`
- Credit:
  - `1000 Cash on Hand` for cash refunds
  - `1010 Mobile Money Clearing` for mobile money refunds
  - `2010 Customer Credits Payable` for credit refunds

### Commission earned

- Debit `5200 Affiliate Commission Expense`
- Credit `2000 Affiliate Commissions Payable`

### Payout paid

- Debit `2000 Affiliate Commissions Payable`
- Credit:
  - `1000 Cash on Hand` for cash payouts
  - `1010 Mobile Money Clearing` for mobile money or bank payouts

## Journal rules

- Journal entries are append-only
- Journal entry corrections must be separate adjustment entries later
- A source record can only post once because `JournalEntry(sourceType, sourceId)` is unique

## Driver cash reconciliation report

### Endpoint

- GET /v1/admin/reports/driver-cash?date=YYYY-MM-DD

### Per-driver fields

- driverId
- driverUserId
- driverName
- driverPhone
- expectedCashTzs
- declaredCashTzs
- differenceTzs
- mismatchFlag
- status
- econciliationId
- submittedAt
- pprovedAt
- pprovedByUserId

### Formula

- expected cash = sum of recorded CASH payments where:
  - Payment.status = RECORDED
  - Payment.collectedByUserId = driver user id
  - Payment.collectedAt::date = requested date
- declared cash = value from CashReconciliation.declaredCashTzs
- difference = declaredCashTzs - expectedCashTzs
- mismatch flag = differenceTzs != 0

### Status meaning

- OPEN = no reconciliation submitted yet
- SUBMITTED = driver submitted declaration
- APPROVED = admin approved reconciliation
