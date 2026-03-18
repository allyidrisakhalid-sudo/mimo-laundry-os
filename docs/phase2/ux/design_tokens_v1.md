# Design Tokens V1  Mimo Phase 2

## 1) Token Principles

- one system across all roles and public pages
- dark framing + light reading surfaces
- premium contrast without harshness
- rounded geometry everywhere
- gradients used with restraint
- cards are the signature surface
- operational readability always wins
- no local page token inventions
- no ad hoc color substitutions

## 2) Color System

### Foundation Darks
- color.obsidian = #0B1020
- color.midnight = #121A2F
- color.ink = #1C2740

### Foundation Lights
- color.silk = #F8F7F4
- color.cloud = #F1EFEA
- color.mist = #E7E3DB

### Accents
- color.champagne = #D6B36A
- color.teal = #3AB8B2
- color.royal = #6F8CFF
- color.plum = #7B61A8

### Semantic
- color.success = #24A36A
- color.warning = #E6A23C
- color.error = #D95C75
- color.info = #4E8DFF

### Neutral Text
- color.text.primary = #101828
- color.text.secondary = #475467
- color.text.inverse = #FFFFFF
- color.text.muted = #667085

### Light Surfaces
- color.surface.base = #F8F7F4
- color.surface.panel = #FCFBF8
- color.surface.card = #FFFFFF
- color.surface.soft = #F5F3EE

### Dark Surfaces
- color.surface.dark.base = #0B1020
- color.surface.dark.panel = #121A2F
- color.surface.dark.card = #1C2740

### Border Tones
- color.border.light = rgba(16,24,40,0.08)
- color.border.medium = rgba(16,24,40,0.12)
- color.border.dark = rgba(255,255,255,0.08)

### Interactive
- color.focus.ring = rgba(58,184,178,0.14)
- color.hover.light = rgba(16,24,40,0.04)
- color.hover.dark = rgba(255,255,255,0.06)

## 3) Gradient System

- gradient.midnightAurora = linear-gradient(135deg, #0B1020 0%, #121A2F 35%, #1B2B4B 65%, #3A476B 100%)
- gradient.champagneTide = linear-gradient(135deg, #D6B36A 0%, #E7C98A 45%, #F4E2B8 100%)
- gradient.tealSilk = linear-gradient(135deg, #3AB8B2 0%, #6F8CFF 100%)
- gradient.velvetDepth = radial-gradient(circle at top left, rgba(123,97,168,0.22), rgba(58,184,178,0.08), transparent 60%)

Gradient rules:
- midnightAurora: hero, auth, premium shells, dark sidebars
- champagneTide: premium highlight only
- tealSilk: active emphasis, progress, selected highlights
- velvetDepth: atmospheric overlay only
- never apply gradients to long-form reading backgrounds
- never use more than one dominant gradient in the same view

## 4) Typography System

### Font Families
- font.heading = "Plus Jakarta Sans", system-ui, sans-serif
- font.body = "Inter", system-ui, sans-serif
- font.mono = "ui-monospace", "SFMono-Regular", "SF Mono", Consolas, monospace

### Heading Font Usage
- page titles
- hero headings
- dashboard section headers
- large metrics

### Body Font Usage
- paragraphs
- tables
- labels
- forms
- buttons
- microcopy

### Type Scale
- type.display.xl = 56/64/700
- type.display.l = 44/52/700
- type.h1 = 36/44/700
- type.h2 = 28/36/700
- type.h3 = 22/30/600
- type.h4 = 18/26/600
- type.body.l = 16/26/400
- type.body.m = 14/22/400
- type.body.s = 12/18/500
- type.label.xs = 11/16/600

Typography rules:
- use heading font sparingly
- use Inter for dense operational UI
- use tabular figures where supported for finance and KPIs
- never use more than two font families
- never use decorative serif fonts

## 5) Spacing System

- space.1 = 4
- space.2 = 8
- space.3 = 12
- space.4 = 16
- space.5 = 20
- space.6 = 24
- space.8 = 32
- space.10 = 40
- space.12 = 48
- space.16 = 64
- space.20 = 80
- space.24 = 96

Spacing rules:
- 8-point base system
- customer/public pages use more breathing room
- ops dashboards use tighter rhythm but never cramped
- card padding defaults must be consistent
- section spacing must not vary randomly page to page

## 6) Radius System

- radius.xs = 8
- radius.sm = 12
- radius.md = 16
- radius.lg = 20
- radius.xl = 24
- radius.pill = 999

Usage rules:
- inputs and buttons default to 1416 visual feel using radius.sm or radius.md depending on component size
- standard cards use radius.md
- featured panels use radius.lg
- modals use radius.xl
- badges/chips use radius.pill
- sharp corners are not allowed in Phase 2 primary UI

## 7) Shadow System

### Light Mode
- shadow.card.rest = 0 10px 30px rgba(15, 23, 42, 0.06)
- shadow.card.hover = 0 16px 40px rgba(15, 23, 42, 0.10)
- shadow.floating = 0 24px 70px rgba(15, 23, 42, 0.16)

### Dark Mode
- shadow.dark.rest = 0 10px 30px rgba(0, 0, 0, 0.24)
- shadow.dark.hover = 0 20px 50px rgba(0, 0, 0, 0.34)

Rules:
- shadows must feel soft and premium
- no harsh card drop shadows
- no neon glows except subtle gradient aura in featured moments
- shadows are for depth, not drama

## 8) Border System

- border.light = 1px solid rgba(16,24,40,0.08)
- border.medium = 1px solid rgba(16,24,40,0.12)
- border.dark = 1px solid rgba(255,255,255,0.08)
- border.focus = 1px solid rgba(58,184,178,0.45)

Rules:
- thin borders only
- no thick card outlines
- dark cards use soft luminous edge treatment where needed
- border color must come from token list only

## 9) Motion System

### Durations
- motion.fast = 120ms
- motion.normal = 180ms
- motion.panel = 240ms
- motion.section = 280ms

### Motion Easing
- ease.standard = cubic-bezier(0.2, 0.8, 0.2, 1)

Motion rules:
- motion must feel smooth, not bouncy
- hover = subtle lift/fade
- modal/drawer = fade + lift
- page transitions = calm and fast
- no playful spring animations
- operational flows must stay responsive and efficient

## 10) Surface Hierarchy

- surface.0 = page background
- surface.1 = section panel
- surface.2 = card
- surface.3 = floating element / modal / drawer / sticky action area

State:
- reading-heavy content uses light surfaces
- premium framing uses dark surfaces
- cards are used to separate action groups
- dashboards use dark sidebar + light workspace where applicable

## 11) Token Usage Rules

- all future components must reference these tokens
- no component may invent new radii, shadows, or colors
- every app portal and public page must look like one system
- semantic colors must not replace brand accents
- gradients are reserved for brand emphasis, not default fills
- dense tables and forms must prefer clarity over ornament

## 12) Token Lock Statement

### P2.1 Token Lock

These tokens are final for Phase 2 unless a later chapter explicitly supersedes them through a documented change.
