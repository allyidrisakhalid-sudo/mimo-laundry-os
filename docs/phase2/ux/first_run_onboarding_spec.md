# First-Run Onboarding Spec  Mimo Phase 2

## 1) Onboarding Principles

Locked onboarding principles:
- first-run must be short
- first-run must be role-specific
- first-run must remove confusion, not add ceremony
- onboarding must not duplicate help center content
- onboarding must not block usage with unnecessary forms
- every onboarding screen must lead to a real next action
- premium calm guidance beats tutorial overload
- users must be able to skip non-critical setup cleanly where product logic allows
- critical setup must be obvious and fast
- onboarding must feel like product setup, not training

## 2) Customer First-Run Flow

### Trigger
- first successful customer login or first account creation route into /app/customer when essential first-run info has not yet been completed

### Route Rules
- onboarding occurs inside the customer portal experience, not as a disconnected public wizard
- use a clean focused first-run surface that still feels part of the app
- onboarding must resolve before normal home usage only if critical setup is missing
- non-critical setup must not hard-block the customer

### Maximum Screens
- 2 screens only

### Screen 1 Spec
- Purpose:
  - confirm language preference and explain the customer flow in one calm moment
- Primary Action:
  - Continue
- Required Content:
  - short welcome title
  - one-line reassurance
  - language selection/control
  - 3-step customer flow explanation:
    - create order
    - we collect or receive it
    - track and get it back
- Rules:
  - no long intro paragraph
  - no animation tutorial
  - no more than 3 explanation points
  - one visible continue CTA

### Screen 2 Spec
- Purpose:
  - capture a saved address if the current product flow benefits from it, without blocking the customer unnecessarily
- Primary Action:
  - Save address
- Secondary Action:
  - Skip for now
- Required Content:
  - short title
  - one short helper line
  - address form using the approved AddressForm rules
  - clear note that address helps pickup and delivery
- Rules:
  - address is optional in this chapter
  - if skipped, customer still enters the app
  - no extra profile questions
  - no map-heavy flow
  - no billing profile wall

### Completion Rules
- after completion or skip of non-critical step, user lands on /app/customer
- customer home must show the next obvious action immediately

### Skip Rules
- language selection should still leave the user with a deterministic default if they do not change it
- optional address capture can be skipped
- skip must never feel like failure

### Re-entry Rules
- if address was skipped, the product may surface it later from profile or order creation, but not by replaying the whole onboarding
- onboarding should not reappear once completed unless a true required setup condition exists

### Mobile Rules
- one-column card
- CTA visible without awkward scrolling
- explanation points easy to scan
- address form fields stack cleanly
- progress feel calm and short

### Visual Rules
- same premium auth/app bridge aesthetic
- welcoming but restrained
- no giant illustrations pushing actions below the fold
- clean card hierarchy
- use approved form and page-header patterns only

### Forbidden Patterns
- more than 2 screens
- collecting marketing or survey data
- asking for irrelevant profile details
- full tutorial carousel
- multi-minute onboarding
- repeating help/FAQ content already housed elsewhere

## 3) Staff/Operator First-Run Prompt Model

Staff and operator first-run onboarding in P2.6 is not a multi-screen onboarding flow. It is a lightweight, card-based readiness prompt shown inside the correct portal home when the system detects incomplete setup or missing readiness acknowledgment.

Locked model:
- use a single prompt card at the top of the relevant dashboard
- prompt points to real setup actions already native to the product
- prompt must not introduce tutorial pages, training slides, or ceremonial checklists
- prompt exists to remove first-run hesitation and clarify the next real step
- once completed, the user returns directly to the normal dashboard context
- prompt content must remain short, role-specific, and operational

Roles covered by this model:
- driver
- hub staff
- affiliate staff
- affiliate admin

## 4) Role Help Entry Model

Role help in P2.6 must support self-starting behavior without turning onboarding into a duplicate documentation system.

Locked model:
- every role has one obvious help path
- help entry appears inside the real portal context, not as a detached learning experience
- contextual help can appear from profile/account areas and from high-friction task or order detail surfaces
- help must direct users to the right support destination, including public help and WhatsApp/support routes where appropriate
- help wording stays plain, short, and calm
- portal help must not contradict the public /help route
- help must support the roles permissions and operational reality

## 5) Onboarding Lock Statement

The first-run onboarding model for Phase 2 is locked to a minimal, premium, role-correct system. Customers receive a maximum two-screen setup inside the customer app context. Operators do not receive training flows; they receive concise setup prompts inside their real dashboard. Help remains contextual and deterministic. The onboarding system is therefore optimized for self-start, low friction, and immediate operational readiness without duplicating the help center or adding ceremonial product setup.
