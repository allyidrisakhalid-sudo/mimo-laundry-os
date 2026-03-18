# Icons v1

## Objective

This document defines the single icon system for Mimo Phase 2 and how icons must be used consistently across public pages and app portals.

## Relationship to P2.0

Icons must support the P2.0 minimal and role-based experience model:

* clear navigation
* calm dashboards
* low visual noise
* direct comprehension
* no decorative clutter

---

## 1. Chosen Icon System

### Locked Icon Set

Use **Lucide** as the single icon system for Phase 2.

## Reason for choice

Lucide supports the Phase 2 direction because it is:

* clean
* modern
* outline-based
* lightweight
* consistent across marketing and app UI
* suitable for operational interfaces

## Rule

No second icon family may be introduced in Phase 2.

---

## 2. Icon Style Rules

### Style

* Outline icons only
* Consistent stroke appearance
* No mixed outline + solid strategy in the same product surface
* Avoid filled decorative icons

### Visual Behavior

* Icons support labels
* Icons do not replace labels
* Icons must improve scanning, not compete with content

---

## 3. Allowed Sizes

* `16px` for compact inline usage
* `20px` for buttons, badges, and secondary nav contexts
* `24px` for sidebar navigation and major action emphasis

## Size Rules

* Use one size consistently within a component type
* Do not scale icons arbitrarily
* Avoid oversized icons in tables or dense operational UI

---

## 4. Where Icons Are Allowed

### Allowed Uses

* sidebar navigation items
* bottom tab items
* primary and secondary action buttons when helpful
* empty states
* status badges in limited cases
* section headings when meaningful
* partner/public marketing features in a restrained way

### Good Examples

* home icon beside Home
* package icon beside Orders
* truck icon beside Dispatch
* wallet/banknote icon beside Cash
* alert-circle beside Exceptions

---

## 5. Where Icons Are NOT Allowed

### Not Allowed

* decorative repetition in cards
* every table cell
* every label in a form
* repeated icon spam inside the same block
* hero sections overloaded with many icons
* icons used only because a space feels empty
* icon-only critical actions without text

### Bad Examples

* putting icons on every KPI card if they add no value
* adding icons to every status label and every button on the same page
* using icons as decoration beside paragraphs
* using different icon metaphors for the same concept on different pages

---

## 6. Accessibility Rules

* Icons must never be the only indicator of meaning
* Status must always include text
* Action buttons must still be understandable without the icon
* Interactive icons must have proper labels/tooltips where required
* Color + icon alone is not enough for critical meaning

---

## 7. Semantic Consistency Rules

### Recommended Core Mappings

* Home  house
* Orders  package
* New order  plus or shopping-bag/package-plus depending on final component choice
* Tasks  list-checks
* Cash / Finance  wallet or banknote
* Dashboard  layout-grid
* Intake  inbox
* Processing  settings-2 or refresh-cw only if literal context fits
* Dispatch  truck
* Exceptions  alert-circle
* Staff  users
* Payouts  receipt or wallet
* Performance  bar-chart-3 only when justified
* Settings  settings
* Audit  shield-check or file-search depending on exact function
* Feature flags  flag
* Logs & jobs  file-text or activity depending on final implementation context

## Semantic Rule

Once an icon is chosen for a concept, keep it consistent across the product.

---

## 8. Visual Restraint Rule

Mimo is not an icon-heavy product.
Text, spacing, hierarchy, and status labels carry most of the clarity.
Icons are only supporting aids.

## Design Lock

Lucide outline icons are locked as the Phase 2 icon system. No new icon family or decorative icon strategy is allowed without explicit approval.
