# P2 Customer Portal Implementation Baseline  Mimo Phase 2

## 1) Purpose

- This file converts the approved P2.7 customer portal model into the implementation control layer for the live customer experience.

## 2) Locked Route Map

- /app/customer = customer home
- /app/customer/orders = customer orders list
- /app/customer/orders/[id] = customer order detail
- /app/customer/profile = customer profile
- no extra customer routes may be introduced in P2.7

## 3) Locked Home Model

- customer home is active-order-first
- the primary purpose is to show the most relevant current order state and next action
- home may include a compact recent orders section
- home must include a clear order creation entry point
- home must include a secondary support/help entry
- home must not become a duplicate of the orders list or profile page

## 4) Locked Orders List Model

- orders list exists as the customer archive and browsing surface
- the list must be readable, minimal, and status-aware
- list rows/cards must route into the real order detail page
- list must not duplicate the full home hero logic

## 5) Locked Order Detail Model

- order detail is the single customer truth surface for one order
- it must present status/timeline, core order metadata, payment/invoice visibility, and support entry
- it must not fragment into sub-pages or tabs beyond approved scope

## 6) Locked Profile Model

- profile is a minimal utility surface for account basics, saved addresses, language, and receipts/documents access if already in scope
- profile must not become a settings maze
- profile must not duplicate order detail or home behavior

## 7) Implementation Guardrails

- no extra customer pages
- no duplicate page purpose
- no hardcoded customer-facing strings outside i18n
- no design drift away from shared tokens/components
- no fake tutorial layers
- no redundant support entry patterns
- no speculative business logic beyond approved Phase 2 scope

## 8) Downstream Dependency Rule

- later customer features must inherit this route and page-purpose model instead of redefining customer navigation again

## 9) Baseline Lock Statement

- The Phase 2 customer portal implementation baseline is now the single source of truth for live customer route purpose and page behavior.
