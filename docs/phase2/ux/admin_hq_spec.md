# Admin HQ Spec  Mimo Phase 2

## 1) Admin HQ Principles

Locked principles:
- the admin must see what matters first
- queues beat decoration
- actionability beats reporting theater
- operations and finance must stay readable
- network management must stay practical
- pricing changes must feel controlled and version-safe
- read-only technical oversight must remain visible but contained
- no hunting for daily work
- no duplicate control surfaces
- admin HQ must feel like one disciplined command center

## 2) Admin Dashboard Spec

### Route
- /app/admin

### Purpose
- give the admin one immediate daily command view of platform operations, financial pressure points, and issues needing action

### Primary CTA
- Open highest-priority queue

### Secondary Actions
- Review orders
- Open operations
- Open finance

### Page Structure
1) PageHeader
2) KPI row
3) Action queue
4) Global orders / issues list
5) Pressure summary panel
6) Finance signal panel

### KPI Row Rules
- show only daily-decision KPIs
- use these exact KPI intents:
  - active orders
  - delayed / exception count
  - delivered today
  - paid today
  - payout / reconciliation flags
- 5 KPI cards max
- no vanity metrics

### Action Queue Rules
- this is the heart of the page
- queue must answer:
  - what needs attention now
- queue items must be actionable
- queue must prioritize:
  - urgent operational issue
  - dispatch or SLA pressure
  - reconciliation or payout flag
  - open problem needing admin decision
- queue must not duplicate the full orders page

### Global Orders / Issues List Rules
- compact scoped list under the queue
- shows platform-wide items needing inspection
- each row shows:
  - order reference
  - source/channel
  - status
  - zone/hub/affiliate attribution
  - exception or urgency marker if relevant
- keep list operational, not report-like

### Pressure Summary Rules
- summarize network pressure only
- show by-zone or by-hub pressure in one compact support panel
- no heavy analytics dashboard
- summary must guide where admin should look next

### Finance Signal Rules
- show only the business signals needed for same-day admin awareness
- keep it compact
- finance detail belongs in /app/admin/finance

### Web/Desktop Rules
- desktop-first admin workspace
- content should use balanced density
- priority areas remain visible without excessive scrolling
- no mobile-like oversimplification that hides admin context

### Visual Rules
- premium executive clarity
- KPI row clear but subordinate to queue
- cards clean and calm
- use structured emphasis, not bright alarmism

### Forbidden Patterns
- dashboard as chart museum
- duplicate tables stacked endlessly
- decorative analytics with no action path
- hidden urgent items below fold clutter
- multiple competing main areas

## 3) Orders Oversight Spec

### Route
- /app/admin/orders

### Purpose
- let admin search, filter, inspect, and quickly act on platform-wide orders without losing clarity

### Primary CTA
- Open order

### Page Structure
1) PageHeader
2) FiltersBar
3) Orders table/list
4) Pagination
5) EmptyState where relevant

### Filters Rules
- only useful operational filters allowed:
  - status
  - issue / exception state
  - zone
  - hub
  - affiliate
  - driver if supported
  - payment / balance state where useful
- search must remain visible
- filters must stay readable and compact
- no analytics panel above the table

### Table / List Rules
- each row shows:
  - order reference
  - source/channel
  - customer or source identity summary
  - zone/hub/affiliate attribution
  - current status
  - payment state
  - urgency / issue marker if relevant
- table must be scannable and premium
- no unnecessary low-value columns

### Quick Action Rules
- quick actions must remain light and safe
- allow only actions that are clearly justified in the list context
- quick actions must not replace full detail review when needed
- no destructive action frenzy in the table row
- primary quick action remains open/view
- secondary quick actions may include issue review or payment/reconciliation opening if supported cleanly

### Scope and Attribution Rules
- admin sees platform-wide scope
- attribution fields must make the network path legible:
  - zone
  - hub
  - affiliate where relevant
- attribution must support triage, not clutter

### Open Order Rules
- opening a row goes to /app/admin/orders/[id]
- selected order detail becomes the single source of truth

### Empty / No Match Rules
- empty state must distinguish between:
  - no orders in this state
  - no results for current filters
- next action must be obvious:
  - clear filters
  - search again

### Forbidden Patterns
- excessive quick-action buttons per row
- duplicate full-order content in table cells
- hidden active filters
- spreadsheet ugliness
- weak attribution visibility

## 4) Order Detail Spec

### Route
- /app/admin/orders/[id]

### Purpose
- give admin one trusted order detail surface for inspection, issue review, payment context, attribution visibility, and controlled next-step decisions

### Primary CTA
- Review the most relevant open issue

