# Role Journey Test Plan  Mimo Phase 2

## 1) Journey Validation Principles

Locked journey validation principles:
- validate real workflows, not isolated screens
- validate on real target devices
- validate role routing and permissions as used in reality
- validate start-to-finish clarity
- validate next-action visibility
- validate tap count and friction qualitatively
- validate support and error recovery paths
- validate that no role needs hidden knowledge to proceed
- validate production-like conditions, not ideal-only conditions
- every role must finish its journey without confusion

## 2) Customer Journey Test

### Goal
- prove that a new customer can discover Mimo, understand the service quickly, create an order, track it, and raise an issue without confusion

### Start Point
- public entry via mimolaundry.org as if arriving from search or direct branded discovery

### Device Target
- mobile first
- web secondary

### Test Preconditions
- public site deployed and reachable
- login/signup working
- customer portal working
- support issue flow available
- at least one realistic order path and support state available for validation

### Journey Steps
1) open mimolaundry.org on a mobile device
2) understand the service and next step within 60 seconds
3) go to signup or login as appropriate
4) enter the customer portal successfully
5) start a new order
6) choose service path, tier, and schedule
7) submit the order
8) view the created order in the customer portal
9) review order detail, timeline, and payment/support area
10) raise a support issue on the order
11) confirm visible support status after submission

### Success Criteria
- user understands what Mimo does quickly
- signup/login path is obvious
- customer lands in the correct portal
- order creation is completed without confusion
- order detail is understandable
- support issue can be created without hunting
- no dead ends
- mobile use feels natural and minimal

### Failure Conditions
- unclear first action on the public site
- auth confusion
- order wizard ambiguity
- missing order truth after creation
- support entry hidden or broken
- duplicate or contradictory status surfaces

### Evidence to Capture
- public home screenshot
- auth screenshot
- order wizard screenshot
- order detail screenshot
- support issue submission screenshot
- notes on friction points if any

## 3) Driver Journey Test

### Goal
- prove that a driver can open the portal, understand todays work, complete a stop, handle proof, and manage cash/reconciliation flow with minimal taps

### Start Point
- /login then driver portal entry

### Device Target
- mobile primary

### Test Preconditions
- driver login works
- tasks assigned
- proof-required task exists
- cash-required or cash-summary state exists
- poor-network messaging path can be simulated or observed if possible

### Journey Steps
1) log in as driver
2) land on /app/driver
3) understand next task immediately
4) open task list or next task
5) open stop detail
6) complete required proof action
7) handle cash prompt if relevant
8) confirm task completion state
9) review today / cash summary
10) review retry or sync messaging if network delay is simulated or visible

### Success Criteria
- next task is obvious
- stop detail is proof-first
- cash prompts are clear
- minimal taps required
- no role confusion or hidden flow step
- mobile experience is fast and usable

### Failure Conditions
- next task hidden
- proof action buried
- cash prompt ambiguous
- retry/sync state confusing
- unnecessary taps or duplicate confirmation loops

### Evidence to Capture
- driver today screenshot
- stop detail screenshot
- proof completion screenshot
- cash/reconciliation screenshot
- offline/retry state screenshot if exercised

## 4) Hub Journey Test

### Goal
- prove that hub staff can receive an order, move it through processing/QC, and dispatch it without admin help

### Start Point
- /login then hub portal entry

### Device Target
- tablet primary
- web secondary

### Test Preconditions
- hub login works
- intake item exists
- processing workflow exists
- QC decision path exists
- dispatch-ready item and eligible driver context exist

### Journey Steps
1) log in as hub staff
2) land on /app/hub
3) enter intake queue
4) scan or open the intake item
5) confirm intake and move the order forward
6) open processing board
7) move the order through processing
8) complete QC pass/fail decision
9) open dispatch batching flow
10) filter by zone and assign to valid driver
11) confirm dispatch assignment state

### Success Criteria
- scanner-first flow is obvious
- processing board is readable
- QC decision is fast
- dispatch assignment is possible without admin intervention
- tablet/web layout supports repeated work

### Failure Conditions
- intake requires too many steps
- stage transitions unclear
- QC hidden or overbuilt
- no clear dispatch batching path
- zone/driver ambiguity

### Evidence to Capture
- hub dashboard screenshot
- intake screen screenshot
- processing board screenshot
- QC state screenshot
- dispatch batching screenshot

## 5) Affiliate Journey Test

### Goal
- prove that an affiliate can create a walk-in order, manage it through shop workflow, and review payout visibility appropriately within own-shop scope only

### Start Point
- /login then affiliate portal entry

### Device Target
- tablet/web primary

