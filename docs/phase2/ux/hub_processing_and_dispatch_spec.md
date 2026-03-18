# Hub Processing and Dispatch Spec  Mimo Phase 2

## 1) Processing and Dispatch Principles

Locked processing and dispatch principles:
- operational stages must stay plain and readable
- movement through stages must feel controlled
- issue visibility must be immediate
- QC must remain explicit and fast
- dispatch must be zone-aware and practical
- hub staff must not need admin help for normal flow
- repeated daily actions matter more than edge-case complexity
- the board must stay clean, calm, and operationally sharp

## 2) Processing Board Spec

### Route
- /app/hub/processing

### Purpose
- let hub staff move orders cleanly through operational stages and spot exceptions quickly

### Primary CTA
- Advance the next ready order

### Board Structure
- one clean multi-column board
- columns represent operational stages only
- board is readable at a glance
- no visual overload

### Column Model
Use these exact column intentions:
- Ready for Processing
- In Processing
- QC Needed
- Ready for Dispatch

Rules:
- columns must reflect true operational stages
- do not add decorative or low-value columns
- stage names must be plain and action-oriented

### Card Content Rules
- each order card shows:
  - order reference
  - service tier
  - current stage
  - priority or SLA chip if relevant
  - issue flag if present
  - minimal supporting metadata only
- card content must stay short and scannable
- card does not duplicate the full order detail view

### Issue Flag Rules
- issue flags must be immediately visible on cards
- flag types remain compact and meaningful
- issue visibility must support queue scanning
- do not hide issue state in hover-only behavior

### Movement Rules
- stage advancement must be obvious
- the board may support click/open/advance interaction, but normal advancement must not require admin help
- actions must map to valid operational state changes only
- no ambiguous drag behavior if click/advance is clearer in implementation
- every move must feel controlled and auditable

### Filtering Rules
- only practical filters allowed:
  - stage
  - issue
  - SLA/urgency
  - service tier if useful
- filters must remain light
- no analytics clutter in the board view

### Tablet/Web Rules
- columns remain readable on tablet and web
- horizontal overflow must be controlled
- staff must not need pixel-perfect dragging
- cards remain touch-friendly on tablet

### Visual Rules
- clean column separation
- premium light workspace
- issue flags and SLA chips visually distinct but calm
- board must feel operational, not playful kanban

### Forbidden Patterns
- too many columns
- overloaded cards
- drag-and-drop as the only movement method
- charts or KPI clutter above the board
- duplicate detailed metadata on every card

## 3) QC Flow Spec

### Purpose
- let hub staff confirm whether an order is ready to move forward or needs an issue opened

### Entry Points
- from processing board cards
- from order detail
- from QC-needed stage surfaces

### QC Decision Model
- one clear decision:
  - Pass
  - Fail / Open issue
- the decision must be explicit and fast
- reasons and notes only where operationally necessary
- no giant QC form in P2.9

### Pass State Rules
- pass action advances the order to the next valid operational state
- staff receives a clear completion response
- order becomes dispatch-ready or continues as the product truth requires

### Fail / Issue Open Rules
- fail path opens an issue state clearly
- issue category or note remains concise
- the order remains visible in the correct operational context
- issue state must be visible back on the board and order detail

### Escalation Visibility Rules
- QC issues must be visible without admin involvement
- issue state must remain easy to spot in board and detail surfaces
- help path for unclear issue states must exist but remain secondary

### Order Detail Role in QC
- order detail acts as the focused place for:
  - full order context
  - QC decision if needed
  - issue visibility
  - dispatch readiness visibility
- QC should not require a separate permanent sidebar page in P2.9

### Forbidden Patterns
- giant pass/fail wizard
- forcing staff through excessive note-taking
- hiding QC result after action
- separate detached issue system for normal QC flags

## 4) Dispatch Batching Spec

### Purpose
- let hub staff assign dispatch-ready work to the correct zone-filtered driver cleanly and confidently

### Entry Point
- from Ready for Dispatch stage or order detail

### Batching Structure
- one clear batching workspace
- ready orders list
- zone filter
- driver selection area
- batch confirmation action

### Ready-for-Dispatch Selection Rules
- only dispatch-ready items appear
- each row/card shows:
  - order reference
  - zone
  - tier
  - urgency/SLA if relevant
  - issue-free readiness state
- no non-ready items in this workspace

### Zone Filter Rules
- zone is the primary operational filter
- batching must make zone context obvious
- hub staff must not need to guess which driver is valid for which order
- zone filter must be easy to adjust and visibly active

### Driver Selection Rules
- show only relevant driver options for the active zone context as supported by the product
- if driver availability exists, surface it clearly
- if no driver is available, show that cleanly
- driver choice must feel practical and quick

### Batch Confirmation Rules
- one clear confirmation action assigns the selected items
- confirmation must state what is being assigned and to whom
- after assignment, success state must be clear and immediate
- normal assignment must not require admin assistance

### Visibility After Assignment
- assigned items should leave the ready list
- assignment state should be visible in order detail and operational views
- hub staff should understand that dispatch is complete for those items

### Tablet/Web Rules
- selection and filtering remain touch-friendly on tablet
- no tiny checkbox maze
- batching workspace should support repeated assignments quickly

### Forbidden Patterns
- showing all drivers without zone context
- mixing non-ready work into dispatch
- requiring admin-only controls to complete dispatch
- giant dispatch analytics instead of action workspace

## 5) Driver Assignment Filter Rules

Locked driver assignment filter rules:
- zone first
- readiness only
- driver list constrained by valid operational context
- availability surfaced if supported
- assignment action must remain fast
- no unrestricted global driver chooser in hub dispatch flow
- no cross-zone ambiguity

## 6) Processing and Dispatch Lock Statement

The hub processing and dispatch model is locked as a clean, stage-based operational flow. Orders move through four plain work stages, QC remains a fast pass-or-open-issue decision, and dispatch batching assigns only dispatch-ready work through zone-filtered driver context. The board stays calm, readable, and auditable while enabling hub staff to move work from processing to assignment without admin dependence.
