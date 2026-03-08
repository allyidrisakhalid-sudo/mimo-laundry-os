# Drivers & Dispatch Architecture

## Chapter

4.4 Driver & Dispatch Entities

## Purpose

Drivers are first-class operational actors. In V1, dispatch is manual: an admin assigns trips to drivers, and drivers can only see their own trips and stops.

## Driver Profile

`DriverProfile` fields:

- `id`: uuid
- `userId`: unique FK to `User`
- `homeZoneId`: required FK to `Zone`
- `phone`: optional
- `vehicleType`: optional enum
  - `MOTORBIKE`
  - `CAR`
  - `VAN`
- `vehiclePlate`: optional
- `isActive`: boolean
- `availabilityStatus`: enum
  - `OFFLINE`
  - `AVAILABLE`
  - `ON_TRIP`
  - `SUSPENDED`
- `lastStatusAt`: datetime
- `createdAt`
- `updatedAt`

## Core Rules

- A driver belongs to exactly one home zone in V1.
- A user with a driver profile has role `DRIVER`.
- One user maps to one driver profile.

## Availability Status Meanings

- `OFFLINE`: not available for assignment
- `AVAILABLE`: can be assigned new work
- `ON_TRIP`: actively executing a trip
- `SUSPENDED`: blocked from operational assignment

## Trip Model

`Trip` represents a dispatch batch.

Fields:

- `id`: uuid
- `type`: enum
  - `PICKUP`
  - `DELIVERY`
- `zoneId`: required FK to `Zone`
- `hubId`: nullable FK to `Hub`
- `driverId`: required FK to `DriverProfile`
- `status`: enum
  - `PLANNED`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `CANCELLED`
- `scheduledFor`: optional datetime
- `startedAt`: optional datetime
- `completedAt`: optional datetime
- `createdAt`
- `updatedAt`

## Trip Stop Model

`TripStop` is the executable unit a driver performs.

Fields:

- `id`: uuid
- `tripId`: required FK to `Trip`
- `orderId`: required FK to `Order`
- `stopType`: enum
  - `PICKUP`
  - `DROPOFF`
- `sequence`: int
- `status`: enum
  - `PENDING`
  - `DONE`
  - `FAILED`
  - `SKIPPED`
- `notes`: optional
- `createdAt`
- `updatedAt`

## Relationship Meanings

- One trip contains many stops.
- Stops are ordered by `sequence`.
- Stops are linked to orders.
- In V1, active-trip uniqueness per order/type is enforced later in the service layer.

## Assignment Flow

1. Admin creates or manages driver profiles.
2. Admin creates a trip for a selected driver.
3. Admin adds one or more stops to the trip.
4. Driver logs in and retrieves only:
   - their own profile
   - their own trips
   - their own active tasks

## API Surface

Admin endpoints:

- `POST /v1/admin/drivers`
- `GET /v1/admin/drivers`
- `POST /v1/admin/trips`
- `POST /v1/admin/trips/:id/stops`
- `GET /v1/admin/trips/:id`

Driver endpoints:

- `POST /v1/auth/driver/login`
- `GET /v1/driver/me`
- `GET /v1/driver/trips`
- `GET /v1/driver/trips/:id`
- `GET /v1/driver/tasks`

## Scoping Rules

Hard RBAC rule:

- Drivers must never see trips that are not assigned to them.
- Drivers must never see tasks from other drivers trips.
- Driver identity is derived from bearer token.
- Client never submits `driverId` for driver-scoped reads.

## Verified Examples

Verified in Chapter 4.4:

- Admin listed seeded drivers successfully.
- Admin created a new pickup trip for Driver A.
- Admin added a stop linked to order `AFF-SHOP-A-001`.
- Driver A retrieved only Driver A trips and tasks.
- Driver A tried to fetch Driver B trip and received `403`.

## Invariants Preserved

- Zones remain first-class routing boundaries.
- Drivers remain zone-linked from day 1.
- Assignment visibility is role-scoped.
- Dispatch remains compatible with future automation.
