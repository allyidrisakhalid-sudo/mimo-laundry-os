# Final UI Cleanup Spec  Mimo Phase 2

## 1) Cleanup Principles

Locked cleanup principles:
- every pixel decision must support clarity
- spacing rhythm must feel deliberate
- icons must feel like one family everywhere
- alignment must feel invisible and clean
- card surfaces must feel consistent
- polish means removing roughness, not adding decoration
- final cleanup must reinforce world-class minimal quality

## 2) Spacing Audit Rules

Spacing audit scope:
- check page gutters
- check section spacing
- check card padding
- check form field spacing
- check table/list spacing
- check modal and drawer spacing
- spacing must reflect token system only
- no random local spacing fixes left in launch flows

Spacing review rules:
- page gutters must feel consistent by device class and route type
- section spacing must clearly separate structure without creating visual drift
- card padding must feel consistent across similar card types and role dashboards
- form field spacing must support readability, scan speed, and input confidence
- table and list spacing must stay dense enough for operations but never cramped
- modal and drawer spacing must preserve hierarchy, focus, and clean action grouping
- token-based spacing must remain the only source of spacing logic in launch flows
- local exceptions must be removed unless system-backed and clearly justified

## 3) Icon Audit Rules

Icon audit scope:
- one icon family only
- consistent size by component context
- no mixed weights or styles
- no decorative icon overuse
- nav icons, action icons, alert icons, and status icons must remain consistent with the icon rules

Icon review rules:
- navigation icons must feel structurally aligned across all role portals
- action icons must support recognition, not become decorative clutter
- alert and status icons must reinforce meaning without overpowering text
- icon size must be consistent within headers, buttons, lists, badges, alerts, and dashboards
- no mixed stroke logic, corner feel, or style families may remain in launch surfaces

## 4) Alignment Audit Rules

Alignment audit scope:
- headers align with content bodies
- buttons align within action groups
- table/list cells align consistently
- icon and label baselines align
- forms align field labels, inputs, and messages cleanly
- dashboard cards align as a system, not as isolated objects

Alignment review rules:
- page titles, summaries, and content edges must feel intentionally shared
- action rows and grouped controls must align cleanly with related surfaces
- table columns, status chips, and row actions must feel stable under real data
- icon-label combinations must maintain clean baseline and spacing relationships
- forms must align labels, fields, helper text, validation, and action areas without visual wobble
- dashboard cards must align as a coordinated layout system rather than independent blocks

## 5) Surface and Card Audit Rules

Surface and card audit scope:
- cards use consistent radius and shadow logic
- dark/light surface hierarchy remains coherent
- no random border treatments
- no inconsistent panel density between similar screens
- key hero cards remain visually dominant where intended:
  - customer active order card
  - driver next task card
  - hub scanner/intake active surface
  - affiliate create-order focus area
  - admin action queue
  - DevAdmin health/failure awareness panels

Surface review rules:
- surface hierarchy must preserve the Midnight Silk balance of deep anchors, silk-white reading surfaces, and restrained accent emphasis
- radius and shadow behavior must feel system-defined, not screen-specific
- border use must remain deliberate and consistent across cards, panels, modals, and tables
- similar functional screens must not have noticeably different density or weight without purpose
- hero surfaces must remain dominant through structure and hierarchy, not noise or decoration

## 6) Visual Consistency Rules

Locked visual consistency rules:
- every role portal must still feel part of one product
- role differences come from workflow, not a different design system
- public, portal, support, and admin surfaces must all feel like one coherent brand
- final cleanup should remove visual drift, not introduce new ideas

Visual consistency review rules:
- public pages must connect visually to product portals without duplicating portal density
- support surfaces must inherit the same calm hierarchy and token discipline as core product flows
- admin and DevAdmin may feel denser, but must still remain recognizably Mimo
- visual cleanup must use existing design tokens, component rules, icon rules, and surface logic
- no new decorative patterns, visual experiments, or off-system styling may enter during cleanup

## 7) Cleanup Lock Statement

The final UI cleanup pass is locked as a system-discipline review across the full Mimo product. Every spacing, icon, alignment, and surface decision must reinforce clarity, consistency, and premium restraint under the Midnight Silk direction. Launch quality is only acceptable when visual roughness is deliberately removed, system drift is closed, and all role experiences feel like one world-class minimal product.
