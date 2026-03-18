# Screen Map by Role  Phase 2 Blueprint Lock (P2.0)

System: Mimo Laundry OS  
Direction: Midnight Silk  
Rule: Every screen has one clear purpose and one primary action. No duplicate page purpose is allowed.

---

## CUSTOMER

**Journey summary:** Start from one calm home, create or resume an order, inspect one order in full detail, then manage profile and preferences.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Customer Home | /app/customer | Give the customer one calm starting point with order status, next step, and quick access to core actions. | Start a new order or continue tracking an active one. | - active order summary<br>- latest status/timeline snapshot<br>- quick CTA to create order<br>- quick CTA to track recent order<br>- support/help entry |
| Orders | /app/customer/orders | Show the customers full order history and active orders in one clean list. | Open a specific order. | - order number<br>- service channel/tier<br>- current status<br>- balance/payment state<br>- created/updated time |
| Order Detail | /app/customer/orders/[id] | Show complete order truth for one order without making the user search elsewhere. | Track status and complete the next relevant customer action. | - order summary<br>- timeline/events<br>- pickup/delivery details<br>- invoice/payment summary<br>- issue/help state if present |
| Profile | /app/customer/profile | Let the customer manage own account, language, and personal preferences. | Update account settings. | - account identity<br>- phone/contact details<br>- saved preferences<br>- language setting<br>- saved addresses if exposed here |

---

## DRIVER

**Journey summary:** Start from todays command view, open assigned work, complete proof on task detail, then update availability and profile as needed.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Driver Today | /app/driver | Give the driver a sharp daily command view. | Start the next assigned task. | - availability state<br>- assigned tasks count<br>- next stop<br>- cash summary<br>- alerts/exceptions |
| Tasks | /app/driver/tasks | Show all assigned tasks in a sequence-friendly list. | Open a task. | - task type<br>- stop/customer/shop<br>- status<br>- assigned time<br>- proof/cash requirement marker |
| Task Detail | /app/driver/tasks/[id] | Let the driver complete pickup/delivery correctly with proof. | Complete the task step now. | - stop details<br>- bags/order reference<br>- proof requirements<br>- OTP/photo/signature needs<br>- cash collection instructions if applicable |
| Profile | /app/driver/profile | Let the driver manage own availability and account info. | Update availability/profile. | - driver identity<br>- phone/contact<br>- availability<br>- assigned zone summary<br>- session/account controls |

---

## HUB_STAFF

**Journey summary:** Start from hub command view, open intake work, move orders through processing, then complete order-specific operational updates inside hub scope.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Hub Dashboard | /app/hub | Show what the hub must act on now. | Open the next queue requiring action. | - intake count<br>- processing count<br>- dispatch-ready count<br>- exceptions needing attention<br>- hub SLA alerts |
| Intake Queue | /app/hub/intake | Manage orders that need intake confirmation and receiving. | Open an intake item. | - order reference<br>- source/channel<br>- arrival state<br>- intake priority<br>- assigned hub/zone |
| Processing Board | /app/hub/processing | Move work through processing and QC stages. | Advance an order to the next valid stage. | - order reference<br>- current stage<br>- notes/exceptions<br>- priority/SLA marker<br>- dispatch readiness |
| Order Detail | /app/hub/orders/[id] | Review and update one order within hub scope. | Complete the next operational update for this order. | - intake details<br>- timeline<br>- weight/notes/photos if supported<br>- QC/exception state<br>- dispatch readiness |

---

## AFFILIATE_STAFF

**Journey summary:** Start from the shop dashboard, create a new shop order, monitor shop-only orders, then operate one order through handoff and return readiness.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Affiliate Dashboard | /app/affiliate | Give the shop a simple command center for todays activity. | Create a new shop order. | - todays orders<br>- ready-for-pickup/return items<br>- pending customer pickups<br>- active issues<br>- quick action shortcuts |
| Create Order | /app/affiliate/orders/new | Capture a walk-in or shop-originated customer order cleanly. | Submit a new order. | - customer identity inputs<br>- service selection<br>- pickup/return path<br>- order source confirmation<br>- price/summary block if supported |
| Shop Orders | /app/affiliate/orders | List all orders belonging to this shop only. | Open a shop order. | - order reference<br>- customer name/phone<br>- service type<br>- status<br>- handoff/pickup readiness |
| Order Detail | /app/affiliate/orders/[id] | Operate one shop-owned order from capture to return. | Perform the next valid shop action. | - order summary<br>- timeline<br>- customer details<br>- handoff state<br>- ready-for-pickup/return status |

---

## AFFILIATE_ADMIN

