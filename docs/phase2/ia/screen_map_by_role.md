# Screen Map by Role

## Objective

This document defines the minimal screen inventory per role for Phase 2. Each role is limited to 3-7 screens. Every screen must have one purpose, one primary action, and role-correct data only.

## Global Rules

* Hard cap: 3-7 screens per role
* No duplicate screens with different names
* If a screen contains more than one main task, split or simplify it
* Details should open from lists rather than becoming separate unnecessary dashboards
* Reusable patterns across roles are preferred over custom page designs

---

## CUSTOMER

### 1. Customer Home

* Route: `/app/customer`
* Purpose: Give the customer a quick, calm overview of their current laundry activity
* Primary action: Create a new order
* Key data shown:

  * active order summary
  * latest order status
  * next expected step
  * outstanding balance if any
  * quick access to tracking/help

### 2. Orders

* Route: `/app/customer/orders`
* Purpose: Show all customer orders in one clear list
* Primary action: Open an order
* Key data shown:

  * order reference
  * service type/tier
  * current status
  * price summary
  * created/delivery dates

### 3. Order Detail / Tracking

* Route: `/app/customer/orders/[orderId]`
* Purpose: Show the full order timeline and order details
* Primary action: Track progress and resolve next customer-facing step
* Key data shown:

  * timeline/events
  * pickup/dropoff method
  * bag/order summary
  * payment state
  * issue or support state if present

### 4. New Order

* Route: `/app/customer/new`
* Purpose: Let the customer create a door, shop, or hybrid order
* Primary action: Submit order request
* Key data shown:

  * service channel
  * tier
  * address/shop selection
  * notes/preferences
  * quote preview if available

### 5. Profile

* Route: `/app/customer/profile`
* Purpose: Manage personal account details used in ordering
* Primary action: Save account details
* Key data shown:

  * name
  * phone
  * language
  * saved addresses
  * notification preferences

Customer journey coverage:

* enter app
* create order
* view order list
* track active order
* manage profile/contact details

---

## DRIVER

### 1. Driver Today

* Route: `/app/driver`
* Purpose: Show todays assignment summary and immediate work
* Primary action: Start the next assigned task
* Key data shown:

  * todays assigned stops/tasks
  * active trip/batch
  * pending pickups/deliveries
  * cash due/collected summary
  * status/availability

### 2. Task List

* Route: `/app/driver/tasks`
* Purpose: Show assigned tasks in execution order
* Primary action: Open task detail
* Key data shown:

  * task type
  * customer/shop name
  * zone/area
  * scheduled window
  * task status

### 3. Task Detail

* Route: `/app/driver/tasks/[taskId]`
* Purpose: Execute a pickup or delivery with proof
* Primary action: Confirm task completion
* Key data shown:

  * stop details
  * order/bag reference
  * proof requirements
  * OTP/photo/signature inputs
  * cash collection requirement if any

### 4. Cash

* Route: `/app/driver/cash`
* Purpose: Show driver cash obligations and reconciliation visibility
* Primary action: Review cash summary
* Key data shown:

  * collected today
  * pending handover
  * reconciled amount
  * exceptions/disputes
  * recent cash-related events

### 5. Profile

* Route: `/app/driver/profile`
* Purpose: Manage driver identity and work readiness settings
* Primary action: Update work status
* Key data shown:

  * profile basics
  * home zone
  * availability
  * support contact
  * vehicle info if enabled

Driver journey coverage:

* see today
* open task list
* complete proofed task
* review cash state
* manage availability/profile

---

## HUB_STAFF

### 1. Hub Dashboard

* Route: `/app/hub`
* Purpose: Show operational state of the hub right now
* Primary action: Open the next work queue
* Key data shown:

  * intake waiting count
  * in-processing count
  * exceptions count
  * dispatch-ready count
  * hub SLA attention items

### 2. Intake Queue

* Route: `/app/hub/intake`
* Purpose: Receive and register incoming orders/bags
* Primary action: Check in an order
* Key data shown:

  * newly arrived orders
  * bag identifiers
  * intake timestamp
  * customer/shop source
  * missing info warnings

### 3. Processing Queue

* Route: `/app/hub/processing`
* Purpose: Progress work through wash/QC stages
* Primary action: Update order processing stage
* Key data shown:

  * current stage
  * priority/tier
  * SLA urgency
  * notes/photos/exceptions
  * assigned hub context

### 4. Dispatch Queue

* Route: `/app/hub/dispatch`
* Purpose: Prepare completed work for outbound delivery or return
* Primary action: Mark ready for dispatch
* Key data shown:

  * dispatch-ready orders
  * destination type
  * customer/shop return mode
  * assigned driver/batch if any
  * outstanding blockers

### 5. Exceptions

* Route: `/app/hub/exceptions`
* Purpose: Resolve damaged, delayed, missing, or failed QC items
* Primary action: Open and resolve exception case
* Key data shown:

  * exception type
  * affected order
  * age of issue
  * owner/status
  * required next step

Hub Staff journey coverage:

* assess dashboard
* intake
* process
* dispatch
* resolve exceptions

---

## AFFILIATE_STAFF

### 1. Affiliate Dashboard

* Route: `/app/affiliate`
* Purpose: Give shop staff a fast overview of the days activity
* Primary action: Create a new shop order
* Key data shown:

  * orders received today
  * pending customer pickups
  * awaiting handover count
  * active issues
  * quick actions

### 2. New Shop Order

