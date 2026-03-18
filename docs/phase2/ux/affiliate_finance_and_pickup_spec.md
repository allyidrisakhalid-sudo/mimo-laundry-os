# Affiliate Finance and Pickup Spec  Mimo Phase 2

## 1) Shop Pickup Workflow Spec

### 1) Pickup Workflow Principles
Locked pickup workflow principles:
- readiness must be obvious
- shop staff must know the next action without training
- pickup confirmation must be fast
- issue handling must remain light and clear
- pickup workflow must fit inside daily counter operations

### 2) Ready-for-Pickup State
- when the order is ready, the UI must say so clearly
- readiness must be visible in both list and order detail
- staff should not need to inspect multiple screens to confirm readiness

### 3) Customer Pickup Confirmation Rules
- pickup confirmation must be one clear action
- the confirmation should feel final and immediate
- after confirmation, the order state updates clearly
- do not require a long checkout-style sequence

### 4) Shop Return / Handoff Rules
- if the shop is handing off to customer or next step, the screen must show the handoff state clearly
- wording must reflect the actual shop role in the chain
- no hidden dependency on admin or hub views

### 5) Pickup Issue States

#### order not ready
- message intent: explain calmly that collection cannot happen yet because readiness has not been reached
- next action: review current status or return later
- forbidden wording:
  - blame-focused language
  - technical back-office status codes
  - admin-only operational language

#### customer issue / mismatch
- message intent: explain there is a customer-facing mismatch or verification issue that needs attention before handoff
- next action: review details and get help if needed
- forbidden wording:
  - accusatory language
  - fraud-heavy wording without product confirmation
  - accounting or admin jargon

#### status unclear
- message intent: explain the current handoff state is unclear and needs review before pickup confirmation
- next action: refresh status or get help
- forbidden wording:
  - system panic language
  - internal technical diagnostics
  - cross-team blame wording

#### support needed
- message intent: explain help is needed to complete the pickup or handoff safely
- next action: open help/support path
- forbidden wording:
  - dead-end language
  - admin-only escalation phrasing
  - long operational instructions on the order screen

### 6) Pickup Workflow Lock Statement
The shop pickup workflow is locked as a clear, counter-ready model inside the affiliate order detail surface where readiness is obvious, the next valid action is unmistakable, pickup confirmation is fast, and issue handling stays light enough for daily shop operations.

## 2) Affiliate Finance Summary Spec

### 1) Finance Summary Principles
Locked finance summary principles:
- simple visibility, not bookkeeping complexity
- affiliate admin only
- earnings and payouts must be understandable at a glance
- finance surface must support trust, not analysis overload
- no cross-affiliate visibility
- no admin-only controls

### 2) Route and Access Rules
- route: /app/affiliate/finance
- affiliate admin can access
- affiliate staff cannot access and must receive a deliberate 403 if attempted
- the portal must not expose finance navigation to affiliate staff

### 3) Earnings Summary Rules
- show:
  - earned commissions
  - pending payout amount
  - recent payout activity summary
  - current period or simple time scope if supported
- keep layout simple
- use summary cards plus one practical list/table below
- no accounting jargon dump

### 4) Payout Summary Rules
- payout history must be visible simply
- payout status terms must remain plain
- if reconciliation notes exist, surface them calmly
- one clear action may be view/review only unless the product supports more

### 5) Finance State Rules

#### no earnings yet
- message intent: explain there are no earnings to show yet and keep the user oriented without implying an error
- next action: return to daily shop operations or review recent orders
- forbidden wording:
  - bookkeeping-heavy language
  - failure language
  - payout promises not supported by product truth

#### pending payout
- message intent: confirm earnings exist and payout is pending
- next action: review payout summary
- forbidden wording:
  - payroll jargon
  - internal finance processing codes
  - admin-only approval language unless product truth supports it visibly

#### paid out recently
- message intent: confirm a recent payout has been completed and keep the summary calm and trustworthy
- next action: review recent payouts
- forbidden wording:
  - celebratory marketing tone
  - accounting-heavy ledger language
  - ambiguous payout status phrasing

#### payout delayed or under review if supported
- message intent: explain calmly that payout timing is under review or delayed
- next action: review note or get help if available
- forbidden wording:
  - alarming finance language
  - blame wording
  - internal accounting investigation jargon

### 6) Forbidden Patterns
- exposing other shops or affiliates
- admin-like reconciliation dashboard
- large charts not tied to daily use
- payroll/accounting jargon walls
- cluttering normal affiliate staff flows with finance content

### 7) Finance Lock Statement
The affiliate finance summary is locked as a simple, high-trust visibility surface for affiliate admin only, showing earnings, pending payouts, and recent payout activity in a readable, non-accounting-heavy format without exposing any other affiliate data or admin-only controls.
