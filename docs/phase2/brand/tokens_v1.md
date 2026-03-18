# Tokens v1

## Objective

This document defines the locked visual tokens for Mimo Phase 2. These tokens are the single source of truth for all future UI implementation across public pages and role portals.

## Relationship to P2.0

These tokens are designed to support the P2.0 blueprint:

* calm operational dashboards
* minimal public surfaces
* strong readability
* simple bilingual UI
* consistent role-based experiences

## Global Token Rules

* No new token values without a documented brand-kit change request
* No random spacing values outside the scale
* No ad hoc corner radii
* No page-specific color inventions
* Component styles must derive from these tokens only
* Public pages and app portals must share the same token system

---

## 1. Color Palette (Locked)

### Core Brand Colors

| Token                 | Hex       | Usage                                                |
| --------------------- | --------- | ---------------------------------------------------- |
| `color.primary`       | `#0F766E` | Primary brand actions, links, active states          |
| `color.primaryActive` | `#0B5E57` | Pressed/active primary actions                       |
| `color.primarySoft`   | `#E6F4F2` | Soft backgrounds, selected surfaces, calm highlights |
| `color.accent`        | `#F59E0B` | Secondary emphasis, limited highlights               |
| `color.accentSoft`    | `#FFF4DB` | Soft accent backgrounds                              |

### Neutral Surfaces

| Token              | Hex       | Usage                                       |
| ------------------ | --------- | ------------------------------------------- |
| `color.background` | `#F8FAFC` | Global app/page background                  |
| `color.surface`    | `#FFFFFF` | Primary cards, panels, modals               |
| `color.surface2`   | `#F1F5F9` | Secondary surfaces, subtle grouped sections |
| `color.border`     | `#E2E8F0` | Borders, dividers, input outlines           |

### Text Colors

| Token                 | Hex       | Usage                        |
| --------------------- | --------- | ---------------------------- |
| `color.textPrimary`   | `#0F172A` | Main body and heading text   |
| `color.textSecondary` | `#475569` | Supporting text, helper text |
| `color.textDisabled`  | `#94A3B8` | Disabled or inactive text    |

### Status Colors

| Token                 | Hex       | Usage                                      |
| --------------------- | --------- | ------------------------------------------ |
| `color.statusSuccess` | `#15803D` | Success states, paid, completed            |
| `color.statusWarning` | `#D97706` | Warning states, pending attention          |
| `color.statusDanger`  | `#DC2626` | Errors, failed, danger                     |
| `color.statusInfo`    | `#2563EB` | Informational statuses, neutral highlights |

## Color Rationale

* Primary is teal to signal trust, calm, cleanliness, and confidence
* Accent is warm amber for human warmth and selective emphasis
* Neutrals remain soft and bright to keep dashboards readable
* Status colors are clear, standard, and operationally useful

## Color Rules

* Primary color is the default action color
* Accent color must be used sparingly
* Status colors must never replace labels
* Large backgrounds should stay neutral, not saturated
* Customer and staff portals use the same palette
* No role-specific color themes allowed in Phase 2

---

## 2. Typography (Locked)

### Font Family  Web

`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Font Family  Mobile

`Inter, System, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

## Typography Scale

| Token          | Size | Weight | Line Height | Usage                              |
| -------------- | ---- | ------ | ----------- | ---------------------------------- |
| `type.h1`      | 32px | 700    | 40px        | Major page titles, hero headings   |
| `type.h2`      | 24px | 700    | 32px        | Section headings, dashboard titles |
| `type.h3`      | 20px | 600    | 28px        | Card titles, list section titles   |
| `type.body`    | 16px | 400    | 24px        | Default body copy                  |
| `type.small`   | 14px | 400    | 20px        | Helper text, table secondary info  |
| `type.caption` | 12px | 500    | 16px        | Labels, metadata, badges if needed |

## Typography Rules

* Use sentence case throughout
* Use bold weights sparingly
* Use `h1` only once per page
* Use `body` for most interface text
* Keep long paragraphs rare inside portals
* SW copy must preserve readability and not be squeezed into tiny text

## Letter Spacing Rule

* Default letter spacing should remain normal
* Do not artificially widen or compress UI type
* Avoid uppercase menu labels

---

## 3. Spacing Scale (Locked)

Use only the following spacing values:

* `space.4 = 4px`
* `space.8 = 8px`
* `space.12 = 12px`
* `space.16 = 16px`
* `space.20 = 20px`
* `space.24 = 24px`
* `space.32 = 32px`
* `space.40 = 40px`
* `space.48 = 48px`
* `space.64 = 64px`

## Spacing Rules

* Prefer 8-based spacing combinations
* Card padding should usually be 16, 20, or 24
* Section spacing should usually be 24, 32, or 40
* Tight UI elements may use 8 or 12
* No one-off values such as 10, 14, 18, 22, 26, 30 unless future change request approves them

---

## 4. Radii (Locked)

* `radius.8 = 8px`
* `radius.12 = 12px`
* `radius.16 = 16px`
* `radius.20 = 20px`

## Radius Rules

* Inputs, small cards, and buttons typically use 12
* Larger panels may use 16
* Hero or major public blocks may use 20 sparingly
* Do not mix too many radii on the same screen

---

## 5. Shadows and Borders (Locked)

### Shadows

* `shadow.sm = 0 1px 2px rgba(15, 23, 42, 0.06)`
* `shadow.md = 0 6px 20px rgba(15, 23, 42, 0.08)`

### Border Rule

* Default border thickness: `1px`
* Border color: `color.border`

## Shadow Rules

* Use `shadow.sm` for most cards and inputs if needed
* Use `shadow.md` for elevated surfaces like dropdowns or modals
* Do not stack multiple shadow styles
* Most portal UI should rely more on spacing and borders than on strong shadows

---

## 6. Token Usage Guidance by Surface

### Public pages

* Can use more breathing room
* Can use more `primarySoft` and occasional `accentSoft`
* Must still stay restrained and premium-minimal

### Role portals

* Must prioritize neutrality and readability
* White and soft neutral surfaces dominate
* Primary color used mainly for focus, active state, CTA, and controlled emphasis

---

## 7. Lock Rules

* No additional palette branches in Phase 2
* No dark mode in Phase 2 unless separately approved
* No gradient-heavy design language
* No glassmorphism, neon, or ornamental shadows
* No component-level override tokens outside this document without approval

## Design Lock

This file is the single source of truth for Mimo Phase 2 tokens. Future UI chapters must inherit from this file directly.
