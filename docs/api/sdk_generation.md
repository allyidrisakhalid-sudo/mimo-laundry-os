# SDK Generation

## Purpose

Laundry OS uses a generated TypeScript SDK so web and mobile consume the API contract from OpenAPI instead of handwritten request DTOs.

## Package location

- SDK package: `packages/sdk`
- Saved OpenAPI snapshot: `packages/sdk/openapi/openapi.json`
- Generated types: `packages/sdk/src/generated/api.ts`

## Commands

From repo root:

- Refresh saved OpenAPI snapshot from running API:
  - `pnpm --filter @mimo/sdk refresh:openapi`
- Generate SDK from saved OpenAPI snapshot:
  - `pnpm --filter @mimo/sdk gen`
- Full root helper:
  - `pnpm gen:sdk`
- Verify SDK is up to date:
  - `pnpm check:sdk`

## Generation flow

1. The API must expose OpenAPI JSON at:
   - `http://localhost:3001/api/openapi.json`
2. `refresh:openapi` saves that contract into the repo at:
   - `packages/sdk/openapi/openapi.json`
3. `gen` runs `openapi-typescript` against the saved repo snapshot.
4. The SDK exports a typed client factory from `@mimo/sdk`.

## Client usage

- Web imports `@mimo/sdk`
- Mobile imports `@mimo/sdk`
- App code must call API through SDK client helpers
- App code must not duplicate API DTOs by hand

## Compile lock

Compile lock is enforced by:

- package script:
  - `packages/sdk` `pnpm run check`
- root script:
  - `pnpm check:sdk`

The check script regenerates the SDK and compares the generated file content hash before and after generation.

If the generated output changes, the check fails with an explicit error so contract drift is caught loudly.

## Operational rule

When OpenAPI changes:

1. Start API
2. Run `pnpm gen:sdk`
3. Commit:
   - `packages/sdk/openapi/openapi.json`
   - `packages/sdk/src/generated/api.ts`
   - any app changes required by the new contract

This keeps SDK, web, and mobile aligned to the API contract.
