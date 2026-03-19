# P2.10 Affiliate Portal Implementation Baseline

## 1) Purpose
- This file converts the approved P2.10 affiliate portal model into the implementation control layer for affiliate-facing portal work.

## 2) Locked Affiliate Route Model
- /app/affiliate
- /app/affiliate/orders/new
- /app/affiliate/orders
- /app/affiliate/orders/[id]
- /app/affiliate/finance

## 3) Locked Dashboard Model
- create-order first
- readiness and issues visible
- orders needing attention visible
- finance snapshot only for affiliate admin

## 4) Locked Walk-In Order Model
- one concise fast form
- customer data minimal
- service selection clear
- handoff/return expectation obvious
- submit path immediate and practical

## 5) Locked Orders and Pickup Model
- orders list shows only current shop scope
- order detail is the shop-owned truth surface
- readiness and pickup/handoff state are obvious
- one valid next action at a time

## 6) Locked Finance Visibility Model
- finance route exists for affiliate admin only
- affiliate staff must not see finance navigation or finance route content
- finance remains summary-based and simple

## 7) Locked Scope Model
- affiliate users see only their own shop context
- no cross-shop lists, detail views, or finance leakage
- forbidden access must be deliberate and visible where applicable

## 8) Locked Tablet/Web Behavior Model
- tablet/web speed first
- touch-friendly counter use
- fast repeated order entry
- no admin-style density

## 9) Implementation Guardrails
- no extra affiliate routes beyond approved scope
- no giant CRM/customer-profile flow
- no finance sprawl into normal staff workflow
- no hardcoded copy outside i18n
- no cross-shop ambiguity
- no giant pickup wizard

## 10) Downstream Dependency Rule
- later affiliate refinements must preserve this fast scoped shop model unless explicitly revised

## 11) Baseline Lock Statement
- The Phase 2 affiliate portal implementation baseline is now the single source of truth for affiliate portal behavior.
