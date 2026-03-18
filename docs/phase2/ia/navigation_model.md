# Navigation Model  Mimo Phase 2

## 1) Purpose

This file locks the navigation patterns that implementation must follow across public and portal surfaces.

## 2) Public Web Header Rules

The public website uses a simple header model.

Required header items:
- logo / home
- track
- partners
- help
- login
- signup

Rules:
- do not overload the header with secondary/legal items
- legal links belong in the footer
- header must point only to live top-level public pages
- no dead links
- no duplicate nav items for the same destination

## 3) Role Sidebar Rules

Portal web/tablet layouts use a role sidebar as the primary in-app navigation pattern.

Rules:
- sidebar items must reflect only the signed-in role's allowed sections
- forbidden actions must not appear in sidebar navigation
- detail pages do not become permanent sidebar items
- the sidebar must remain stable and predictable per role
- role portals must not link laterally to other role portals

Expected sidebar behavior by portal:
- /app/customer:
  - customer home
  - orders
  - account
- /app/driver:
  - today
  - tasks
  - account
- /app/hub:
  - dashboard
  - intake
  - processing
  - dispatch
- /app/affiliate:
  - dashboard
  - new order
  - orders
  - summary
- /app/admin:
  - dashboard
  - orders
  - network
  - finance
  - support
- /app/dev:
  - dashboard
  - jobs
  - flags
  - overrides
  - activity

## 4) Customer and Driver Mobile Bottom Tabs

Only customer and driver mobile experiences use bottom tabs.

### Customer mobile tabs
- home
- orders
- account

### Driver mobile tabs
- today
- tasks
- account

Rules:
- bottom tabs must mirror real top-level role structure
- bottom tabs must not include detail pages
- detail flows open from a list/dashboard and return back into the tab structure
- no extra mobile nav system should be invented for these roles

## 5) Detail Page Navigation Rule

Detail pages are reachable from list, queue, table, or dashboard surfaces but are not promoted as permanent navigation destinations.

Examples:
- order detail
- stop detail
- qc/detail
- individual support case

## 6) Forbidden Navigation Patterns

- no role sees links for forbidden actions
- no alternate nav system replaces sidebar/tabs without explicit later approval
- no dead menu items
- no duplicate entry points for the same permanent destination
- no detail page promoted as a permanent nav item

## 7) Implementation Lock Statement

Header, role sidebar, and customer/driver bottom tabs are the source-of-truth navigation systems for Phase 2 implementation.
