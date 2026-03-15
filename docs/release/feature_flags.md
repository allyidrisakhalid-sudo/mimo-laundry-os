# Feature Flags

## Purpose

Allow safe rollout of risky functionality without redeploy-dependent rollback.

## Required fields

- flagKey: string
- enabled: boolean
- scope: GLOBAL | ZONE | HUB | AFFILIATE | USER_SEGMENT
- scopeRef: nullable reference for scoped rollout
- notes: string
- updatedAt: datetime
- updatedByUserId: user id

## v1 minimum scope

- GLOBAL
- ZONE

## Operational rules

- Flags default to disabled.
- Enable in staging first.
- In production, enable for one zone first.
- Expand only after stability review.
- Disable instantly if degradation appears.

## Read paths

- API reads flags for server-side behavior.
- Web reads flags for UI exposure.
- Mobile reads flags for UI exposure.

## Example rollout

### FEATURE_SUBSCRIPTIONS

- staging: enabled for testing
- production: disabled globally
- production pilot: enabled for one zone only
- rollback: disable immediately without redeploy

## Proof expectations

- Deploy with flag still disabled and confirm no visible change
- Enable for one zone and confirm only that zone receives behavior
- Disable again and confirm rollback without redeploy
