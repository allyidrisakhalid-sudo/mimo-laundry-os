# Admin Support Queue Spec  Mimo Phase 2

## 1) Support Queue Principles

Locked support queue principles:
- support queue is operational, not theatrical
- triage first
- one support case must have one clear current owner/state
- issue context must stay tied to the real order
- refund and credit decisions must stay ledger-safe
- admin must be able to move from review to resolution without hunting
- support resolution must remain visible and auditable
- support queue must not duplicate the orders page blindly
- common cases must feel routine and controlled
- read clarity beats ticketing-system complexity

## 2) Support Queue Entry Model

- support queue access lives within admin workflow, primarily via admin orders/order detail and finance/control contexts
- support queue may be surfaced as a defined sub-area or structured filtered view inside admin operations model
- do not create an extra permanent top-level portal route in P2.13 unless already supported by approved admin IA
- support must be easy to find from the admin dashboard action queue

Additional entry model notes:
- new or active cases should be discoverable from admin HQ action queue using support-specific queue signals
- linked order detail should expose the related support state and provide direct transition into the support case detail view
- finance/control contexts may surface refund or credit review cases without splitting the case away from its linked order context

## 3) Support Queue List Spec

### Purpose
- let admin review and prioritize active support cases fast

### Primary CTA
- Open case

### List Structure
- each row shows:
  - issue type
  - linked order reference
  - current support status
  - created or updated time
  - urgency marker if relevant
  - refund / credit marker if relevant
- the list must stay readable and action-oriented

### Filter Rules
- only useful support filters allowed:
  - issue type
  - support status
  - refund / credit involved
  - recency / priority
- keep filters compact
- no giant CRM-style filter maze

### Triage Signals
- queue must support fast recognition of:
  - new case
  - waiting review
  - waiting customer action if supported
  - refund/credit pending review
  - resolved
- urgency must stay calm and clear

### Queue Readability Rules
- issue state and linked order must be obvious
- support cases must not feel detached from the business context
- open action must be the dominant row action

### Forbidden Patterns
- generic ticket system clone
- duplicate full order table plus issue columns everywhere
- unresolved cases hidden in finance only
- too many tiny row actions
- disconnected support IDs with no order context

## 4) Support Case Detail Spec

### Purpose
- give admin one clear place to review the issue, linked order context, customer-visible status, and resolution path

### Required Context Blocks
- issue summary
- linked order summary
- current support status
- timeline or update log for the support case
- refund / credit context if relevant
- audit/update note area

### Resolution Controls Rules
- admin must be able to:
  - move status forward
  - add a clear case update
  - resolve the case
- controls must stay structured and explicit
- no casual ambiguous done button
- status changes must be auditable

### Refund / Credit Decision Rules
- refund/credit decisions must appear only when relevant
- if such a decision is made, it must be tied clearly to finance and ledger truth
- support UI must not imply money moved unless the underlying approved action is complete

### Customer Visibility Link Rules
- admin should understand what the customer will see as the current case state
- customer-facing updates must stay aligned to approved message templates
- no contradictory internal vs external statuses

### Forbidden Patterns
- support case with no order context
- refund buttons that bypass finance logic
- giant internal-only jargon wall
- hidden resolution outcome

## 5) Triage to Resolve Workflow

1) new case appears
2) admin reviews linked order and issue context
3) admin sets or confirms support status
4) admin adds update or resolution action
5) refund/credit path handled if relevant
6) case resolves with visible outcome
7) audit trail preserved

Workflow notes:
- triage should begin from the queue row and move directly into one coherent case detail view
- the linked order summary must stay present enough to prevent context-switching back and forth between support and order surfaces
- any refund or credit review must keep admin aware of whether the outcome is pending decision, approved, declined, or financially completed
- resolution should be explicit, recorded, and customer-visible through approved support state and message templates

## 6) Audit and Visibility Rules

- queue activity must preserve actor, timestamp, and resolution accountability
- support updates must remain visible to admin in case detail chronology
- refund and credit review states must remain visible both in support handling and finance-relevant contexts
- customer-visible support state must align with the approved support status model and message templates
- affiliate visibility is limited to scoped order issue state where relevant to the shop workflow
- DevAdmin visibility is limited to audit, diagnostics, and control surfaces where relevant, not routine support case ownership
- no cross-shop, cross-order, or cross-customer leakage is allowed

## 7) Support Queue Lock Statement

The admin support queue is locked as a structured operational workspace embedded inside the approved admin model, not a separate support-product maze. It gives admin one readable queue, one clear case detail view, and one auditable path from triage to resolution while keeping the real order context, customer-visible status, and finance-safe refund or credit handling aligned at every step.
