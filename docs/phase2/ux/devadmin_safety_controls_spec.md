# DevAdmin Safety Controls Spec  Mimo Phase 2

## 1) Safety Controls Principles

Locked safety controls principles:
- safety before speed
- review before mutation
- controlled tools are better than manual infrastructure access
- retries and flag changes must be explicit
- dangerous controls must remain separated from read-only diagnosis
- audit context should remain visible around sensitive actions
- internal language must stay readable and operationally useful
- the tools surface must guide careful action, not encourage experimentation

## 2) Failed Jobs Viewer Spec

### Purpose
- let DevAdmin inspect failed jobs and retry them safely without needing direct database work

### Entry Point
- inside /app/dev/tools as a defined control area

### Page Area Structure
1) tools header/context
2) failed jobs list
3) failed job detail panel or view
4) retry action area
5) audit reminder strip

### Failed Job List Rules
- list must show:
  - job type
  - failure time
  - current failure state
  - short context summary
- keep list filterable and readable
- do not flood the view with low-value internals

### Job Detail Rules
- detail should explain what failed at a support-usable level
- show enough context to decide whether retry is appropriate
- raw technical details may exist deeper, but primary view must remain organized
- do not require DevAdmin to parse chaos

### Retry Rules
- retry must be an explicit action
- retry is allowed only from the failed job detail context
- retry must not be a one-click casual action from a noisy list row
- after retry, the system must show a clear pending/success/failure outcome state

### Retry Confirmation Rules
- confirmation must state what is being retried
- if reason entry is required by product safety policy, it must be collected here
- retry confirmation must feel deliberate and logged
- success/failure response must be visible immediately after action

### Readability Rules
- business-relevant failed jobs must be easy to distinguish
- retryability must be obvious
- the UI must guide the support decision, not dump raw data

### Forbidden Patterns
- bulk-retry chaos
- retry from a tiny unlabeled icon
- hidden post-retry state
- direct DB-fix mentality reflected in UI language

## 3) Feature Flags Manager Spec

### Purpose
- let DevAdmin inspect and manage approved feature flags safely for rollout control

### Entry Point
- inside /app/dev/tools as a dedicated flags section

### Flags List Rules
- list feature flags clearly
- each row shows:
  - flag name
  - current state
  - scope if relevant
  - short purpose summary
- no cryptic internal-only naming as the primary display label if a clearer label exists

### Flag Detail Rules
- opening a flag shows:
  - purpose
  - current state
  - scope / audience if relevant
  - last changed context if available
- DevAdmin must understand what the flag affects before changing it

### Change Workflow Rules
- changing a flag must be explicit
- if a flag change is safety-sensitive, require reason confirmation
- resulting state must be obvious immediately
- flag changes must feel controlled, not casual
- no confusing mixed current/target state display

### Visibility Rules
- flags should be readable and searchable
- dangerous or high-impact flags must be visually distinguished
- do not bury the current state

### Forbidden Patterns
- giant JSON editor
- unlabeled toggle chaos
- changing flags with no explanation
- mixing experimental raw config fields into the primary UI

## 4) Safety Guardrails

- diagnostics and tools must remain separate so diagnosis happens before action
- failed jobs, feature flags, and overrides must remain clearly separated inside /app/dev/tools
- high-sensitivity controls must keep visible caution context nearby
- actions that change state must not be launched from ambiguous icons or dense table rows
- outcome states must always become visible immediately after retry or flag change
- primary wording must stay calm, precise, and support-usable
- no supported workflow should instruct DevAdmin to resolve routine issues through manual database access
- activity visibility must reinforce accountability for all sensitive actions

## 5) Safety Controls Lock Statement

The DevAdmin safety controls model is locked as a controlled tools surface where failed jobs can be reviewed and retried deliberately, feature flags can be understood before being changed, and all sensitive actions remain separated, readable, and visibly accountable. The product direction avoids raw infrastructure leakage and manual database dependency by giving DevAdmin clear internal tools that feel powerful without becoming chaotic.
