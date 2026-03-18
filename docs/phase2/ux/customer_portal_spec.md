# Customer Portal Spec  Mimo Phase 2

## 1) Customer Portal Principles

Locked customer portal principles:
- one calm command center for the customer
- active order first
- clear next action always visible
- payment and support never hidden
- order truth lives in order detail
- profile remains simple and useful
- customer portal must feel premium and effortless
- web and mobile must follow one product model
- minimal surfaces, no clutter
- every screen must help the customer move forward confidently

## 2) Customer Home Spec

### Route
- /app/customer

### Purpose
- give the customer one clear starting point with the current order state, next action, and fast access to order creation or tracking

### Primary CTA
- Start new order

### Secondary Actions
- View order
- Get help

### Page Structure
1) PageHeader
2) Active Order Card or EmptyState
3) Quick action row
4) Recent orders list
5) Support/help entry

### Active Order Card Rules
- active order card is the visual hero of the page
- only one primary active order card should dominate the page at a time
- if multiple active orders exist, show the most urgent or most recent one first, with list access below
- card must include:
  - order reference
  - service channel
  - tier
  - current status badge
  - next expected step or action
  - quick CTA to open full order detail
- if payment is due, the card must surface this clearly but calmly
- if issue exists, the card must surface support entry clearly

### No Active Order State
- show a premium empty state
- explain that the customer has no active order right now
- primary CTA remains Start new order
- no dead-end copy

### Recent Orders Section
- compact list only
- show recent orders with:
  - reference
  - created date
  - status
  - balance/payment state
- tapping an item opens order detail
- do not duplicate full order-detail content here

### Support Entry Rules
- one clear help/support entry near the lower section of the page
- keep it secondary to ordering/tracking
- no giant help wall inside home

### Mobile Rules
- active order card must appear quickly
- CTA must remain visible without hunting
- recent orders stack cleanly
- no dashboard density overload

### Visual Rules
- premium card hierarchy
- active order card gets strongest emphasis
- use Midnight Silk rhythm and tokens
- keep layout calm and airy
- no dashboard-chart look

### Forbidden Patterns
- multiple competing hero cards
- heavy metrics dashboard language
- duplicate timeline on home
- duplicate invoice summary blocks on home
- cluttered shortcuts grid

## 3) New Order Wizard Summary

The customer new order wizard is the signature transaction flow for the customer portal. It begins from the Start new order CTA on `/app/customer`, remains inside customer portal context, and follows one deterministic sequence:
1) Service path
2) Service speed / tier
3) Address or shop handoff details
4) Schedule
5) Review and submit

The wizard must feel premium, short, and obvious. It supports Door, Shop, and Hybrid without adding permanent navigation clutter. Each step focuses on one decision group only. The flow must preserve entered data when moving back, surface concise validation only where needed, and end with one consolidated review before order creation.

## 4) Order Detail Spec

### Route
- /app/customer/orders/[id]

### Purpose
- show the full customer-facing truth for one order and enable the next relevant customer actions

### Primary Action
- complete the next relevant action for this order

### Allowed Supporting Actions
- pay now
- get help
- view receipt/invoice
- review address/timing details if visible and permitted

### Page Structure
1) PageHeader
2) Order summary block
3) Timeline block
4) Invoice/payment block
5) Support/issues block
6) Related detail/supporting info

### Order Summary Block Rules
- include:
  - order reference
  - service path
  - selected tier
  - current status
  - latest update
- keep it compact and high trust
- do not duplicate the entire timeline here

### Timeline Block Rules
- use the approved Timeline system
- timeline is the center of trust on this page
- must show progression clearly
- latest event visible first or clearly emphasized
- event language must remain customer-readable

### Invoice/Payment Block Rules
- show payment summary cleanly
- show amount due or paid status clearly
- if payment is pending and the product supports payment action here, surface Pay now visibly
- receipt/invoice access belongs here
- do not scatter payment info across multiple page sections

