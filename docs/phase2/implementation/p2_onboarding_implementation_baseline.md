# P2 Onboarding Implementation Baseline  Mimo Phase 2

## 1) Purpose

- This file converts the approved P2.6 onboarding and help-entry model into the implementation control layer for first-run experience across customer and operator roles.

## 2) Locked Customer First-Run Model

- customer onboarding is maximum 2 screens
- screen 1: language preference + simple flow explanation
- screen 2: optional saved address
- no tutorial maze
- no non-critical hard block after the approved steps

## 3) Locked Operator Setup Prompt Model

- driver, hub, affiliate staff, and affiliate admin use card-based "Complete setup" prompts
- prompts live inside the role home/dashboard
- prompts point to real setup actions only
- no training module behavior

## 4) Locked Help Entry Model

- each role has one obvious help path
- help is contextual and minimal
- public /help remains valid for public/customer fallback
- portal help must not fragment into random duplicate pages

## 5) Locked Completion Rules

- onboarding/setup completion must persist correctly
- completed onboarding does not reappear unless a real required condition remains
- skipped optional setup should not replay the whole flow

## 6) Implementation Guardrails

- no extra onboarding steps
- no long tutorial carousel
- no dead-end "learn more" detours in launch-critical flows
- no repeated nagging after completion
- no hardcoded onboarding/help strings outside i18n
- no role help entry placed in irrelevant locations

## 7) Downstream Dependency Rule

- later portal implementation must inherit these onboarding/help rules instead of inventing different first-run behavior per screen

## 8) Baseline Lock Statement

- The Phase 2 onboarding implementation baseline is now the single source of truth for first-run and contextual help behavior.
