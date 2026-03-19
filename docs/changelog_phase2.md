
## P2.0  Experience blueprint implementation baseline

- Phase 2 implementation baseline installed
- IA docs verified and normalized
- route/portal map locked for implementation
- public sitemap locked for implementation
- navigation model locked for implementation
- dashboard model locked for implementation
- EN/SW copy baseline verified for implementation use

## P2.1 completed
- Locked Phase 2 brand tone and messaging for Mimo under the Midnight Silk direction
- Locked final Phase 2 design tokens for color, gradients, typography, spacing, radii, shadows, borders, motion, and surface hierarchy
- Locked Lucide as the sole icon system for all Phase 2 surfaces
- Locked imagery rules for photography, illustration, and abstract visual treatments
- Formalized the Midnight Silk brand surface system as the implementation reference for upcoming UI chapters

## P2.2 completed
- locked production layout components for all Phase 2 portals
- locked production data components for operational lists, tables, empty, loading, and pagination states
- locked production form components for guided flows, validation, Tanzanian phone input, and address capture
- locked production status components for badges, timeline truth, and SLA urgency handling
- locked production feedback components for confirmations, toasts, and inline alerts
- locked shared component state rules across interactive, data, form, permission, and responsive behavior
- added component usage matrix proving full current Phase 2 screen coverage without custom structural hacks
- added component gallery specification to verify implementation quality and visual coherence

## P2.3 completed
- locked the public landing experience for mimolaundry.org with a mobile-first Midnight Silk structure
- locked the public /track page as the direct order-status utility route
- locked the /partners page as the affiliate recruitment and conversion surface
- locked the /help page and minimal policy surface model
- locked the public contact and WhatsApp CTA system around +255788558975
- locked minimal legal page specs for /terms, /privacy, and /refund-policy
- locked public SEO and content intent with route ownership and duplication guards
- defined a public mobile-first trust-to-convert flow for fast first-time understanding and next-step action

