# Monorepo Structure

## Root

- package.json
- pnpm-workspace.yaml
- turbo.json
- tsconfig.base.json

## Apps

- apps/api: API workspace with Chapter 2.1 placeholder dev server and future NestJS target
- apps/web: Next.js TypeScript application
- apps/mobile: Expo React Native TypeScript application
- apps/docs: System specs and runbooks workspace

## Packages

- packages/ui: Design system placeholders
- packages/types: Shared contracts/types
- packages/sdk: Generated client placeholder
- packages/config: Shared configuration package

## Verification

- pnpm install passed
- pnpm -r build passed
- pnpm -r lint passed
- pnpm -r typecheck passed
- pnpm -r test passed
- API health and swagger placeholder endpoints returned 200
- Web app returned 200
- Mobile Expo app started successfully
