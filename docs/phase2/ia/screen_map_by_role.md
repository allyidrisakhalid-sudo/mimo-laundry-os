# Screen Map by Role  Mimo Phase 2

## 1) Purpose

This file locks the minimal implementation-safe screen map for each role. Each role is limited to 3-7 screens so implementation stays focused, reusable, and free of route drift.

## 2) Customer Screen Map

### 1. Customer Home
- route: /app/customer
- purpose: show current account state, active order status, and next best action
- primary action: start a new order
- key data shown:
  - active order summary
  - latest order timeline snapshot
  - saved addresses/basic account info

### 2. New Order
- route: /app/customer/new-order
- purpose: create a door, shop, or hybrid order
- primary action: submit order
- key data shown:
  - service channel
  - tier
  - pickup/drop preferences
  - address/shop selection
  - order summary before submit

### 3. Track Order
- route: /app/customer/orders/[orderId]
- purpose: show full customer-visible order progress
- primary action: view live status and resolve next customer action if needed
- key data shown:
  - order status
  - timeline
  - bag/order identifiers
  - issue/refund/help prompts if applicable

### 4. Order History
- route: /app/customer/orders
- purpose: let customer review past and current orders
- primary action: open selected order
- key data shown:
  - order list
  - dates
  - totals/status
  - channel/tier summary

### 5. Account
- route: /app/customer/account
- purpose: manage profile basics for ongoing use
- primary action: save account details
- key data shown:
  - customer profile
  - phone
  - language
  - saved addresses

## 3) Driver Screen Map

### 1. Driver Today
- route: /app/driver
- purpose: show today's workload and next assigned stop
- primary action: start next stop
- key data shown:
  - assigned stops count
  - urgent tasks
  - cash/proof reminders
  - route/day summary

### 2. Tasks List
- route: /app/driver/tasks
- purpose: list active assigned tasks
- primary action: open assigned stop
- key data shown:
  - stop list
  - task type
  - status
  - customer/shop name
  - zone cue

### 3. Stop Detail
- route: /app/driver/tasks/[taskId]
- purpose: execute one stop correctly
- primary action: confirm pickup or delivery proof
- key data shown:
  - stop instructions
  - bags/order info
  - OTP/photo/signature proof area
  - payment/cash prompt if applicable

### 4. Driver Account
- route: /app/driver/account
- purpose: show driver profile and simple work settings
- primary action: update availability or basic profile data
- key data shown:
  - driver profile
  - status/availability
  - home zone
  - support info

## 4) Hub Staff Screen Map

### 1. Hub Dashboard
- route: /app/hub
- purpose: show hub workload and urgent operational queues
- primary action: open the next operational queue
- key data shown:
  - intake count
  - processing count
  - qc blockers
  - dispatch-ready count

### 2. Intake
- route: /app/hub/intake
- purpose: receive incoming bags/orders into hub flow
- primary action: complete intake
- key data shown:
  - intake queue
  - scan/code input
  - weight
  - notes/photos
  - linked order details

### 3. Processing Board
- route: /app/hub/processing
- purpose: move work through production stages
- primary action: advance selected order
- key data shown:
  - stage columns or filtered stage list
  - SLA/tier urgency
  - order tags
  - blockers

### 4. QC / Order Detail
- route: /app/hub/orders/[orderId]
- purpose: review one order for qc, exception handling, and dispatch readiness
- primary action: pass qc or flag exception
- key data shown:
  - order detail
  - bag detail
  - notes/photos
  - exception state
  - dispatch readiness

### 5. Dispatch
- route: /app/hub/dispatch
- purpose: assign ready orders into outbound work
- primary action: assign to driver batch
- key data shown:
  - dispatch-ready queue
  - zone
  - driver options
  - batch summary

## 5) Affiliate Screen Map

### 1. Affiliate Dashboard
- route: /app/affiliate
- purpose: show shop workload and shop-specific next actions
- primary action: create a walk-in order or open active queue
- key data shown:
  - active shop orders
  - ready for pickup
  - pending dropoff/pickup actions
  - finance summary for admin-capable users

### 2. New Walk-In Order
- route: /app/affiliate/new-order
- purpose: create a shop-scoped customer order
- primary action: submit order
- key data shown:
  - customer basics
  - service selection
  - tier
  - bag/order intake summary
  - quoted totals if available

### 3. Shop Orders
- route: /app/affiliate/orders
- purpose: review only this shop's orders
- primary action: open selected order
- key data shown:
  - shop-scoped order list
  - statuses
  - due states
  - pickup/return mode

### 4. Shop Order Detail
- route: /app/affiliate/orders/[orderId]
- purpose: manage one shop-scoped order
- primary action: complete the next shop step
- key data shown:
  - order status
  - customer/shop handoff info
  - pickup/drop workflow
  - timeline snapshot

### 5. Affiliate Summary
- route: /app/affiliate/summary
- purpose: show shop-level summary for affiliate-admin usage without adding a separate portal
- primary action: review shop performance and payout-related summary
- key data shown:
  - order counts
  - sales/commission summary
  - payout period summary

## 6) Admin Screen Map

### 1. Admin Dashboard
- route: /app/admin
- purpose: run the business from one operations overview
- primary action: open the highest-priority queue
- key data shown:
  - business KPIs
  - urgent queue
  - orders overview
  - finance exceptions

### 2. Orders Oversight
- route: /app/admin/orders
- purpose: inspect and control platform-wide order truth
- primary action: open and resolve selected order
- key data shown:
  - global order list
  - filters
  - statuses
  - SLA/exception flags

### 3. Network and Pricing
- route: /app/admin/network
- purpose: manage hubs, zones, shops, drivers, and pricing controls from one admin surface
- primary action: update configuration safely
- key data shown:
  - hub/shop/driver summaries
  - zone mapping
  - pricing plan summary
  - control states

### 4. Finance and Controls
- route: /app/admin/finance
- purpose: review reconciliation, payouts, and operational finance health
- primary action: complete the next finance review action
- key data shown:
  - payments summary
  - payout summary
  - reconciliation flags
  - daily close status

### 5. Support Queue
- route: /app/admin/support
- purpose: resolve customer and operational issues from one queue
- primary action: open and resolve selected case
- key data shown:
  - issue queue
  - refund/delay/dispute states
  - linked orders
  - SLA priority

## 7) Dev Admin Screen Map

### 1. Dev Dashboard
- route: /app/dev
- purpose: monitor platform health and engineering operations
- primary action: open the most urgent system issue
- key data shown:
  - service health
  - failed jobs
  - alert summary
  - recent activity

### 2. Failed Jobs
- route: /app/dev/jobs
- purpose: inspect and retry operational failures safely
- primary action: retry or inspect failed job
- key data shown:
  - failed job list
  - job type
  - retry status
  - failure details

### 3. Feature Flags
- route: /app/dev/flags
- purpose: manage rollout states safely
- primary action: change a flag with auditability
- key data shown:
  - flag name
  - current state
  - environment
  - last modified info

### 4. Overrides
- route: /app/dev/overrides
- purpose: perform controlled emergency platform actions
- primary action: execute documented override with reason
- key data shown:
  - override types
  - reason input
  - impacted entity
  - confirmation requirements

### 5. Activity Log
- route: /app/dev/activity
- purpose: review technical platform activity in one place
- primary action: inspect recent system activity
- key data shown:
  - deployment/system activity
  - actor/system source
  - timestamps
  - event summaries

## 8) Screen Map Lock Rule

All roles remain bounded to the routes above for implementation start. No extra screens may be added for convenience before later approval.
