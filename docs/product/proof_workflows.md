# Proof Workflows v1

## Scope

Chapter 8.4 introduces driver pickup and delivery proof flows.

## Pickup proof rules

- Driver must be authenticated with DRIVER role.
- Stop must belong to the authenticated driver.
- Stop type must be `PICKUP`.
- `tagCode` is required.
- `tagCode` must match the order bag tag.
- Wrong tag fails with `BAG_TAG_MISMATCH`.
- Successful pickup:
  - marks `TripStop.status = DONE`
  - appends `OrderEvent = PICKED_UP`
  - sets `Order.statusCurrent = PICKED_UP`

## Delivery proof rules

- Driver must be authenticated with DRIVER role.
- Stop must belong to the authenticated driver.
- Stop type must be `DROPOFF`.
- OTP is required for delivery confirmation.
- OTP is stored hashed in `OrderDeliveryOtp.otpHash`.
- OTP carries expiry in `expiresAt`.
- OTP use is recorded via `usedAt`.
- Wrong OTP fails with `OTP_INVALID`.
- Expired OTP fails with `OTP_EXPIRED`.
- Successful delivery:
  - marks `TripStop.status = DONE`
  - appends `OrderEvent = DELIVERED`
  - sets `Order.statusCurrent = DELIVERED`
  - invalidates OTP by setting `usedAt`

## Error codes

- `BAG_TAG_MISMATCH`
- `OTP_INVALID`
- `OTP_EXPIRED`
- `STOP_ALREADY_COMPLETED`
- `STOP_TYPE_INVALID`
- `STOP_NOT_FOUND`
- `DRIVER_PROFILE_NOT_FOUND`

## Customer visibility

- Customer timeline is read from immutable `OrderEvent` records.
- Polling/refresh is sufficient in v1.
- Customer sees `PICKED_UP` after successful pickup.
- Customer sees `DELIVERED` after successful delivery.
