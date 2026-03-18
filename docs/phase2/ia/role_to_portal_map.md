# Role to Portal Map

## Objective

This document locks which role enters which portal, what each role is allowed to see or do, what must be blocked with 403, and what the single primary action is for each role. This is the master routing and permission map for Phase 2.

## Global Rules

* `mimolaundry.org` is the single entry point for all users.
* After login, the system must automatically route the user to the correct portal home.
* If a user attempts to access a portal or section outside their role scope, the result must be `403 Forbidden`.
* No portal may expose navigation to forbidden sections.
* A role may only see data relevant to its scope.
* `AFFILIATE_ADMIN` uses the same portal root as `AFFILIATE_STAFF` but receives additional management permissions within that portal.
* `DEV_ADMIN` is operationally separate from business admin and must use `/app/dev`.

## Role Routing Table

| Role            | Portal Home Route | Allowed Sections                                                                                                                                       | Forbidden Sections                                                                                                 | Primary Action                                              |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| CUSTOMER        | `/app/customer`   | Home, Orders, Track, Profile, Address/Contact, Support entry                                                                                           | Driver, Hub, Affiliate, Admin, Dev portals                                                                         | Create and track a laundry order with confidence            |
| DRIVER          | `/app/driver`     | Today, Assigned Tasks, Cash Summary, Profile                                                                                                           | Customer, Hub, Affiliate, Admin, Dev portals                                                                       | Complete assigned pickups and deliveries with proof         |
| HUB_STAFF       | `/app/hub`        | Dashboard, Intake, Processing Queue, Dispatch Queue, Exceptions                                                                                        | Customer, Driver, Affiliate, Admin, Dev portals unless explicitly granted                                          | Move orders from intake to dispatch accurately              |
| AFFILIATE_STAFF | `/app/affiliate`  | Dashboard, Create Order, Shop Orders, Customer Handover                                                                                                | Customer, Driver, Hub, Admin, Dev portals and affiliate settings/payout management                                 | Capture and manage shop-origin orders for walk-in customers |
| AFFILIATE_ADMIN | `/app/affiliate`  | Dashboard, Create Order, Shop Orders, Staff View, Payout View, Shop Performance                                                                        | Customer, Driver, Hub, Admin, Dev portals                                                                          | Run affiliate operations and monitor shop performance       |
| ADMIN           | `/app/admin`      | Global Dashboard, Orders, Hubs, Affiliates, Drivers, Customers, Pricing Read/Control, Exceptions, Finance Summaries, Settings allowed for business ops | Dev portal                                                                                                         | Monitor and operate the entire business safely              |
| DEV_ADMIN       | `/app/dev`        | System diagnostics, feature flags, logs, environment-aware support tools, audit inspection, technical admin tools                                      | Customer, Driver, Hub, Affiliate business workflows unless testing through approved impersonation or support tools | Maintain system correctness and release safety              |

## Role Access Notes

### CUSTOMER

* Scope is personal orders only
* Must never see internal operational queues
* Must never see hub assignment internals unless abstracted as customer-friendly tracking

### DRIVER

* Scope is assigned trips/tasks only
* Must not browse all orders
* Must not edit pricing, payouts, or customer account settings

### HUB_STAFF

* Scope is hub-linked work and operational queues
* Must not see unrelated hub data unless policy allows zone-scoped visibility
* Must not manage commissions or developer settings

### AFFILIATE_STAFF

* Scope is own shop operations only
* Must not view other shops
* Must not manage staff permissions or payouts unless upgraded to affiliate admin

### AFFILIATE_ADMIN

* Scope is own affiliate business unit only
* Can view staff, payout summaries, and shop performance for own affiliate
* Must not access system-wide admin tools

### ADMIN

* Scope is full business operation across zones, hubs, affiliates, drivers, orders, and finance summaries
* Must not access developer-only controls by default

### DEV_ADMIN

* Scope is system-level administration and technical oversight
* Access must be audited
* Any sensitive override capability must be visibly labeled and logged

## Written Acceptance Tests

* Login as `CUSTOMER`  lands on `/app/customer`  attempt `/app/admin`  receive `403`
* Login as `DRIVER`  lands on `/app/driver`  attempt `/app/hub`  receive `403`
* Login as `HUB_STAFF`  lands on `/app/hub`  attempt `/app/affiliate`  receive `403`
* Login as `AFFILIATE_STAFF`  lands on `/app/affiliate`  attempt `/app/admin`  receive `403`
* Login as `AFFILIATE_ADMIN`  lands on `/app/affiliate`  can access affiliate admin sections only within affiliate scope
* Login as `ADMIN`  lands on `/app/admin`  attempt `/app/dev`  receive `403`
* Login as `DEV_ADMIN`  lands on `/app/dev`  access is audited

## Design Lock

The portal map is locked for Phase 2. Any new portal or cross-role access pattern must be documented as a Phase 2 change request before implementation.