**Journey summary:** Start from the affiliate home, manage todays shop flow, create and inspect orders, then review commissions and payout visibility in one place.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Affiliate Dashboard | /app/affiliate | Provide shop-level operations and business overview in one home. | Resolve todays highest-priority operational or payout item. | - todays orders<br>- ready items<br>- active issues<br>- commission summary<br>- payout status snapshot |
| Create Order | /app/affiliate/orders/new | Capture a new shop order. | Submit a new order. | - customer identity inputs<br>- service selection<br>- return path<br>- source confirmation<br>- summary/pricing block |
| Shop Orders | /app/affiliate/orders | List all affiliate-owned orders. | Open an order. | - order reference<br>- customer details<br>- service type<br>- status<br>- readiness/handoff marker |
| Order Detail | /app/affiliate/orders/[id] | Manage one affiliate order completely. | Perform the next valid affiliate action. | - order summary<br>- timeline<br>- customer/shop details<br>- handoff status<br>- issue state |
| Commissions & Payouts | /app/affiliate/finance | Show commissions earned and payout history without needing admin access. | Review current payout state. | - earned commissions<br>- pending payout amount<br>- payout history<br>- period summary<br>- reconciliation/status notes if present |

---

## ADMIN

**Journey summary:** Start from the platform overview, inspect global orders, resolve one order deeply, monitor operations pressure, and review finance and reconciliation confidence.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Admin Dashboard | /app/admin | Give global operational control and top-level business visibility. | Open the highest-priority queue or exception. | - total active orders<br>- delayed/exceptions count<br>- todays delivered/paid summary<br>- payout/reconciliation alerts<br>- quick oversight KPIs |
| Orders Oversight | /app/admin/orders | Let admin search, filter, and inspect platform-wide orders. | Open an order. | - order reference<br>- source/channel<br>- zone/hub/affiliate attribution<br>- current status<br>- payment/balance state |
| Order Detail | /app/admin/orders/[id] | Give admin complete cross-functional truth for one order. | Resolve the next issue or confirm the current state. | - full order summary<br>- timeline/events<br>- routing attribution<br>- pricing/payment summary<br>- exceptions/audit-relevant state |
| Operations Control | /app/admin/operations | Monitor hubs, affiliates, drivers, and queues without fragmenting oversight. | Open the area needing intervention. | - by-hub workload<br>- by-zone workload<br>- affiliate performance snapshot<br>- driver assignment pressure<br>- SLA or backlog indicators |
| Finance & Reconciliation | /app/admin/finance | Review financial control items required for daily business confidence. | Open the item needing reconciliation or payout action. | - collections summary<br>- unpaid balances<br>- commissions/payout state<br>- reconciliation flags<br>- daily close markers |

---

## DEV_ADMIN

**Journey summary:** Start from the internal support home, inspect diagnostics, open support tools, and review logged activity for full accountability.

| Screen Name | Route | Purpose | Primary Action | Key Data Shown |
|---|---|---|---|---|
| Dev Home | /app/dev | Provide system support entry for diagnostic and controlled internal tools. | Open the required support tool. | - system status snapshot<br>- recent support/admin tools<br>- warning notices<br>- environment indicators<br>- recent diagnostic activity |
| Diagnostics | /app/dev/diagnostics | Inspect system health and internal runtime support data. | Run or review a diagnostic check. | - health summaries<br>- queue/runtime indicators<br>- recent failures<br>- support markers<br>- environment metadata |
| Support Tools | /app/dev/tools | Access controlled operational support utilities in one place. | Open a support action safely. | - tool list<br>- access warnings<br>- audit notice<br>- destructive/non-destructive labels<br>- recent usage summary |
| Audit & Activity | /app/dev/activity | Review developer/admin support actions for accountability. | Inspect a logged support event. | - actor<br>- action<br>- time<br>- target/system area<br>- result/status |

---

## Redundancy Check

- CUSTOMER: Each screen has a unique purpose. Home is the entry point, Orders is the list, Order Detail is the single-order truth view, and Profile is account management. No duplicate page exists.
- DRIVER: Each screen has a unique purpose. Today is the command center, Tasks is the assignment list, Task Detail is execution with proof, and Profile is personal settings. No duplicate page exists.
- HUB_STAFF: Each screen has a unique purpose. Dashboard summarizes, Intake handles receiving, Processing advances work, and Order Detail handles one order inside hub scope. No duplicate page exists.
- AFFILIATE_STAFF: Each screen has a unique purpose. Dashboard summarizes shop activity, Create Order captures new business, Shop Orders lists owned orders, and Order Detail handles one order. No duplicate page exists.
- AFFILIATE_ADMIN: Each screen has a unique purpose. Dashboard summarizes operations and business state, Create Order captures new business, Shop Orders lists owned orders, Order Detail handles one order, and Finance covers commissions/payouts only. No duplicate page exists.
- ADMIN: Each screen has a unique purpose. Dashboard prioritizes platform action, Orders Oversight lists/searches all orders, Order Detail is single-order truth, Operations Control monitors operational pressure, and Finance & Reconciliation handles money-control work. No duplicate page exists.
- DEV_ADMIN: Each screen has a unique purpose. Home is entry, Diagnostics inspects health, Tools handles controlled support utilities, and Activity provides accountability. No duplicate page exists.
