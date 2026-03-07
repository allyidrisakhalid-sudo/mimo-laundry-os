# Changelog

## 2026-03-07 Chapter 0.1 Mission Lock

- Added docs/product/mission_lock.md
- Added docs/product/mvp_scope.md
- Added docs/product/success_metrics.md
- Established operational definition of done, explicit MVP exclusions, and launch metrics

## Chapter 0.2 completed

- Added docs/architecture/core_invariants.md
- Locked architectural invariants for multi-hub, zones, immutable order events, versioned pricing, traceable ledgers, and RBAC plus audit logging
- Updated docs/acceptance.md with Chapter 0.2 PASS

## Chapter 1.1 completed

- Added docs/setup/workstation_baseline.md
- Recorded verified workstation toolchain versions for Git, Node.js, pnpm, Docker, WSL2, and VS Code
- Updated docs/acceptance.md with Chapter 1.1 PASS

## Chapter 1.2 completed

- Added local environment file standard and app-level .env.example templates.
- Added security documentation for environment handling, secrets policy, and repository standards.
- Updated .gitignore to block secrets, local env files, and node_modules.
- Enabled Husky pre-commit and commit-msg hooks with lint-staged, Prettier, and commitlint.
- Verified a test commit was blocked by pre-commit checks, proving enforcement is active.

## Chapter 2.1 completed

- Created Turborepo workspace root with package.json, pnpm-workspace.yaml, turbo.json, and tsconfig.base.json.
- Created required app workspaces: api, web, mobile, docs.
- Created required shared packages: ui, types, sdk, config.
- Repaired workspace package manifests and completed scaffold recovery for web and mobile.
- Verified pnpm install completed successfully across the workspace.
- Verified repo-wide build, lint, typecheck, and test commands completed successfully.
- Created docs/repo/monorepo_structure.md documenting the monorepo skeleton.

- Ignored Turbo cache artifacts and removed generated .turbo files from version control.

## Chapter 2.2 completed

- Added shared TypeScript strict config in packages/config and updated workspaces to extend it.
- Added root ESLint and Prettier configuration with repo-wide lint/format scripts.
- Added Vitest baseline tests in apps/api and packages/types.
- Added Husky, lint-staged, and commitlint enforcement for standardized commits.
- Added docs/changelog_policy.md and recorded Chapter 2.2 completion.

- Pre-commit enforcement probe for Chapter 2.2.

## Chapter 3.1 completed

- Added Docker Compose local infrastructure for Postgres and Redis with healthchecks and persistent Postgres volume.
- Added docs/setup/local_infra.md for local infrastructure operations and safe reset guidance.
- Expanded .env.example with Postgres and Redis local defaults.

## Chapter 3.2 completed

- Added Prisma schema, Prisma 7 config, initial migration, and Prisma client generation for apps/api.
- Added dev-only seed system with baseline users and audit log records.
- Added docs/setup/database_prisma.md documenting DATABASE_URL, migrate, seed, studio, and local reset flow.
