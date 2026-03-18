# Admin Network and Pricing Spec  Mimo Phase 2

## 1) Network and Pricing Principles

Locked principles:
- network management must stay practical
- zone is the primary network lens
- visibility must support same-day intervention
- entity views must be concise and operational
- edit flows must feel deliberate and auditable
- pricing control must reinforce version truth
- current, staged, and historical pricing must never blur together
- operations must remain one controlled workspace
- no configuration maze
- no hidden mini-app sprawl inside admin operations

## 2) Operations Control Spec

### Route
- /app/admin/operations

### Purpose
- let admin monitor and manage the network structure and operational pressure from one controlled workspace

### Primary CTA
- Open the area needing intervention

### Page Structure
1) PageHeader
2) Operations summary row
3) Network management sections
4) Pressure / workload list or summary
5) Support panel for issues requiring escalation

### Network Overview Rules
- show the network in practical operational groupings
- use these exact section areas:
  - Zones
  - Hubs
  - Affiliates
  - Drivers
- keep each section concise
- no giant org-chart UI in P2.11

### Section Model
- each section must allow:
  - visibility of current entities
  - core operational status or availability summary
  - opening deeper detail/edit surface if supported by current product
- keep the model list/detail oriented, not overdesigned

### Filters and Scope Rules
- allow practical filtering by zone and operational state
- keep filters shallow and useful
- no duplicate filters across many stacked sub-panels

### Read / Edit Surface Rules
- admin can view and manage the network from this workspace
- edit/create behavior must remain controlled and explicit
- no chaotic inline editing across huge tables
- network changes must feel deliberate and auditable

### Forbidden Patterns
- giant configuration maze
- separate hidden mini-apps per entity type
- redundant network views with the same information
- overly abstract diagrams that slow daily work

## 3) Network Management Spec

### A) Zones
- Purpose:
  - view and manage operational zone structure
- Required visible data:
  - zone name
  - active hubs
  - affiliate presence
  - driver pressure or coverage indicator if supported
- Rules:
  - zone should act as the primary network lens
  - no map-heavy GIS interface in P2.11

### B) Hubs
- Purpose:
  - view hub capacity/pressure and operational health
- Required visible data:
  - hub name
  - zone
  - current workload marker
  - exceptions if relevant
- Rules:
  - hub visibility must support same-day intervention

### C) Affiliates
- Purpose:
  - view affiliate activity and operational/finance health
- Required visible data:
  - affiliate/shop name
  - zone
  - order activity summary
  - issue or payout flag if relevant
- Rules:
  - affiliate visibility should support partner operations without exposing unnecessary clutter

### D) Drivers
- Purpose:
  - view driver availability and assignment pressure
- Required visible data:
  - driver identity
  - home zone
  - availability
  - assigned workload summary
- Rules:
  - keep driver visibility practical and dispatch-relevant

## 4) Pricing Plans UI Spec

### Purpose
- let admin create, stage, review, and activate pricing plans safely with clear version control

### Entry Point
- pricing management appears as a defined section inside /app/admin/operations

### Pricing List Rules
- list existing plans clearly
- show:
  - plan name
  - version
  - effective date
  - current state
- keep list practical and scannable

### Version Visibility Rules
- current active plan must be unmistakable
- staged future plan must be distinguishable
- historic plans must remain visible for reference
- no ambiguity between current and future pricing

### Create / Stage / Activate Workflow Rules
- creating a new plan must not overwrite the current one silently
- new plans are staged first
- activation must be explicit
- workflow language must reinforce date-based version control
- admin must understand what becomes active and when

### Effective Date Rules
- effective dates are central to the UI
- date choice must be visible and understandable
- the UI must reinforce that old orders remain on the correct historical plan per Phase 1 truth
- no vague publish now behavior without version clarity

### Guardrail Rules
- pricing changes must feel deliberate and reviewable
- no accidental inline overwrite of the active plan
- no mixed current/future state confusion
- admin should always know whether they are editing current, staged, or historical pricing

### Forbidden Patterns
- spreadsheet-like uncontrolled pricing edits
- hiding version number or effective date
- replacing versioned workflow with one mutable settings form
- ambiguous activation state

## 5) Network and Pricing Lock Statement

The admin operations workspace is locked as one controlled surface where network visibility follows the zone lens, hubs, affiliates, and drivers remain practical to review, and pricing plans follow an explicit versioned create, stage, and activate workflow. This workspace supports deliberate admin control without drifting into a configuration maze, org-chart theater, or mutable-pricing confusion.