### Test Preconditions
- affiliate staff and affiliate admin login works
- shop order creation works
- shop-owned order list exists
- pickup/handover readiness state exists
- affiliate finance summary exists for affiliate admin
- other-shop data exists or can be validated as inaccessible

### Journey Steps
1) log in as affiliate staff
2) land on /app/affiliate
3) create a walk-in order
4) submit the order successfully
5) open the shop orders list
6) verify only own-shop orders are visible
7) open the order detail
8) perform or confirm the next pickup/handover action
9) verify readiness state visibility
10) log in as affiliate admin
11) open finance summary
12) verify earnings/payout visibility
13) verify no other shop data is visible in either role

### Success Criteria
- walk-in order creation is fast
- order list is clearly scoped
- pickup workflow is obvious
- finance visibility is simple for affiliate admin
- staff/admin difference is role-correct
- no cross-shop leakage

### Failure Conditions
- slow or confusing order entry
- unclear pickup readiness
- finance visible to affiliate staff
- other shops visible
- shop workflow requires admin workaround

### Evidence to Capture
- affiliate dashboard screenshot
- walk-in order creation screenshot
- orders list screenshot
- order detail / pickup state screenshot
- affiliate admin finance screenshot
- scope restriction proof screenshot if possible

## 6) Admin Journey Test

### Goal
- prove that admin can run the day from dashboard to operations and finance review without hunting

### Start Point
- /login then admin portal entry

### Device Target
- laptop / desktop primary

### Test Preconditions
- admin login works
- dashboard KPIs and queues exist
- orders view exists
- operations view exists
- pricing section exists
- finance view exists
- audit/read-only control visibility exists where applicable

### Journey Steps
1) log in as admin
2) land on /app/admin
3) identify the highest-priority queue quickly
4) open orders oversight
5) filter and inspect an order
6) open operations workspace
7) inspect network management sections
8) inspect pricing version visibility
9) open finance page
10) review payments/refunds/payouts/daily close signals
11) inspect audit / failed-job read visibility if surfaced here
12) confirm no hunting is required for daily control

### Success Criteria
- dashboard prioritizes action
- orders filtering is usable
- network, pricing, and finance are findable and clear
- admin can move through the business-control path smoothly
- no report museum effect

### Failure Conditions
- important actions buried
- pricing workflow unclear
- finance overloaded or vague
- read-only oversight hidden
- too many duplicate admin surfaces

### Evidence to Capture
- admin dashboard screenshot
- orders filter screenshot
- operations workspace screenshot
- pricing section screenshot
- finance page screenshot
- audit/read-only visibility screenshot if relevant

## 7) DevAdmin Journey Test

### Goal
- prove that DevAdmin can inspect health, review failed jobs, use feature flags, and apply override controls safely without manual DB work

### Start Point
- /login then DevAdmin portal entry

### Device Target
- laptop / desktop primary

### Test Preconditions
- DevAdmin login works
- diagnostics view exists
- failed jobs viewer exists
- feature flags manager exists
- override workflow exists with reason requirement
- activity/audit view exists

### Journey Steps
1) log in as DevAdmin
2) land on /app/dev
3) inspect health/monitoring summary
4) open diagnostics
5) open tools
6) inspect failed jobs
7) retry a failed job if testable
8) inspect feature flags state
9) open an override-capable tool
10) confirm reason-required workflow appears
11) apply or simulate a safe override path if testable
12) open activity view and confirm visible audit trail

### Success Criteria
- diagnosis comes before action
- failed jobs retry is controlled
- feature flags are understandable
- override workflow is reason-required and auditable
- DevAdmin does not need manual DB intervention for supported tasks

### Failure Conditions
- raw engineering chaos
- retry with no guardrail
- flags ambiguous
- override with no reason capture
- audit visibility missing

### Evidence to Capture
- DevAdmin home screenshot
- diagnostics screenshot
- failed jobs viewer screenshot
- feature flags screenshot
- override reason workflow screenshot
- activity view screenshot

## 8) Cross-Role Validation Rules

Locked cross-role validation rules:
- every role lands in the correct portal after login
- every role sees only what it should see
- every roles next action is obvious on first landing
- device behavior matches the intended target device for that role
- support/help entry exists where needed
- no duplicate page-purpose confusion appears during live usage
- no hidden dependency on admin for normal role work
- no hidden dependency on DevAdmin for normal business work
- status, payment, support, and routing language remain consistent across roles
- evidence must be captured for pass/fail, not guessed

## 9) Journey Test Lock Statement

The Phase 2 role journey test plan is locked as the operational validation model for launch readiness. Each role is validated through a real start-to-finish workflow on its intended device context, with strict evidence capture, clear failure conditions, and no allowance for guesswork or role confusion.
