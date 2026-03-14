# Security Hardening Chapter 10.3

## Goal

Harden the API against abuse and enforce strict privacy boundaries for scoped actors.

## Rate limiting

Redis-backed counters are enforced in the API for abuse-prone routes.

### Global / baseline

- Admin route baseline throttling is applied for `/v1/admin/*`
- Standardized error on limit hit:
  - HTTP 429
  - error code: `RATE_LIMITED`

### Auth limits

- `POST /v1/auth/register`
  - scoped limiter: `auth-register-ip`
  - purpose: reduce registration spam
- `POST /v1/auth/login`
  - scoped limiter: `auth-login-ip`
  - scoped limiter: `auth-login-identity`
  - purpose: reduce brute-force attempts from single IP and against a single identity

### OTP limits

- `POST /v1/dev/orders/:id/delivery-otp`
  - scoped limiter: `otp-generate-admin`
  - purpose: prevent OTP regeneration abuse by privileged actors
- `POST /v1/driver/stops/:id/deliver`
  - scoped limiter: `otp-delivery-stop`
  - current policy: 6 attempts per stop within 21600 seconds
  - purpose: prevent OTP brute-force on delivery confirmation

### Payments limits

- `POST /v1/payments/cash`
- `POST /v1/payments/mobile-money`
  - scoped limiter: `payments-actor`
  - purpose: reduce payment endpoint abuse and repeated submission risk

## Validation hardening

Validation is enforced server-side in `apps/api/src/dev.ts`.

### Rules in effect

- unknown request fields are rejected
- standardized validation error code:
  - HTTP 400
  - error code: `VALIDATION_FAILED`
- phone normalization is enforced for `+255` flows
- required fields and enum-like checks are enforced on route handlers
- notes, numeric values, and integer inputs are bounded

### Request-body surface reduction

- request bodies use explicit field allowlists via unknown-field rejection helpers
- this reduces accidental or malicious over-posting

## Upload / proof reference restrictions

Proof inputs are constrained even where storage is still reference-based.

### Accepted proof reference formats

For fields like `photoRef` and `signatureRef`, accepted formats are:

- UUID
- `upload://...`
- `https://...`

### Rejected formats

- arbitrary malformed strings
- unknown extra payload fields
- oversized or structurally invalid text values

### Signature restrictions

- `signatureName` is optional
- max length: 120 characters

### Notes restrictions

- optional notes are bounded
- max length: 1000 characters

## Privacy enforcement

Scoped access remains enforced through role + scope resolution.

### Covered boundaries

- Affiliate staff cannot access another shops order
- Driver cannot access another drivers trip/order scope
- Hub staff cannot access another hubs order scope
- Customer cannot access another customers order, balance, or timeline
- Admin can access all scoped records
- Non-DEV_ADMIN actors cannot use DevAdmin override endpoints

## Automated test coverage

Tests added under `apps/api/test`:

- `privacy.test.ts`
  - 13 assertions covering affiliate, driver, hub, customer, admin, and dev-override boundaries
- `abuse.test.ts`
  - login brute-force throttling proof
  - OTP brute-force throttling proof

## Test harness notes

A lightweight Vitest integration harness was added:

- seeds the database before each suite
- starts the API on port 3001
- supports Windows process cleanup for stable suite execution

## Gate proof

The Chapter 10.3 gate is:

> Abuse tests fail safely; forbidden access always blocked.

This gate is satisfied when:

- full API test suite passes
- rate limiting returns controlled failures
- no 500s occur during abuse simulation
- cross-scope access returns 403 consistently
