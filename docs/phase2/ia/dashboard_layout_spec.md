# Dashboard Layout Spec  Phase 2 Blueprint Lock (P2.0)

System: Mimo Laundry OS  
Rule: Every dashboard follows one structural logic so the product feels calm, premium, and operationally consistent.

## Global Dashboard Template

1. Header band  
2. KPI row  
3. Action queue  
4. Main table/list  
5. Secondary support panel only if the role truly needs it  

## Global Rules

- KPI row: 36 cards max.
- Action queue: mandatory.
- Table/list: mandatory.
- No charts unless a chart directly drives a same-day decision.
- Every dashboard must answer:
  - What happened?
  - What needs attention now?
  - What do I do next?
- The page must expose one dominant daily action first.

---

## A) Customer Home

**Header band**
- welcome/state summary

**KPI row**
- active orders
- ready for action
- unpaid balance or payment state

**Action queue**
- continue active order / track order / resolve payment if needed

**Main list**
- recent orders

**Secondary panel**
- help/support shortcut

---

## B) Driver Today

**Header band**
- today summary + availability

**KPI row**
- assigned tasks
- pending proofs
- cash to reconcile

**Action queue**
- next stop first

**Main list**
- today task list in execution order

**Secondary panel**
- alerts/exceptions

---

## C) Hub Dashboard

**Header band**
- hub operational summary

**KPI row**
- intake waiting
- in processing
- dispatch ready
- exceptions

**Action queue**
- next queue needing action

**Main list**
- active operational queue

**Secondary panel**
- SLA alerts

---

## D) Affiliate Dashboard

**Header band**
- shop summary

**KPI row**
- today orders
- ready for pickup/return
- active issues
- commission/payout snapshot for admin-capable affiliate views

**Action queue**
- create order / release ready item / resolve issue

**Main list**
- shop orders needing attention

**Secondary panel**
- customer/shop pickup readiness

---

## E) Admin Dashboard

**Header band**
- platform summary

**KPI row**
- active orders
- delayed/exceptions
- delivered today
- paid today
- reconciliation/payout flags

**Action queue**
- highest-priority platform issues

**Main list**
- global orders/issues queue

**Secondary panel**
- by-zone/by-hub pressure summary

---

## Dashboard Consistency Rules

All dashboards use the same structural logic, with role-specific data only.
