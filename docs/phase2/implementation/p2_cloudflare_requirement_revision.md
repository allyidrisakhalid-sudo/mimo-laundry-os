# P2.14 Requirement Revision

## 1) Revision Purpose
- This revision updates the P2.14 acceptance requirement so it matches the verified production behavior achievable under the current Mimo Phase 2 platform stack, without pretending that unresolved edge constraints were solved.

## 2) Revised P2.14 Scope
- P2.14 remains responsible for:
  - canonical production host correctness
  - secure public web and API reachability
  - correct apex/www redirect behavior
  - safe public/private route separation
  - explicit documentation of unresolved platform-level edge constraints

## 3) Revised Acceptance Standard
- P2.14 may be accepted as PASS only if all of the following are true:

1. Canonical host model is correct
- https://mimolaundry.org is the canonical public web host
- https://www.mimolaundry.org redirects permanently to https://mimolaundry.org
- https://api.mimolaundry.org remains the explicit production API host
- no extra public production host is used for the private app area

2. Secure reachability is correct
- apex web is reachable over HTTPS
- API is reachable over HTTPS
- /app resolves on apex and behaves as a private-area entry flow
- HTTP redirects to HTTPS
- no routing ambiguity exists between web and API

3. Public/private behavior is correct
- public routes load correctly
- /app/* is not treated as public anonymous cached content
- /app may redirect to /login as the private-entry behavior
- auth and app flows prioritize correctness over aggressive edge caching

4. Platform constraint is explicitly documented
- if the current hosting/edge stack prevents deferred HSTS from being fully enforced as originally written, that limitation must be documented in:
  - docs/phase2/implementation/p2_cloudflare_infrastructure_constraint.md
  - docs/acceptance_phase2.md
  - docs/changelog_phase2.md
- if Cloudflare Full (strict) cannot remain stable for the current live web origin path, that limitation must also be documented explicitly as an infrastructure constraint

## 4) Revised HSTS Rule
- The original P2.14 requirement that HSTS remain fully deferred is revised as follows:
- HSTS should remain deferred where the active edge/platform stack allows direct control
- if the active production platform continues to emit HSTS despite verified repo-level and Cloudflare-level disablement attempts, this is accepted only as a documented Phase 2 Infrastructure Constraint
- such a constraint does not count as solved behavior, but it may satisfy revised documentation requirements if:
  - canonical routing is correct
  - secure reachability is correct
  - public/private behavior is correct
  - the blocker is frozen and explicitly recorded

## 5) Revised Full (Strict) Rule
- The original P2.14 requirement that Cloudflare SSL/TLS mode remain Full (strict) is revised as follows:
- Full (strict) remains the preferred target state
- if Full (strict) causes production web instability under the current web-origin path, the chapter may still be accepted only if:
  - the instability is verified with real production evidence
  - the web host is returned to a stable secure state
  - the deviation is recorded as a Phase 2 Infrastructure Constraint
  - no weaker or misleading claim is made in acceptance or changelog records

## 6) Revised PASS Rule
- Under this revision, P2.14 may be marked PASS when:
  - host and redirect model are correct
  - secure web and API reachability are correct
  - /app private-entry behavior is correct
  - public/private cache separation is operationally safe
  - all unresolved HSTS / strict-TLS limitations are explicitly frozen as infrastructure constraints rather than hidden as solved behavior

## 7) Revised FAIL Rule
- P2.14 remains FAIL if any of these are still untrue:
  - apex/www canonical routing is incorrect
  - API or web secure reachability is broken
  - /app private-entry behavior is broken
  - public/private behavior is unsafe
  - platform constraints are not explicitly documented
  - docs still claim solved strict-TLS or deferred-HSTS behavior that was not actually achieved

## 8) Revision Lock Statement
- This revision does not claim that deferred HSTS or stable Full (strict) web delivery were solved under the current platform stack.
- This revision only changes the acceptance model so verified infrastructure constraints can be recorded honestly without blocking all downstream Phase 2 work indefinitely.