* Route: `/app/affiliate/new`
* Purpose: Create an order for a walk-in customer
* Primary action: Submit shop order
* Key data shown:

  * customer details
  * order type/tier
  * handover mode
  * notes
  * quote preview if available

### 3. Shop Orders

* Route: `/app/affiliate/orders`
* Purpose: Show all orders belonging to the current affiliate shop
* Primary action: Open order detail
* Key data shown:

  * order reference
  * customer name
  * current status
  * payment state
  * pickup/return mode

### 4. Shop Order Detail

* Route: `/app/affiliate/orders/[orderId]`
* Purpose: Manage one shop order through handover and customer collection
* Primary action: Record the next shop-side handoff
* Key data shown:

  * order status/timeline
  * customer details
  * amount due
  * handover checkpoints
  * issues/notes

Affiliate Staff journey coverage:

* view dashboard
* create walk-in order
* manage order list
* hand over or release completed orders

---

## AFFILIATE_ADMIN

### 1. Affiliate Dashboard

* Route: `/app/affiliate`
* Purpose: View operational and commercial state of the affiliate
* Primary action: Review shop performance and operational blockers
* Key data shown:

  * order counts
  * pending pickups
  * payout summary
  * issue count
  * staff activity snapshot

### 2. Shop Orders

* Route: `/app/affiliate/orders`
* Purpose: Monitor all affiliate orders within affiliate scope
* Primary action: Open order detail
* Key data shown:

  * order volume
  * status mix
  * payment state
  * exceptions
  * customer/shop source details

### 3. Staff

* Route: `/app/affiliate/staff`
* Purpose: View affiliate staff and role readiness
* Primary action: Open staff member
* Key data shown:

  * staff names
  * roles
  * activity/last active
  * status
  * permissions summary

### 4. Payouts

* Route: `/app/affiliate/payouts`
* Purpose: Review commission and payout history for the affiliate
* Primary action: Review payout period
* Key data shown:

  * payout periods
  * total earned
  * paid/unpaid state
  * order count basis
  * payout references

### 5. Performance

* Route: `/app/affiliate/performance`
* Purpose: Review shop performance without leaving affiliate scope
* Primary action: Inspect operational trends
* Key data shown:

  * order volume
  * turnaround indicators
  * issue rate
  * pickup completion
  * payout-related context

Affiliate Admin journey coverage:

* monitor business
* inspect orders
* oversee staff
* review payouts
* review performance

---

## ADMIN

### 1. Admin Dashboard

* Route: `/app/admin`
* Purpose: Show global business state and operational priorities
* Primary action: Open the highest-priority queue
* Key data shown:

  * active orders
  * delayed orders
  * zone/hub health summary
  * payout/finance attention items
  * issue queue count

### 2. Orders

* Route: `/app/admin/orders`
* Purpose: Search and manage all orders across the system
* Primary action: Open order detail
* Key data shown:

  * reference
  * customer/shop source
  * zone/hub
  * status
  * payment/exception flags

### 3. Operations

* Route: `/app/admin/operations`
* Purpose: Manage hubs, affiliates, drivers, and live operational bottlenecks
* Primary action: Open operational entity or issue
* Key data shown:

  * hub summaries
  * affiliate summaries
  * driver readiness
  * zone workload
  * operational blockers

### 4. Pricing & Finance

* Route: `/app/admin/finance`
* Purpose: Review pricing, payouts, and finance-related operational state
* Primary action: Open finance item needing review
* Key data shown:

  * pricing plans
  * payout summaries
  * collections state
  * reconciliation alerts
  * refund/credit flags

### 5. Exceptions & Audit

* Route: `/app/admin/exceptions`
* Purpose: Review escalations, overrides, and audit-visible events
* Primary action: Resolve or inspect exception
* Key data shown:

  * open exceptions
  * severity/age
  * actor trail
  * resolution state
  * related order/entity

### 6. Settings

* Route: `/app/admin/settings`
* Purpose: Manage business-facing system configuration within approved scope
* Primary action: Save controlled configuration
* Key data shown:

  * allowed configuration groups
  * role/policy summaries
  * locale/business settings
  * operational defaults
  * warnings for sensitive actions

Admin journey coverage:

* review business state
* search/manage orders
* manage operations
* inspect finance state
* resolve exceptions
* manage approved settings

---

## DEV_ADMIN

### 1. Dev Dashboard

* Route: `/app/dev`
* Purpose: Show technical system health and release safety
* Primary action: Open the system area requiring attention
* Key data shown:

  * service health
  * job failures
  * flag states
  * audit anomalies
  * environment markers

### 2. Feature Flags

* Route: `/app/dev/flags`
* Purpose: View and safely control feature rollout states
* Primary action: Inspect or update a flag under audit
* Key data shown:

  * flag name
  * environment scope
  * current state
  * owner
  * last changed metadata

### 3. Logs & Jobs

* Route: `/app/dev/logs`
* Purpose: Inspect background job health and system-level technical signals
* Primary action: Open failed job or log group
* Key data shown:

  * job failures
  * retry state
  * queue health
  * recent errors
  * timestamps/environment context

### 4. Audit & Support Tools

* Route: `/app/dev/audit`
* Purpose: Review high-risk actions and support-sensitive technical audit trails
* Primary action: Inspect audit record
* Key data shown:

  * actor
  * action
  * object affected
  * timestamp
  * environment/result

DevAdmin journey coverage:

* assess technical state
* inspect flags
* inspect jobs/logs
* inspect audit/support activity

## Design Lock Summary

This screen map is the maximum allowed footprint for Phase 2 initial implementation. Any added screen must replace another screen or be justified in backlog before implementation.

