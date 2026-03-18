# State and Copy Consistency Audit  Mimo Phase 2

## 1) State Audit Principles

Locked state audit principles:
- every state must tell the user what is happening
- every state must provide the next useful action where appropriate
- empty states must feel intentional, not forgotten
- error states must stay calm and actionable
- loading states must preserve trust and layout stability
- state wording must remain consistent across roles
- launch quality depends on edge-state quality, not only happy paths

## 2) Empty State Audit

Empty-state audit scope:
- audit all empty states for:
  - public pages where relevant
  - customer home and history
  - driver no-task state
  - hub no-intake/no-processing state
  - affiliate no-orders/no-ready-pickups state
  - admin no-match/no-urgent-issue states
  - DevAdmin no-failed-jobs or healthy-state surfaces
- each empty state must confirm context and next action
- no dead-end empty state is acceptable in a core flow

Empty-state review rules:
- public pages with empty or no-result conditions must still preserve brand clarity and next-step guidance
- customer home and history empty states must explain whether the customer has no order yet, no recent activity, or no matching records
- driver no-task state must confirm that the task list is currently clear and what to do next
- hub no-intake and no-processing states must confirm operational quiet state without implying broken systems
- affiliate no-orders and no-ready-pickups states must support confident counter operation rather than leaving staff uncertain
- admin no-match and no-urgent-issue states must confirm system status clearly and support next review action
- DevAdmin healthy-state and no-failed-job views must communicate operational calm without removing visibility

Empty-state quality rules:
- every empty state must explain the context in plain language
- every empty state in a core journey must provide a next useful action or confirm why no action is needed
- no empty state may look like missing data or unfinished design
- no empty state may contradict role permissions or workflow expectations

## 3) Error State Audit

Error-state audit scope:
- audit all meaningful error surfaces for:
  - auth failure
  - forbidden access
  - lookup failure
  - support submission issue
  - network / retry conditions
  - finance / payout / refund-related review errors where surfaced
- error copy must avoid blame, panic, and jargon
- every error must expose a reasonable next step

Error-state review rules:
- auth failure must explain the problem calmly and preserve recovery path
- forbidden access must confirm that access is not allowed without sounding broken or hostile
- lookup failure must distinguish between no result and unable-to-load conditions where needed
- support submission issues must preserve confidence that the user can retry or choose another path
- network and retry conditions must tell the user what happened, what still might be safe, and what to do next
- finance, payout, and refund-related review errors must remain ledger-safe, precise, and non-alarming

Error-state quality rules:
- no error may blame the user unnecessarily
- no error may use jargon when a direct instruction is possible
- no error may create uncertainty about whether an action succeeded if state truth can be shown
- every meaningful error must offer retry, back, support, or another reasonable recovery route

## 4) Loading State Audit

Loading-state audit scope:
- every major screen must have a structured loading state
- loading must mirror final layout where possible
- no spinner-only dead void for major screens when a skeleton or structure is possible
- loading states must avoid layout jump when content arrives

Loading-state review rules:
- customer, driver, hub, affiliate, admin, DevAdmin, and support surfaces must preserve recognizable page structure while loading
- KPI rows, hero cards, task lists, tables, and detail panels should use skeleton or structured placeholders where possible
- route-level loading must keep users oriented rather than blanking the screen without context
- loading feedback must appear fast enough that users know the interface received their action

Loading-state quality rules:
- structure should resemble the final page so the interface feels intentional
- loading should reduce perceived instability, not create it
- spinners may support a loading state, but should not replace structure on major screens where layout is known
- loading completion must not cause avoidable jumps in card height, table alignment, or CTA placement

## 5) Cross-Role State Consistency Rules

Locked cross-role state consistency rules:
- same type of state must use aligned language patterns across roles
- loading, retry, no results, access not allowed, and issue recorded semantics must stay consistent
- semantics may adapt by role context, but not contradict

Consistency rules:
- a user should not see one role describe a network issue as a system failure while another role describes the same condition as a simple retry case
- similar empty-state situations should share the same confidence pattern: confirm context, explain absence, offer next step where appropriate
- similar error conditions should share the same calm, direct recovery pattern across roles
- similar success or issue-recorded confirmations should feel like one product voice even when role-specific details differ
- shared component states must inherit common semantics and only vary where workflow truly demands it

## 6) Copy Consistency Audit

### Scope
- all public copy
- auth copy
- onboarding copy
- customer copy
- driver copy
- hub copy
- affiliate copy
- admin copy
- DevAdmin copy
- support copy

### Tone Consistency Rules
- tone stays warm, calm, premium, and direct
- no random playful copy in one role and harsh enterprise copy in another
- no decorative marketing tone inside operational portals
- no robotic system tone in customer-facing states

Tone review rules:
- public copy may be slightly more expressive, but must still stay disciplined and premium
- operational portals must stay clear, direct, and efficient without becoming cold
- support copy must feel reassuring and actionable without becoming vague
- diagnostics and DevAdmin copy may be more technical, but must still remain disciplined and readable

### EN / SW Parity Rules
- English and Swahili must communicate the same meaning
- one language must not be more detailed or more alarming than the other
- translation must sound natural in context
- no obviously machine-like phrasing remains

Parity review rules:
- the same user action must carry equivalent confidence and urgency in both languages
- short labels and long helper copy must both preserve intent across EN and SW
- no translation may introduce accidental contradiction in pricing, support, issue, or status meaning
- parity must be judged in context, not word count

### Label Consistency Rules
- core nouns and actions remain consistent across the product
- the same concept must not receive many different labels
- order, task, issue, payout, refund, support, and status terms remain stable

Label review rules:
- one concept should have one preferred product label unless a deliberate role-context distinction exists
- navigation labels, card headers, CTA labels, and status chips must stay aligned
- no unnecessary synonym drift is allowed across public, portal, and support surfaces

### CTA Consistency Rules
- primary actions must use strong direct verbs
- same action should use the same wording pattern across similar contexts
- no vague labels like Continue where a more exact label is available and needed

CTA review rules:
- create, assign, confirm, retry, save, submit, and resolve actions should stay explicit
- primary and secondary CTA hierarchy should remain consistent across roles
- CTA labels must match the actual result of the action

### Status and Support Wording Rules
- status language remains aligned with Phase 1 truth
- support messages remain aligned between in-app and optional WhatsApp templates
- refund and credit wording remain ledger-safe and non-contradictory

Status and support review rules:
- operational truth must not be softened into misleading marketing language
- customer-facing updates must remain reassuring without obscuring actual state
- refund, credit, and payout language must remain precise enough for financial trust
- issue and support terminology must remain aligned across self-serve and assisted support surfaces

### Forbidden Patterns
- mixed terminology for the same action
- one language feeling premium and the other awkward
- duplicate CTA words for different meanings
- emotionally inconsistent error/support tone

Additional forbidden patterns:
- decorative copy inside dense operational flows
- vague status words that hide real state
- inconsistent capitalization or label grammar for the same shared object
- role portals drifting into different brand voices

## 7) State and Copy Lock Statement

The final state and copy consistency audit is locked as a trust requirement for launch readiness. Mimo must not only work on happy paths; it must also feel intentional, calm, and clear during empty, loading, error, retry, and support moments across every role and both languages. Launch quality is only acceptable when states remain structurally consistent, wording remains aligned, and EN/SW copy communicates the same confidence, meaning, and product truth.
