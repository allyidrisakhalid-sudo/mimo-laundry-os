# Support Center Spec  Mimo Phase 2

## 1) Support Experience Principles

Locked support experience principles:
- support starts from context
- issue creation must be short and specific
- common problems must map to clear categories
- support must reduce anxiety, not increase it
- issue state must remain visible after submission
- support must not break ledger truth or order truth
- refund/credit paths must stay controlled
- auditability must exist without overwhelming the user
- messaging must stay calm and exact
- support UX must feel trustworthy and finite

## 2) Customer Issue Creation Spec

### Entry Points
- customer order detail support block
- customer order detail issue state block if an issue already exists
- contextual help entry from customer portal where order context is already known

### Purpose
- let the customer raise a specific issue about a real order without confusion or repetition

### Primary CTA
- Report issue

### Supported Issue Types
- damage
- missing item
- delay
- refund request

### Issue Form Rules
- one short form only
- required fields must stay minimal
- customer must choose one issue type first
- once issue type is chosen, show only the fields needed for that issue
- keep form concise:
  - issue type
  - short description
  - optional supporting detail or photo only if the current product supports it cleanly
- no generic something went wrong catch-all if one of the defined issue types fits
- no giant ticketing form

### Submission Rules
- submission must feel explicit and final
- after submit, the issue receives a visible support state
- the customer must understand that the issue is now under review or active
- do not promise instant resolution

### Post-Submit Visibility Rules
- issue state remains visible on the order detail page
- the customer can see:
  - issue type
  - current support status
  - last update summary if available
- support state must not disappear into a hidden inbox

### Order Detail Integration Rules
- support lives inside the order truth, not outside it
- issue creation must not duplicate order summary or payment summary
- the order detail remains the primary place to understand the problems context

### Mobile Rules
- issue type selection clear and large
- one-column form
- no long scroll of unnecessary fields
- status visibility remains obvious after submission

### Visual Rules
- calm support card/panel
- issue status uses approved status treatment
- no alarmist red wall
- form and status remain premium and structured

### Forbidden Patterns
- separate detached support portal for customers
- giant multi-step ticket wizard
- duplicate FAQ blocks in the issue flow
- forcing the customer to repeat order details already known
- vague dead-end submission state

## 3) Cross-Role Visibility Summary

Locked cross-role support visibility model:
- customer sees own issue state attached to own order
- affiliate may see order issue state only where relevant to shop-owned order workflow and scope
- admin sees triage and resolution context
- DevAdmin sees audit/control visibility where relevant, not customer support resolution workflow ownership
- no cross-customer or cross-shop support leakage

Additional visibility notes:
- customer visibility is scoped to the single order detail experience and should never expose internal workflow jargon
- affiliate visibility is limited to order-linked support context that matters to shop handling, pickup, handover, or customer communication within approved scope
- admin visibility includes queue, case detail, resolution action, refund or credit context, and customer-visible message state
- DevAdmin visibility is limited to observability, audit, and control surfaces when needed for platform safety or investigation, not day-to-day support ownership

## 4) Support Status Model

### received
- trigger: customer submits a new issue from the order detail support entry point
- customer-visible meaning: your issue has been received and is now in the support flow
- admin usage meaning: a new case exists and awaits review or triage confirmation
- next action: review linked order context and confirm the appropriate working state
- forbidden wording: fixed, completed, refunded

### under review
- trigger: admin has opened the case and is reviewing the issue and linked order context
- customer-visible meaning: the team is reviewing the issue details
- admin usage meaning: active review is underway and the case is not yet resolved
- next action: add update, move to action in progress, or route to refund / credit review if relevant
- forbidden wording: guaranteed soon, solved already, money sent

### action in progress
- trigger: a concrete operational or support action is being taken to resolve the case
- customer-visible meaning: work is in progress on the issue
- admin usage meaning: the team has moved beyond review and is carrying out the chosen resolution path
- next action: continue action, record update, or complete resolution when outcome is ready
- forbidden wording: finished unless actually resolved, refunded unless finance truth confirms it

### refund / credit review
- trigger: the issue requires refund or credit assessment tied to finance truth
- customer-visible meaning: refund or credit options are being reviewed
- admin usage meaning: the case now includes a finance-sensitive decision path that must remain ledger-safe
- next action: approve, decline, or convert to a clear credit outcome in line with ledger state
- forbidden wording: refund complete before actual completion, instant return, cash sent

### resolved
- trigger: the issue outcome is complete and the case has a clear visible conclusion
- customer-visible meaning: the case has been resolved with the latest outcome recorded
- admin usage meaning: resolution is complete, recorded, and auditable
- next action: no further action unless reopened under controlled rules
- forbidden wording: ignored, vanished, automatically closed with no outcome

## 5) Support Auditability Summary

Locked support auditability model:
- issue creation is logged
- support status changes are logged
- refund / credit decisions are logged
- resolution outcome is logged
- auditability must support accountability without exposing noisy internal detail to customers

Audit summary notes:
- customer-facing surfaces should show calm state and relevant update summary, not raw internal action history
- admin must be able to trace who changed status, when updates were added, and which decision path was used
- refund and credit decisions must remain traceable to the related order and finance truth
- audit visibility should align with existing admin and DevAdmin control patterns without becoming a separate support system

## 6) Support Center Lock Statement

The support center model is locked as a calm, order-linked support layer that begins from customer order context, keeps issue creation minimal, preserves visible case state after submission, and gives admin one coherent path from triage to resolution. Refund and credit behavior remains controlled by finance truth, while customer messaging stays short, respectful, and audit-safe. This structure formalizes support without adding a detached support portal, ticket maze, or duplicate business surfaces.
