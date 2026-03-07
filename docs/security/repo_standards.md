# Repository Standards

## Branching Rules

- Default branch: main
- Feature work branches:
  - feat/\*
  - fix/\*
  - chore/\*

## Commit Standard

Use Conventional Commits:

- feat: add new user-facing or system capability
- fix: correct a defect
- chore: maintenance or tooling work
- docs: documentation-only change
- refactor: internal code change without behavior change
- test: test-only change

## Security Baseline

- No secrets may be committed.
- Local secret files must stay ignored.
- Any leaked secret must be rotated immediately.

## Hook Policy

Pre-commit hooks must enforce at minimum:

- formatting
- lint
- typecheck where applicable

Optional but recommended:

- secret scan
- commit message linting

## Branch Protection Intent

- main is the protected integration branch
- direct work should happen on feat/_, fix/_, or chore/\* branches
- merge to main only after chapter gate is passed
