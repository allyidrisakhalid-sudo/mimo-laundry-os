# Navigation Model  Phase 2 Blueprint Lock (P2.0)

System: Mimo Laundry OS  
Rule: Navigation must be minimal, role-correct, and operationally obvious.

## A) Web App Navigation Model

### Global Header Inside /app/*

The global header must contain exactly:
- Mimo logo (left)
- Current portal label
- Language toggle (EN/SW)
- Notifications entry if supported by existing product
- Profile/account menu (right)

### Header Rules

- No marketing links inside /app/*.
- No role switcher unless the user truly has multiple roles in product logic.
- No duplicated sidebar actions in the header.
- Keep header utility-only.

## Role Sidebars

### CUSTOMER Sidebar
- Home
- Orders
- Profile

### DRIVER Sidebar
- Today
- Tasks
- Profile

### HUB_STAFF Sidebar
- Dashboard
- Intake
- Processing

### AFFILIATE_STAFF Sidebar
- Dashboard
- New Order
- Orders

### AFFILIATE_ADMIN Sidebar
- Dashboard
- New Order
- Orders
- Finance

### ADMIN Sidebar
- Dashboard
- Orders
- Operations
- Finance

### DEV_ADMIN Sidebar
- Home
- Diagnostics
- Tools
- Activity

## Sidebar Rules

- Show only what the role can actually use.
- No dead links.
- No disabled placeholder items.
- Active route must be visually obvious.
- Sidebar labels must match i18n keys later.
- Sidebar order must reflect daily usage priority, top to bottom.

## B) Mobile Navigation Model

Mobile bottom tabs exist only for CUSTOMER and DRIVER.

### CUSTOMER Mobile Tabs
- Home
- Orders
- Profile

### DRIVER Mobile Tabs
- Today
- Tasks
- Profile

### Mobile Rules

- 3 tabs only for both customer and driver.
- Labels short and clear.
- Current tab strongly visible.
- No hidden critical action behind More.
- Primary work must be reachable in one tap from a tab root.

Do not include Cash as a separate tab in P2.0. Cash summary remains inside Driver Today or Task Detail, not top-level nav.

## C) Navigation Behavior Rules

- Login routes user automatically to their portal home.
- Direct forbidden route access returns 403 state, not redirect loop.
- Sidebar collapses cleanly on smaller desktop widths.
- Mobile uses bottom tabs only where defined.
- Detail pages do not appear as permanent sidebar items.
- Breadcrumbs appear only where needed on web admin-like views, not everywhere.

## Navigation Minimality Check

Every navigation item maps to a real page, and no role sees irrelevant destinations.