### Page Structure
1) PageHeader with order reference and status
2) Order summary card
3) Timeline / recent activity block
4) Attribution and network path block
5) Payment and balance block
6) Exception / issue block
7) Support context strip or notes area

### Detail Rules
- this page is the single source of truth once an order is opened
- surface current status first
- keep timeline readable and operational
- make zone, hub, affiliate, and driver attribution visible without scattering it across tabs
- show payment state and balance clearly
- issue handling context must be visible without overwhelming the page
- actions shown here must be controlled, explicit, and tied to admin authority
- avoid duplicate data blocks with the same meaning

### Timeline Rules
- show recent events in clear chronological order
- emphasize the latest meaningful state
- preserve operational readability over forensic overload
- avoid raw system-event clutter in the main business view

### Payment Context Rules
- show balance state, payment state, and refund state where relevant
- link finance review cleanly without turning order detail into a finance dashboard

### Exception Rules
- exceptions must be visible, calm, and actionable
- exception area should help the admin decide what needs review or escalation next
- do not use alarm-heavy styling for every issue

### Forbidden Patterns
- multiple conflicting summaries
- hidden order truth behind nested tabs
- raw internal system detail as the default business view
- action overload across the full page

## 5) Operations Control Summary

### Surface Relationship
- /app/admin is the daily command view
- /app/admin/orders is the platform-wide order oversight workspace
- /app/admin/orders/[id] is the single order truth surface
- /app/admin/operations is the network and pricing control workspace
- /app/admin/finance is the finance and control workspace

### Model Rules
- the five screens must behave as one coherent admin system
- each screen has one clear purpose
- the dashboard surfaces what matters now
- the orders workspace supports broad inspection and triage
- order detail supports accurate decision-making
- operations supports network and pricing control
- finance supports same-day business control and closure
- no duplicate control surface should compete with another

## 6) Admin State Rules

### State: no urgent issues right now
- trigger:
  - no urgent items are present in the action queue
- surface:
  - dashboard action queue
- primary user message intent:
  - operations are stable
- next action:
  - review the orders list or pressure summary for routine oversight
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: filters returned no orders
- trigger:
  - current orders filters return zero matching results
- surface:
  - /app/admin/orders empty state
- primary user message intent:
  - no matching orders found
- next action:
  - clear filters or search again
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: network item requires attention
- trigger:
  - a zone, hub, affiliate, or driver record is flagged by pressure, issue, or availability concern
- surface:
  - /app/admin/operations network section or summary panel
- primary user message intent:
  - review this network item
- next action:
  - open the affected network section and inspect the item
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: staged pricing awaiting activation
- trigger:
  - a staged pricing plan exists with a future effective date or pending activation status
- surface:
  - pricing section inside /app/admin/operations
- primary user message intent:
  - staged plan waiting
- next action:
  - review the plan version and activation date
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: payout pending review
- trigger:
  - an affiliate payout item or payout period is awaiting admin review or approval
- surface:
  - /app/admin/finance payouts section
- primary user message intent:
  - review payout
- next action:
  - open the payout item and confirm the next finance step
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: daily close blocked
- trigger:
  - one or more blockers prevent the daily close workflow from being completed
- surface:
  - /app/admin/finance daily close section
- primary user message intent:
  - action needed before close
- next action:
  - resolve the listed blocker before closing the day
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: audit item visible
- trigger:
  - an audit entry is surfaced in the finance/control oversight area
- surface:
  - audit visibility strip or controlled detail view
- primary user message intent:
  - activity recorded
- next action:
  - inspect the activity and confirm whether follow-up is needed
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: failed job visible
- trigger:
  - a business-relevant failed job appears in the finance/control oversight area
- surface:
  - failed jobs visibility strip or controlled detail view
- primary user message intent:
  - issue needs review
- next action:
  - inspect the failure context and escalate if needed
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: loading operations
- trigger:
  - operations or network data is loading
- surface:
  - /app/admin/operations
- primary user message intent:
  - loading operations
- next action:
  - wait for the workspace to finish loading
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

### State: loading finance
- trigger:
  - finance data is loading
- surface:
  - /app/admin/finance
- primary user message intent:
  - loading finance
- next action:
  - wait for the finance workspace to finish loading
- forbidden wording:
  - panic language
  - technical internal jargon in business surfaces
  - vague dead-end system errors
  - developer-only terminology in admin summaries

## 7) Admin HQ Lock Statement

The admin portal is locked as a minimal five-screen command center where admin can see what matters first, move from urgent queue to order truth, manage network and pricing from one controlled operations workspace, and run daily finance review and close without hunting. The system preserves the approved Midnight Silk direction, keeps technical oversight visible but contained, and avoids report-museum drift, configuration-maze drift, and duplicate control surfaces.
