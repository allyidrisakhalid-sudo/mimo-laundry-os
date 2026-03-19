# P2 SEO Implementation Baseline  Mimo Phase 2

## 1) Purpose

- This file converts the approved P2.4 SEO and searchability model into the implementation control layer for public discovery, canonical routing, indexing, structured data, and performance-safe delivery.

## 2) Locked Canonical Host

- https://mimolaundry.org

## 3) Locked Indexable Public Routes

- /
- /track
- /partners
- /help
- /login
- /signup
- /terms
- /privacy
- /refund-policy

## 4) Locked Non-Indexable Areas

- /app/*
- authenticated private states
- internal tools
- duplicate provider/origin URLs
- no alternate production host should act as a canonical public brand URL

## 5) Locked Structured Data Scope

- WebSite
- LocalBusiness
- optional FAQ only if the visible help-page FAQ content matches exactly
- no fake review/rating/product schema

## 6) Locked Performance Discipline

- public pages must stay lightweight
- public pages must remain mobile-first
- metadata/searchability must not be implemented in a way that harms route performance or auth correctness

## 7) Implementation Guardrails

- no duplicate metadata patterns with different page intent
- no extra location/zone pages in this chapter
- no robots rules that accidentally block the site
- no public caching assumptions that break auth/app behavior
- no route-level SEO hacks that contradict canonical rules
- no fake structured data

## 8) Downstream Dependency Rule

- later public refinements must preserve this canonical/indexing/structured-data model unless explicitly revised

## 9) Baseline Lock Statement

- The Phase 2 SEO implementation baseline is now the single source of truth for public searchability and indexability.
