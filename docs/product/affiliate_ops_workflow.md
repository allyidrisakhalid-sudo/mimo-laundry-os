# Affiliate Operations Workflow v1

## Scope

Chapter 8.6 enables affiliate shops to operate as scoped mini-branches.

Affiliate staff can:

- create walk-in orders
- view only their own shop orders
- mark orders ready for pickup at shop
- mark customer pickup complete
- create hybrid return orders for home delivery return

Affiliate staff cannot:

- see other shops' orders
- act on other shops' orders
- access global admin views through affiliate endpoints

## Walk-in order creation

Endpoint:

- `POST /v1/affiliate/orders`

Required fields:

- `customerPhone`
- `tier`
- `returnMethod`

Optional fields:

- `customerName`
- `notes`

For `returnMethod = PICKUP_AT_SHOP`:

- order channel becomes `SHOP_DROP`
- `dropoffAddressId = null`

For `returnMethod = DELIVER_TO_DOOR`:

- order channel becomes `HYBRID`
- required:
  - `dropoffAddressLine1`
  - `dropoffAddressArea`
  - `dropoffAddressCity`
- optional:
  - `dropoffAddressNotes`

Server-derived fields:

- `sourceType = AFFILIATE`
- `affiliateShopId` from authenticated affiliate staff profile
- `zoneId` from affiliate shop
- `hubId` from first active hub in zone by createdAt ascending
- bag created automatically with generated tag code

Initial timeline events:

- `ORDER_CREATED`
- `HUB_ASSIGNED`

`HUB_ASSIGNED` payload carries `receivedAtShop: true` to indicate affiliate counter intake.

## Affiliate order list

Endpoint:

- `GET /v1/affiliate/orders`

Rules:

- returns only orders for authenticated affiliate shop
- newest first
- no cross-shop records exposed

## Shop pickup workflow

Endpoints:

- `POST /v1/affiliate/orders/:id/mark-ready-for-pickup`
- `POST /v1/affiliate/orders/:id/customer-picked-up`

Behavior:

- mark-ready-for-pickup:
  - scope-enforced by affiliate shop
  - appends shop-ready event payload
  - updates `statusCurrent` to `PACKED` in current v1 status contract
- customer-picked-up:
  - scope-enforced by affiliate shop
  - appends final handoff event
  - updates `statusCurrent` to `DELIVERED`

## Hybrid return workflow

For affiliate orders with `returnMethod = DELIVER_TO_DOOR`:

- affiliate creates order
- order remains scoped to affiliate shop
- admin dispatches delivery trip using existing driver dispatch contract
- OTP delivery proof uses existing Chapter 8.4 flow
- affiliate order list reflects final delivered state

## Scoping rules

All affiliate endpoints derive shop scope from authenticated affiliate staff profile.

V1 rule:

- affiliate shop id is never trusted from client payload
- order actions verify `order.affiliateShopId == authAffiliateShopId`

Expected failure for cross-shop action:

- HTTP `403`
- code: `FORBIDDEN`

Example:

- Affiliate A can act on `shop_mikocheni` orders only
- attempt to act on `order_scope_b` returns `403 FORBIDDEN`

## Verified outcomes

Verified in Chapter 8.6:

- affiliate walk-in shop-return order creation
- affiliate hybrid return order creation
- affiliate scoped order list
- affiliate ready-for-pickup workflow
- affiliate customer pickup completion workflow
- hybrid delivery with driver OTP proof
- cross-shop action blocked with `403`
