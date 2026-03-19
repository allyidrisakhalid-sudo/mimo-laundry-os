# P2 Support Center Implementation Baseline

## 1) Purpose
- This file converts the approved P2.13 support and trust model into the implementation control layer for support behavior across customer and admin experiences.

## 2) Locked Customer Issue Model
- issue creation lives in customer order detail
- issue types are:
  - damage
  - missing item
  - delay
  - refund request
- issue creation is short and contextual
- issue state remains visible after submission

## 3) Locked Admin Support Queue Model
- admin support queue is operational
- triage starts from linked order context
- one clear case state at a time
- resolution and updates remain visible and auditable

## 4) Locked Support Status Messaging Model
- received
- under review
- action in progress
- refund / credit review
- resolved
- status messaging stays calm, short, and consistent

## 5) Locked Refund and Credit Model
- refund request does not imply completed money movement
- credit and refund are distinct outcomes
- customer-visible wording must reflect actual finance truth
- support state cannot outrun ledger truth

## 6) Locked Visibility and Audit Model
- customer sees own issue state on own order
- admin sees triage and resolution context
- updates and resolution are logged
- no support leakage across users or shops

## 7) Implementation Guardrails
- no detached generic ticket portal for customers
- no giant support wizard
- no hardcoded support copy outside i18n
- no refund-complete wording before actual completion
- no admin support UI that loses linked order context
- no duplicate support surfaces with conflicting truth

## 8) Downstream Dependency Rule
- later support refinements must preserve this contextual support model unless explicitly revised

## 9) Baseline Lock Statement
- The Phase 2 support implementation baseline is now the single source of truth for support-center behavior.
