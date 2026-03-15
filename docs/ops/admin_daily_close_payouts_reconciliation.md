# Admin Routines Daily Close, Affiliate Payouts, Reconciliation

## Scope

This SOP defines end-of-day and finance-adjacent operating routines required to run Laundry OS safely.

## Roles

- Admin
- Finance/Admin Operator
- Hub Supervisor (supporting evidence)
- Affiliate Manager (for payout queries)
- Driver (for reconciliation submission)

---

# A. Daily Close SOP

## Goal

Produce and store a trusted daily operating close by hub, zone, and channel.

## Preconditions

- Day's operational activity is recorded.
- Payments and key order updates have been entered.

## Screen / Tool

- Daily closing report
- Admin reports/export screen
- Order/payment/ledger views for spot checks

## Steps

1. Sign in as admin.
2. Open daily close report.
3. Run the report for the target date.
4. Review output by:
   - hub
   - zone
   - channel
5. Check for anomalies:
   - unpaid delivered orders
   - missing receipts
   - cash mismatch indicators
   - missing commission triggers
   - unexpected refunds
6. Spot check totals against known test orders/DB-facing reports.
7. Export or store the report in the approved location.
8. Record that daily close was completed.

## Proof of Completion

- Daily close output exists.
- Totals align with observed order/payment activity.
- Anomalies are either cleared or logged as issues.

## Escalation

- Material mismatch -> stop close sign-off and investigate same day.

---

# B. Affiliate Payout SOP

## Goal

Review earned commissions and move them through payout workflow with full traceability.

## Preconditions

- Affiliate orders are delivered + paid.
- Commission ledger entries exist.

## Screen / Tool

- Affiliate commission ledger/report
- Payout draft/create screen
- Approval and paid-marking controls

## Steps

1. Sign in as admin/finance operator.
2. Open affiliate commission ledger/report for the target shop/period.
3. Verify only eligible orders are included.
4. Confirm total earned amount.
5. Create payout draft for the period.
6. Review draft contents and references.
7. Approve payout using proper authority.
8. Mark payout paid with payment reference when actual payment is made.
9. Confirm payout status and ledger balance.

## Proof of Completion

- Commission ledger balances against included orders.
- Payout draft/report exists.
- Paid payout contains reference and audit evidence.

## Escalation

- Missing commission entry for delivered+paid affiliate order -> investigate before paying.
- Duplicate commission/payout risk -> stop and review.

---

# C. Reconciliation SOP

## Goal

Close driver cash collection accurately and surface mismatches.

## Preconditions

- Driver has submitted daily reconciliation.
- Cash-eligible deliveries/payments were recorded.

## Screen / Tool

- Driver reconciliation report
- Payment ledger/report
- Approval/reject controls

## Steps

1. Sign in as admin/finance operator.
2. Open driver reconciliation report for the target driver/date.
3. Compare:
   - expected cash from system
   - driver-submitted amount
4. If amounts match:
   - approve reconciliation
5. If amounts do not match:
   - reject or flag
   - record discrepancy amount
   - request explanation/evidence
   - escalate if unresolved
6. Confirm outcome is stored in system.

## Proof of Completion

- Reconciliation report reflects expected vs submitted cash.
- Match/mismatch status is visible.
- Differences are escalated and tracked.

## Escalation

- Any unresolved variance must be logged before day close.
