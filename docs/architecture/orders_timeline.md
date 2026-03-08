# Orders, Bags, Timeline

## Purpose

Chapter 4.5 establishes the operational truth model for Laundry OS:

- Order is the core transaction record
- Bag is the physical tracking unit
- OrderEvent is the append-only truth timeline
- OrderIssue makes operational exceptions explicit and visible

## Order channels

- `DOOR`
  - Pickup is from customer address
  - `pickupAddressId` is required
  - `affiliateShopId` must be null in normal direct flow

- `SHOP_DROP`
  - Drop-off originates at affiliate shop
  - `affiliateShopId` is required
  - `pickupAddressId` is null in V1

- `HYBRID`
  - Mixed fulfillment pattern
  - V1 supports shop-origin or door-return combinations
  - `dropoffAddressId` is required for return-delivery handling

## Order tiers

- `STANDARD_48H`
- `EXPRESS_24H`
- `SAME_DAY`

These are stored directly on the order and locked with the order record.

## Zone and hub derivation

### Zone derivation

- `DOOR` and `HYBRID`: derive zone from `pickupAddress.zoneId`
- `SHOP_DROP`: derive zone from `affiliateShop.zoneId`

### Hub assignment

- V1 rule: assign the first active hub in the derived zone
- Assigned hub is stored directly on the order as `hubId`

## Bag tagging model

V1 uses one bag per order.

Bag fields:

- unique `tagCode`
- `bagStatus`
- linked `orderId`

Generated tag format in V1:

- `BAG-<ORDER_NUMBER>`

This supports QR/barcode printing later without changing the core data model.

## Event immutability rules

`OrderEvent` is append-only.

Rules:

- no editing existing events
- no deleting existing events
- corrections are represented by new events
- `statusCurrent` is a denormalized convenience field and must reflect the latest operational event

### Current V1 event types

- `ORDER_CREATED`
- `PICKUP_SCHEDULED`
- `PICKED_UP`
- `RECEIVED_AT_HUB`
- `WASHING_STARTED`
- `DRYING_STARTED`
- `IRONING_STARTED`
- `PACKED`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `PAYMENT_DUE`
- `PAID`
- `ISSUE_OPENED`
- `ISSUE_UPDATED`
- `ISSUE_RESOLVED`

## Issue types and lifecycle

### Issue types

- `DAMAGE`
- `MISSING_ITEM`
- `DELAY`
- `REFUND_REQUEST`

### Issue statuses

- `OPEN`
- `INVESTIGATING`
- `RESOLVED`
- `REJECTED`

### Lifecycle rule

Issue actions append matching order events:

- create issue `ISSUE_OPENED`
- update open issue `ISSUE_UPDATED`
- resolve/reject issue `ISSUE_RESOLVED`

## API added in Chapter 4.5

- `POST /v1/orders`
- `GET /v1/orders/:id`
- `GET /v1/orders/:id/timeline`
- `POST /v1/orders/:id/events`
- `GET /v1/orders/:id/issues`
- `POST /v1/orders/:id/issues`
- `PATCH /v1/orders/:id/issues/:issueId`

## Notes

- Admin auth is used for Chapter 4.5 runtime proof
- A temporary local admin user was created for verification: `admin@mimo.local`
- Future chapters should move this into formal seed/auth flows
