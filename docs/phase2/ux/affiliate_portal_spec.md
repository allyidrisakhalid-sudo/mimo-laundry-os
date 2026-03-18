# Affiliate Portal Spec  Mimo Phase 2

## 1) Affiliate Portal Principles

Locked affiliate portal principles:
- shop speed first
- own-shop visibility only
- walk-in order creation must be fast
- handoff and pickup readiness must be obvious
- finance visibility must stay simple
- affiliate staff and affiliate admin share one portal model with role-correct scope
- no admin dependence for normal shop work
- no cross-shop ambiguity
- repeated daily actions must feel lightweight
- affiliate portal must feel practical, clean, and trustworthy

## 2) Affiliate Dashboard Spec

### Route
- /app/affiliate

### Purpose
- give the shop one command center for todays orders, readiness, and next action

### Primary CTA
- Create new order

### Required Structure
1) PageHeader
2) KPI row
3) Action queue
4) Orders needing attention list
5) Support panel
6) finance snapshot only for affiliate admin

### KPI Row
- todays orders
- ready for pickup/return
- active issues
- commission/payout snapshot only for affiliate admin

### Action Queue
Priority order:
1) create new order
2) open ready item
3) resolve issue

### Rules
- dashboard is a routing and awareness surface
- dashboard must remain fast and uncluttered
- do not duplicate full orders list or full finance page here
- affiliate staff and affiliate admin see the same operational shell with role-correct scope
- finance snapshot is summary-only and visible to affiliate admin only
- the create-order action must be visually dominant
- ready items and issues must be scannable in one glance
- dashboard language must stay short, calm, and operational

## 3) Walk-In Order Creation Spec

### Route
- /app/affiliate/orders/new

### Purpose
- let affiliate shop staff create a customer order quickly for a walk-in or shop-originated customer

### Primary CTA
- Create order

### Secondary Actions
- Back to dashboard
- Cancel

### Page Structure
1) PageHeader
2) Customer details section
3) Service selection section
4) Return / handoff section
5) Review summary section
6) Submit action area

### Fast Capture Rules
- the page must feel faster than the customer self-serve wizard
- use one concise structured form
- do not split into a long multi-step flow unless truly required by the product logic
- keep only necessary fields visible
- support quick repeated order entry during busy shop hours
- no onboarding copy inside the transaction flow

### Customer Data Rules
- capture only what is needed to identify and contact the customer
- use approved +255 phone input behavior
- customer name/phone must be easy to enter
- no over-collection of profile details
- no unrelated marketing opt-ins

### Service Selection Rules
- support selecting the service path and relevant service/tier details aligned to product truth
- wording must remain plain and short
- if the affiliate flow only supports specific shop-originated paths, make that clear without confusion
- price cues may be shown if supported, but must remain concise and accurate

### Return / Handoff Rules
- clarify whether the customer will pick up at the shop or use the relevant return model supported by the product
- keep handoff expectations obvious
- no hidden operational assumptions

### Review and Submit Rules
- before submit, show one short summary:
  - customer
  - selected service
  - return / handoff path
  - key timing or fee cues if supported
- submit must feel final and immediate
- success should return the user to the most useful next screen

### Tablet/Web Rules
- one-page fast form
- sections remain visible and easy to scan
- controls large enough for fast repeated use on tablet
- no dense field wall

### Visual Rules
- premium but speed-oriented
- one dominant submit action
- clean section grouping
- minimal supporting copy

### Forbidden Patterns
- long wizard for basic shop entry
- duplicate customer portal language
- cross-shop selection controls
- giant CRM-style customer profile creation
- payout/finance clutter on order creation screen

## 4) Orders List Spec

### Route
- /app/affiliate/orders

### Purpose
- give the affiliate one clear list of this shops orders and their current action state

### Primary CTA
- Open order

### Page Structure
1) PageHeader
2) FiltersBar
3) Orders list/table
4) EmptyState or pagination as needed

### Scope Rules
- only show orders belonging to the current affiliate shop scope
- affiliate staff cannot see other shops
- affiliate admin cannot see other affiliates
- scope enforcement must be reflected in the UX, not only backend logic
- there must be no visual suggestion that broader data exists for this user

### List Content Rules
- each row/card shows:
  - order reference
  - customer name/phone
  - service type
  - current status
  - pickup / return readiness
- keep the list compact and useful
- do not duplicate full order detail data in the list

### Filter Rules
- only useful filters allowed:
  - status
  - readiness
  - recent / today if supported
- no analytics clutter
- filters must support fast shop work