### Support/Issues Block Rules
- one clear issue/help entry
- if an issue already exists, show its state simply
- help entry must feel calm and available
- do not bury support behind profile/settings

### Related Detail / Supporting Info Rules
- include pickup/delivery details relevant to the customer
- include address or shop context as needed
- keep this secondary to status/payment/support

### Order Detail Forbidden Patterns
- duplicate home-page hero patterns
- overwhelming operational jargon
- deeply nested accordions hiding essential truth
- separate detached payment page when in-context payment is possible
- duplicate FAQ block from public help center

## 5) Profile Spec

### Route
- /app/customer/profile

### Purpose
- let the customer manage the few account items that matter for repeat usage

### Primary Action
- save profile changes

### Page Structure
1) PageHeader
2) Account section
3) Saved addresses section
4) Receipts / documents section
5) Language and preferences section
6) Help / logout section

### Account Section Rules
- show essential identity/contact information only
- no oversized account management complexity

### Saved Addresses Section Rules
- allow address add/edit/remove behavior if supported
- use approved address form logic
- address management must feel lightweight
- no map-heavy UX in this chapter

### Receipts / Documents Section Rules
- provide access to receipts/invoices relevant to customer history or most recent orders as supported
- keep this list practical and not overly dense
- do not duplicate full order list here

### Language and Preferences Section Rules
- language switch must be visible and understandable
- keep preferences minimal
- no deep notification-center settings maze in this chapter

### Help / Logout Section Rules
- help entry must remain obvious
- logout must be clean and secondary
- do not make profile feel like a support center

### Profile Forbidden Patterns
- giant settings taxonomy
- duplicate order detail data
- cluttered security/admin settings unrelated to customer needs
- burying language controls

## 6) Customer Portal State Rules

### no active order
- trigger: customer has no currently active order in a live operational state
- surface: home empty state replacing the active order card area
- primary user message intent: ready to start
- next action: Start new order
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### no orders history
- trigger: customer has no completed or historical orders to list
- surface: empty state in the recent orders or orders view
- primary user message intent: no history yet
- next action: Start new order
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### loading home
- trigger: customer portal home is fetching the active order and recent order data
- surface: structured loading skeletons for header, hero card area, and list rows
- primary user message intent: preparing your view
- next action: wait briefly or retry if loading fails
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### loading order detail
- trigger: order detail payload is not yet ready
- surface: structured loading state preserving summary, timeline, and payment layout
- primary user message intent: loading order progress
- next action: wait briefly or retry if loading fails
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### payment due
- trigger: order has outstanding payable balance and payment is relevant at this stage
- surface: active order card or invoice/payment block with clear but calm emphasis
- primary user message intent: action needed to complete payment
- next action: Pay now
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### issue raised
- trigger: support issue or dispute has been opened on the order
- surface: support/issues block and active order card if the issue materially affects next action
- primary user message intent: support is in progress
- next action: View issue status or Get help
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### guest-like empty account after signup
- trigger: newly created account with no saved addresses, no history, and no active order
- surface: home and profile supportive onboarding state
- primary user message intent: ready for your first order
- next action: Start new order or add address if surfaced
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

### offline or retry-needed state if surfaced
- trigger: customer-facing fetch or submit action fails due to connectivity or recoverable error
- surface: inline alert, toast, or preserved page state with retry entry
- primary user message intent: retry calmly
- next action: Retry
- forbidden wording:
  - blame language
  - technical internal status codes
  - alarmist payment wording
  - vague dead-end errors

## 7) Customer Portal Lock Statement

The customer portal is locked as a premium, minimal, active-order-first experience across web and mobile. The customer has one clear home, one truthful order-detail surface, one short order-creation flow, and one simple profile utility page. Payment and support remain visible without overwhelming the product. The model is deliberately calm, role-correct, bilingual-ready, and daily-usable.
