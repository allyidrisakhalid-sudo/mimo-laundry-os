# Environment Variable Standard

## Purpose

This document defines how environment variables are handled in Laundry OS during local development.

## Rules

- Real secrets must never be committed to git.
- Every app may use a local .env file for developer-specific values.
- Every app must provide a .env.example file with placeholder values only.
- Placeholder values must be obvious and non-functional, such as:
  - DATABASE_URL=""postgresql://USER:PASSWORD@HOST:5432/DB""
  - JWT_SECRET=""CHANGE_ME""
  - STORAGE_KEY=""CHANGE_ME""

## Required Patterns

- /apps/\*/.env.example
- /apps/\*/.env
- optional root /.env.example for shared local values

## Allowed Content

- .env.example files may contain keys and safe placeholders only.
- .env files may contain real local secrets, but they must remain untracked.

## Enforcement

- .gitignore must ignore all .env files except approved example templates.
- Any new app added to the monorepo must include its own .env.example before implementation starts.
