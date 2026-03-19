# P2.11 Admin HQ Implementation Baseline

## 1) Purpose
- This file converts the approved P2.11 Admin HQ model into the implementation control layer for admin-facing portal work.

## 2) Locked Admin Route Model
- /app/admin
- /app/admin/orders
- /app/admin/orders/[id]
- /app/admin/operations
- /app/admin/finance

## 3) Locked Dashboard Model
- KPI row
- action queue
- global orders/issues list
- pressure summary
- finance signal panel
- no report museum drift

## 4) Locked Orders Model
- platform-wide oversight
- practical filters
- clear attribution
- safe quick-open behavior
- order detail remains source of truth

## 5) Locked Operations and Network Model
- zones
- hubs
- affiliates
- drivers
- practical list/detail control model
- no configuration maze

## 6) Locked Pricing Model
- versioned plans
- create/stage/activate flow
- effective-date clarity
- no mutable single-plan confusion

## 7) Locked Finance Model
- payments/refunds
- payouts
- daily close
- read clarity over accounting-software complexity

## 8) Locked Read-Only Oversight Model
- audit visibility is readable and filterable
- failed-jobs visibility is readable and business-relevant
- no mutation controls in read-only oversight surfaces

## 9) Locked Desktop Behavior Model
- desktop-first
- organized density
- filters and tables remain readable
- primary actions remain easy to find

## 10) Implementation Guardrails
- no extra admin routes beyond approved scope
- no duplicate dashboards
- no chart-heavy analytics drift
- no hardcoded copy outside i18n
- no pricing UI that breaks version truth
- no hidden daily-close blockers
- no dev-console leakage into admin HQ

## 11) Downstream Dependency Rule
- later admin refinements must preserve this command-center model unless explicitly revised

## 12) Baseline Lock Statement
- The Phase 2 Admin HQ implementation baseline is now the single source of truth for admin portal behavior.