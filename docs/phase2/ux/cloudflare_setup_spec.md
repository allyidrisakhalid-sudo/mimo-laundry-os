# Cloudflare Setup Spec  Mimo Phase 2

## 1) Cloudflare Role in Production

- Cloudflare is the edge layer for domain routing, TLS termination, public caching policy, and baseline delivery hardening for mimolaundry.org
- Cloudflare must not introduce ambiguity between public web and API delivery
- Cloudflare configuration must stay minimal, explicit, and production-safe

## 2) Zone Configuration Summary

- one Cloudflare zone for mimolaundry.org
- production DNS entries documented and controlled
- no stray staging or test records mixed into the production zone
- edge settings must align with SEO, auth, and public routing decisions already locked

## 3) Public Host Exposure Summary

- mimolaundry.org is the canonical production host for the public web experience
- www.mimolaundry.org exists only as a permanent redirect to the apex host
- api.mimolaundry.org is the explicit production API host
- no additional public production hostnames are introduced in this chapter
- web and API public exposure stay clearly separated by hostname

## 4) Cache and Security Summary

- Cloudflare caching is limited to safe public-page use cases only
- /app/* routes are excluded from anonymous public edge caching
- api.mimolaundry.org is excluded from blanket public caching
- redirects must preserve canonical host, HTTPS, path, and query behavior
- SSL/TLS is locked to Full (strict)
- edge certificates must be active for mimolaundry.org, www.mimolaundry.org, and api.mimolaundry.org
- security headers must be deliberate, verified, and compatible with the product
- HSTS is deferred until routing and HTTPS stability are confirmed in production

## 5) Deployment Safety Rules

- DNS changes must be made intentionally and verified after change
- TLS mode changes must be verified after change
- cache rules must be verified against public and private routes
- security headers must be introduced with compatibility checks
- HSTS must be last among the strict hardening steps after stability

## 6) Cloudflare Setup Lock Statement

The Cloudflare production model is locked to one zone, minimal host exposure, strict TLS, controlled public-page caching, canonical redirects, and deliberate baseline hardening. The setup must remain explicit and verification-driven so mimolaundry.org and api.mimolaundry.org stay secure, stable, and operationally clear.
