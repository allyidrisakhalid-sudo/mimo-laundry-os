# Customer Order Wizard Spec  Mimo Phase 2

## 1) Wizard Principles

Locked wizard principles:
- order creation must feel short and obvious
- one decision group per step
- no information overload
- service channel must be understood immediately
- tier choice must be understandable in plain language
- schedule choice must feel practical
- review must confirm the customers choices before submit
- the flow must support Door, Shop, and Hybrid without confusion
- no hidden fees or surprise terminology
- the wizard must feel premium but fast

## 2) Route Model

- entry from /app/customer via Start new order CTA
- wizard lives inside customer portal context
- detail step routes may be implementation-specific, but must follow one deterministic flow
- wizard is not a top-level permanent sidebar destination

Recommended implementation model:
- `/app/customer/new`
- `/app/customer/new/service-path`
- `/app/customer/new/tier`
- `/app/customer/new/handoff`
- `/app/customer/new/schedule`
- `/app/customer/new/review`

Equivalent implementation is allowed if the route sequence remains deterministic, breadcrumb-free, and clearly inside customer portal context.

## 3) Step Structure

Locked step structure:
- Step 1: Service path
- Step 2: Service speed / tier
- Step 3: Address or shop handoff details
- Step 4: Schedule
- Step 5: Review and submit

## 4) Step-by-Step Spec

### Step 1: Service path

#### Purpose
- let the customer choose how the order moves

#### Options
- Door
- Shop
- Hybrid

#### Rules
- each option has a short plain-language explanation
- one option only
- no jargon wall
- use premium selection cards or segmented options

#### Primary CTA
- Continue

#### Interaction notes
- the selected path should immediately shape later copy and handoff requirements
- a short helper line may explain the difference between pickup/delivery, shop handoff, and mixed return model
- the step should visually feel decisive, not crowded

### Step 2: Service speed / tier

#### Purpose
- let the customer choose turnaround expectation

#### Options
- Standard
- Express
- Same-day

#### Rules
- each tier has one-line explanation
- if pricing or fee cues are shown, they must be concise and honest
- do not bury the meaning of the choice

#### Primary CTA
- Continue

#### Interaction notes
- the customer must understand time expectation before tapping continue
- any unavailable tier may be disabled with concise explanation
- tier should never be presented as vague marketing language

### Step 3: Address or shop handoff details

#### Purpose
- capture the operational location details required by the chosen service path

#### Rules by path
- Door:
  - capture pickup/delivery address details
- Shop:
  - capture or confirm selected shop handoff context
- Hybrid:
  - capture both handoff and return expectations as required by the product model

#### Rules
- use approved AddressForm behavior where address applies
- keep fields minimal and clear
- no giant map dependency
- no giant freeform text area replacing structure

#### Primary CTA
- Continue

#### Interaction notes
- Door should favor a structured address form with common fields only
- Shop should prioritize known shop selection or confirmation rather than excessive form entry
- Hybrid should make the split model easy to understand, especially where dropoff and return differ
- any optional note field must remain secondary and short

### Step 4: Schedule

#### Purpose
- let the customer choose or confirm timing cleanly

#### Rules
- show the relevant pickup/dropoff schedule choice in a practical format
- use plain labels
- do not overwhelm with too many calendar/time controls
- if the backend supports constrained slots, surface them clearly

#### Primary CTA
- Continue

#### Interaction notes
- schedule UI should feel like picking a practical window, not planning a complex trip
- the UI may use date chips, time windows, or simplified selectors
- where timing is partly fixed by the chosen shop or service model, the UI should confirm rather than over-ask

### Step 5: Review and submit

#### Purpose
- confirm the full order before creation

#### Required Review Blocks
- service path
- selected tier
- address/shop details
- schedule
- price/summary block if available

#### Primary CTA
- Place order

#### Secondary Action
- Back

#### Rules
- review must feel complete but short
- customer should not need to jump between many screens to verify the order
- support one final edit-back path before submit

#### Interaction notes
- each review block should be scannable and easy to trust
- one edit-back behavior may return the user to the relevant step while preserving prior data
- a short post-submit expectation line should explain what happens next

## 5) Summary and Review Rules

- show one consolidated summary
- avoid duplicate repeated information
- pricing presentation must stay aligned with Phase 1 truth
- customer should understand what happens next after submission

Additional review guidance:
- the review page should not repeat decorative explanations from earlier steps
- service path, tier, handoff details, and schedule should appear in a fixed order
- any pricing shown must match the real product rules and avoid implied guarantees the backend cannot support
- the submit moment should feel confident and final, not ambiguous

## 6) Validation and Recovery Rules

- each step validates only what matters for that step
- back action preserves data
- invalid field states are local and clear
- wizard must recover gracefully if interrupted
- no data loss on ordinary navigation within the wizard

Additional validation guidance:
- service path and tier require clear selection before continue
- address or shop details validate only the fields required for the selected model
- schedule validates availability or required timing inputs only
- interrupted progress may be restored in-session where feasible
- error messaging must remain short, local, and helpful rather than global and alarming

## 7) Mobile Rules

- one-column flow
- step indicator compact and calm
- CTA fixed or easily reachable
- review screen remains scannable
- address and schedule inputs remain touch-friendly

Additional mobile guidance:
- large tap targets are required for service path and tier selection
- long forms must not appear on a single step without clear structure
- input focus and keyboard behavior should not hide the primary CTA permanently
- review blocks should stack with calm spacing and minimal dense text

## 8) Wizard Lock Statement

The customer order wizard is locked as the premium transaction path for the customer portal. It supports Door, Shop, and Hybrid through one short, deterministic flow with clear tier, handoff, schedule, and review steps. The experience avoids jargon, unnecessary complexity, and hidden costs. It is designed to feel fast, trustworthy, and production-usable on both web and mobile.
