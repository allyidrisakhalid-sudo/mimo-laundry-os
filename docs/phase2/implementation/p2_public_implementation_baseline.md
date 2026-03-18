# P2 Public Implementation Baseline

## 1) Purpose

- This file converts the approved P2.3 public experience into the implementation control layer for all public-facing website work.

## 2) Locked Public Routes

- /
- /track
- /partners
- /help
- /terms
- /privacy
- /refund-policy

## 3) Locked Public Header Model

- logo left
- Track
- Partners
- Help
- language toggle
- Login
- Start now
- no extra top-level items

## 4) Locked Public Footer Model

- Home
- Track Order
- Partners
- Help
- Login
- Sign Up
- Terms
- Privacy
- Refund Policy
- support/WhatsApp area
- no giant sitemap

## 5) Locked WhatsApp / Contact Model

- use +255788558975 as the public support/WhatsApp CTA number
- support CTA appears in the defined public locations only
- no spammy floating takeover behavior

## 6) Locked Public Content Structure

- home owns the service story
- track owns tracking entry
- partners owns affiliate recruitment
- help owns support guidance
- legal pages own policy detail
- no duplicate page function allowed

## 7) Implementation Guardrails

- no extra marketing routes
- no duplicate FAQ on multiple public pages
- no blog/news surface in this chapter
- no giant hero clutter
- no hardcoded copy outside translation system
- no local page styling that bypasses the shared token/component layer

## 8) Downstream Dependency Rule

- later SEO/auth/public refinements must preserve this route and content ownership model

## 9) Baseline Lock Statement

- The Phase 2 public implementation baseline is now the single source of truth for the public website.

## Phase 2 Backend Support Note

- During P2.3 verification, repo-wide typecheck failed in apps/api on pre-existing backend issues unrelated to public route installation.
- Observed blockers:
  - scripts/repair-auth-phones.ts imports a missing member from @prisma/client
  - src/dev.ts references sendJson at two locations without a valid in-scope definition
- These must be handled as Phase 2 Backend Support and not silently folded into public frontend implementation work.

