# Release Playbook

## Change types

A. Configuration change
B. Pricing plan change
C. Feature rollout
D. Bug fix release

## Required outputs for every change

- release note entry
- before/after proof
- audit record where applicable
- staging verification evidence
- post-release health and integrity checks

## Standard release flow

### 1. Classify the change

Record whether the change is:

- configuration-only
- pricing version
- feature flag rollout
- bug fix

### 2. Staging

Required before production:

- CI green
- staging deploy complete
- smoke tests pass
- health endpoints pass
- targeted workflow proof captured

### 3. Production

- use provider rolling / zero-downtime deploy path
- deploy only after staging evidence is attached
- do not enable risky features by default

### 4. Post-deploy verification

Check:

- /v1/health = ok
- /v1/health/db = ok
- one pre-existing order still has intact timeline
- one new order after deploy works correctly
- old invoice line items remain locked
- audit logs still writing
- background jobs still running
- RBAC still blocks cross-scope access

### 5. Rollback

- first response: disable feature flag if feature-related
- second response: app rollback per provider if deploy-related
- preserve evidence and incident note

## Chapter 12.4 gate proof

Pass requires:

- one safe change cycle demonstrated
- no downtime observed in health checks
- no data corruption in orders / invoices / audit / RBAC
