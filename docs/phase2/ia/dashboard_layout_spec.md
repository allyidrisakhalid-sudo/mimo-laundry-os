# Dashboard Layout Specification

## Objective

This document defines the standard dashboard template for all Phase 2 portals. Dashboards must help users act, not admire visuals.

## Global Dashboard Rule

Every dashboard must answer:

1. what is happening now?
2. what needs attention?
3. what do I do next?

## Universal Dashboard Structure

All role dashboards use this order:

### 1. Page Header

Contains:

* page title
* one-line contextual subtitle
* one primary action only when relevant

### 2. KPI Row

* 3 to 6 cards maximum
* each card must represent a decision-driving metric
* no vanity metrics
* each card label must be plain language
* one supporting line allowed under the number if needed

### 3. Action Queue

* the most important work needing attention now
* should appear above large tables/lists
* should feel like start here
* can be cards, compact list rows, or task blocks
* maximum 5 visible items before view all

### 4. Table or List

* filterable
* searchable where useful
* paginated where needed
* default sort must match operational urgency
* row click opens the relevant detail screen

### 5. Empty State

If no data exists, the empty state must:

* explain what this page is for
* show the next correct action
* avoid sounding like an error

---

## Role-Specific Dashboard Guidance

### Admin Dashboard

Purpose:

* global operational control center

Recommended KPI row:

* active orders
* delayed orders
* unresolved exceptions
* active drivers
* pending payouts or reconciliation alerts

Action queue:

* delayed orders needing review
* finance/payout alerts
* hubs or zones with blockers
* high-severity exceptions

Main list/table:

* priority orders or operational incidents

Must not include:

* decorative trend charts with no action value
* duplicate tables already shown elsewhere

### Hub Dashboard

Purpose:

* current hub workload and blockers

Recommended KPI row:

* intake waiting
* processing now
* dispatch ready
* exceptions open
* SLA-risk items

Action queue:

* urgent intakes
* QC failures
* dispatch blockers

Main list/table:

* active operational queue ordered by urgency

Must not include:

* system-wide business finance summaries

### Affiliate Dashboard

Purpose:

* todays shop activity and commercial visibility

Recommended KPI row:

* orders today
* awaiting customer pickup
* pending handover
* active issues
* payout summary snapshot for admin view only

Action queue:

* customer pickups awaiting release
* new orders to confirm
* issue follow-ups

Main list/table:

* shop orders

Must not include:

* cross-affiliate comparisons outside scope

### Customer Home

Purpose:

* orient the customer and reduce uncertainty

Recommended KPI row:

* active orders
* ready for pickup/delivery
* balance due if any

Action queue:

* pay now if required
* track active order
* create new order

Main list/table:

* recent orders list

Must not include:

* internal operational jargon
* admin metrics
* charts

### Driver Today

Purpose:

* help the driver complete work in sequence

Recommended KPI row:

* tasks today
* remaining stops
* collected cash
* pending handover

Action queue:

* next stop
* overdue task
* proof required task

Main list/table:

* ordered task list

Must not include:

* non-assigned global workload
* system-wide analytics

---

## Dashboard Copy Style

* Titles must be literal
* Numbers must have context
* Action queue language must feel direct and useful
* Avoid executive-dashboard language for operational users

## Dashboard Visual Rules

* generous spacing
* clear hierarchy
* calm surfaces
* no chart unless it drives a decision today
* status badges should be used more than colors alone
* cards should be compact, readable, and consistent
* tables should favor legibility over density

## Design Lock

All Phase 2 dashboards must follow this template. New dashboards may not invent a different page grammar.
