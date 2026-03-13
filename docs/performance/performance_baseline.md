# Chapter 10.2 Performance Baseline

## Scope

Chapter 10.2 established baseline performance and scale practices for local development:

- hot-query database indexes
- pagination contract for list endpoints
- short-TTL Redis caching for a read-heavy pricing endpoint
- baseline load testing with autocannon

## Hot-query indexes added

### Affiliate shops

- `AffiliateShop(zoneId, createdAt)`
- Reason: supports zone-scoped affiliate lookups and stable ordering.

### Orders

- `Order(hubId, statusCurrent, createdAt)`
- `Order(zoneId, statusCurrent, createdAt)`
- `Order(affiliateShopId, createdAt)`
- `Order(hubId, zoneId, statusCurrent, createdAt)`
- Reason: supports hot operational boards, affiliate order lists, and filtered admin order views.

### Order timeline

- `OrderEvent(orderId, occurredAt, createdAt)`
- Reason: supports immutable timeline reads ordered by occurred time.

### Driver operations

- `Trip(driverId, status, createdAt)`
- `Trip(zoneId, status, createdAt)`
- `TripStop(tripId, status, sequence)`
- Reason: supports active driver task reads and ordered trip-stop execution.

### Commissions and payments

- Existing indexed access patterns were preserved and used:
  - `CommissionLedgerEntry(affiliateShopId, status, earnedAt)`
  - `Payment(orderId, receivedAt)`

## Pagination contract

Standard query params:

- `page` default `1`
- `pageSize` default `20`
- max `pageSize` = `100`

Validation:

- invalid `page` returns `VALIDATION_ERROR`
- invalid `pageSize` returns `VALIDATION_ERROR`

Standard response shape:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}

Applied in Chapter 10.2 to these list-style endpoints:
- `GET /v1/affiliate/orders`
- `GET /v1/driver/tasks`
- `GET /v1/admin/audit`
- `GET /v1/admin/commissions`
- `GET /v1/admin/reports/daily-close`
- `GET /v1/admin/reports/driver-cash`
- `GET /v1/admin/payouts/report`

## Caching strategy

### Endpoint cached
- `GET /v1/admin/pricing/plans`

### Cache backend
- Redis via `ioredis`

### Cache key
- `cache:admin:pricing:plans`

### TTL
- 60 seconds

### Invalidation
The cache is invalidated after:
- `POST /v1/admin/pricing/plans`
- `POST /v1/admin/pricing/plans/:id/activate`

### Runtime proof
Observed API log proof:
- `[cache] set admin pricing plans`
- `[cache] hit admin pricing plans`
- `[cache] invalidated admin pricing plans after create`
- `[cache] invalidated admin pricing plans after activate`

## Load test baseline

### Tool
- `autocannon`

### Script
- `tools/loadtest/chapter_10_2_baseline.cjs`

### Endpoints tested
1. `GET /v1/health`
2. `GET /v1/affiliate/orders?page=1&pageSize=20`
3. `GET /v1/orders/order_customer_a/timeline`
4. `GET /v1/admin/audit?page=1&pageSize=20`

### Profile
- duration: 30 seconds per scenario
- concurrency: 10 connections

### Result summary
- zero errors
- zero timeouts
- zero non-2xx responses

Observed latency from autocannon output:
- health p95  13 ms
- affiliate orders p95  28 ms
- order timeline p95  16 ms
- admin audit p95  27 ms

These were within the baseline local targets:
- hot read endpoints p95 <= 300 ms
- authenticated list endpoints p95 <= 500 ms

## Operational conclusion
Chapter 10.2 established a valid local-dev performance baseline:
- hot reads are indexed
- list endpoints are paginated
- selected read-heavy pricing data is cached and invalidated correctly
- baseline load testing passes without instability
```
