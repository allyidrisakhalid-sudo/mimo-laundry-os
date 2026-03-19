# P2.9 Hub Portal Implementation Baseline

## 1) Purpose
- This file converts the approved P2.9 hub portal model into the implementation control layer for hub-facing portal work.

## 2) Locked Hub Route Model
- /app/hub
- /app/hub/intake
- /app/hub/processing
- /app/hub/orders/[id]

## 3) Locked Dashboard Model
- dashboard routes staff into work
- KPI row + action queue + active operational list
- no duplicate board/detail complexity on the dashboard

## 4) Locked Intake Model
- scanner/input first
- intake queue visible
- active intake detail focused
- issue visibility clear but secondary to normal flow

## 5) Locked Processing Model
- clean operational columns only
- issue flags visible
- stage movement explicit and controlled

## 6) Locked QC Model
- pass or fail/open issue
- fast decision
- issue visibility preserved
- no giant QC form system

## 7) Locked Dispatch Model
- ready-for-dispatch items only
- zone is the primary filter
- driver selection constrained by valid operational context
- assignment must be possible without admin help

## 8) Locked Tablet/Web Behavior Model
- tablet/web operational density
- touch-friendly where relevant
- no desktop micro-controls
- no mobile oversimplification that slows staff down

## 9) Implementation Guardrails
- no extra hub routes beyond approved scope
- no giant configuration maze
- no chart-heavy hub drift
- no hardcoded copy outside i18n
- no ambiguous stage movement
- no dispatch screen showing invalid cross-zone choices

## 10) Downstream Dependency Rule
- later operational refinements must preserve this hub execution model unless explicitly revised

## 11) Baseline Lock Statement
- The Phase 2 hub portal implementation baseline is now the single source of truth for hub portal behavior.
