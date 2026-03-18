# Session and Logout Spec  Mimo Phase 2

## 1) Session Experience Principles

Locked principles:
- session behavior must feel predictable
- auth state must not surprise the user
- logout must be explicit and clean
- expired sessions must recover gracefully
- session handling must never drop the user into a broken portal shell
- security and clarity must both be respected

## 2) Active Session Rules

- authenticated user can move within allowed portal routes normally
- public auth pages redirect away when session is active
- portal shell/profile menu must expose logout clearly
- session-based protected routes must not leak protected data before auth is confirmed

Locked active-session behavior:
- auth confirmation occurs before portal content is revealed
- direct access to /login and /signup while signed in sends the user to their portal home
- profile/account menu is the single consistent location for logout
- valid refresh or restored session keeps the user in the correct portal after reload

## 3) Expired Session Rules

- expired session on protected route redirects to /login
- preserve a clean re-entry path when appropriate
- message must explain that the session ended and login is needed again
- do not show cryptic auth errors to normal users

Locked expired-session behavior:
- redirect target is `/login`
- optional return path may be preserved only when safe and role-valid
- user-facing copy must explain that sign-in is needed again
- do not expose token or session implementation details in user-facing surfaces

## 4) Logout UX Rules

- logout action lives in the profile/account menu
- logout label is plain and visible
- if confirm dialog is used, it must be justified and concise
- on logout, user returns to /login or another defined public auth entry
- all portal-specific nav disappears after logout
- success state must be clean and final

Locked logout behavior:
- preferred destination after logout: `/login`
- if a confirm dialog is used, it should appear only when needed by actual product behavior
- confirm copy must stay short and direct
- after logout, protected portal shells, sidebars, tabs, and role-specific actions must no longer be visible
- browser back navigation must not reveal live protected data after logout

## 5) Cross-Portal Session Behavior

- user cannot switch portals unless their role allows that portal
- one authenticated role session does not create visible cross-portal confusion
- internal portal shells remain role-correct after refresh or deep link
- browser refresh on allowed route keeps the user in the correct portal if session is valid

Locked cross-portal behavior:
- CUSTOMER session does not expose driver, hub, affiliate, admin, or dev shells
- DRIVER session does not expose customer, hub, affiliate, admin, or dev shells beyond allowed product behavior
- AFFILIATE_STAFF and AFFILIATE_ADMIN share `/app/affiliate`, but sub-permissions inside that portal stay role-correct
- ADMIN and DEV_ADMIN always remain separated by approved route access and permission model

## 6) Session Feedback States

### Loading Auth State
- trigger: auth status is being checked before allowing public-auth redirect or portal rendering
- message intent: calm verification
- user next action: wait briefly while access is confirmed
- forbidden wording:
  - blame language
  - technical token/session jargon on user-facing screens
  - security theater language
  - ambiguous something went wrong with no next step

### Expired Session State
- trigger: protected route is opened with an invalid or expired session
- message intent: re-entry required
- user next action: log in again
- forbidden wording:
  - blame language
  - technical token/session jargon on user-facing screens
  - security theater language
  - ambiguous something went wrong with no next step

### Forbidden Access State
- trigger: authenticated user opens a portal or route outside allowed role scope
- message intent: access not allowed here
- user next action: return to own portal home or get help
- forbidden wording:
  - blame language
  - technical token/session jargon on user-facing screens
  - security theater language
  - ambiguous something went wrong with no next step

### Logout Success State
- trigger: user completes logout successfully
- message intent: signed out cleanly
- user next action: log in again if needed
- forbidden wording:
  - blame language
  - technical token/session jargon on user-facing screens
  - security theater language
  - ambiguous something went wrong with no next step

### Generic Auth Error State
- trigger: recoverable auth issue that is neither a standard invalid credential message nor a standard expired-session message
- message intent: retry or get help
- user next action: try again or use support/help path
- forbidden wording:
  - blame language
  - technical token/session jargon on user-facing screens
  - security theater language
  - ambiguous something went wrong with no next step

## 7) Session Lock Statement

The Phase 2 session model is locked as a predictable, role-correct auth experience in which valid sessions keep users inside the right portal, expired sessions return users cleanly to login, forbidden access shows a deliberate 403 state, and logout ends the experience clearly without leaving broken shells, confusing navigation, or exposed protected data.
