# P2.14 Cloudflare Implementation Baseline

## 1) Purpose
- This file converts the approved P2.14 Cloudflare and domain model into the implementation control layer for production DNS, TLS, redirects, caching, and baseline edge security.

## 2) Locked Production Hosts
- https://mimolaundry.org
- https://www.mimolaundry.org
- https://api.mimolaundry.org

## 3) Locked DNS Model
- mimolaundry.org points to the production web origin
- www.mimolaundry.org exists only to redirect to mimolaundry.org
- api.mimolaundry.org points to the production API origin
- no extra public production hosts are introduced

## 4) Locked TLS Model
- Cloudflare SSL/TLS mode is Full (strict)
- edge certificates are valid for web and API hosts
- origin trust must be valid enough to support strict mode
- no Flexible SSL
- no permanent Full (non-strict)

## 5) Locked Redirect Model
- www redirects permanently to apex
- HTTP redirects to HTTPS
- path and query are preserved where appropriate
- canonical host remains mimolaundry.org

## 6) Locked Caching Model
- public pages only
- /app/* is not public-edge-cached
- sensitive auth/API flows are not blanket public-edge-cached
- correctness beats aggressive caching

## 7) Locked Security Header Model
- baseline security headers are deliberate
- HTTPS enforcement is real
- HSTS remains deferred until stable verification is complete
- no blind copy-paste CSP breakage

## 8) Locked Stability Rule
- HSTS is not enabled until routing, TLS, redirects, and public/private behavior are verified stable in production

## 9) Implementation Guardrails
- no duplicate host behavior
- no undocumented DNS-only exception
- no routing loops
- no cache leakage of authenticated content
- no provider-domain host confusion in public use
- no premature HSTS enablement

## 10) Downstream Dependency Rule
- later deployment refinements must preserve this host/TLS/cache model unless explicitly revised

## 11) Baseline Lock Statement
- The Phase 2 Cloudflare implementation baseline is now the single source of truth for production domain and edge behavior.
