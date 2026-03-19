## 1) Purpose

- This file converts the approved P2.12 DevAdmin console model into the implementation control layer for DevAdmin-facing portal work.

## 2) Locked DevAdmin Route Model

- /app/dev
- /app/dev/diagnostics
- /app/dev/tools
- /app/dev/activity

## 3) Locked Health and Diagnostics Model

- health summary first
- diagnosis before action
- diagnostics are readable and structured
- no raw engineering dump as the primary UX

## 4) Locked Failed-Jobs Model

- failed jobs are visible
- retry happens from deliberate detail context
- retry outcomes are visible
- no retry chaos

## 5) Locked Feature-Flags Model

- flags are readable
- state is obvious
- changes are explicit
- safety-sensitive changes require deliberate confirmation

## 6) Locked Override Model

- override is exceptional
- reason capture is mandatory
- auditability is mandatory
- no raw DB behavior or hidden mutation shortcuts

## 7) Locked Activity Model

- activity is readable
- actor/action/target/time/outcome are visible
- activity supports accountability
- activity is not an action launcher

## 8) Locked Desktop Behavior Model

- desktop-first
- organized density
- dangerous controls visually distinct
- diagnostics and tools remain clear, not cluttered

## 9) Implementation Guardrails

- no extra DevAdmin routes beyond approved scope
- no developer-console aesthetic drift
- no raw stack-trace wall as the main UI
- no hardcoded copy outside i18n
- no one-click override without reason
- no retry control buried in noisy list rows
- no direct database dependency for supported scenarios

## 10) Downstream Dependency Rule

- later DevAdmin refinements must preserve this safety-control model unless explicitly revised

## 11) Baseline Lock Statement

- The Phase 2 DevAdmin console implementation baseline is now the single source of truth for DevAdmin portal behavior.
