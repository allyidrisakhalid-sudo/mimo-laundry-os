# Launch Validation Runbook  Mimo Phase 2

## 1) Purpose

This runbook defines how the operator executes Phase 2 role-based launch validation in a repeatable, evidence-driven order so launch readiness is judged on real workflows, real devices, and recorded proof.

## 2) Required Roles and Devices

Locked required roles and devices:
- Customer on mobile
- Driver on mobile
- Hub Staff on tablet or tablet-like viewport
- Affiliate Staff on tablet/web
- Affiliate Admin on tablet/web
- Admin on laptop/desktop
- DevAdmin on laptop/desktop

## 3) Test Order

Locked test order:
1) Customer
2) Driver
3) Hub Staff
4) Affiliate Staff
5) Affiliate Admin
6) Admin
7) DevAdmin

## 4) Evidence Capture Plan

Locked evidence capture plan:
- capture screenshots for each critical journey step
- capture notes for friction, confusion, dead ends, and permission problems
- capture clear evidence for pass/fail of each role
- capture repair evidence if a test is re-run after a fix

## 5) Failure Logging Rules

Locked failure logging rules:
- every failure must record:
  - role
  - device
  - exact step
  - visible symptom
  - expected behavior
  - screenshot if possible
- do not summarize failures vaguely
- do not continue past a blocking failure without recording it

## 6) Re-test Rules

Locked re-test rules:
- after a fix, re-run the full affected journey, not just the broken screen
- if routing/auth/support state changed, re-check adjacent journey steps too
- keep original evidence and repaired evidence both

## 7) Final Validation Summary Rules

Locked final validation summary rules:
- summarize each role as PASS or FAIL
- summarize device readiness
- summarize major friction if any
- summarize whether the product is ready for launch validation sign-off

## 8) Runbook Lock Statement

The Phase 2 launch validation runbook is locked as the operator procedure for role-based readiness testing. Execution must follow the defined role order, device targets, evidence rules, failure logging discipline, and re-test requirements without improvisation.
