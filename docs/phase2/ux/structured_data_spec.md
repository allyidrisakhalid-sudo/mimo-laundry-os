# Structured Data Spec  Mimo Phase 2

## 1) Structured Data Principles

- structured data must reflect real site truth only
- no fake reviews
- no fake ratings
- no fabricated price ranges
- no invented opening hours unless verified and intentionally published
- structured data must support trust, clarity, and local discoverability
- one clear schema strategy is better than many noisy fragments

## 2) Chosen Schema Types

- LocalBusiness
- WebSite

Do NOT require Review, AggregateRating, or Product schema in P2.4.

## 3) LocalBusiness Schema Spec

LocalBusiness schema must define:
- business name: Mimo Laundry
- site URL: https://mimolaundry.org
- contact phone: +255788558975
- sameAs only if officially controlled profiles are available and approved; otherwise omit
- service area language must align with true coverage claims
- description must reflect the core service truth
- business category must remain laundry/service appropriate
- use only fields that are known, accurate, and intended for publication

Implementation guardrails for LocalBusiness:
- publish only on routes where the business identity is central, primarily the homepage
- do not invent exact operating hours, address details, or area coverage claims unless verified and intentionally published
- do not add fake review, rating, offer, or price-range signals
- keep the description concise, operationally true, and aligned to visible homepage messaging

## 4) Website Schema Spec

Website Schema Spec must define:
- site name
- site URL
- search/track intent support only if implemented truthfully
- no fake sitelinks search box behavior if the implementation does not support it

Implementation guardrails for WebSite:
- use it to identify the site cleanly and support truthful site-level intent
- include search or tracking action support only if the site actually exposes that behavior in an implementation-valid way
- do not simulate Google search-box behavior or sitelinks behavior unless it is truly supported
- keep the schema lean and testable

## 5) FAQ/Help Structured Data Rules

- FAQ schema is allowed only if actual page FAQ content is present and stable
- no bloated FAQ spam
- only include FAQ items that visibly exist on the page
- if implementation is uncertain, omit FAQ schema rather than faking it

Help-page FAQ discipline:
- FAQ markup is optional, not required
- if the help page changes frequently or does not have stable FAQ blocks, omit FAQ schema
- help structured data must never include invisible or marketing-only Q&A content

## 6) Route Application Rules

- Home: WebSite + LocalBusiness
- Help: optional FAQ only if true page content matches exactly
- Partners: no misleading business-review schema
- Track/Login/Signup/Legal: no unnecessary schema clutter

Route application detail:
- homepage carries the main structured data burden
- public utility and legal routes remain lean unless a clear truthful need exists
- structured data must support clarity, not create implementation noise

## 7) Structured Data Guardrails

- visible page content and structured data must match
- schema must be testable and valid
- do not publish incomplete garbage fields
- no markup for things users cannot actually do

Additional guardrails:
- avoid schema expansion just to chase search features
- omit uncertain fields rather than guessing
- preserve one calm, premium, trustworthy site truth across visible content and machine-readable markup
- every published schema block should be easy to explain and defend operationally

## 8) Structured Data Lock Statement

The structured data strategy is locked to a minimal, truthful, implementation-safe system for Mimo Laundry. P2.4 uses only WebSite and LocalBusiness as the default schema foundation, with optional FAQ markup only when visible page content supports it exactly. No fake reviews, ratings, hours, prices, or claims are allowed.
