# Cloudflare Runbook  Mimo Phase 2

## 1) Purpose

This runbook defines the operator-facing configuration order, verification flow, rollback guidance, and evidence capture required to set up Cloudflare correctly for the Mimo production domain. It exists to ensure mimolaundry.org and api.mimolaundry.org resolve securely, redirect cleanly, and use minimal safe edge behavior before any stricter hardening like HSTS is enabled.

## 2) Target Production Hosts

- mimolaundry.org
- www.mimolaundry.org
- api.mimolaundry.org

## 3) Required Cloudflare Settings to Configure

- DNS records for apex, www, and api
- SSL/TLS mode set to Full (strict)
- edge certificates active
- HTTPS redirect behavior
- cache rules for public pages only
- non-cache treatment for /app/* and sensitive API/auth flows
- security headers baseline
- HSTS deferred until stable verification

## 4) Change Order

1) DNS records
2) origin routing verification
3) SSL/TLS mode and certificate verification
4) redirect verification
5) cache rule application
6) security header application
7) HSTS only after stable validation

## 5) Verification Checklist

- mimolaundry.org loads over HTTPS
- www.mimolaundry.org redirects to mimolaundry.org
- api.mimolaundry.org responds over HTTPS
- public web routes load correctly
- /app routes still function correctly
- API calls from the web app still succeed
- no redirect loops
- no mixed content warning
- certificate looks valid at edge
- cache rules do not break auth or app behavior
- security headers do not break page load
- HSTS is still deferred until stability is confirmed

## 6) Rollback / Repair Guidance

- if DNS target is wrong, restore the last known correct target
- if Full (strict) fails, fix origin certificate/trust rather than downgrading permanently
- if cache breaks auth/app behavior, disable the offending cache rule immediately
- if security headers break the app, roll back the specific header change and document it
- if redirects loop, disable the offending redirect rule and restore canonical path cleanly

## 7) Evidence to Capture

- screenshots of Cloudflare DNS records
- screenshot of SSL/TLS mode
- screenshot of edge certificate state
- screenshot of redirect rule or settings
- screenshot of cache rule summary
- browser proof of:
  - https://mimolaundry.org
  - https://www.mimolaundry.org redirect
  - https://api.mimolaundry.org
- any error and repair evidence if needed

## 8) Runbook Lock Statement

The Cloudflare runbook is locked to a minimal production-safe sequence where DNS, routing, TLS, redirects, caching, and security headers are applied in deliberate order and verified at each step. HSTS remains deferred until the production domain is proven stable so strict hardening follows successful validation rather than guesswork.
