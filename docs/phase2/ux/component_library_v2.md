# Component Library V2  Mimo Phase 2

## 1) Component System Principles

This library is the single approved component system for all Phase 2 public pages and role portals on mimolaundry.org.

System principles:
- one coherent production library for all approved screens
- no custom structural hacks
- no duplicate component behavior
- one clear purpose per component
- one dominant action per screen
- role-based clarity over feature sprawl
- bilingual-safe structure using i18n keys only
- Midnight Silk visual discipline across every component
- production-grade responsive behavior from the start
- accessibility and interaction consistency are mandatory

This library is locked to the Phase 2 mission:
- premium
- minimal
- operationally sharp
- calm
- trustworthy
- device-ready

---

## 2) Layout Components

### Component Name
AppShell

### Purpose
The root application frame for every /app/* portal page.

### Used In
- customer
- driver
- hub
- affiliate
- admin
- dev

### Required Anatomy
- portal sidebar area on desktop where applicable
- topbar/header utility area
- main content region
- scroll-safe content container
- mobile-safe bottom tab support for customer and driver only

### Behavior Rules
- customer and driver support desktop shell and mobile shell variants
- hub, affiliate, admin, dev use desktop-first shell with collapsible sidebar
- sidebar persists across portal pages
- content area must never visually collide with fixed topbar or bottom tabs
- shell must support page-level loading and empty states cleanly

### Responsive Rules
- desktop: sidebar + topbar + content
- tablet: collapsed or slim sidebar behavior
- mobile customer/driver: topbar + content + bottom tabs
- mobile admin-like portals: no bottom tabs; content stacks vertically under topbar

### Visual Rules
- dark premium sidebar where sidebar exists
- light workspace reading surface
- consistent page gutters
- no full-bleed content chaos
- shell must preserve premium spacing and card rhythm from P2.1 tokens

### Content Rules
- shell does not own page-specific titles or CTA copy
- shell only frames the workspace

### Forbidden Patterns
- separate shell styles per role
- custom per-page shell inventions
- floating disconnected sidebars
- duplicated navigation zones

---

### Component Name
Sidebar

### Purpose
Provide role-specific persistent navigation inside the app shell.

### Used In
- all desktop portal views

### Required Anatomy
- logo/brand area
- primary nav list
- active item state
- optional lower utility cluster
- profile/account area if placed in sidebar layout

### Behavior Rules
- only role-approved routes appear
- active route must be visually obvious
- collapsed state must preserve icon + tooltip clarity
- detail pages do not become persistent sidebar items

### Responsive Rules
- desktop expanded by default
- narrower desktop can collapse
- mobile customer/driver remove sidebar in favor of bottom tabs
- mobile admin-like portals use topbar access pattern only if needed by implementation, but no second nav system is invented in this chapter

### Visual Rules
- midnightAurora or dark surface base
- text inverse hierarchy with clear active state
- icon + label alignment consistent
- spacing and hover states come from locked token system

### Content Rules
- labels must match i18n keys from the copy baseline
- order of items follows task priority

### Forbidden Patterns
- dead links
- placeholder items
- mixed icon styles
- duplicate links already represented elsewhere in the same nav frame

---

### Component Name
Topbar

### Purpose
Provide global in-app utility controls without replacing the sidebar.

### Used In
- all /app/* portals

### Required Anatomy
- current portal label or page context
- language toggle
- optional notifications entry if supported
- profile/account menu

### Behavior Rules
- topbar remains utility-only
- no marketing links
- no duplicate sidebar route set
- actions remain concise and account/global in nature

### Responsive Rules
- compress cleanly on tablet/mobile
- portal label remains visible
- controls do not wrap into visual clutter

### Visual Rules
- light elevated bar over workspace or integrated premium light panel
- subtle border and shadow
- premium compact spacing

### Content Rules
- no promotional content
- no redundant page description walls

### Forbidden Patterns
- adding role navigation menus into the topbar
- putting primary page CTAs permanently in the topbar unless globally justified later

---

### Component Name
PageHeader

### Purpose
Establish page identity and expose the single dominant page action.

### Used In
- all major screens

### Required Anatomy
- title
- short description or status line
- one primary action area
- optional secondary metadata row if operationally required

### Behavior Rules
- every page gets one clear title
- every page gets one clear primary action or intentionally none if the page is read-only
- title must match screen purpose from the approved screen maps

### Responsive Rules
- content stacks cleanly on smaller widths
- primary action remains visible without overpowering the title

### Visual Rules
- generous but disciplined spacing
- premium hierarchy
- no oversized decorative hero treatment inside app pages

### Content Rules
- title plain and exact
- description short and useful
- CTA explicit and action-based

### Forbidden Patterns
- multiple competing primary actions
- vague titles
- marketing-style slogans in operational portals

---

### Component Name
SectionHeader

### Purpose
Label a subsection inside a page and orient the user before data or controls.

### Used In
- dashboards
- forms
- lists
- detail pages
- settings blocks

### Required Anatomy
- section title
- optional short helper line
- optional local action aligned to the section

### Behavior Rules
- section actions are subordinate to page action
- helper text is concise
- repeated section headers on the same page must not say the same thing

### Responsive Rules
- action drops below or beside title cleanly
- helper text remains readable and short

### Visual Rules
- tighter spacing than PageHeader
- consistent text scale
- no decorative separators unless from token system

### Content Rules
- direct wording only
- helper line explains why the section matters

### Forbidden Patterns
- verbose paragraphs
- duplicate local actions already available at page level

---

## 3) Data Components

### Component Name
Table

### Purpose
Present operational data in a clean, filterable, scannable structure without spreadsheet ugliness.

### Used In
- admin orders
- finance views
- operations views
- affiliate orders
- hub queues where table layout is appropriate

### Required Anatomy
- table shell/card container
- column header row
- row states
- hover/active row behavior
- optional row action area
- empty state slot
- loading state slot
- pagination region

### Behavior Rules
- columns must be purposeful
- sort only where useful
- status and attribution columns must remain visually scannable
- row click and row action patterns must never conflict
- sticky header allowed where useful
- no horizontal chaos from excessive columns; prioritize column discipline

### Responsive Rules
- dense data can collapse by priority on smaller widths
- mobile may transform to card/list presentation where needed, but data meaning must remain intact
- critical status and primary identifier stay visible first

### Visual Rules
- premium light table shell
- subtle row separators
- no harsh gridlines
- soft row hover tint
- rounded outer container
- toolbar above table where filters/search exist

### Content Rules
- headers must be short and exact
- cell values must preserve status clarity
- no duplicate data in adjacent columns

### Forbidden Patterns
- uncontrolled column growth
- spreadsheet-style full-grid borders
- unlabeled row actions
- raw IDs without contextual label if a human-friendly label exists

---

### Component Name
FiltersBar

### Purpose
Provide compact filtering and search controls for lists and tables.

### Used In
- orders
- operations
- finance
- any role-based list requiring narrowing

### Required Anatomy
- search field
- primary filters
- clear/reset control
- result count or active filter summary where useful

### Behavior Rules
- show only meaningful filters
- default state must be understandable
- clear action resets predictably
- filter groups must not overwhelm the page

### Responsive Rules
- stack cleanly on smaller widths
- preserve search visibility first
- lower-priority filters can wrap, but remain usable

### Visual Rules
- integrated with table/list shell
- premium compact inputs
- no noisy control clutter

### Content Rules
- labels use i18n keys
- filter names are domain-specific and plain

### Forbidden Patterns
- too many low-value filters
- duplicate filter and search logic
- hidden critical filters with no visibility of active state

---

### Component Name
Pagination

### Purpose
Move through long lists cleanly and predictably.

### Used In
- all paginated lists and tables

### Required Anatomy
- previous control
- page indicator
- next control
- optional per-page size only where needed later

### Behavior Rules
- always visible when more than one page exists
- disabled states clear
- page state preserved with filters where appropriate

### Responsive Rules
- compact on mobile
- still understandable with minimal controls

### Visual Rules
- low-noise, premium controls
- subordinate to the data list itself

### Content Rules
- labels plain and short

### Forbidden Patterns
- oversized pagination chrome
- unclear current page state

---

### Component Name
EmptyState

### Purpose
Reassure the user when there is no data and point to the correct next action.

### Used In
- every data component and page-level empty condition

### Required Anatomy
- one icon or illustration
- one title
- one short body line
- one primary next-step action where appropriate

### Behavior Rules
- empty states must be calm and useful
- must explain whether the user has no data yet, no results from filters, or no permission-relevant content
- action must map to the next real step

### Responsive Rules
- centered or section-contained depending on page
- no oversized illustration on mobile

### Visual Rules
- premium minimal
- soft icon treatment
- strong whitespace
- not cartoonish

### Content Rules
- reassuring, direct, short
- role-aware messaging from i18n baseline

### Forbidden Patterns
- jokes
- blaming language
- dead-end empty states with no next step

---

### Component Name
LoadingState

### Purpose
Keep the interface stable and believable while data is loading.

### Used In
- dashboards
- lists
- detail pages
- forms awaiting data

### Required Anatomy
- skeleton blocks matching real layout
- loading label only when necessary
- stable reserved layout space

### Behavior Rules
- skeleton shape mirrors final content structure
- loading indicators must not flash excessively
- avoid spinner-only pages where structure can be previewed

### Responsive Rules
- scale skeleton layout to the target layout
- mobile skeletons remain compact and readable

### Visual Rules
- soft shimmer or subtle skeleton wash
- premium minimal treatment
- no distracting animation

### Content Rules
- if text is shown, keep it short

### Forbidden Patterns
- layout jumps
- generic loading without structure
- overly busy animated placeholders

---

## 4) Form Components

### Component Name
WizardSteps

### Purpose
Guide users through multi-step flows without confusion.

### Used In
- signup if multi-step
- customer order creation
- affiliate order creation
- selected support flows if needed later

### Required Anatomy
- step indicator
- current step title
- step content region
- previous/next controls
- final submit action
- validation/error exposure per step

### Behavior Rules
- show current step clearly
- steps must reflect true flow order
- cannot advance on invalid required input
- each step must have one main purpose
- back navigation must preserve entered data

### Responsive Rules
- desktop can show horizontal step indicator
- mobile uses compact step indicator or progress label
- controls stay reachable without crowding

### Visual Rules
- premium progress treatment using token system
- no noisy progress bars
- clear active/completed/upcoming states

### Content Rules
- step titles plain and short
- helper copy concise
- CTA labels explicit to the step outcome

### Forbidden Patterns
- hidden step count
- vague CTA labels
- mixing unrelated inputs into one overloaded step

---

### Component Name
ValidationStates

### Purpose
Standardize success, error, warning, and helper behavior across all forms.

### Used In
- every form component

### Required Anatomy
- default field state
- focus state
- helper text area
- error state
- success/confirmed state where relevant

### Behavior Rules
- required fields clearly indicated
- error appears near the field
- message explains what to fix
- warning is distinct from error
- success is used sparingly where it adds confidence

### Responsive Rules
- messages wrap cleanly
- field state remains visually obvious on mobile

### Visual Rules
- error uses locked error token
- focus uses locked focus ring token
- success uses locked success token
- no ad hoc form colors

### Content Rules
- human language
- direct fix guidance
- no raw technical validation jargon

### Forbidden Patterns
- error messages only at form top with no field mapping
- using red for helper text without error meaning
- placeholder-only labels

---

### Component Name
PhoneInputTZ

### Purpose
Standardize Tanzanian phone number input and validation.

### Used In
- login
- signup
- customer forms
- affiliate customer capture
- profile/contact editing

### Required Anatomy
- country prefix display fixed to +255
- local number entry
- label
- helper/error region

### Behavior Rules
- default country context is Tanzania
- +255 must be clear and consistent
- formatting guidance must support local expectation
- invalid number pattern must be caught cleanly
- pasted numbers must normalize safely where possible

### Responsive Rules
- touch-friendly
- prefix and local number stay visually clear on mobile

### Visual Rules
- same input style as core form system
- no separate random phone field styling

### Content Rules
- example format must be local and plain
- error message must explain required format simply

### Forbidden Patterns
- freeform international ambiguity in primary Tanzanian flows
- hiding the +255 context
- splitting phone entry into confusing multiple fields

---

### Component Name
AddressForm

### Purpose
Capture and edit customer address details clearly for routing and service accuracy.

### Used In
- customer profile/address
- order creation
- affiliate-assisted customer entry where needed

### Required Anatomy
- contact name if needed by flow
- phone field where needed
- address lines
- area/locality
- zone-linked location fields if supported by current product
- delivery/pickup notes
- validation/help region

### Behavior Rules
- must support the Phase 1 zone-based reality
- field sequence must feel natural for local address entry
- required vs optional fields clearly shown
- long freeform text must not replace structured address essentials
- review summary must be understandable before save/submit

### Responsive Rules
- stack vertically on mobile
- grouped fields stay logically ordered

### Visual Rules
- grouped section card
- clean field spacing
- no cluttered dense address wall

### Content Rules
- labels exact and locally understandable
- helper text only where needed to avoid routing mistakes

### Forbidden Patterns
- relying on one giant textarea for the whole address
- unclear zone/location responsibility
- unlabeled optional note fields

---

## 5) Status Components

### Component Name
StatusBadge

### Purpose
Show compact state information clearly and consistently.

### Used In
- lists
- tables
- detail headers
- KPI cards
- queue views

### Required Anatomy
- label
- optional icon
- background or border treatment from status system

### Behavior Rules
- every operational status maps to one approved badge style
- status wording must come from i18n keys
- badge meaning must stay consistent across all portals

### Responsive Rules
- compact and readable on small widths
- label must not truncate into ambiguity

### Visual Rules
- rounded pill or soft rounded rect
- premium subdued color use
- no cheap default red/green chip styles

### Content Rules
- use approved order/issue status language only

### Forbidden Patterns
- inventing new badge words page by page
- same color meaning different things in different portals

---

### Component Name
Timeline

### Purpose
Present the immutable order truth in a premium, readable, event-based flow.

### Used In
- customer order detail
- affiliate order detail
- hub order detail
- admin order detail

### Required Anatomy
- vertical event line
- event node
- timestamp
- actor/source label
- event title
- optional event notes or proof marker

### Behavior Rules
- latest event clearly visible
- exceptions visually distinguished but still elegant
- event order is chronological and trustworthy
- timeline must support proof events, hub events, delivery events, payment events as already established in Phase 1

### Responsive Rules
- single-column vertical presentation
- event detail stacks cleanly on mobile

### Visual Rules
- gradient or premium accent line with restraint
- soft event cards or grouped event blocks
- latest or key event can receive subtle emphasis

### Content Rules
- titles short and exact
- timestamps human-readable
- no decorative filler text

### Forbidden Patterns
- decorative timeline with weak information density
- collapsing important truth behind hidden accordions by default
- inconsistent event naming

---

### Component Name
SLAChip

### Purpose
Highlight urgency, lateness, or timing sensitivity without overpowering the UI.

### Used In
- hub queues
- admin operations
- affiliate views where timing matters
- selected driver views if needed

### Required Anatomy
- short label
- status tone
- optional icon if required

### Behavior Rules
- indicate on-time, due soon, delayed, or critical states if supported by the data
- urgency language must remain calm and actionable
- chip must support queue scanning

### Responsive Rules
- compact and readable
- should not dominate row layout

### Visual Rules
- subtle but distinct from general status badges
- premium amber/rose/teal tone discipline

### Content Rules
- short timing language only

### Forbidden Patterns
- alarmist language
- oversized urgency banners inside dense queues when a chip is sufficient

---

## 6) Feedback Components

### Component Name
ConfirmDialog

### Purpose
Stop destructive or high-impact actions and force intentional confirmation.

### Used In
- destructive actions
- payout-sensitive actions
- status overrides
- sign out if required
- any irreversible or high-risk operation

### Required Anatomy
- title
- body
- primary confirm action
- secondary cancel action
- optional consequence summary

### Behavior Rules
- use only for meaningful decisions
- body must state what will happen
- destructive actions must be unmistakable
- confirm label must be explicit, never just Confirm

### Responsive Rules
- centered modal on desktop
- full-width sheet or modal on mobile with safe spacing

### Visual Rules
- premium modal surface
- clear hierarchy
- danger styling only when truly destructive

### Content Rules
- direct and calm
- no fear language
- no vague Are you sure? without specifics

### Forbidden Patterns
- using confirm dialog for low-risk actions
- vague confirm button labels
- stacking multiple dialogs

---

### Component Name
Toast

### Purpose
Give lightweight ephemeral feedback for completed actions.

### Used In
- save
- update
- quick state change
- non-blocking success/error feedback

### Required Anatomy
- short message
- optional icon
- optional dismiss
- optional action only if truly useful

### Behavior Rules
- success toasts auto-dismiss
- error toasts remain long enough to read
- toast must never carry critical information only
- no toast flooding from repeated actions

### Responsive Rules
- stack safely without covering critical controls
- remain readable on mobile

### Visual Rules
- premium compact surface
- clear semantic accent
- minimal motion

### Content Rules
- short and exact
- action outcome first

### Forbidden Patterns
- long paragraphs
- multiple stacked noisy toasts
- using toast instead of inline error for form validation

---

### Component Name
InlineAlert

### Purpose
Show contextual warnings, errors, or notices inside the flow.

### Used In
- forms
- detail pages
- finance warnings
- route/permission notices
- queue/problem states

### Required Anatomy
- alert title or strong opening
- short body
- optional supporting action/link

### Behavior Rules
- remains near the relevant content
- severity matches the actual issue
- actionable when possible
- can persist until resolved

### Responsive Rules
- full-width within its container
- text wraps clearly

### Visual Rules
- soft tinted panel
- icon + text
- subtle border from token system

### Content Rules
- explain the issue and next step
- calm, precise wording

### Forbidden Patterns
- global page alarm banners for local issues
- vague warning copy
- overusing alert styles for neutral information

---

## 7) Shared Accessibility Rules

- all interactive controls must be keyboard reachable
- visible focus state is mandatory
- text contrast must remain readable on both light and dark surfaces
- touch targets must remain comfortable on mobile
- icon-only controls require accessible labels
- destructive actions must be distinguishable without relying only on color
- status communication must not depend on color alone
- tables transformed for mobile must preserve the meaning and label of each datum
- dialogs must trap focus correctly and return focus on close
- language toggles and profile controls must remain easy to reach across breakpoints

---

## 8) Shared Interaction Rules

- every screen must present one clear primary action
- page-level CTA takes priority over section-level actions
- row click and row actions must never conflict
- loading states preserve layout stability
- empty states must explain the next real step
- filters must be purposeful and reset predictably
- selected, active, focused, disabled, and error states must follow the shared state model
- permission restrictions must surface as deliberate UX, not broken layouts
- mobile adaptations may reflow structure but may not invent new product logic
- all user-facing text must be served by i18n keys in EN and SW

---

## 9) Component Lock Statement

P2.2 locks this component library as the only approved structural and interaction foundation for Phase 2 implementation.

No upcoming screen may:
- invent a custom shell
- invent one-off structural navigation
- duplicate component purpose
- bypass shared states
- drift away from Midnight Silk visual rules
- introduce component behavior not documented here

Any future expansion must be added by a later approved chapter, not improvised during implementation.
