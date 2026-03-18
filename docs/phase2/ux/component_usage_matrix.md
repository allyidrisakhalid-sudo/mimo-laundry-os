# Component Usage Matrix  Mimo Phase 2

## 1) Purpose of the Matrix

This matrix proves that the approved Phase 2 screen set can be built from one coherent component library without custom structural hacks, duplicate layouts, or one-off interaction behavior.

The matrix exists to:
- prove coverage for all current public and portal screens
- enforce component discipline
- prevent implementation drift
- show that approved screens remain minimal, consistent, and production-ready

---

## 2) Core Component Inventory

- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- Table
- FiltersBar
- Pagination
- EmptyState
- LoadingState
- WizardSteps
- ValidationStates
- PhoneInputTZ
- AddressForm
- StatusBadge
- Timeline
- SLAChip
- ConfirmDialog
- Toast
- InlineAlert

---

## 3) Screen-to-Component Mapping

### Screen Name
customer home

### Route
/app/customer

### Core Components Used
- AppShell
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- EmptyState
- LoadingState
- Toast
- InlineAlert

### Notes
Dashboard layout follows KPI row + action queue + list pattern. Mobile uses bottom-tab shell variant.

---

### Screen Name
customer orders

### Route
/app/customer/orders

### Core Components Used
- AppShell
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- EmptyState
- LoadingState
- StatusBadge

### Notes
Orders list remains simple and scannable. On smaller widths, list may transform from table to card/list while preserving meaning.

---

### Screen Name
customer order detail

### Route
/app/customer/orders/[id]

### Core Components Used
- AppShell
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- Timeline
- InlineAlert
- LoadingState

### Notes
Timeline is the truth surface. Page header carries one dominant action only if operationally justified.

---

### Screen Name
customer profile

### Route
/app/customer/profile

### Core Components Used
- AppShell
- Topbar
- PageHeader
- SectionHeader
- ValidationStates
- PhoneInputTZ
- AddressForm
- Toast
- InlineAlert
- LoadingState

### Notes
Profile editing uses the shared form system and local Tanzanian phone/address standards.

---

### Screen Name
driver today

### Route
/app/driver

### Core Components Used
- AppShell
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- SLAChip
- EmptyState
- LoadingState
- Toast
- InlineAlert

### Notes
Mobile-first variant supported through bottom tabs. Today view emphasizes task readiness and urgency scanning.

---

### Screen Name
driver tasks

### Route
/app/driver/tasks

### Core Components Used
- AppShell
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- SLAChip
- EmptyState
- LoadingState

### Notes
Task list prioritizes status, stop identity, and urgency. Responsive collapse allowed.

---

### Screen Name
driver task detail

### Route
/app/driver/tasks/[id]

### Core Components Used
- AppShell
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- Timeline
- InlineAlert
- ConfirmDialog
- Toast
- LoadingState

### Notes
Proof-related actions and high-impact completion states use feedback components deliberately.

---

### Screen Name
driver profile

### Route
/app/driver/profile

### Core Components Used
- AppShell
- Topbar
- PageHeader
- ValidationStates
- PhoneInputTZ
- Toast
- InlineAlert
- LoadingState

### Notes
Simple operational profile surface with minimal form footprint.

---

### Screen Name
hub dashboard

### Route
/app/hub

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- SLAChip
- Table
- EmptyState
- LoadingState
- InlineAlert

### Notes
Desktop-first shell. Queue scanning and operational status are core.

---

### Screen Name
hub intake

### Route
/app/hub/intake

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- ValidationStates
- Table
- StatusBadge
- Toast
- InlineAlert
- LoadingState

### Notes
Intake workflows use structured form states and queue visibility without custom structures.

---

### Screen Name
hub processing

### Route
/app/hub/processing

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- SLAChip
- LoadingState
- EmptyState

### Notes
Processing board or queue can still derive from approved list/table patterns at this stage.

---

### Screen Name
hub order detail

### Route
/app/hub/orders/[id]

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- Timeline
- InlineAlert
- ConfirmDialog
- Toast
- LoadingState

### Notes
Order truth and operational actions stay within one detail structure.

---

### Screen Name
affiliate dashboard

### Route
/app/affiliate

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- EmptyState
- LoadingState
- InlineAlert

### Notes
Dashboard follows the standard layout with KPI row + action queue + list blocks.

---

### Screen Name
affiliate create order

### Route
/app/affiliate/orders/new

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- WizardSteps
- ValidationStates
- PhoneInputTZ
- AddressForm
- InlineAlert
- Toast
- LoadingState

### Notes
Multi-step creation flow uses the locked wizard pattern and local input standards.

---

### Screen Name
affiliate orders

### Route
/app/affiliate/orders

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- EmptyState
- LoadingState

