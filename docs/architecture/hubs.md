# Hubs

## Purpose

A Hub is a first-class operational processing node in Laundry OS. In V1, each Hub belongs to exactly one Zone and can be added by admin configuration without code changes.

## Hub fields

- `id`: UUID primary key
- `name`: unique hub name
- `zoneId`: required foreign key to `Zone`
- `addressLabel`: human-readable hub location label
- `locationLat`: optional latitude placeholder for future geo features
- `locationLng`: optional longitude placeholder for future geo features
- `capacityKgPerDay`: optional stored capacity value
- `capacityOrdersPerDay`: optional stored capacity value
- `supportsTiers`: JSON flags describing supported service tiers
- `isActive`: active/inactive hub state
- `createdAt`, `updatedAt`: timestamps

## Zone mapping rule

- Every Hub must belong to exactly one Zone in V1.
- Zone membership is required for routing and visibility boundaries.
- Hubs are queryable by zone through the API.

## Hub staff scoping rule

- Hub staff users are represented by `User` with role `HUB_STAFF`.
- `HubStaffProfile` links one user to exactly one hub in V1.
- Later RBAC policy will scope hub staff visibility to their hub, or to their hub zone where appropriate.

## Capacity behavior in V1

- Capacity fields are stored now for operational planning.
- Capacity is not enforced in V1.
- A computed `capacityStatus` output may be added later without changing the stored hub record model.

## API endpoints in Chapter 4.2

- `GET /v1/hubs`
- `GET /v1/hubs/:id`
- `POST /v1/hubs`
- `GET /v1/zones/:id/hubs`

## Seed coverage

Chapter 4.2 seed creates:

- at least 2 zones
- at least 2 hubs across 2 zones
- at least 1 hub staff user per hub
