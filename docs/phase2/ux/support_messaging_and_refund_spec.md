# Support Messaging and Refund Spec  Mimo Phase 2

## 1) Support Messaging Principles

Locked support messaging principles:
- every message must say what is happening now
- every message must imply or state the next step clearly
- tone must remain calm and respectful
- support messages must not overpromise
- in-app and WhatsApp wording must not contradict each other
- customer-visible messages must stay short
- internal status complexity must not leak into user-facing copy
- refund/credit wording must stay financially accurate
- bilingual parity is mandatory

## 2) Support Status Template Model

### received
- purpose: confirm that the issue entered the support flow successfully
- customer-visible meaning: the issue was received and is now in review flow
- internal usage note: use immediately after issue submission before deeper review begins
- next-step intent: reassure the customer that the case is active and review is the next step

### under review
- purpose: show that the team is actively assessing the issue and linked order context
- customer-visible meaning: the issue is being reviewed
- internal usage note: use when admin or support operations are evaluating facts, context, or next action
- next-step intent: prepare the customer for an update or a move into action in progress or refund / credit review

### action in progress
- purpose: show that a defined action is underway to resolve the issue
- customer-visible meaning: work is being done on the case now
- internal usage note: use once review is complete and an operational resolution path is active
- next-step intent: signal that the case is moving forward toward an outcome

### waiting on resolution
- purpose: show that the case is pending a final outcome or dependent completion step
- customer-visible meaning: the issue is still open and waiting for the final resolution step
- internal usage note: use only where the internal workflow needs a pending end state before final completion
- next-step intent: keep expectations calm while indicating that the case remains active

### refund / credit under review
- purpose: show that a money-related decision is being assessed safely
- customer-visible meaning: refund or credit options are under review
- internal usage note: use for finance-sensitive case paths tied to refund or credit consideration
- next-step intent: clarify that money outcome is not complete yet and will be confirmed when ready

### resolved
- purpose: close the loop with a clear visible outcome
- customer-visible meaning: the issue has been resolved and the latest result is now recorded
- internal usage note: use only once the actual support outcome is complete and aligned with order and finance truth
- next-step intent: end uncertainty and confirm closure without hidden ambiguity

## 3) In-App Message Rules

- messages appear in issue state blocks or order detail support area
- message must include:
  - current support state
  - short explanation
  - next-step expectation if relevant
- keep messages short enough for mobile
- no paragraph walls
- no legalistic tone

Additional in-app rules:
- title and body should feel scan-friendly inside the customer order detail support surface
- messages must reinforce visibility of state rather than bury it below unrelated order information
- the latest update summary should stay short and factual
- status labels and message bodies must remain aligned at all times

## 4) WhatsApp-Optional Message Rules

- optional WhatsApp templates may mirror the in-app support status
- wording must remain slightly more conversational but still premium and exact
- no message should create a promise not reflected in system state
- no spam-like repetition
- WhatsApp template family must remain aligned to the same status model

Additional WhatsApp-aligned rules:
- use WhatsApp only as an optional reflection of the same approved case state already visible in-app
- do not add channel-only promises, shortcuts, or status meanings
- keep wording human and calm without becoming casual, noisy, or repetitive
- every WhatsApp-aligned template should still make sense when read alongside the in-app support state block

## 5) Refund and Credit Messaging Rules

### Principles
- support can initiate or manage the refund request context
- finance/ledger truth governs money state
- customer messaging must never imply a completed refund before ledger-safe completion
- refund and credit are distinct outcomes
- admin must understand which state is pending vs completed
- the customer must see a clear support-visible status throughout

### Refund Request Rules
- refund request starts as a support issue type or support-linked state
- request is visible in support case detail and customer issue view
- refund request must not instantly appear as completed money movement

### Refund Review Rules
- admin can move refund request into review
- if approved, resulting state must reflect the actual finance action truth
- if not approved, the outcome must remain clear and respectful
- no silent disappearance of refund requests

### Credit Option Rules
- if credit is used instead of refund, this must be stated clearly
- credit must not be mislabeled as refund
- the customer-visible wording must distinguish between refund and credit outcome

### Ledger Consistency Rules
- all refund/credit UX must remain aligned with Phase 1 ledger/accounting truth
- support state cannot outrun actual financial state
- resolved support case and financial completion must remain coherent
- no refunded label unless the actual recorded finance state supports it

### Customer Visibility Rules
- customer can see:
  - refund requested
  - refund under review
  - refund completed
  - credit issued if applicable
- these labels must remain calm and exact

### Forbidden Patterns
- instant refund complete wording before actual completion
- mixing refund and credit language
- support-only refund actions that bypass finance truth
- contradictory case status vs payment ledger state

## 6) Messaging Lock Statement

The support messaging and refund model is locked to one calm, bilingual status system that works consistently across in-app updates and optional WhatsApp-aligned wording. Every message states the current truth, signals the next step without overpromising, and keeps refund or credit language aligned to actual finance state. This prevents status drift, reduces customer anxiety, and preserves trust across support, admin handling, and ledger-backed outcomes.
