# Authentication

## Identity rule

Laundry OS MVP uses phone number as the primary login identity.

Required format:

- `+255XXXXXXXXX`

Customer self-registration is allowed through:

- `POST /v1/auth/register`

Staff self-registration is not allowed in MVP.
Staff accounts are seeded/admin-created.

## Roles

- `ADMIN`
- `DEV_ADMIN`
- `HUB_STAFF`
- `DRIVER`
- `AFFILIATE_STAFF`
- `CUSTOMER`

## Token policy

- Access token TTL: 15 minutes
- Refresh token TTL: 30 days
- Refresh tokens rotate on every successful refresh

## Session storage

Refresh tokens are stored server-side as SHA-256 hashes only.

Stored fields:

- id
- userId
- tokenHash
- createdAt
- expiresAt
- revokedAt
- replacedByTokenId
- userAgent
- ipAddress

## Logout behavior

`POST /v1/auth/logout` revokes the presented refresh token.

## Protected routes

Protected endpoints require:

- `Authorization: Bearer <accessToken>`

Without a valid access token:

- response is 401
- standardized error schema is returned
