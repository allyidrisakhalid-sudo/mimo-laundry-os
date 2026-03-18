# P2 Implementation Baseline

## 1) Purpose

- This file is the implementation baseline for Phase 2. All frontend and portal work must follow the approved IA, route map, navigation model, dashboard structure, and bilingual copy rules before any new UI is implemented.

## 2) Locked Role Portals

- /app/customer
- /app/driver
- /app/hub
- /app/affiliate
- /app/admin
- /app/dev

## 3) Locked Public Routes

- /
- /track
- /partners
- /help
- /login
- /signup
- /terms
- /privacy
- /refund-policy

## 4) Locked Navigation Model

- web uses header + role sidebar
- customer/driver mobile uses bottom tabs
- no extra role portals
- no extra top-level public pages

## 5) Locked Dashboard Model

- KPI Row + Action Queue + Table/List
- no chart-heavy drift
- every dashboard must show the next obvious action

## 6) Locked Copy Rule

- no hardcoded user-facing strings
- all implementation must move toward EN/SW i18n-key usage
- wording must remain aligned to copy baseline and role terminology

## 7) Implementation Guardrails

- one screen = one purpose
- one dominant action per screen
- no duplicate page purpose
- no custom layout hacks before component usage is attempted
- role scope must remain enforced in UI structure
- public, portal, support, and admin surfaces must remain one product system

## 8) Chapter Dependency Rule

- no P2.1+ implementation may contradict this baseline
- if a later implementation change requires IA/copy/navigation correction, it must be documented explicitly

## 9) Baseline Lock Statement

- This implementation baseline is now the control layer for all Phase 2 product work.
