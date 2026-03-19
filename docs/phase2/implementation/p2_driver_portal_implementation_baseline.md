# P2 Driver Portal Implementation Baseline

## 1) Purpose
- This file converts the approved P2.8 driver portal model into the implementation control layer for driver-facing portal work.

## 2) Locked Driver Route Model
- /app/driver
- /app/driver/tasks
- /app/driver/tasks/[id]
- /app/driver/profile

## 3) Locked Today Model
- next task first
- grouped tasks
- route clarity without map dependence
- cash visibility secondary but clear
- one dominant task-start action

## 4) Locked Stop-Detail Model
- proof action is the hero
- supporting details are secondary
- issue/help remains visible
- cash prompt appears only when relevant

## 5) Locked Cash Model
- stop-level cash prompts
- today-level cash summary
- end-of-day reconciliation visibility
- no finance-dashboard drift

## 6) Locked Resilience Model
- online
- weak connection
- offline
- syncing
- sync failed
- synced
- retry and recovery must be visible and calm

## 7) Locked Mobile Navigation Model
- Today
- Tasks
- Profile

## 8) Implementation Guardrails
- no extra driver routes beyond approved scope
- no map-first takeover in this chapter
- no hidden proof actions
- no hardcoded copy outside i18n
- no desktop-style data density on mobile-critical flows
- no vague sync state behavior

## 9) Downstream Dependency Rule
- later dispatch/ops/support refinements must preserve this driver execution model unless explicitly revised

## 10) Baseline Lock Statement
- The Phase 2 driver portal implementation baseline is now the single source of truth for driver portal behavior.
