# Dry-Run Results Chapter 12.1

## Status

- Chapter state: IN PROGRESS
- Date executed: 2026-03-14 21:32:20
- Operator: ally idrisa
- Repo commit at start: 02f2163

## Pre-Flight Production Verification

- Production web URL: https://app.mimolaundry.org
- Production API URL: https://api.mimolaundry.org
- /v1/health result: ok / env=production / db=ok / ts=2026-03-14T18:32:20.185Z
- /v1/health/db result: ok / db=ok / check=SELECT 1 / ts=2026-03-14T18:32:20.744Z
- Monitoring evidence checked: YES

## Accounts Used

- Customer: Seed Customer A (CUSTOMER)
- Affiliate staff: Affiliate Staff User (AFFILIATE_STAFF)
- Driver: Driver User (DRIVER)
- Hub staff: Hub Staff User (HUB_STAFF)
- Admin: Admin User (ADMIN)

## Order Execution Summary

| Order | Source    | Zone   | Return Type   | Tier     | Payment          | Result       | Notes                                                                                                                                                                    |
| ----- | --------- | ------ | ------------- | -------- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01    | Door      | zone_a | Door          | Standard | Cash             | PARTIAL PASS | ORD-1773515264690 created successfully; hub auto-assigned=hub_kigamboni; bag=BAG-1773515264690; quote TZS 7,000; timeline shows ORDER_CREATED, HUB_ASSIGNED, PAYMENT_DUE |
| 02    | Door      |        | Door          | Express  | Mobile Money Ref | PENDING      |                                                                                                                                                                          |
| 03    | Door      |        | Door          | Same-Day | Cash             | PENDING      |                                                                                                                                                                          |
| 04    | Door      |        | Door          | Standard | Mobile Money Ref | PENDING      |                                                                                                                                                                          |
| 05    | Door      |        | Door          | Express  | Cash             | PENDING      |                                                                                                                                                                          |
| 06    | Affiliate | Zone A | Shop Pickup   | Standard | Cash             | BLOCKED      | Affiliate Staff create failed using Shop drop + Zone A + Mikocheni Affiliate                                                                                             |
| 07    | Affiliate |        | Shop Pickup   | Express  | Mobile Money Ref | PENDING      |                                                                                                                                                                          |
| 08    | Affiliate |        | Hybrid Return | Standard | Cash             | PENDING      |                                                                                                                                                                          |
| 09    | Affiliate |        | Hybrid Return | Express  | Mobile Money Ref | PENDING      |                                                                                                                                                                          |
| 10    | Affiliate |        | Shop Pickup   | Standard | Cash             | PENDING      | QC FAIL then resolve                                                                                                                                                     |

## Required Evidence References

- Full lifecycle timeline screenshot:
- QC fail + resolution screenshot:
- Receipt screenshot:
- Commission ledger screenshot:
- Payout draft/report screenshot:
- Daily close report screenshot:
- Driver reconciliation screenshot:

## QC Fail Scenario

- Order:
- Failure type:
- Resolution:
- Evidence:

## Commission / Payout Verification

- Affiliate order refs included:
- Commission evidence:
- Payout draft/report evidence:

## Daily Close Verification

- Report date:
- Expected totals:
- Observed totals:
- Match status:

## Driver Reconciliation Verification

- Driver:
- Expected cash:
- Submitted cash:
- Result:

## Issues Logged During Dry-Run

| ID | Title | Order Ref | Severity | Owner | Workaround | Permanent Fix |
| DR-01 | Apex domain still not resolving | N/A | P2 | Admin | Use https://www.mimolaundry.org for ops dry-run | Verify Cloudflare apex A record propagation and resolver visibility |
| DR-02 | Production web operational shell lacks executable order-action workflows | N/A | P1 | Admin | Use current web only for login/read-only proof | Implement executable production workflow actions beyond login and payload viewing |
| DR-03 | Admin order creation path failed in current shell | N/A | P3 | Admin | Use role-appropriate windows only | Clarify or hide unsupported create-order action for admin in web shell |
| DR-04 | Affiliate order creation failed with current visible form defaults | 06 | P2 | Admin | Check channel-specific affiliate flow options before retry | Expose valid affiliate create-order path clearly in web shell |
| DR-05 | Affiliate shop order creation fails with valid affiliate form inputs | 06 | P1 | Admin | Continue dry-run with customer path first while defect is isolated | Inspect affiliate order create API validation, shop-zone mapping, and affiliate account/shop linkage |
| DR-06 | Deployed web has role routes but lacks executable operational actions required for Chapter 12.1 | N/A | P1 | Admin | Use current shell only for limited smoke proof | Deploy full operational UI for customer, affiliate, driver, hub, and admin workflows before rerunning Chapter 12.1 |

## Outcome

- PASS / FAIL: FAIL
- Summary: Chapter 12.1 dry-run could not complete. Customer login/read-only proof is present, but the deployed web app does not expose executable operational actions required for the Chapter 12.1 dry-run. Affiliate order creation also failed.
- Follow-up actions: Implement affiliate create-order and all required role-specific operational actions, then rerun the full 10-order dry-run.
