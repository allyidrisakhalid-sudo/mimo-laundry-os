# Role Routing Spec  Mimo Phase 2

## 1) Routing Principles

Locked principles:
- every authenticated user lands in the correct portal every time
- there is no generic dashboard landing
- there is no role confusion after login
- direct route access respects RBAC
- public routes and private routes remain clearly separated
- error handling must be calm and informative
- role routing must feel instant and deterministic

## 2) Role-to-Portal Routing Map

Locked routing map:
- CUSTOMER  /app/customer
- DRIVER  /app/driver
- HUB_STAFF  /app/hub
- AFFILIATE_STAFF  /app/affiliate
- AFFILIATE_ADMIN  /app/affiliate
- ADMIN  /app/admin
- DEV_ADMIN  /app/dev

Mandatory acceptance examples:
- Login as CUSTOMER  lands on /app/customer.
- Login as DRIVER  lands on /app/driver.
- Login as HUB_STAFF  lands on /app/hub.
- Login as AFFILIATE_STAFF  lands on /app/affiliate.
- Login as AFFILIATE_ADMIN  lands on /app/affiliate.
- Login as ADMIN  lands on /app/admin.
- Login as DEV_ADMIN  lands on /app/dev.
- Logged-in CUSTOMER opening /app/admin  receives 403.
- Expired session opening /app/customer  returns to /login.

## 3) Authenticated Entry Rules

- successful login routes user to the correct portal home
- visiting /login or /signup while already authenticated should redirect the user to their portal home
- if an authenticated user lands on root public pages intentionally, product behavior may allow browsing, but any open app action must return them to their portal cleanly
- portal root loads the correct shell immediately

Operational clarifications:
- the route decision must happen before rendering role-specific navigation
- direct deep links inside an allowed portal may continue if session and permission are valid
- root public site remains public, but authenticated open app behavior always resolves to the correct portal home

## 4) Forbidden Route Rules

- unauthorized role trying to access another portal gets a deliberate 403 surface
- do not redirect forbidden-role access to a different portal silently
- preserve trust by stating access is not allowed
- 403 page must offer the correct safe next action:
  - go to own portal home
  - get help if needed

Locked 403 behavior:
- page title states access is not allowed
- body explains the route is not available for this account
- primary action returns the user to their own portal home
- secondary action can route to help/support if needed
- never flash the forbidden portal shell before the 403 state appears

## 5) Loading and Transition Rules

- short routing/loading state allowed only if needed
- routing spinner must not become a dead holding state
- route decision must complete before exposing the wrong shell
- no flash of wrong navigation for another role

Locked loading behavior:
- use a neutral auth verification/loading surface only
- keep copy brief and calm
- do not display another roles sidebar, tabs, or dashboard during route resolution
- if routing fails because role data is malformed, move to controlled error/help handling immediately

## 6) Edge Case Rules

- invalid/expired session hitting app route  redirect to /login
- authenticated user with missing or malformed role data  controlled error/help path, not broken UI
- multi-role chooser is not introduced unless the backend/product truly supports it and a later chapter approves it
- affiliate staff and affiliate admin share /app/affiliate, but view permissions remain role-specific inside that portal

Edge case clarifications:
- if preserved return path logic exists, it must only return the user to a route their role is allowed to access
- app route refresh with valid session must keep the user inside the correct portal
- app route refresh with invalid session must remove protected shell access and return to login cleanly
- malformed role state must never default to admin, affiliate, hub, or any guessed portal

## 7) Routing Lock Statement

Role routing is locked as a deterministic auth behavior in which each authenticated user is sent directly to the correct Phase 2 portal root, forbidden cross-portal access produces a deliberate 403 surface, public and private routes remain clearly separated, and no generic dashboard or silent role-confusing redirect is allowed.
