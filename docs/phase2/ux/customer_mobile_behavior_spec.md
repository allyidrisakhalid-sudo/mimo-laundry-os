# Customer Mobile Behavior Spec  Mimo Phase 2

## 1) Mobile Principles

Locked mobile principles:
- thumb-friendly
- scan-first
- one-column clarity
- active order first
- payment and support always reachable
- no dense desktop carryover
- portal feels native-quality on mobile web

## 2) Bottom Tab Behavior

Bottom tabs for customer mobile must match the approved navigation exactly:
- Home
- Orders
- Profile

Rules:
- Home is the default landing tab after customer portal entry
- Orders provides direct access to history and order list views without replacing order-detail truth
- Profile remains a simple utility destination
- tabs must remain stable and predictable
- no extra temporary tabs should be added for wizard, payment, or support
- order wizard may open from Home or Orders context but does not become a permanent bottom tab item

## 3) Home Mobile Behavior

- active order card appears before recent history
- Start new order remains clearly reachable
- support entry remains visible without taking over the page

Additional home mobile rules:
- the active order card should be visible with minimal initial scroll
- current status, next action, and view-order CTA must be easy to scan
- if payment is due, payment visibility should appear within the active order card or immediately adjacent action area
- recent orders should stack as compact rows, not heavy cards
- the page should avoid dashboard density, multiple hero areas, or wide desktop spacing patterns

## 4) Order Wizard Mobile Behavior

- compact step progress
- large selectors for service path and tier
- form fields stacked
- review summary remains short and readable
- primary CTA always reachable

Additional wizard mobile rules:
- step progress should remain informative without consuming excessive vertical space
- selectors should support confident thumb use and quick comparison
- address fields should use touch-friendly inputs with clear labels
- schedule controls should avoid complicated embedded calendars where simpler patterns work
- CTA placement may be sticky or visually persistent only when it improves clarity and does not obstruct form content

## 5) Order Detail Mobile Behavior

- summary first
- timeline second
- payment/support sections reachable without confusion
- avoid deep nested card stacks

Additional order detail mobile rules:
- order summary should present reference, tier, path, and current status at the top
- timeline entries must remain readable and vertically scannable
- invoice/payment should appear as a single clear section rather than fragmented rows scattered across the page
- support entry must be obvious and nearby, but not louder than the main order truth
- related details such as address or shop context should sit lower in the content hierarchy

## 6) Profile Mobile Behavior

- grouped sections in logical order
- addresses manageable without clutter
- language/help/logout remain easy to find

Additional profile mobile rules:
- account section should be compact and practical
- saved addresses should support clear add/edit/remove actions without long nested UI
- receipts/documents should show as a usable list, not a dense archive wall
- language selector should be simple, visible, and understandable
- help and logout should appear in the lower section with calm visual treatment

## 7) Mobile State and Performance Rules

- loading states preserve structure
- no oversized decorative media
- no dense multi-column layouts
- sticky or persistent CTA behavior may be used only if it improves clarity and does not cover content
- customer portal must feel fast and readable on everyday mobile devices

Additional state and performance guidance:
- skeletons should match final content shape closely enough to reduce perceived jumpiness
- empty states must remain short, action-oriented, and visually calm
- retry and offline moments should preserve context and avoid forcing the user back to the start
- images, decorative art, or large promotional surfaces must not delay access to core order actions
- mobile layout must prioritize speed, readability, and single-purpose sections over visual excess

## 8) Mobile Lock Statement

The customer portal mobile behavior is locked as a fast, thumb-friendly, one-column interpretation of the same customer product model used on web. Home prioritizes the active order, the wizard stays compact and touch-ready, order detail remains the single source of truth, and profile stays light and practical. The mobile experience must feel native-quality, calm, and production-usable on everyday devices.
