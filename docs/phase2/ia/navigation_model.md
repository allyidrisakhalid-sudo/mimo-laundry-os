# Navigation Model

## Objective

This document defines navigation patterns for web and mobile in Phase 2. Navigation must be role-based, minimal, and dead-link free.

## Global Rules

* Navigation must only show what the role can access
* No dead links
* No hidden future menu items
* No duplicate destinations under different labels
* The current page must always be visually clear
* Primary action visibility must remain strong even when navigation is minimal

---

## Web Navigation Model (`/app/*`)

### Header (all portals)

The app header must contain only:

* Mimo logo
* current workspace or portal label if needed
* language toggle (EN/SW)
* notification entry only if useful for that role
* profile menu
* logout

The app header must NOT contain:

* marketing navigation
* duplicate sidebar items
* more than one prominent CTA
* unrelated shortcuts

### Sidebar Principles

* Sidebar is the main app navigation for web
* Sidebar items must be role-specific
* Maximum of 46 primary items for most roles
* Secondary utility items may appear grouped at the bottom
* Icons must be consistent and minimal
* Labels must be short and literal

---

## Sidebar by Role

### CUSTOMER sidebar

* Home
* Orders
* New Order
* Profile

Do not include:

* Track as separate item if order detail already handles it well
* Support as full nav item unless necessary; prefer contextual entry

### DRIVER sidebar

* Today
* Tasks
* Cash
* Profile

Do not include:

* All orders
* Admin tools
* Hub views

### HUB_STAFF sidebar

* Dashboard
* Intake
* Processing
* Dispatch
* Exceptions

Do not include:

* Customer/account sections
* finance-heavy global tools
* developer controls

### AFFILIATE_STAFF sidebar

* Dashboard
* New Order
* Orders

Do not include:

* Staff management
* payouts
* cross-shop analytics

### AFFILIATE_ADMIN sidebar

* Dashboard
* Orders
* Staff
* Payouts
* Performance

Do not include:

* system-wide admin tools
* developer tools

### ADMIN sidebar

* Dashboard
* Orders
* Operations
* Finance
* Exceptions
* Settings

Do not include:

* developer tools unless role is dev admin

### DEV_ADMIN sidebar

* Dashboard
* Feature Flags
* Logs & Jobs
* Audit

Do not include:

* business-facing duplicate navigation already covered elsewhere unless required for support workflows

---

## Mobile Navigation Model

### General Mobile Rules

* Only customer and driver receive bottom-tab navigation in Phase 2
* Bottom tabs must stay between 3 and 5 items
* Labels must be short
* The most frequent action must be reachable in one tap
* Deep details should open within the tab flow, not create more tabs

### Customer bottom tabs

* Home
* Orders
* Profile

Optional:

* If order creation is very frequent and deserves direct access, allow:

  * Home
  * Orders
  * New
  * Profile

Preferred default:

* Keep `New Order` as a prominent action inside Home rather than a permanent tab

### Driver bottom tabs

* Today
* Tasks
* Cash
* Profile

Do not add:

* notifications tab
* settings tab separate from profile
* duplicate home/today concepts

---

## Navigation States

Every navigation system must support:

* default
* active/current
* hover/focus on web
* disabled only if truly necessary
* no placeholder states for future destinations

## Routing Rule

After login, users are routed automatically to their portal home:

* CUSTOMER  `/app/customer`
* DRIVER  `/app/driver`
* HUB_STAFF  `/app/hub`
* AFFILIATE_STAFF`/`AFFILIATE_ADMIN  `/app/affiliate`
* ADMIN  `/app/admin`
* DEV_ADMIN  `/app/dev`

## 403 Rule

If a user manually enters a forbidden route:

* return 403 page or guarded forbidden state
* do not silently redirect to avoid masking authorization errors
* log according to security/audit rules if required

## Design Lock

Navigation is standardized in this document. Pages may not create their own side navigation patterns outside this model.
