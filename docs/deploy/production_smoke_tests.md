# Production smoke tests

## Automated smoke tests

- GET https://api.mimolaundry.org/v1/health -> 200
- GET https://api.mimolaundry.org/v1/health/db -> 200
- GET https://api.mimolaundry.org/v1/zones with admin auth -> 200

## Manual workflow

1. Create or use a production test customer
2. Create production order
3. Hub intake records weight and appends event
4. Processing moves order to packed / ready
5. Dispatch assigns to driver
6. Driver completes pickup / delivery proof
7. Payment recorded and receipt generated
8. Daily closing report includes test order
9. Audit log records privileged actions
