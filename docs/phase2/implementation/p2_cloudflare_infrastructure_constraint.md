# P2.14 Infrastructure Constraint Record

## 1) Purpose
- This record captures the remaining infrastructure blockers that prevented P2.14 from reaching PASS after real production implementation and live verification.

## 2) Chapter Status
- P2.14 status: FAIL
- Acceptance state remains FAIL in docs/acceptance_phase2.md
- The failure is not due to missing repo implementation for the web/app routing model.

## 3) What Was Successfully Implemented
- mimolaundry.org is the canonical production web host
- www.mimolaundry.org redirects to mimolaundry.org
- app.mimolaundry.org was removed from the public production host model
- api.mimolaundry.org is reachable securely over HTTPS
- /app now resolves on apex and redirects to /login with private no-store behavior
- the P2.14 implementation baseline was created and committed
- acceptance and changelog records were updated with real production findings

## 4) Remaining Blockers
- Cloudflare Full (strict) did not remain stable for the live web origin
- live Vercel web responses still emit Strict-Transport-Security: max-age=63072000
- deferred-HSTS validation therefore cannot be satisfied in the current platform path

## 5) Evidence Summary
- live curl checks showed apex, www redirect, API HTTPS, and /app redirect behavior working
- switching Cloudflare web delivery to Full (strict) caused production web host failure
- Cloudflare-side HSTS was disabled
- repo-level Vercel header override attempted to set Strict-Transport-Security to max-age=0
- live production web responses still emitted Strict-Transport-Security: max-age=63072000 from Vercel-served responses

## 6) Root Constraint Statement
- Under the current Vercel custom-domain delivery path, deferred HSTS for the live web host could not be achieved through the verified repo-level and Cloudflare-level controls used in this chapter.
- Under the current web origin path, Cloudflare Full (strict) did not remain stable for production web delivery.

## 7) Constraint Classification
- Phase 2 Infrastructure Constraint

## 8) Impact
- P2.14 cannot be marked PASS without either:
  - changing the hosting/edge architecture for the web origin, or
  - revising the locked P2.14 requirement to accept the current platform limitation

## 9) Allowed Next Actions
- do not mark P2.14 PASS
- do not begin P2.15 under the original gate rules
- either open a platform-architecture remediation track or revise the locked requirement explicitly

## 10) Future Remediation Paths
- move web hosting to an origin path compatible with stable Cloudflare Full (strict)
- move web delivery to a platform path where deferred HSTS is actually controllable
- adopt an enterprise-grade certificate/origin configuration path if the platform supports it
- explicitly revise the P2.14 acceptance requirement if the business chooses to accept the current platform behavior

## 11) Constraint Lock Statement
- This record is the frozen explanation for why P2.14 remains FAIL after real implementation and verification.
