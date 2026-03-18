# Role Journey Acceptance Checklist  Mimo Phase 2

## 1) Checklist Purpose

This checklist defines the strict pass/fail acceptance conditions for each role journey so Phase 2 launch validation is consistent, evidence-based, and intolerant of blocked workflows, role confusion, or device mismatch.

## 2) Customer Checklist

- [ ] customer can identify the service and primary next action quickly from the public entry point
- [ ] customer can reach login or signup without confusion
- [ ] customer is routed into the correct portal after authentication
- [ ] customer can complete the order journey end-to-end
- [ ] customer can understand order detail, timeline, payment, and support state
- [ ] customer mobile experience fits the target device well
- [ ] customer does not encounter dead ends or contradictory status surfaces
- [ ] customer can reach support or recovery flow when needed
- [ ] customer does not see any restricted role content or confusing cross-role paths

## 3) Driver Checklist

- [ ] driver can log in and land in the correct portal
- [ ] next task or next action is obvious immediately
- [ ] driver can complete the proof flow end-to-end
- [ ] driver can understand and handle cash or reconciliation state where relevant
- [ ] driver mobile experience fits the target device well
- [ ] driver does not require hidden instructions to complete stops
- [ ] retry or sync state is understandable where visible
- [ ] driver does not see irrelevant admin, hub, affiliate, or DevAdmin surfaces

## 4) Hub Checklist

- [ ] hub staff can log in and land in the correct portal
- [ ] scanner-first or intake-first action is obvious
- [ ] hub staff can complete intake, processing, QC, and dispatch end-to-end
- [ ] tablet or tablet-like workflow remains readable and usable
- [ ] queue, board, and dispatch states are clear without confusion
- [ ] hub staff can assign work without normal dependency on admin intervention
- [ ] no role leakage appears outside valid hub scope
- [ ] recovery or alternate path is understandable when an exception state appears

## 5) Affiliate Checklist

- [ ] affiliate staff can log in and land in the correct portal
- [ ] affiliate staff can create a walk-in order quickly
- [ ] affiliate staff can view only own-shop orders
- [ ] affiliate staff can complete the next pickup or handover step without confusion
- [ ] affiliate admin can log in and land in the correct portal context
- [ ] affiliate admin can review earnings or payout visibility appropriately
- [ ] tablet/web experience fits the intended device use
- [ ] staff/admin role split is clear and correct
- [ ] no cross-shop data leakage appears
- [ ] no hidden admin workaround is required for normal shop workflow

## 6) Admin Checklist

- [ ] admin can log in and land in the correct portal
- [ ] highest-priority action is obvious from dashboard landing
- [ ] admin can move from dashboard to orders, operations, pricing, and finance smoothly
- [ ] laptop/desktop density remains organized and readable
- [ ] filters, tables, and oversight surfaces are usable without clutter
- [ ] audit or read-only control visibility appears where relevant
- [ ] admin does not need to hunt across duplicate pages to run daily operations
- [ ] no role leakage or route confusion appears during the control workflow

## 7) DevAdmin Checklist

- [ ] DevAdmin can log in and land in the correct portal
- [ ] health and diagnostics come before risky action surfaces
- [ ] failed jobs workflow is understandable and guarded
- [ ] feature flags state is understandable
- [ ] override path requires a reason and shows audit intent
- [ ] activity or audit visibility confirms traceability
- [ ] laptop/desktop workflow fits the intended device context
- [ ] DevAdmin does not need manual DB work for supported tasks
- [ ] no unsafe ambiguity appears in retry, flag, or override flows

## 8) Global Pass / Fail Rules

Locked global pass / fail rules:
- PASS requires every role journey to complete end-to-end
- PASS requires target-device usability to be acceptable for every role
- PASS requires no major confusion point that blocks normal use
- PASS requires no role-permission breach
- FAIL if any role cannot complete its core journey
- FAIL if any role lands in the wrong portal
- FAIL if any role requires hidden instructions to finish the workflow
- FAIL if evidence is incomplete or contradictory

## 9) Checklist Lock Statement

The Phase 2 role journey acceptance checklist is locked as the hard gate for role-based launch validation. A journey only passes when the full workflow succeeds on the intended device with evidence, clear routing, correct permissions, and no blocking confusion.
