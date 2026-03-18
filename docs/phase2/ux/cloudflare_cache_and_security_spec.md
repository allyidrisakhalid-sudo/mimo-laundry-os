# Cloudflare Cache and Security Spec  Mimo Phase 2

## 1) Edge Delivery Principles

Locked edge delivery principles:
- cache only what is safe
- public pages only
- app and API correctness beats edge aggressiveness
- authenticated content must not be cached at the edge as public content
- cache behavior must remain understandable
- Cloudflare should improve delivery, not create stale-auth bugs
- minimal correct rules beat many speculative rules

## 2) Caching Scope Rules

- caching rules apply only to public website routes intended for anonymous browsing
- app portals under /app/* are excluded from public edge caching behavior
- API responses are excluded from public page caching behavior unless a later chapter explicitly defines safe API cache cases
- auth pages must be handled carefully and not treated as generic marketing-cache targets

## 3) Public Page Caching Rules

Locked public-cache candidates:
- /
- /track
- /partners
- /help
- /terms
- /privacy
- /refund-policy

Rules:
- public pages may receive Cloudflare performance/caching treatment appropriate for mostly public content
- caching strategy must remain compatible with fresh deployments and content correctness
- do not create stale canonical/metadata mismatch
- if /track contains dynamic lookup behavior, cache only the static shell safely, not private result data
- login and signup are not treated as generic heavily cached marketing pages in this chapter

## 4) API and App Non-Cache Rules

- /app/* must not be publicly edge-cached as anonymous content
- api.mimolaundry.org responses must not receive blanket public caching
- authenticated sessions, portal HTML, and sensitive API responses must prioritize correctness and security
- no cached authenticated leakage is acceptable

## 5) Redirect Rules

### Apex vs WWW Redirect
- www.mimolaundry.org redirects permanently to https://mimolaundry.org
- mimolaundry.org remains the canonical public host

### HTTP to HTTPS Redirect
- all public requests redirect to HTTPS
- no mixed public protocol paths remain intentionally open

### Canonical Host Preservation
- redirects must reinforce the canonical host used in SEO metadata and sitemap
- redirects must not conflict with canonical URL rules from P2.4

### Path and Query Preservation
- redirects preserve path and query where appropriate
- tracking or login paths must not be broken by redirect simplification

### Forbidden Patterns
- redirect loops
- dual-canonical hosts
- protocol confusion
- provider-domain redirects visible to end users

## 6) Security Header Rules

### Baseline Header Principles
- security headers must harden delivery without breaking the product
- baseline headers must be deliberate and documented
- do not set copy-pasted aggressive headers blindly
- rollout must prefer verified compatibility

### Required Header Families
- HTTPS enforcement
- HSTS after stable verification
- X-Content-Type-Options style hardening
- Referrer-Policy style control
- baseline frame and content protection rules as compatible with the product

Do not hardcode speculative CSP details in this chapter unless already verified elsewhere. This chapter defines the requirement to apply deliberate security headers, not untested header theater.

### HSTS Rollout Rule
- HSTS is applied only after routing and HTTPS behavior are verified stable
- do not enable preload in this chapter
- document that HSTS must follow successful validation, not precede it

### API vs Web Header Considerations
- web and API security headers may differ where technically appropriate
- header policy must not break the API
- header policy must not break auth/session flows

### Forbidden Patterns
- enabling HSTS too early
- blindly copied CSP causing breakage
- security header config with no verification step
- inconsistent host/protocol enforcement

## 7) Verification Model

- verify public-cache candidates load correctly through Cloudflare
- verify /app/* behavior remains correct without public edge caching
- verify API and auth behavior are not broken by cache treatment
- verify redirects preserve host, path, query, and HTTPS expectations
- verify security headers improve hardening without breaking pages or flows
- verify HSTS remains deferred until routing and HTTPS stability are confirmed

## 8) Edge Delivery Lock Statement

Cloudflare edge delivery is locked to a minimal, production-safe model where only clearly public routes may receive caching treatment, while app routes, auth flows, and API behavior prioritize correctness and security. Redirects and security headers must reinforce the canonical domain and HTTPS delivery without introducing stale-auth risk or compatibility breakage.
