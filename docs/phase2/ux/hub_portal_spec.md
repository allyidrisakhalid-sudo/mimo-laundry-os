# Hub Portal Spec  Mimo Phase 2

## 1) Hub Portal Principles

Locked hub portal principles:
- queue clarity first
- scanner-first intake
- stage movement must be obvious
- issue visibility must stay calm and clear
- dispatch readiness must be visible without admin help
- tablet/web usability first
- one operational truth per order
- no decorative dashboard clutter
- fast repeated actions matter more than visual novelty
- hub portal must feel controlled, clean, and dependable

## 2) Hub Dashboard Summary

### Route
- /app/hub

### Purpose
- show the hubs immediate operational workload and direct staff into intake, processing, or dispatch work

### Primary CTA
- Open next queue

### Required Structure
1. PageHeader
2. KPI row
3. Action queue
4. Active operational list
5. SLA / issue support panel

### KPI Row
The KPI row must show:
- intake waiting
- in processing
- ready for dispatch
- exceptions

### Action Queue
The action queue must prioritize:
- the next operational queue needing action now

### Rules
- dashboard is a routing surface, not the main work surface
- no duplicate board/detail complexity here
- dashboard must direct staff quickly into intake or processing work

## 3) Intake Screen Spec

### Route
- /app/hub/intake

### Purpose
- let hub staff receive, verify, and move incoming orders into operational flow quickly and accurately

### Primary CTA
- Scan or open next intake item

### Secondary Actions
- Search intake item
- Open order detail
- Report issue

### Page Structure
1. PageHeader
2. Scanner input / scan entry zone
3. Intake queue list
4. Active intake detail panel or focused card
5. Issue / alert strip if relevant

### Scanner-First Rules
- the scan/input action is the primary interaction at intake
- scan zone must be immediately visible on tablet/web
- if scanner hardware or manual code entry is used, the input treatment must support both cleanly
- after successful scan or lookup, the correct order/intake item opens immediately
- no extra confirmation maze before staff can continue intake work

### Intake Queue Rules
- queue shows only items relevant to intake
- each row/card shows:
  - order reference
  - source/channel
  - arrival state
  - intake priority
  - zone/hub context
- queue must be scannable
- queue filtering remains light and useful only
- queue does not duplicate full order detail content

### Intake Detail Surface Rules
- once an item is active, the intake detail surface must allow the next real intake action
- include only the details needed for receiving:
  - order reference
  - source context
  - intake notes or expectations if available
  - bag/item reference if supported
  - one clear action to confirm and move forward
- keep this surface focused and fast

### Issue Visibility Rules
- missing item, mismatch, or intake problem must surface clearly
- issue flag must not block visibility of normal intake flow
- issue path must be obvious but not overbuilt

### Tablet/Web Rules
- scanner zone and queue must remain visible without awkward page jumps
- active item detail may sit beside the queue on larger screens
- tablet layout must preserve touch-friendly actions
- no desktop-only tiny controls

### Visual Rules
- scanner zone gets the strongest action emphasis
- queue and detail surfaces must feel like one operational workspace
- use clean contrast and clear status chips
- premium but utilitarian rhythm

### Forbidden Patterns
- burying scan input below the fold
- giant data tables with tiny rows
- intake split across too many screens
- repeated confirmation modals for normal intake
- admin-style complexity inside hub workflow

## 4) Processing Board Summary

### Route
- /app/hub/processing

### Purpose
- act as the main work-in-progress surface for operational stage movement, issue visibility, QC handling, and dispatch readiness

### Primary CTA
- Advance the next ready order

### Summary Rules
- processing is the main operational board for active work
- stage visibility must remain plain, fast, and scannable
- issue states must be visible from the board without extra drill-in
- board actions should move staff into the next valid action quickly
- dispatch readiness must be visible as an operational outcome, not hidden inside analytics

## 5) Order Detail and QC Summary

### Route
- /app/hub/orders/[id]

### Purpose
- provide the focused operational truth for one order, including intake context, stage history, QC decision point, issue visibility, and dispatch readiness

### Required Summary
- order detail is the single focused surface for one order
- it supports intake review, QC decision, issue visibility, and dispatch readiness in one operational context
- it should expose only what hub staff need to move the order correctly
- it should not become an admin-style control center
- QC may be completed here when staff need full order context before passing or opening an issue

## 6) Hub Portal State Rules

### State: no intake items
- trigger: intake queue is empty
- surface: intake screen
- primary user message intent: nothing waiting right now
- next action: remain ready to scan or return to dashboard
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: no processing items
- trigger: processing board has no active cards
- surface: processing board
- primary user message intent: no active processing work
- next action: return to dashboard or intake when new work arrives
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: QC issue open
- trigger: QC fail path or issue-open state is active on an order
- surface: order detail and processing board
- primary user message intent: issue needs review
- next action: open issue context and decide the next valid handling step
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: ready for dispatch with no driver available
- trigger: dispatch-ready order exists but no valid driver is available
- surface: dispatch batching workspace and relevant order detail
- primary user message intent: waiting for driver assignment
- next action: keep item visible in ready-for-dispatch context and retry driver assignment later
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: loading intake
- trigger: intake queue or scan lookup is loading
- surface: intake screen
- primary user message intent: preparing intake queue
- next action: wait for queue or active item to load
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: loading processing board
- trigger: processing board is loading columns or active stage content
- surface: processing board
- primary user message intent: loading work stages
- next action: wait for board readiness
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: assignment complete
- trigger: selected dispatch-ready items are assigned successfully
- surface: dispatch batching workspace, order detail, and relevant operational views
- primary user message intent: dispatch assigned
- next action: continue batching or return to the next queue
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

### State: issue reported
- trigger: staff reports an intake or QC issue
- surface: intake screen, processing board, and order detail where relevant
- primary user message intent: issue recorded
- next action: continue with the correct operational flow or open the order for focused review
- forbidden wording:
  - blame language
  - technical status codes
  - alarmist failure language
  - admin-only language on hub surfaces

## 7) Hub Portal Lock Statement

The hub portal is locked as a minimal four-screen operational system for tablet and web: a routing dashboard, a scanner-first intake screen, a clean stage-based processing board, and a focused order detail surface. Intake, processing, QC, and dispatch are defined as one coherent operational flow so hub staff can receive, move, review, and assign work end-to-end without admin assistance. The experience remains premium and calm in the Midnight Silk direction while staying utilitarian, fast, and dependable for repeated daily operations.
