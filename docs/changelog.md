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