### Pickup Readiness Rules
- list must make clear which orders are ready for customer pickup or next handoff step
- readiness should be scannable via status badge or short readiness label
- no need to open every order just to know pickup state

### Open Order Rules
- opening an order goes to the shop-owned order detail screen
- list interactions must remain simple and fast

### Empty State Rules
- explain there are no shop orders matching the current state
- offer the most useful next action:
  - create order
  - clear filters

### Tablet/Web Rules
- support list/table presentation cleanly
- rows remain touch-friendly on tablet
- no tiny admin-grid density

### Forbidden Patterns
- any cross-shop visibility
- heavy admin reporting baked into the orders page
- duplicate dashboard widgets above the list
- too many filters
- finance-heavy list columns for normal staff

## 5) Order Detail Summary

### Route
- /app/affiliate/orders/[id]

### Purpose
- give the shop one complete operational truth for a shop-owned order from creation to pickup/return

### Primary Action
- perform the next valid shop action for this order

### Supporting Actions
- view status
- confirm readiness / pickup handoff as supported
- get help
- review customer/order details

### Page Structure
1) PageHeader
2) Order summary block
3) Timeline / status block
4) Pickup / return workflow block
5) Customer and handoff details block
6) Issue/help block

### Order Summary Rules
- include:
  - order reference
  - customer identity
  - service type
  - current status
  - latest update
- keep summary compact and high-trust

### Timeline / Status Rules
- use the approved status and timeline language
- show progression clearly
- keep it operationally readable for shop staff
- do not overload with back-office event detail

### Pickup Workflow Rules
- pickup or return readiness must be the center of the shop-side action model
- if the order is waiting for customer pickup, surface this clearly
- if shop handoff is needed, surface the exact next action clearly
- do not make staff guess whether the order is ready, waiting, or completed
- one valid next action only

### Issue / Help Rules
- support entry remains available
- issue state must be visible if present
- keep support language short and calm

### Forbidden Patterns
- splitting pickup workflow across multiple detached permanent pages
- burying readiness below generic order metadata
- duplicate full customer profile surface
- finance clutter in normal order detail

## 6) Affiliate Scope and State Rules

### no orders yet
- trigger: the current shop has no orders yet or the filtered list returns zero orders in a true first-use state
- surface: dashboard empty state and orders list empty state
- primary user message intent: ready to create your first order
- next action: create order
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### no ready pickups
- trigger: the current shop has orders, but none are currently ready for pickup or return handoff
- surface: dashboard KPI/queue state and readiness-filtered orders list empty state
- primary user message intent: nothing ready right now
- next action: review active orders
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### order ready for customer pickup
- trigger: an order reaches the shop-ready state for customer collection
- surface: dashboard action queue, orders list readiness badge, and order detail pickup block
- primary user message intent: ready for collection
- next action: open ready item
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### payout pending
- trigger: affiliate admin has earned commission awaiting payout
- surface: dashboard finance snapshot and finance summary page
- primary user message intent: payout is pending
- next action: review finance summary
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### finance unavailable to affiliate staff
- trigger: affiliate staff attempts to access finance route directly or via a stale link
- surface: deliberate 403 state on /app/affiliate/finance
- primary user message intent: access not allowed here
- next action: return to dashboard
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### loading orders
- trigger: dashboard/order list/order detail is fetching shop-scoped order data
- surface: dashboard loading state, orders list loading state, detail skeleton state
- primary user message intent: loading shop orders
- next action: wait or retry if recovery is needed
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### loading finance
- trigger: finance summary page or finance snapshot is fetching affiliate-admin finance data
- surface: finance snapshot placeholder and finance summary loading state
- primary user message intent: loading earnings and payouts
- next action: wait or retry if recovery is needed
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

### issue raised on order
- trigger: an order has an active issue, mismatch, unclear state, or help-needed flag
- surface: dashboard issues list, order detail issue/help block, and issue-tagged rows in the orders list
- primary user message intent: issue needs attention
- next action: open issue or get help
- forbidden wording:
  - cross-shop language
  - technical role jargon
  - accounting-heavy error language
  - admin-only language in shop views

## 7) Affiliate Portal Lock Statement

The affiliate portal is locked as a fast, role-scoped shop workspace where affiliate staff and affiliate admin can create walk-in orders quickly, manage only their own shops orders, handle pickup and handoff clearly, and review earnings and payouts simply without seeing any other shops data. The portal stays aligned to the approved Midnight Silk direction while preserving speed, clarity, trust, and low-friction daily counter operations.
