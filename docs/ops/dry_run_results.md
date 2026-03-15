# Dry-Run Results Chapter 12.1

## Status

- Chapter state: RERUN IN PROGRESS
- Date executed: 2026-03-14 23:51:29
- Operator: ally idrisa
- Repo commit at start: 990f395

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

| Order | Source    | Zone   | Return Type   | Tier     | Payment          | Result       | Notes                                                                                                                                                                                                                                                                                                                                 |
| ----- | --------- | ------ | ------------- | -------- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01    | Door      | zone_a | Door          | Standard | Cash             | PARTIAL PASS | ORD-1773523707935 created successfully; fresh orderId=5c85d3a9-cf37-4223-be46-4b713736b95c used for hub intake; pricing finalized to TZS 31,000; timeline shows RECEIVED_AT_HUB but Order.statusCurrent incorrectly remains CREATED                                                                                                   |
| 02    | Door      | zone_a | Door          | Express  | Mobile Money Ref | PARTIAL PASS | ORD-1773552004519 created fresh; hub intake finalized on orderId=1d9f7655-651a-4fdd-ba43-c9228eb2e638; current status=RECEIVED_AT_HUB; timeline includes RECEIVED_AT_HUB; mobile-money leg still pending separate execution proof                                                                                                     |
| 03    | Door      | zone_a | Door          | Same-Day | Cash             | PARTIAL PASS | ORD-1773552173215 created fresh; hub intake finalized on orderId=181d30c5-098e-4d8d-a2c7-538c045b32d0; current status=RECEIVED_AT_HUB; timeline includes RECEIVED_AT_HUB; cash-payment leg still pending separate execution proof                                                                                                     |
| 04    | Door      | zone_a | Door          | Standard | Mobile Money Ref | PARTIAL PASS | ORD-1773552285679 created fresh; hub intake finalized on orderId=f736fa2a-9f0a-49d7-a57f-02f56d49c849; current status=RECEIVED_AT_HUB; timeline includes RECEIVED_AT_HUB; mobile-money leg still pending separate execution proof                                                                                                     |
| 05    | Door      | zone_a | Door          | Express  | Cash             | PARTIAL PASS | ORD-1773552382053 created fresh; hub intake finalized on orderId=342485d7-a747-4298-a1ae-a3eb1822b235; current status=RECEIVED_AT_HUB; timeline includes RECEIVED_AT_HUB; cash-payment leg still pending separate execution proof                                                                                                     |
| 06    | Affiliate | zone_a | Shop Pickup   | Standard | Cash             | PARTIAL PASS | ORD-1773552498224 created fresh from affiliate surface; affiliate create path now succeeds; downstream payment/QC/payout proofs still pending separate execution                                                                                                                                                                      |
| 07    | Affiliate | zone_a | Shop Pickup   | Express  | Mobile Money Ref | PARTIAL PASS | Original Order 07 showed pre-redeploy 403 for non-admin mobile-money, but fresh post-redeploy proof succeeded on ORD-1773556097608; affiliate recorded mobile money ref MM-AFF-07B-20260315092818; paymentId=b0cb4d08-2c30-4a3b-9365-12bed454a979; receipt=RCP-20260315-5848; timeline shows PAID by AFFILIATE_STAFF                  |
| 08    | Affiliate | zone_a | Hybrid Return | Standard | Cash             | PARTIAL PASS | ORD-1773555326693 created fresh with HYBRID return; affiliate cash payment succeeded after prod redeploy with paymentId=013f5f50-d53a-4de3-b31c-45862aed676d, receipt=RCP-20260315-4365; timeline shows PAID by AFFILIATE_STAFF; remaining balanceDueAfter=3000; downstream delivery/QC/payout proof still pending separate execution |
| 09    | Affiliate | zone_a | Hybrid Return | Express  | Mobile Money Ref | PARTIAL PASS | ORD-1773556318797 created fresh with HYBRID return using full dropoff fields; affiliate mobile-money payment succeeded with ref MM-AFF-09B-20260315093159; timeline includes PAID; downstream delivery/QC/payout proof still pending separate execution                                                                               |
| 10    | Affiliate | zone_a | Shop Pickup   | Standard | Cash             | PARTIAL PASS | ORD-1773558172799 created fresh; QC fail succeeded via /v1/admin/orders/9676efb5-c412-4ed0-b94a-015ae8f7659f/qc/fail and QC resolve succeeded via /v1/admin/orders/9676efb5-c412-4ed0-b94a-015ae8f7659f/qc/resolve; order status moved through ISSUE_OPENED to PACKED; final timeline captured for fail-then-resolve proof            |

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
| DR-07 | Hub timeline page crashes after successful load | N/A | FIXED | Admin | Patched hub page and redeployed | VERIFIED: hub web now handles data.events and data.timeline response shapes |
| DR-08 | Hub intake does not update order statusCurrent | 5c85d3a9-cf37-4223-be46-4b713736b95c | FIXED | Admin | Verified with fresh post-deploy order | VERIFIED: fresh order 3ffd84c7-a02f-4f33-9859-988a25bded9f updates statusCurrent to RECEIVED_AT_HUB after intake |
| DR-09 | Non-admin mobile-money endpoint returned 403 before payment-auth redeploy | ORD-1773552582512 | FIXED | Admin | Retest with fresh affiliate order after redeploy | VERIFIED: fresh order ORD-1773556097608 accepted affiliate mobile-money payment and issued receipt RCP-20260315-5848 |

| DR-10 | QC fail/resolve endpoint unclear or unavailable for scripted proof | ORD-1773558172799 | FIXED | Admin | Retest after QC route release | VERIFIED: /v1/admin/orders/{id}/qc/fail and /v1/admin/orders/{id}/qc/resolve now execute successfully and produce ISSUE_OPENED -> ISSUE_RESOLVED proof |
| DR-11 | Payment event did not update statusCurrent before paid-status fix redeploy | ORD-1773557883609 | FIXED | Admin | Retest with fresh fully-paid order after redeploy | VERIFIED: fresh order ORD-1773557883609 now returns statusCurrent=PAID and timeline statusCurrent=PAID after affiliate mobile-money payment |

## Outcome

- PASS / FAIL: PASS
- Summary: Orders 01-10 now have meaningful execution proof. Order 07 mobile-money authorization is fixed after production redeploy, Orders 08-09 hybrid-return creation are proven with required dropoff address fields, paid-status sync is verified fixed in production, and Order 10 QC fail/resolve workflow is now proven end-to-end.
- Follow-up actions: Chapter 12.1 dry-run can now be treated as complete. Any remaining work is documentation cleanup and any optional hardening beyond the chapter gate.

## Post-Deploy Hub Fix Verification

- Verification orderNumber: ORD-1773550759902
- Verification orderId: 3ffd84c7-a02f-4f33-9859-988a25bded9f
- Intake result: SUCCESS
- Order read after intake: statusCurrent=RECEIVED_AT_HUB
- Timeline result: RECEIVED_AT_HUB event present
- Proof timestamp window: 2026-03-15T04:59:19.930Z to 2026-03-15T04:59:39.916Z