## P2.4 completed
- locked metadata and canonical URL rules for all required public and legal routes on https://mimolaundry.org
- locked OpenGraph and Twitter/X social preview system under one Midnight Silk branded asset family
- locked sitemap and robots strategy with public-route inclusion only and /app/* exclusion
- locked LocalBusiness and WebSite structured data strategy with strict truthfulness guardrails
- defined location-page guardrails with no current location/zone page sprawl in P2.4
- locked public performance and Lighthouse baseline rules for mobile-first searchability discipline
- formalized the technical searchability foundation for implementation without duplication, spam, or indexing risk

## P2.5 completed
- locked unified login experience as the single clean bilingual entry for all supported existing roles
- locked minimal customer-only signup flow with no public staff or admin self-registration
- locked deterministic role-based post-login router mapped exactly to approved Phase 2 portals
- locked session and logout UX behavior for active sessions, expired sessions, forbidden access, and clean sign-out
- locked EN/SW auth copy baseline for login, signup, validation, routing, session feedback, logout, and help fallback
- formalized launch-ready auth access model so every role lands in the correct portal with no confusion

## P2.6 completed
- Locked minimal customer first-run onboarding inside the customer portal with a strict two-screen maximum
- Locked operator setup prompt model for driver, hub staff, affiliate staff, and affiliate admin as dashboard-native card prompts
- Locked role help entry points so every role has a clear contextual support path without redundant help pages
- Locked EN/SW onboarding, setup prompt, help entry, and completion feedback copy baseline
- Formalized a self-start onboarding model that avoids training dependency, tutorial overload, and duplicate support content

## P2.7 completed
- locked customer portal structure across /app/customer, /app/customer/orders, /app/customer/orders/[id], and /app/customer/profile
- locked customer home with active-order-first model, clear next action, compact recent orders, and secondary support entry
- locked new order wizard for Door, Shop, and Hybrid with tier and schedule through one deterministic premium flow
- locked order detail as the single customer truth surface for timeline, invoice/payment, and support
- locked customer profile as a minimal utility page for account basics, saved addresses, receipts/documents, and language
- locked mobile behavior for the customer portal including bottom tabs, home, wizard, order detail, and profile rules
- locked EN/SW customer portal copy baseline for home, order creation, order detail, profile, and customer states
- formalized the customer daily-use model for web and mobile in a premium, minimal, role-correct system


## P2.8 completed
- locked the driver portal as a minimal 4-screen mobile-first system across Today, Tasks, Stop Detail, and Profile
- locked the Today screen with a next-task-first execution model, grouped tasks, compact cash visibility, and concise alerts
- locked stop detail with a proof-first action pattern using large dominant actions and minimal supporting detail
- locked cash collection prompts and end-of-day reconciliation UX as practical operational flows without finance-dashboard sprawl
- locked basic offline and poor-network resilience UX with clear sending, retry, failed, and synced behavior
- locked mobile behavior for the driver portal with one-hand usability, route clarity, and no desktop carryover clutter
- locked EN/SW driver portal copy baseline for today, task detail, cash, retry, profile, and help states
- formalized a full-day driver execution model optimized for minimal taps, low confusion, and calm recovery under weak connectivity

## P2.9 completed
- locked hub portal structure across dashboard, intake, processing, and order detail surfaces
- locked intake screen with scanner-first operation model for receiving work quickly and accurately
- locked processing board with clean operational stage columns and clear issue flag visibility
- locked QC decision model with explicit pass/fail and issue-open flow
- locked dispatch batching with zone-filtered driver assignment rules
- locked tablet/web behavior for repeated hub operations
- locked EN/SW hub portal copy baseline
- formalized an end-to-end intake  processing  dispatch operational model for hub staff without admin dependence


## P2.10 completed
- locked the affiliate portal structure for /app/affiliate, /app/affiliate/orders/new, /app/affiliate/orders, /app/affiliate/orders/[id], and /app/affiliate/finance
- locked a fast walk-in order creation flow optimized for busy shop counter use
- locked the own-shop orders list with strict scope behavior and no cross-shop visibility
- locked the shop pickup workflow inside the affiliate order/detail model without detached permanent pages
- locked a simple affiliate earnings and payout summary for affiliate admin only
- locked tablet/web behavior for fast, repeated shop operations
- locked the EN/SW affiliate portal copy baseline
- formalized an independent fast affiliate operations model with no cross-shop visibility


## P2.11 completed
- locked admin HQ structure as a five-screen command center for daily business control
- locked ops dashboard with KPI row, action-queue model, global issues list, pressure summary, and finance signal support
- locked platform-wide orders oversight with practical filters, attribution visibility, and safe quick actions
- locked network management inside admin operations for zones, hubs, affiliates, and drivers
- locked pricing plans UI with versioned create, stage, review, and activate workflow
- locked finance UI for payments, refunds, payouts, and daily close
- locked read-only audit and failed-jobs visibility inside admin finance/control context
- locked EN/SW admin HQ copy baseline
- formalized the daily business command-center model for admin with no hunting

## P2.12  DevAdmin Console (Safety Controls)
- locked DevAdmin console structure across /app/dev, /app/dev/diagnostics, /app/dev/tools, and /app/dev/activity
- locked health and monitoring view to support diagnosis before action
- locked failed jobs viewer with safe retry flow inside the tools surface
- locked feature flags manager as a controlled rollout tool
- locked audited override workflow with reason-required controls
- locked activity visibility for accountability across support and override actions
- locked EN/SW DevAdmin copy baseline for diagnostics, tools, overrides, activity, and state feedback
- formalized a safe internal-controls model without manual DB dependency for supported scenarios


## P2.13 completed
- locked customer issue creation UX for damage, missing item, delay, and refund request inside customer order context
- locked admin support queue UX for a triage-to-resolve workflow embedded within the approved admin operations model
- locked bilingual support status messaging templates for in-app and WhatsApp-aligned use
- locked refund and credit UX with ledger-consistent support states and finance-safe customer visibility
- formalized support visibility and auditability across customer, affiliate, admin, and DevAdmin contexts
- added implementation-grade EN/SW support copy baseline for issue creation, queue handling, status messaging, and refund or credit outcomes
- formalized the end-to-end support and trust layer to reduce chaos while preserving order truth, ledger truth, and auditability

## P2.14  Cloudflare setup for mimolaundry.org
- locked Cloudflare production host model for mimolaundry.org and api.mimolaundry.org
- locked DNS structure with apex web, API subdomain, and WWW redirect
- locked SSL/TLS to Full (strict)
- locked public-page-only caching rules
- locked redirect and security-header model
- deferred HSTS until stable verification
- locked Cloudflare operator runbook
- formalized domain, SSL, and routing polish for secure production delivery

## P2.15  Role-based journey tests (device-ready)
- locked role-based launch journey test plan
- locked target-device validation matrix
- locked strict role acceptance checklist
- locked launch validation runbook
- formalized customer, driver, hub, affiliate, admin, and DevAdmin real-world journey criteria
- established the device-ready end-to-end workflow validation model for launch

## P2.16  Performance + UX polish pass
- locked performance and responsiveness audit across public, auth, support, and all role portals
- locked empty, error, and loading state audit as a launch-quality trust requirement
- locked EN/SW copy consistency audit across all public and role-based copy surfaces
- locked final spacing, icon, alignment, and surface cleanup rules under Midnight Silk discipline
- locked final polish runbook for evidence capture, issue logging, re-test, and honest pass judgment
- formalized the cross-role world-class minimal quality gate for final launch readiness

## P2.1  Brand Kit V1 for Mimo
- Phase 2 brand implementation baseline installed
- verified brand kit for implementation use
- created or normalized the shared token/theme source in code
- locked icon family to Lucide for implementation use
- locked imagery rules for implementation use
- visual system is now ready for component-library execution


## P2.2 Implementation  UI Component Library V2 (Production-grade)

- installed the Phase 2 component implementation baseline under docs/phase2/implementation/p2_component_implementation_baseline.md
- created or normalized the shared UI component source under packages/ui/src/components
- implemented layout/data/form/status/feedback component families as reusable shared code
- added a real ui gallery proof route at /ui-gallery in the web app with realistic Mimo states
- stabilized shared exports from the UI package for downstream screen implementation
- the UI system is now ready for real page implementation without custom hacks

## P2.3  Marketing Website (Implementation)
- installed the Phase 2 public implementation baseline
- implemented real public routes for home, track, partners, help, and legal pages
- added or normalized shared public header, footer, and support CTA system
- wired EN/SW public copy into the implementation layer
- implemented legal pages as minimal readable public documents
- public website is now structurally ready for SEO/searchability implementation

## P2.4  SEO + Searchability Foundation (Implementation)
- installed the Phase 2 SEO implementation baseline as the control layer for canonical host, indexable public routes, non-indexable private areas, structured-data scope, and performance discipline
- implemented real route-level metadata and canonical behavior for the approved public and legal routes on https://mimolaundry.org
- implemented one real sitemap and one real robots.txt output for the approved public route set only
- implemented truthful WebSite and LocalBusiness structured data with no fake ratings, reviews, hours, or unsupported claims
- enforced the no-sprawl location-page rule by keeping this chapter focused on the approved public route set only
- added baseline searchability and performance verification targets for the launch-critical public routes
- public site is now ready for auth and routed entry implementation


## P2.5  Unified Auth UX (Implementation)
- installed the Phase 2 auth implementation baseline control file
- identified the real login and signup route targets
- identified the real session and i18n source targets
- started normalization of role-based routing, logout, and forbidden-access handling
- access model is being prepared for onboarding and role-portal buildout

## P2.5  Unified Auth UX (Implementation)  status correction
- confirmed the active Next App Router tree is apps/web/app
- confirmed /login, /signup, and /forbidden are real live routes in the active tree
- confirmed lint, typecheck, and production build now pass
- confirmed role portal pages currently exist only under apps/web/src/app and are not live app-router routes
- kept P2.5 implementation status incomplete until live /app/* role routes are created and verified

## P2.6  First-Run Onboarding (Implementation)
- installed the Phase 2 onboarding implementation baseline
- implemented real customer first-run onboarding inside the customer portal
- implemented real operator setup prompts for driver, hub, and affiliate roles
- installed real contextual help entry points across role surfaces
- moved onboarding/help copy into apps/web/src/i18n/en.json and apps/web/src/i18n/sw.json
- replaced embedded onboarding message object with real react-i18next usage
- replaced one-off onboarding UI with shared UI components already exported by the UI package
- kept customer first-run flow to two short steps and preserved role help/setup coverage



## P2.7  Customer Portal (Implementation)
- installed the customer portal implementation baseline
- implemented real customer home
- implemented real customer orders list
- implemented real customer order detail
- implemented real customer profile
- wired EN/SW customer portal copy into implementation
- customer route purpose now ready for later slices

## P2.8  Driver Portal (Implementation)
- installed the Phase 2 driver portal implementation baseline
- implemented the real driver today screen with next-task-first model
- implemented the real stop-detail execution surface
- implemented real cash prompt and reconciliation visibility
- implemented real poor-network, retry, and sync UX
- installed real driver mobile bottom-tab behavior
- wired EN/SW driver portal copy into implementation
- driver portal now ready for real daily execution on mobile

## P2.9  Hub Portal (Implementation)
- installed the Phase 2 hub portal implementation baseline
- implemented the real hub dashboard
- implemented the real scanner-first intake screen
- implemented the real processing board
- implemented the real QC decision flow
- implemented real dispatch batching with zone-filtered drivers
- wired EN/SW hub portal copy into implementation
- hub portal is now ready for real operational use on tablet and web

## P2.10  Affiliate Portal (Implementation)
- installed the Phase 2 affiliate portal implementation baseline
- implemented the real affiliate dashboard
- implemented real fast walk-in order creation
- implemented the real scoped orders list
- implemented the real shop pickup and handoff workflow
- implemented the real affiliate-admin finance summary
- implemented real scope restriction and permission behavior
- wired EN/SW affiliate portal copy into implementation
- affiliate portal now ready for fast independent shop operations

