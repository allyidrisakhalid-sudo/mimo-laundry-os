# Role to Portal Map  Mimo Phase 2

## 1) Purpose

This file locks the role-to-portal routing model for Phase 2 implementation. Auth routing, portal entry, UI guards, and forbidden access handling must follow this mapping exactly.

## 2) Locked Role to Portal Mapping

- CUSTOMER -> /app/customer
- DRIVER -> /app/driver
- HUB_STAFF -> /app/hub
- AFFILIATE_STAFF -> /app/affiliate
- AFFILIATE_ADMIN -> /app/affiliate
- ADMIN -> /app/admin
- DEV_ADMIN -> /app/dev

## 3) Allowed Sections by Role

### CUSTOMER
- allowed portal:
  - /app/customer
- allowed sections:
  - customer home
  - order creation
  - active order tracking
  - order history
  - account/profile

### DRIVER
- allowed portal:
  - /app/driver
- allowed sections:
  - driver today dashboard
  - assigned tasks/stops
  - stop detail
  - proof capture
  - driver earnings/cash summary if implemented in scope

### HUB_STAFF
- allowed portal:
  - /app/hub
- allowed sections:
  - hub dashboard
  - intake
  - processing board
  - qc/detail
  - dispatch/assignment view

### AFFILIATE_STAFF
- allowed portal:
  - /app/affiliate
- allowed sections:
  - affiliate dashboard
  - create walk-in order
  - shop orders list
  - order detail
  - pickup/drop workflow

### AFFILIATE_ADMIN
- allowed portal:
  - /app/affiliate
- allowed sections:
  - all affiliate staff sections
  - affiliate finance summary
  - shop-level operational summary

### ADMIN
- allowed portal:
  - /app/admin
- allowed sections:
  - admin dashboard
  - orders oversight
  - network/pricing controls
  - finance/reconciliation
  - support/exception management

### DEV_ADMIN
- allowed portal:
  - /app/dev
- allowed sections:
  - platform health
  - failed jobs/tools
  - feature flags
  - override tools
  - activity log

## 4) Forbidden Sections by Role

### CUSTOMER
- forbidden sections:
  - /app/driver
  - /app/hub
  - /app/affiliate
  - /app/admin
  - /app/dev

### DRIVER
- forbidden sections:
  - /app/customer
  - /app/hub
  - /app/affiliate
  - /app/admin
  - /app/dev

### HUB_STAFF
- forbidden sections:
  - /app/customer
  - /app/driver
  - /app/affiliate
  - /app/admin
  - /app/dev

### AFFILIATE_STAFF
- forbidden sections:
  - /app/customer
  - /app/driver
  - /app/hub
  - /app/admin
  - /app/dev

### AFFILIATE_ADMIN
- forbidden sections:
  - /app/customer
  - /app/driver
  - /app/hub
  - /app/admin
  - /app/dev

### ADMIN
- forbidden sections:
  - /app/customer
  - /app/driver
  - /app/hub as a direct staff workspace
  - /app/affiliate as a direct shop workspace
  - /app/dev unless separately authorized as DEV_ADMIN

### DEV_ADMIN
- forbidden sections:
  - /app/customer
  - /app/driver
  - /app/hub as a staff workspace
  - /app/affiliate as a shop workspace
  - /app/admin unless separately authorized as ADMIN

## 5) One Primary Action per Role

- CUSTOMER -> create and track an order
- DRIVER -> complete assigned stops with proof
- HUB_STAFF -> move orders through intake, processing, qc, and dispatch
- AFFILIATE_STAFF -> create and manage shop-scoped orders
- AFFILIATE_ADMIN -> run shop operations and review affiliate-level summary
- ADMIN -> operate the business from one command center
- DEV_ADMIN -> monitor and control platform health safely

## 6) Acceptance Examples for Forbidden Access

- if CUSTOMER attempts to open /app/admin, return 403 or route to authorized portal only
- if DRIVER attempts to open /app/hub, return 403 or route to authorized portal only
- if HUB_STAFF attempts to open /app/affiliate, return 403 or route to authorized portal only
- if AFFILIATE_STAFF attempts to open another privileged portal, return 403 or route to /app/affiliate only
- if ADMIN attempts to open /app/dev without DEV_ADMIN permission, return 403
- if DEV_ADMIN attempts to open /app/admin without ADMIN permission, return 403

## 7) Lock Rule

Route names, role names, and portal ownership rules are locked in this chapter and must not be changed here.
