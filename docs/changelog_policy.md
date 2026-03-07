# Changelog Policy

## Lock

Laundry OS uses chapter-based changelog updates during guided build execution.

## Rule

- Every completed chapter must append a short, factual entry to `docs/changelog.md`.
- `docs/acceptance.md` is the gate log and must record PASS/FAIL with proof notes.
- Commit messages must follow Conventional Commits.

## Allowed commit prefixes

- `feat`
- `fix`
- `chore`
- `docs`
- `refactor`
- `test`
- `build`
- `ci`

## Examples

- `feat(api): add order timeline endpoint`
- `fix(web): correct zone selector validation`
- `chore(repo): enforce chapter 2.2 guardrails`
- `docs(product): update MVP scope note`

## Operating mode

Until launch, changelog entries are updated per chapter.
