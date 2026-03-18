# DevAdmin Console Spec  Mimo Phase 2

## 1) DevAdmin Console Principles

Locked DevAdmin console principles:
- safety first
- diagnosis before action
- read clarity before control density
- dangerous actions must feel deliberate
- internal tools must not feel like raw infrastructure leakage
- override actions must be auditable and reason-required
- no manual database dependency for normal support tasks
- failed jobs and health visibility must be immediate
- feature flags must be controlled and understandable
- DevAdmin console must feel powerful, calm, and disciplined

## 2) Dev Home Spec

### Route
- /app/dev

### Purpose
- give DevAdmin a controlled entry point for system health, operational anomalies, and safe internal controls

### Primary CTA
- Open the area needing intervention

### Secondary Actions
- Open diagnostics
- Review failed jobs
- Open tools
- Review activity

### Page Structure
1) PageHeader
2) Health summary row
3) Monitoring signal panel
4) Failed jobs snapshot panel
5) Feature flags / override awareness strip
6) Activity shortcut panel

### Health Summary Rules
- show only the support-critical signals needed first:
  - system health status
  - queue / job health signal
  - recent failure signal
  - feature flag alert if relevant
- no vanity infrastructure metrics
- keep the summary compact and readable

### Monitoring Signal Rules
- highlight what needs inspection now
- signals should answer:
  - is the system healthy
  - is something degraded
  - what should DevAdmin inspect first
- no raw noisy telemetry wall on the home screen

### Failed Jobs Snapshot Rules
- show a compact count or short list of recent failed jobs
- make the retry/review path obvious
- keep technical detail for the deeper failed-jobs viewer

### Safety Surface Rules
- if override-capable tools exist, show them as a controlled area, not as loud primary hero buttons
- home should reinforce caution and auditability
- reason-required actions must not be executable from a casual summary tile

### Web/Desktop Rules
- desktop-first diagnostic workspace
- balanced density
- clear support hierarchy
- no crowded console layout

### Visual Rules
- premium internal-control aesthetic
- dark/light balance consistent with Midnight Silk
- calm warnings, not alarm sirens
- strong panel hierarchy

### Forbidden Patterns
- raw infrastructure dashboard clone
- giant chart grid
- dev-terminal aesthetic
- exposing destructive tools with no guardrail context
- home screen as an unfiltered log stream

## 3) Diagnostics Spec

### Route
- /app/dev/diagnostics

### Purpose
- let DevAdmin inspect the current health and degradation state of the system clearly before taking action

### Primary CTA
- Review the affected area

### Page Structure
1) PageHeader
2) System health panels
3) Queue / worker health area
4) Recent failure visibility area
5) Context or escalation note area

### Health View Rules
- health must be presented in readable operational categories
- show status and high-level meaning clearly
- use plain internal labels, not raw stack output as primary content
- support diagnosis, not noise

### Monitoring Detail Rules
- include deeper read-only detail than the home screen
- failed areas must stand out clearly
- keep detail organized by operational area
- no uncontrolled wall of logs in the main surface

### Readability Rules
- DevAdmin can scan quickly and decide where to go next
- severity must be clear
- labels and states must remain consistent with the rest of the platform

### Forbidden Patterns
- unreadable engineering dump
- mixing destructive controls into diagnostics
- duplicate full failed-job retry surface here

## 4) Tools Summary

### Route
- /app/dev/tools

### Purpose
- give DevAdmin one place for failed jobs review, feature flags, and approved override tools

### Primary CTA
- Open the required control safely

### Required Structure
1) PageHeader
2) Failed jobs control area
3) Feature flags area
4) Override tools area
5) Audit reminder / caution panel

### Rules
- tools screen is action-capable but controlled
- failed jobs, flags, and overrides must be clearly separated
- caution and audit context remain visible
- no raw configuration maze

## 5) Activity Summary

### Route
- /app/dev/activity

### Purpose
- let DevAdmin inspect a readable history of support actions, overrides, and internal control activity

### Primary CTA
- Inspect logged activity

### Required Structure
1) PageHeader
2) Activity filters
3) Activity list
4) Activity detail panel or view

### Activity List Rules
- show:
  - actor
  - action
  - time
  - target
  - outcome
- list must be readable and filterable
- no raw log-stream chaos

### Rules
- activity must support accountability
- support actions and override actions must be visible
- activity remains read-focused, not an action launcher
- no edit/delete controls in this view

## 6) DevAdmin State Rules

### system healthy
- trigger: all core monitored areas report healthy and no support-critical failures need action
- surface: dev home health summary row and diagnostics overview
- primary user message intent: system looks healthy
- next action: continue monitoring or inspect activity if needed
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### degraded monitoring state
- trigger: one or more health areas are degraded or warning thresholds require review
- surface: dev home monitoring signal panel and diagnostics screen
- primary user message intent: review degradation
- next action: open diagnostics and review the affected area
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### failed jobs present
- trigger: recent failed jobs exist and are visible in monitoring or tools
- surface: dev home failed jobs snapshot and tools failed jobs area
- primary user message intent: failed jobs need review
- next action: open the failed job detail and decide whether retry is appropriate
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### retry in progress
- trigger: DevAdmin confirms a retry and the system is processing the retry action
- surface: failed job detail and retry action area
- primary user message intent: retry in progress
- next action: wait for outcome state or move to activity if more context is needed
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### retry complete
- trigger: retry returns a resolved success state or a clearly completed result
- surface: failed job detail, tools area, and activity visibility
- primary user message intent: retry completed
- next action: confirm the updated state or review activity trail
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### feature flag changed
- trigger: DevAdmin applies an approved feature flag state change
- surface: feature flag detail and tools summary feedback
- primary user message intent: flag updated
- next action: review the resulting state and inspect activity if needed
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### override awaiting reason
- trigger: DevAdmin opens a state-changing override workflow before reason submission
- surface: override modal, drawer, or dedicated confirmation view
- primary user message intent: reason required
- next action: enter a meaningful reason or cancel
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### override applied
- trigger: override action completes successfully
- surface: override workflow result and activity visibility
- primary user message intent: override applied
- next action: verify the changed state or inspect the audit trail
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### override failed
- trigger: override action does not complete successfully
- surface: override workflow result and activity surface if logged
- primary user message intent: override needs review
- next action: review the failure context, retry safely if appropriate, or escalate
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### loading diagnostics
- trigger: diagnostics route is opening or refreshing
- surface: /app/dev/diagnostics
- primary user message intent: loading diagnostics
- next action: wait for diagnostics content to render
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### loading tools
- trigger: tools route is opening or refreshing
- surface: /app/dev/tools
- primary user message intent: loading tools
- next action: wait for tools controls to render
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

### loading activity
- trigger: activity route is opening or refreshing
- surface: /app/dev/activity
- primary user message intent: loading activity
- next action: wait for activity list and filters to render
- forbidden wording:
  - panic language
  - vague system broken language
  - raw database language
  - unbounded technical dump in primary UI
  - blame language

## 7) DevAdmin Console Lock Statement

The DevAdmin console is locked as a calm, disciplined, desktop-first internal control surface where DevAdmin can understand platform health before acting, inspect failed jobs without retry chaos, manage approved feature flags with clear context, apply audited override tools only through reason-required workflows, and review internal activity through a readable accountability trail. The console preserves the approved Midnight Silk direction while replacing manual database dependency for supported support scenarios with safe, explicit, productized controls.
