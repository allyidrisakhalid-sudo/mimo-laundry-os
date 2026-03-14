# Dry-Run Simulation Plan Chapter 12.1

## Objective

Execute an operational simulation of 10 orders end-to-end using real role accounts and existing product flows only.

## Locked Rules

- No new features during this chapter.
- Every action must leave system evidence.
- RBAC must remain enforced.
- Any deviation becomes a logged issue.

## Required Accounts

- Customer account
- Affiliate staff account
- Driver account
- Hub staff account
- Admin account

## Required Mix

- 5 door orders
- 5 affiliate/shop orders
- 2 of the affiliate orders must be hybrid return orders
- Use at least 2 zones if active

## Per-Order Required Path

1. Order created
2. Pickup/drop flow completed
3. Hub intake + weight recorded
4. Processing stages completed
5. QC pass, except one forced QC fail scenario
6. Dispatch + delivery completed
7. Payment recorded (mix cash + mobile money reference)
8. Receipt generated
9. Affiliate commission verified for affiliate-sourced delivered+paid orders
10. Test orders appear in daily close output

## Suggested Order Matrix

| Order | Source    | Return Type   | Tier     | Payment          | Special Case         |
| ----- | --------- | ------------- | -------- | ---------------- | -------------------- |
| 01    | Door      | Door          | Standard | Cash             | Normal               |
| 02    | Door      | Door          | Express  | Mobile Money Ref | Normal               |
| 03    | Door      | Door          | Same-Day | Cash             | Normal               |
| 04    | Door      | Door          | Standard | Mobile Money Ref | Normal               |
| 05    | Door      | Door          | Express  | Cash             | Normal               |
| 06    | Affiliate | Shop Pickup   | Standard | Cash             | Normal               |
| 07    | Affiliate | Shop Pickup   | Express  | Mobile Money Ref | Normal               |
| 08    | Affiliate | Hybrid Return | Standard | Cash             | Hybrid               |
| 09    | Affiliate | Hybrid Return | Express  | Mobile Money Ref | Hybrid               |
| 10    | Affiliate | Shop Pickup   | Standard | Cash             | QC Fail then Resolve |

## Evidence to Capture

- One full lifecycle timeline
- One QC fail + resolution
- One receipt
- One commission ledger entry
- One payout draft/report
- Daily close report output
- Driver reconciliation report output

## Dry-Run Execution Sequence

1. Pre-flight production health check
2. Create all 10 orders
3. Execute pickup/drop intake
4. Run hub intake and processing
5. Force one QC fail case and resolve it
6. Dispatch/deliver all orders
7. Record payments and verify receipts
8. Verify affiliate commission earned
9. Run payout draft/report
10. Run daily close
11. Run driver reconciliation
12. Log all deviations/issues
13. Record evidence in dry_run_results.md

## Pass Condition

Dry-run completes without system breakage and evidence exists for all required checkpoints.
