# Secrets Policy

## Purpose

This policy defines what counts as a secret in Laundry OS, where secrets may be stored, and what must happen if a secret is exposed.

## What Counts as a Secret

The following are secrets and must never be committed to git:

- database passwords and connection strings with real credentials
- JWT secrets and signing keys
- API keys and access tokens
- cloud storage credentials
- mobile money credentials
- SMTP credentials
- OAuth client secrets
- private certificates and private keys
- any production, staging, or real sandbox credential

## Allowed Storage Locations

Allowed locations for secrets:

- local .env files on a developer machine
- approved secret managers in later environments
- local-only gitignored folders such as /secrets when explicitly needed

Not allowed:

- committed files in the repository
- screenshots or docs containing real credentials
- hardcoded secrets in source code, tests, scripts, or seed files

## Leak Response

If any secret is committed or exposed:

1. Treat it as compromised immediately.
2. Rotate or revoke it immediately.
3. Remove it from the codebase and git tracking.
4. Document the incident and replacement action.
5. Re-check repository history and local files.

## Enforcement

- .gitignore must block common secret file patterns.
- Example environment files must contain placeholders only.
- Secret scanning is introduced in repository protections.
