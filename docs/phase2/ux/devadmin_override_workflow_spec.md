# DevAdmin Override Workflow Spec  Mimo Phase 2

## 1) Override Principles

Locked override principles:
- override is exceptional, not routine
- every override must be deliberate
- reason capture is mandatory
- auditability is mandatory
- override tools must never feel like raw DB access
- destructive or state-changing actions must be clearly distinguished
- DevAdmin must understand consequence before action
- safe controls replace manual database manipulation for supported scenarios

## 2) Override Tools Surface

### Purpose
- give DevAdmin a safe place to apply approved high-sensitivity operational overrides without touching the database manually

### Entry Point
- inside /app/dev/tools as a clearly separated override area

### Tool List Rules
- each override tool must show:
  - tool name
  - short purpose
  - sensitivity level
  - audit warning
- tools must be grouped by type or severity if helpful
- no unlabeled tool actions

### Sensitivity Visibility Rules
- high-impact actions must be visually distinct
- dangerous actions cannot be styled like normal utility toggles
- caution language must be clear but calm

### Forbidden Patterns
- showing raw SQL-like behaviors
- unlabeled override actions
- one-click high-impact mutation
- burying override tools among harmless utilities

## 3) Reason-Required Workflow

### Trigger
- any override action that changes state, forces an action, or bypasses a normal workflow

### Workflow Steps
1) open override action
2) review action context and consequence
3) enter reason
4) confirm action
5) receive action outcome
6) activity becomes visible in audit trail

### Reason Field Rules
- reason is mandatory
- reason field must be plain text and clearly labeled
- reason must explain why the override is needed
- blank or trivial confirmation is not acceptable
- the workflow must make reason feel meaningful, not ceremonial

### Confirmation Rules
- confirmation must restate the action and its target
- confirm button label must be explicit
- cancel path must remain easy
- destructive wording must be clear but not theatrical

### Post-Action Feedback Rules
- user sees immediate outcome:
  - action applied
  - action pending
  - action failed
- next step must be obvious
- resulting audit visibility must be acknowledged or easy to reach

### Forbidden Patterns
- one-click override with no reason
- vague confirm labels like Confirm
- hidden target/context
- override succeeding silently with no visible result

## 4) Auditability Rules

- every override action records:
  - actor
  - action
  - reason
  - target
  - time
  - outcome
- audit trail must be inspectable in /app/dev/activity
- override visibility must support accountability, not secrecy

## 5) Safe Outcome and Recovery Rules

- if override succeeds, state becomes clear
- if override fails, retry/help/escalation path is clear
- override failures must not leave the UI ambiguous
- no suggestion that DevAdmin should jump to direct DB manipulation for supported scenarios

## 6) Override Lock Statement

The DevAdmin override workflow is locked as a high-sensitivity, reason-required, visibly audited control model. Overrides are treated as exceptional support actions, never as routine shortcuts, and the interface must always make consequence, target, and outcome clear. This preserves accountability while replacing informal manual database intervention with deliberate, productized recovery tools for supported scenarios.
