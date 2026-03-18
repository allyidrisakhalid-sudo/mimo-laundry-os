# Performance Baseline Spec  Mimo Phase 2

## 1) Performance Principles

- mobile performance first
- fast understanding before decoration
- performance supports trust and conversion
- public pages must ship only what they need
- every visual enhancement must justify its cost
- SEO and UX both depend on speed and stability

## 2) Public Route Performance Scope

This baseline applies to:
- /
- /track
- /partners
- /help
- /login
- /signup
- /terms
- /privacy
- /refund-policy

Scope discipline:
- all public pages should remain lean and easy to understand on common mobile devices
- public legal and utility pages should be especially lightweight
- app portal performance is important but is not the subject of this P2.4 baseline

## 3) Core Web Vitals Baseline Rules

- layout stability is mandatory
- above-the-fold content must appear quickly
- avoid render-blocking clutter
- avoid large offscreen asset waste
- avoid heavy client-side marketing bloat
- no autoplay video
- no decorative background media that delays meaning
- reserve image and card space to reduce CLS
- keep interactive controls usable quickly on mobile

Additional Core Web Vitals discipline:
- prioritize stable initial rendering for hero, CTA, cards, and forms
- public pages must not depend on unnecessary client-side hydration for basic understanding
- reduce layout shifts from images, icons, fonts, and asynchronous content injection
- keep the first meaningful screen calm, readable, and operationally clear

## 4) Asset Weight Rules

- public pages must avoid unnecessary libraries
- reuse one component system
- avoid one-off heavy widgets
- keep hero visuals lightweight
- keep icon usage vector-based and disciplined
- legal/help pages must remain especially lightweight

Asset discipline:
- prefer reusable shared UI primitives already locked in Phase 2
- avoid loading separate marketing-only dependencies for simple presentation tasks
- remove decorative assets that do not help comprehension or conversion
- do not add third-party scripts without a clear operational reason

## 5) Image Rules

- all images optimized
- responsive sizing
- no oversized hero image payloads
- imagery optional, not required for comprehension
- decorative visuals must not block CTA visibility

Image discipline:
- reserve image dimensions to reduce CLS
- use imagery sparingly and only where it strengthens brand trust or page clarity
- homepage/social-preview support assets should stay visually premium but payload-aware
- legal, help, login, and signup pages should not depend on heavy imagery

## 6) Font Rules

- only approved font pair from P2.1
- limit font weights loaded
- avoid loading many variants
- preserve premium typography while staying lightweight

Font discipline:
- typography must remain elegant without creating network waste
- do not load decorative alternates or unused weights
- keep fallback behavior stable to reduce layout shift

## 7) JavaScript and Interaction Rules

- static-first where possible for public pages
- interactive behavior only where useful
- forms and menu interactions must remain lean
- avoid animation-heavy libraries for public marketing experience
- tracking form should remain functionally simple and fast

Interaction discipline:
- navigation, forms, and disclosure patterns should stay minimal
- do not add motion systems that delay understanding or increase bundle weight
- any interactive enhancement must improve usability clearly
- public pages should degrade gracefully if network conditions are weak

## 8) Lighthouse Verification Rules

- run Lighthouse on public routes
- verify indexability and basic best-practice readiness
- verify performance does not collapse on mobile simulation
- verify SEO fundamentals are present
- capture screenshots or outputs as evidence

Baseline acceptance expectation:
- public pages must pass baseline Lighthouse checks sufficiently to show no major structural SEO/performance failure
- if one page underperforms, the cause must be identified and logged before moving on

Verification evidence expectations:
- capture route-by-route outputs or screenshots for the public route set
- record any recurring weakness such as heavy image payload, script cost, or layout shift source
- treat Lighthouse as a diagnostic proof step, not theater

## 9) Performance Lock Statement

The public-site performance baseline is locked to a mobile-first, static-first, premium-minimal standard. Public pages must remain fast to understand, visually stable, and lightweight enough to support trust, conversion, and clean indexability. Decorative complexity must never outrun meaning.
