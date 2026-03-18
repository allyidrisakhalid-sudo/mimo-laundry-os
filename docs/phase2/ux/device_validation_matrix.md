# Device Validation Matrix  Mimo Phase 2

## 1) Purpose

This matrix defines the target-device expectations and pass criteria for each Phase 2 role journey so launch validation measures real usability on the device contexts that matter in production.

## 2) Target Device Matrix

Locked target device matrix:
- Customer:
  - mobile primary
  - laptop secondary
- Driver:
  - mobile primary
- Hub Staff:
  - tablet primary
  - laptop secondary
- Affiliate Staff:
  - tablet/web primary
- Affiliate Admin:
  - tablet/web primary
- Admin:
  - laptop/desktop primary
- DevAdmin:
  - laptop/desktop primary

## 3) Role-to-Device Expectations

Locked role-to-device expectations:
- what usable means for each role/device
- no desktop density on mobile-first roles
- no mobile oversimplification on desktop-first roles
- touch targets validated where tablet/mobile matters
- readability validated where table/list density matters

Usability interpretation by role:
- Customer on mobile must be able to understand the service, create an order, review status, and raise support without dense layouts, hidden actions, or difficult touch targets.
- Customer on laptop may have more width, but the journey must still remain simple and not introduce duplicate navigation or secondary flows that compete with the primary path.
- Driver on mobile must see the next task immediately, complete stop proof quickly, and handle cash and retry states without cramped controls or excessive scrolling.
- Hub Staff on tablet must be able to scan, review queues, move work across boards, and dispatch without tiny controls or crowded stage views.
- Hub Staff on laptop may use denser data views, but queue priority, board readability, and dispatch flow must remain operationally clear.
- Affiliate Staff on tablet/web must be able to create walk-in orders, manage pickup and handover states, and review scoped lists with comfortable touch and readable lists.
- Affiliate Admin on tablet/web must be able to review finance visibility and own-shop scope cleanly without being forced into dense admin-style control surfaces.
- Admin on laptop/desktop must be able to review KPIs, queues, pricing, finance, and oversight surfaces in an organized, high-density layout without clutter.
- DevAdmin on laptop/desktop must be able to inspect health, jobs, flags, overrides, and activity in structured, guardrail-heavy views that prioritize clarity over raw engineering density.

## 4) Device-Specific Pass Criteria

Locked device-specific pass criteria:

### Mobile
- next action visible quickly
- no horizontal scrolling
- tap targets comfortable
- critical forms and actions reachable

### Tablet
- queue/board layouts remain readable
- touch use is practical
- no tiny controls

### Desktop
- high-density views remain organized
- primary actions remain easy to find
- tables/filters do not become cluttered

## 5) Evidence Capture Rules

Locked evidence capture rules:
- capture at least one screenshot per critical step per role
- note device type used
- note any friction, confusion, or extra-tap problems
- note any role-permission leakage immediately

## 6) Device Matrix Lock Statement

The Phase 2 device validation matrix is locked as the device-readiness standard for role journey testing. A role only passes when the intended workflow feels correct on the intended device class, not merely when the screens technically render.
