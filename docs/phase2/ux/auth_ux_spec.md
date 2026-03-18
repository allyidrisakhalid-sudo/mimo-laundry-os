# Auth UX Spec  Mimo Phase 2

## 1) Auth Experience Principles

Locked principles:
- one clear login entry
- one clear signup entry
- role confusion is forbidden
- bilingual from first interaction
- minimal fields
- trust-first presentation
- premium but mass-market understandable
- auth must feel fast, calm, and obvious
- public auth screens must remain clean and mobile-first
- auth must not expose internal role complexity to the wrong audience

## 2) Login Page Spec

### Route
- `/login`

### Purpose
- authenticate any existing allowed user and route them to the correct portal automatically

### Supported Users
- customer
- driver
- hub staff
- affiliate staff
- affiliate admin
- admin
- dev admin

### Primary CTA
- Log in

### Secondary Links
- Create account
- Forgot password

### Page Structure
1. top minimal public header
2. auth surface
3. login panel
4. support/help link area
5. footer

Auth surface rules:
- split layout on desktop only if it remains clean
- mobile-first single-column experience
- premium Midnight Silk visual framing
- no distracting marketing clutter
- no role chooser before login
- no duplicated signup content inside the login body

Login panel anatomy:
- title
- short subtitle
- phone input using the approved +255 treatment
- password field
- forgot password link
- primary login button
- signup link
- optional support/help link
- language toggle visible at page level

### Field Rules
- use PhoneInputTZ component rules
- phone is the primary identifier
- password field must support show/hide
- labels must stay visible
- placeholders must not carry the entire meaning
- no unnecessary fields

### Validation Rules
- inline validation only
- clear error near field
- incorrect credentials must return calm, non-revealing language
- disabled/loading states must follow the component state rules
- submit button remains single primary action

### Forgot Password Rules
- include forgot password entry in the login UI
- if reset flow exists, document the direct route/path
- if reset flow is not yet implemented, the link must route to a controlled support/help path and must not be a dead link
- there must be no broken forgot-password promise

Locked current rule for P2.5:
- forgot password must point to a controlled help path until a true reset flow is implemented
- approved fallback path: `/help`
- approved behavior: help page explains how to contact support for account recovery without presenting a broken self-service promise

### Routing Rules
- successful login must never land the user on a generic holding page
- user lands directly in the correct portal home by role
- if a user has exactly one role, route immediately
- if multi-role support is not part of current product logic, do not invent a role selector

### Mobile Rules
- CTA visible without deep scroll
- one-column auth card
- large tap targets
- no oversized decorative visual pushing the form too low
- support/help path remains visible but secondary

### Visual Rules
- premium auth panel on silk-light surface
- dark branded framing around it
- one calm visual support area only
- concise copy
- clear card hierarchy
- strong focus states

### Forbidden Patterns
- social login buttons unless truly supported
- multi-step login for standard users
- role chooser before authentication
- noisy marketing blocks on auth page
- dead links
- duplicate help or signup walls inside login

## 3) Signup Flow Spec

### Route
- `/signup`

### Purpose
- create a customer account with minimum friction and immediate clarity

### Supported User
- customer only

### Primary CTA
- Create account

### Secondary Link
- Log in

### Flow Structure
1. page entry
2. account creation form
3. terms/privacy acknowledgment
4. successful account creation
5. route to customer portal

Form anatomy:
- title
- short subtitle
- phone input using +255 format
- password field
- confirm password field if current auth logic requires it
- name field only if required by product logic
- terms/privacy acknowledgment
- primary create-account CTA
- login link

### Field Rules
- minimal required fields only
- no asking for business/staff/admin role at signup
- no over-collection of profile data
- no address capture in signup
- no marketing survey questions

Locked current minimal form assumption for implementation:
- required: phone, password
- conditional: confirm password if current auth logic requires it
- optional only if already required by product logic: name
- no additional profile capture in P2.5

### Validation Rules
- inline field validation
- password rules explained clearly and briefly
- duplicate account error handled calmly
- terms/privacy requirement explicit if used
- success state must feel immediate and trustworthy

### Success Rules
- on success, route directly to `/app/customer` unless the product requires verification first
- if verification is required by actual product logic, show one clean confirmation step and then continue
- do not send the user into a confusing dead-end success screen

Locked current rule for P2.5:
- customer signup is the only public signup flow
- internal staff/admin roles are provisioned internally and do not self-register on public auth pages

### Signup Mobile Rules
- same premium auth pattern as login
- one-column form
- clear spacing
- CTA visible without excessive scroll
- no clutter below the fold

### Signup Forbidden Patterns
- role selection maze
- collecting driver, staff, affiliate, or admin onboarding here
- long multi-step signup for basic customer entry
- duplicate login content blocks
- public-facing enterprise registration complexity

## 4) Post-Login Router Spec

Summary lock:
- login is one clean entry for all supported existing users
- successful authentication immediately calls the role router
- role router sends the user directly to the correct portal root
- there is no generic dashboard holding page
- there is no pre-auth role chooser
- forbidden portal access is handled with a deliberate 403 surface, not a silent redirect

Portal summary:
- CUSTOMER  `/app/customer`
- DRIVER  `/app/driver`
- HUB_STAFF  `/app/hub`
- AFFILIATE_STAFF  `/app/affiliate`
- AFFILIATE_ADMIN  `/app/affiliate`
- ADMIN  `/app/admin`
- DEV_ADMIN  `/app/dev`

## 5) Session and Logout Experience Summary

Summary lock:
- active sessions redirect away from `/login` and `/signup`
- protected routes must confirm auth before exposing portal shell content
- expired sessions return users cleanly to `/login`
- logout must be clearly available in the profile/account menu
- logout must remove portal-specific navigation and end on a clean public auth entry
- session feedback must remain calm, short, and helpful

## 6) Auth UX Lock Statement

The Phase 2 authentication experience is locked as a minimal, bilingual, premium, mobile-first system with one clear login entry for all supported existing users, one minimal customer-only signup entry, deterministic role routing after authentication, and stable session/logout behavior that avoids confusion, duplication, and dead-end states.
