# Dashboard Layout Spec  Mimo Phase 2

## 1) Purpose

This file standardizes the dashboard build template for Phase 2 so each role dashboard feels like one product system and can be implemented with reusable structure.

## 2) Standard Dashboard Structure

Every dashboard should follow this order unless a role-specific spec explicitly narrows it:

1. header band
2. KPI row
3. action queue
4. main list/table
5. optional secondary support panel only if truly needed

## 3) Header Band

Purpose:
- orient the user instantly
- show role/context title
- reinforce the current work period or system state

Typical contents:
- page title
- short subtitle or today's context
- one dominant page-level action if needed

## 4) KPI Row

Purpose:
- summarize the state that matters immediately

Rules:
- keep KPI count limited and readable
- prefer operationally meaningful numbers
- do not turn the dashboard into an analytics report
- no chart-heavy drift

## 5) Action Queue

Purpose:
- show the next obvious actions the role should take

Rules:
- action queue must be visible above the full table/list
- queue items should represent urgency, blockers, or immediately actionable work
- every dashboard must show the next obvious action

## 6) Main List / Table

Purpose:
- provide the fuller working surface after the summary and urgency layers

Rules:
- this is the primary operational body of the dashboard
- use list or table based on role/device need
- support filtering only where necessary
- avoid clutter and duplicate panels

## 7) Optional Secondary Support Panel

Purpose:
- provide truly secondary but useful context only when needed

Allowed examples:
- brief tips
- finance mini-summary
- SLA reminder
- support shortcut

Rules:
- optional only
- must not compete with the main list/table
- must not become a chart-heavy side analytics area

## 8) Role Dashboard Standardization

### Customer Home
- header band:
  - account greeting / active-order context
- KPI row:
  - active order count
  - recent orders
  - pending action state if present
- action queue:
  - continue active order action or start new order
- main list/table:
  - active/recent orders list
- secondary panel:
  - optional help/account reminder only if needed

### Driver Today
- header band:
  - today's work summary
- KPI row:
  - assigned stops
  - urgent stops
  - proof/cash reminders
- action queue:
  - next stop
- main list/table:
  - assigned tasks/stops list
- secondary panel:
  - optional driver status/support panel

### Hub Dashboard
- header band:
  - hub operational status
- KPI row:
  - intake
  - processing
  - qc blockers
  - dispatch-ready
- action queue:
  - urgent work queue
- main list/table:
  - current workload list/board entry view
- secondary panel:
  - optional SLA warning/support info

### Affiliate Dashboard
- header band:
  - shop operational summary
- KPI row:
  - active shop orders
  - ready for pickup
  - pending actions
  - finance cue if applicable
- action queue:
  - next shop action
- main list/table:
  - shop-scoped orders list
- secondary panel:
  - optional payout/summary panel for admin-capable view

### Admin Dashboard
- header band:
  - business command center context
- KPI row:
  - core business KPIs
  - urgent issues
  - finance/reconciliation cue
- action queue:
  - highest-priority operational queue
- main list/table:
  - platform-wide queue/list
- secondary panel:
  - optional finance or support summary if needed

## 9) Implementation Lock Statement

This standardized dashboard structure becomes the implementation template for Phase 2 dashboards. Chart-heavy deviation is not allowed in this baseline.
