# Full Launch Expansion Playbook

## Chapter 12.3 objective

Expand Laundry OS from soft launch into full launch using configuration only:

- add or activate zones
- link or add hubs
- onboard affiliate shops
- onboard drivers
- validate end-to-end behavior
- do not change application code

## Locked rules

- No code changes for expansion
- Expansion is configuration-only via admin portal/tools
- Expand one zone batch at a time
- If metrics degrade, expansion pauses immediately
- Multi-hub + zone backbone remains routing truth
- RBAC scoping must hold
- Pricing versioning remains intact

## Expansion order (must follow exactly)

1. Add or activate zone
2. Link or add hub to that zone
3. Add or activate affiliate shops in that zone
4. Add or activate drivers with HomeZone = that zone
5. Run mini dry-run in that zone (23 orders)
6. Only then open ordering to public for that zone

## Capacity rules required before enabling orders

- Max orders per day per zone
- Max active stops per driver per shift
- Hub daily capacity threshold (warning minimum)

## Zone expansion checklist

- Create zone with name and metadata
- Mark zone active
- Verify zone appears in admin and ordering flows

## Hub onboarding checklist

- Create hub
- Link hub to zone
- Set address label
- Set capacity fields
- Set supported service tiers
- Mark active
- Create hub staff users
- Verify zone orders route to this hub
- Verify hub staff see only hub-scoped orders

## Affiliate onboarding checklist

- Create affiliate shop
- Link affiliate to zone
- Assign commission plan
- Mark active
- Create affiliate staff
- Verify affiliate shop visibility is zone-filtered
- Verify cross-shop access is forbidden

## Driver onboarding checklist

- Create driver user
- Create driver profile
- Set home zone
- Set availability = AVAILABLE
- Mark active
- Verify only assigned tasks visible
- Verify cross-zone assignment rejection

## Validation test for each new zone

- 1 door order
- 1 shop order
- 1 hybrid return order (recommended)
- Confirm:
  - zone to hub assignment
  - shop list filtered by zone
  - driver task visibility
  - timeline updates
  - invoice/receipt generation
  - commission trigger on delivered+paid shop orders
  - reporting reflects zone activity

## Pause conditions

Pause expansion immediately if any of the following occur:

- backlog appears in new zone
- reconciliation mismatch appears
- wrong hub assignment occurs
- cross-scope visibility occurs
- driver cross-zone assignment is accepted
- invoice / commission / reporting mismatches appear

## Gate statement

Adding a hub, affiliate, or driver must require no development work only admin configuration.
