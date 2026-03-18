# Admin Finance and Controls Spec  Mimo Phase 2

## 1) Finance and Control Principles

Locked principles:
- finance must support same-day business control
- sections must stay distinct and readable
- actionability beats finance theater
- money states must be calm and unambiguous
- payout review must stay simple and operational
- daily close must feel controlled
- audit and failed jobs visibility must support trust without becoming a developer console
- business admin language beats accounting-software jargon
- no raw ledger dump as the main experience
- finance control must feel clear, premium, and disciplined

## 2) Finance UI Spec

### Route
- /app/admin/finance

### Purpose
- let admin review, resolve, and close the days key financial workflows from one clear workspace

### Primary CTA
- Open the item needing reconciliation or payout action

### Page Structure
1) PageHeader
2) Finance summary row
3) Payments / refunds section
4) Payouts section
5) Daily close section
6) Audit / failed jobs visibility strip or panel

### Finance Summary Rules
- show only the summary signals needed for daily control:
  - collections
  - unpaid / outstanding balances
  - payouts pending
  - reconciliation flags
- no finance vanity dashboard

### Payments / Refunds Section Rules
- list payment and refund items needing review
- show:
  - order reference
  - payment state
  - refund state if relevant
  - amount
  - issue marker if relevant
- keep the section operational and clear
- payment and refund handling must remain readable to business admins, not accountants only

### Payouts Section Rules
- show affiliate payout items or periods needing attention
- show:
  - affiliate
  - payout amount
  - status
  - time period or due context
- keep the surface simple and action-oriented

### Daily Close Section Rules
- surface daily closing readiness clearly
- show whether there are outstanding blockers
- daily close must feel like a controlled end-of-day checkpoint
- no giant accounting close process in P2.11

### Readability Rules
- numbers must be clear
- states must be calm and unambiguous
- sections must remain distinct
- no overloaded dense financial table maze

### Forbidden Patterns
- accounting-software complexity
- huge charts with no action path
- mixing all finance categories into one undifferentiated table
- finance page acting as a raw ledger dump

## 3) Payments and Refunds Rules

### payment due
- visible label intent:
  - payment still needs collection or confirmation
- next action:
  - review the order payment path and collect or confirm payment
- forbidden wording:
  - delinquent
  - failed customer
  - accounting hold jargon

### paid
- visible label intent:
  - payment is complete and recognized
- next action:
  - continue normal order or finance review if needed
- forbidden wording:
  - settled forever
  - hard posted jargon
  - finance-closed technical language

### refund requested
- visible label intent:
  - a refund request is waiting for review
- next action:
  - open the item and review the request context
- forbidden wording:
  - disputed liability jargon
  - chargeback style language unless truly applicable
  - customer blame wording

### refund under review
- visible label intent:
  - refund review is in progress
- next action:
  - inspect supporting context and complete the review path
- forbidden wording:
  - pending internal adjudication
  - escalation matrix jargon
  - vague processing error language

### refund completed
- visible label intent:
  - refund has been completed
- next action:
  - confirm the outcome and return to routine finance review
- forbidden wording:
  - reversal posted batch jargon
  - offset clearance jargon
  - overly technical settlement wording

## 4) Payouts Rules

### pending payout
- visible label intent:
  - payout is waiting for admin review or approval
- next action:
  - review payout
- forbidden wording:
  - unsettled liability
  - suspense account terminology
  - vague finance backlog wording

### approved payout
- visible label intent:
  - payout has been approved and is ready for the next payment step
- next action:
  - complete payout processing or confirm payment timing
- forbidden wording:
  - queued disbursement batch jargon
  - treasury approval language
  - opaque internal workflow wording

### paid payout
- visible label intent:
  - payout has been completed
- next action:
  - verify the completed status and move on
- forbidden wording:
  - remitted ledger closure
  - posted disbursement journal
  - technical payout processor language

### payout issue / hold
- visible label intent:
  - payout has a blocker or requires attention
- next action:
  - inspect the hold reason and resolve or escalate it
- forbidden wording:
  - compliance freeze language unless truly required
  - suspense or exception queue jargon
  - accusatory partner wording

## 5) Daily Close Rules

### ready to close
- visible label intent:
  - the day can be closed
- next action:
  - complete daily close
- forbidden wording:
  - hard close
  - post to books
  - accounting batch finalize jargon

### blocked close
- visible label intent:
  - closing is blocked until listed issues are resolved
- next action:
  - resolve blockers before closing
- forbidden wording:
  - unreconciled exception matrix
  - posting failure jargon
  - vague close error wording

### close completed
- visible label intent:
  - the day has been closed successfully
- next action:
  - review summary or continue with the next business task
- forbidden wording:
  - final ledger seal
  - posting batch complete jargon
  - archive cycle language

## 6) Audit and Failed Jobs Rules

### Purpose
- give admin visibility into privileged business actions and operational failures without turning the admin portal into a developer console

### Entry Point
- read-only surfaces inside admin finance/control context or controlled sub-sections

### Audit View Rules
- show:
  - actor
  - action
  - time
  - target or affected area
  - result/status if useful
- keep the view readable and filterable
- audit visibility supports trust and accountability

### Failed Jobs View Rules
- show only business-relevant failed job visibility
- present:
  - job type
  - failure status
  - time
  - high-level context
- avoid deep technical dump on the main view
- business admin should understand that something failed and whether it needs escalation

### Read-Only Guardrails
- no mutation controls here in P2.11
- no retry buttons unless a later chapter explicitly approves them
- no dev-console style complexity
- admin can inspect, not repair internals from this surface

### Visibility Rules
- audit and failed-jobs visibility must be discoverable without becoming dashboard clutter
- surfaces remain secondary to core operations and finance
- failed-job view must support escalation, not improvisation

### Forbidden Patterns
- exposing raw stack traces in the primary business UI
- mixing dev-only controls into admin business views
- burying audit visibility so deeply it cannot be used
- making audit/failed jobs the dominant finance experience

## 7) Finance and Control Lock Statement

The finance workspace is locked as a clear daily-control surface where admin can review payment and refund issues, resolve payout attention points, understand daily close readiness, and inspect read-only audit and failed-job visibility without entering accounting-software complexity or developer-console drift. The page remains calm, operational, and readable for business administration.
