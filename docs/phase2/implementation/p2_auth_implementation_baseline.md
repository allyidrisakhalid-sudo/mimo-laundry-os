# P2 Auth Implementation Baseline  Mimo Phase 2

## 1) Purpose

- This file converts the approved P2.5 auth, routing, session, and logout model into the implementation control layer for all access behavior in Phase 2.

## 2) Locked Auth Entry Routes

- /login
- /signup

## 3) Locked Role Routing Map

- CUSTOMER  /app/customer
- DRIVER  /app/driver
- HUB_STAFF  /app/hub
- AFFILIATE_STAFF  /app/affiliate
- AFFILIATE_ADMIN  /app/affiliate
- ADMIN  /app/admin
- DEV_ADMIN  /app/dev

## 4) Locked Session Rules

- authenticated users hitting /login or /signup are redirected to their portal home
- invalid or expired sessions hitting /app/* return to /login
- no generic holding dashboard
- no wrong-shell flash during routing

## 5) Locked Logout Rules

- logout must be visible and explicit
- logout clears active portal session state
- logout returns user to a public auth entry cleanly

## 6) Locked Forbidden-Access Rules

- wrong-role portal access returns a deliberate 403 surface
- wrong-role access is not silently redirected to another portal
- user must be offered the correct safe next step

## 7) Implementation Guardrails

- no role chooser before authentication
- no staff/admin self-signup flow in this chapter
- no hardcoded auth strings outside i18n
- no portal-specific auth pages with drifted layouts
- no hidden access behavior that contradicts role map
- no broken forgot-password promise

## 8) Downstream Dependency Rule

- onboarding and all later role portals must inherit this routing/session behavior without inventing their own access patterns

## 9) Baseline Lock Statement

- The Phase 2 auth implementation baseline is now the single source of truth for sign-in, sign-up, routing, session, and logout behavior.
