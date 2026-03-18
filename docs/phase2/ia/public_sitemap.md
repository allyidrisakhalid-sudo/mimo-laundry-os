# Public Sitemap  Mimo Phase 2

## 1) Purpose

This file locks the minimal public site structure for implementation so the marketing surface stays clear, non-redundant, and fast to understand.

## 2) Locked Core Public Routes

- /
- /track
- /partners
- /help
- /login
- /signup

## 3) Route Purpose Model

### /
- purpose:
  - landing page for value proposition, how it works, trust, service area cues, and primary conversion
- primary action:
  - start an order or continue into login/signup as appropriate

### /track
- purpose:
  - allow a user to check order status without turning other pages into tracking pages
- primary action:
  - submit tracking identifier and open order progress result

### /partners
- purpose:
  - recruit affiliate partners without duplicating login/signup or help center structure
- primary action:
  - start partner inquiry/contact flow

### /help
- purpose:
  - central support and FAQ surface with WhatsApp/contact guidance
- primary action:
  - resolve common question or start support contact

### /login
- purpose:
  - role-aware authentication entry
- primary action:
  - sign in

### /signup
- purpose:
  - public customer account creation only
- primary action:
  - create customer account

## 4) Legal / Footer Policy Routes

These routes are required but are not part of the six core marketing pages:

- /terms
- /privacy
- /refund-policy

Rules:
- legal pages live as footer/policy routes
- legal pages do not become marketing-core pages
- legal pages do not duplicate FAQ, help, tracking, or auth behavior

## 5) Explicit Exclusions

- no separate pricing page in this chapter
- no duplicate support page outside /help
- no duplicate tracking behavior on home/help pages
- no extra marketing routes before later approval
- no public route should duplicate another route's main purpose

## 6) Implementation Lock Statement

The public sitemap is now locked as a minimal implementation-safe structure for the Phase 2 public website.