### Notes
Affiliate only sees own scope. No cross-shop duplication or alternative list pattern allowed.

---

### Screen Name
affiliate order detail

### Route
/app/affiliate/orders/[id]

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- Timeline
- InlineAlert
- Toast
- LoadingState

### Notes
Timeline proves order truth while keeping affiliate workflow readable.

---

### Screen Name
affiliate finance

### Route
/app/affiliate/finance

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- InlineAlert
- EmptyState
- LoadingState

### Notes
Finance views still use core data components only.

---

### Screen Name
admin dashboard

### Route
/app/admin

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- SLAChip
- Table
- EmptyState
- LoadingState
- InlineAlert

### Notes
Admin dashboard remains operational, not decorative.

---

### Screen Name
admin orders

### Route
/app/admin/orders

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- SLAChip
- EmptyState
- LoadingState

### Notes
High-volume operational list covered by table + filters + pagination.

---

### Screen Name
admin order detail

### Route
/app/admin/orders/[id]

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- Timeline
- InlineAlert
- ConfirmDialog
- Toast
- LoadingState

### Notes
Sensitive actions can use confirm dialog. Truth surface remains timeline.

---

### Screen Name
admin operations

### Route
/app/admin/operations

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- SLAChip
- InlineAlert
- LoadingState

### Notes
Operations scanning uses the same dense but disciplined data system.

---

### Screen Name
admin finance

### Route
/app/admin/finance

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- InlineAlert
- EmptyState
- LoadingState

### Notes
No finance-specific structural hack is required at this stage.

---

### Screen Name
dev home

### Route
/app/dev

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- StatusBadge
- EmptyState
- LoadingState
- InlineAlert

### Notes
Dev portal stays inside the shared shell and dashboard standard.

---

### Screen Name
dev diagnostics

### Route
/app/dev/diagnostics

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- InlineAlert
- LoadingState

### Notes
Diagnostic lists remain covered by data primitives.

---

### Screen Name
dev tools

### Route
/app/dev/tools

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- SectionHeader
- InlineAlert
- ConfirmDialog
- Toast
- LoadingState

### Notes
High-impact actions use feedback components. No custom tool layout required.

---

### Screen Name
dev activity

### Route
/app/dev/activity

### Core Components Used
- AppShell
- Sidebar
- Topbar
- PageHeader
- FiltersBar
- Table
- Pagination
- StatusBadge
- EmptyState
- LoadingState

### Notes
Activity log surfaces fit standard data patterns.

---

### Screen Name
public home

### Route
/

### Core Components Used
- PageHeader
- SectionHeader
- InlineAlert
- Toast
- LoadingState

### Notes
Public pages are not app-shell pages. Structural needs stay minimal and aligned to Phase 2 public IA.

---

### Screen Name
public track

### Route
/track

### Core Components Used
- PageHeader
- ValidationStates
- PhoneInputTZ
- StatusBadge
- Timeline
- InlineAlert
- LoadingState
- EmptyState

### Notes
Tracking uses the same truth timeline and shared form behavior.

---

### Screen Name
public partners

### Route
/partners

### Core Components Used
- PageHeader
- SectionHeader
- ValidationStates
- PhoneInputTZ
- InlineAlert
- Toast
- LoadingState

### Notes
Partner inquiry and information layout do not require one-off structures at this stage.

---

### Screen Name
public help

### Route
/help

### Core Components Used
- PageHeader
- SectionHeader
- InlineAlert
- LoadingState
- EmptyState

### Notes
Help stays minimal and structured.

---

### Screen Name
public login

### Route
/login

### Core Components Used
- PageHeader
- ValidationStates
- PhoneInputTZ
- InlineAlert
- Toast
- LoadingState

### Notes
Login form uses local phone standard and shared validation patterns.

---

### Screen Name
public signup

### Route
/signup

### Core Components Used
- PageHeader
- WizardSteps
- ValidationStates
- PhoneInputTZ
- AddressForm
- InlineAlert
- Toast
- LoadingState

### Notes
Signup can be single-step or multi-step, but must use the locked form system only.

---

## 4) Coverage Check

Coverage conclusions:
- every current Phase 2 screen is buildable from the approved library
- no screen requires a one-off structural component outside this library at this stage
- any future need beyond this library must be documented in a later chapter, not invented ad hoc

This matrix confirms that:
- public entry pages are covered
- all current role portals are covered
- dashboards, detail views, lists, forms, and feedback surfaces are covered
- responsive adaptation does not require structural improvisation

---

## 5) No-Custom-Hack Declaration

The Phase 2 UI must be built from this library.

Screens may not introduce custom structural hacks to compensate for missing discipline.

If implementation pressure reveals a true gap, that gap must be documented and approved in a later chapter before any new structural component is introduced.
