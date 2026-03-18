# SEO Foundation Spec  Mimo Phase 2

## 1) SEO Foundation Principles

- every public route must have one clear search purpose
- every indexable page must have one canonical URL
- metadata must describe the page truthfully
- no duplicate title or description intent across public routes
- social preview assets must look premium and readable
- searchability must not create page sprawl
- performance and clarity are part of discoverability
- legal pages remain indexable only if intentional and useful
- auth pages stay technically clean and non-spammy
- the site must be understandable to search engines and users immediately

## 2) Canonical URL Rules

- one canonical per indexable public route
- canonicals must use the production domain:
  - https://mimolaundry.org
- all canonical URLs must be absolute
- no query-string canonicals
- no alternate duplicate route structures
- trailing slash handling must be consistent across the site
- choose one canonical style and enforce it:
  - no trailing slash canonical style except root
- www/non-www duplication must be resolved to the single chosen production host:
  - https://mimolaundry.org
- login/signup pages must still have clean canonical treatment
- /track must not fragment into multiple crawlable parameter states

Canonical route set:
- https://mimolaundry.org/
- https://mimolaundry.org/track
- https://mimolaundry.org/partners
- https://mimolaundry.org/help
- https://mimolaundry.org/login
- https://mimolaundry.org/signup
- https://mimolaundry.org/terms
- https://mimolaundry.org/privacy
- https://mimolaundry.org/refund-policy

## 3) Metadata Rules

- unique title intent per route
- unique description intent per route
- titles must say what the page is
- descriptions must explain the next value clearly
- no title stuffing
- no location stuffing
- no keyword spam
- metadata must align with the pages actual visible content
- route-level metadata ownership must be documented, not invented ad hoc later

Additional metadata discipline:
- public routes must reflect their single clear page purpose from the locked public sitemap and copy model
- metadata must not promise flows or content that do not visibly exist on the page
- legal routes must stay plain, accurate, and intentionally descriptive
- login and signup metadata must remain clean, useful, and low-noise rather than trying to rank with spammy terms
- /track metadata must describe order tracking clearly without creating many crawlable variants

## 4) OpenGraph Rules

- og:title aligned to page title intent
- og:description aligned to page summary intent
- og:type = website for public routes
- og:url must match canonical
- og:image must use approved branded preview asset
- og:image must remain readable on mobile sharing surfaces
- og:image must follow Midnight Silk brand surface rules
- each page may reuse a disciplined OG template system, but purpose must remain route-correct

OpenGraph implementation discipline:
- one branded OG image family is preferred over many disconnected designs
- the image system must maintain premium clarity, dark/light balance, and legible type at small preview sizes
- route-specific text treatment may vary only enough to preserve route truth
- public routes should reuse one calm, premium visual language rather than creating social-preview clutter

## 5) Twitter/X Card Rules

- use summary_large_image
- title and description must remain concise
- image must match OG asset family
- no separate chaotic social-preview design system

Twitter/X implementation discipline:
- use the same visual family and copy intent as OpenGraph
- preserve readability and premium restraint on mobile previews
- do not create copy divergence between search metadata and social metadata without a clear reason

## 6) Route-by-Route Metadata Ownership

### /

- Canonical URL: https://mimolaundry.org/
- Title Intent: premium laundry service homepage introducing Mimo clearly and directly
- Description Intent: explain what Mimo does, who it serves, and the fastest next step to start or track
- Indexing Intent: index
- OpenGraph Intent: premium brand introduction with clear service proposition
- Duplication Risk to Avoid: do not duplicate the full purpose of /track, /partners, or /help on the homepage

### /track

- Canonical URL: https://mimolaundry.org/track
- Title Intent: order tracking page for customers and order owners
- Description Intent: explain that users can track laundry progress clearly and quickly
- Indexing Intent: index
- OpenGraph Intent: route-specific tracking value without turning it into a generic homepage clone
- Duplication Risk to Avoid: do not duplicate homepage pitch, support center scope, or create parameter-based crawl sprawl

### /partners

- Canonical URL: https://mimolaundry.org/partners
- Title Intent: affiliate and business partnership entry page
- Description Intent: explain partnership value, who should apply, and the next action
- Indexing Intent: index
- OpenGraph Intent: premium partnership invitation aligned to real affiliate onboarding intent
- Duplication Risk to Avoid: do not duplicate signup, help, or homepage sales language

### /help

- Canonical URL: https://mimolaundry.org/help
- Title Intent: support and help center entry page
- Description Intent: explain where users can get answers or support quickly
- Indexing Intent: index
- OpenGraph Intent: calm support access and guidance
- Duplication Risk to Avoid: do not duplicate /track as the main function and do not become a legal-policy dump

### /login

- Canonical URL: https://mimolaundry.org/login
- Title Intent: secure login for existing users
- Description Intent: explain that existing customers, staff, drivers, affiliates, and admins can sign in here
- Indexing Intent: index
- OpenGraph Intent: clean branded access point with low-noise utility messaging
- Duplication Risk to Avoid: do not duplicate signup messaging or app portal interior content

### /signup

- Canonical URL: https://mimolaundry.org/signup
- Title Intent: account creation for new eligible users
- Description Intent: explain the correct new-user entry path without bloated acquisition copy
- Indexing Intent: index
- OpenGraph Intent: clean onboarding access point consistent with the brand system
- Duplication Risk to Avoid: do not duplicate homepage selling or login utility language

### /terms

- Canonical URL: https://mimolaundry.org/terms
- Title Intent: terms and conditions page
- Description Intent: explain that the page contains the governing terms for service use
- Indexing Intent: index only if intentionally published as a useful legal page
- OpenGraph Intent: plain, accurate legal identification
- Duplication Risk to Avoid: do not turn legal metadata into support or marketing copy

### /privacy

- Canonical URL: https://mimolaundry.org/privacy
- Title Intent: privacy policy page
- Description Intent: explain how user information is handled and protected at a high level
- Indexing Intent: index only if intentionally published as a useful legal page
- OpenGraph Intent: plain, accurate legal identification
- Duplication Risk to Avoid: do not duplicate help/support messaging or terms wording

### /refund-policy

- Canonical URL: https://mimolaundry.org/refund-policy
- Title Intent: refund policy page
- Description Intent: explain the refund and dispute policy scope clearly
- Indexing Intent: index only if intentionally published as a useful legal page
- OpenGraph Intent: plain, accurate legal identification
- Duplication Risk to Avoid: do not duplicate help article intent or broad legal boilerplate

## 7) Optional Minimal Location Page Rules

- no location or zone pages are created by default in P2.4
- location/zone pages may only be introduced if there is verified unique service-area content and no duplication risk
- if introduced later, they must remain minimal, indexable, and non-spammy
- they must not create fake city-doorway SEO pages
- they must not duplicate the landing page with a place name swapped in

Allowed future location-page standard:
- one route per real service area only
- unique coverage explanation
- unique service notes if operationally true
- same brand/layout system
- no massive template farm

P2.4 does not create location pages now; it only defines the guardrail for later use.

## 8) Sitemap and Robots Rules

Sitemap rules locked:
- the site must expose one production sitemap index or sitemap file
- all intended public indexable routes must be included
- no app portal routes under /app/* may appear in the public sitemap
- no private/authenticated route variants may appear
- no test/staging URLs may appear
- update frequency and priority fields must be used only if implementation supports them cleanly; do not fabricate SEO theater
- sitemap must reflect the true public route set only

Robots.txt rules locked:
- allow crawling of public marketing and legal pages intended for discovery
- disallow private application portals under /app/
- disallow obvious private/auth/session utility paths if they exist
- reference the production sitemap URL
- avoid overly complex robots rules in P2.4
- robots must support indexability, not accidentally block the site

Route inclusion rules:

Include in sitemap:
- /
- /track
- /partners
- /help
- /login
- /signup
- /terms
- /privacy
- /refund-policy

Disallow from sitemap:
- /app/customer
- /app/driver
- /app/hub
- /app/affiliate
- /app/admin
- /app/dev
- authenticated detail pages
- parameterized private states
- internal tools

Additional sitemap/robots foundation:
- production host expectation: https://mimolaundry.org
- one source of sitemap truth
- no duplicate sitemap generation logic across multiple app layers
- robots must not block the canonical public route set accidentally
- auth pages may remain crawlable if intentionally published as clean utility pages, but they must not create spam states or query-based duplication

## 9) Structured Data Rules

Structured data foundation for P2.4:
- use one calm, truthful schema strategy
- prioritize clarity and local discoverability over quantity
- schema must match visible page truth
- omit any field that is not verified, intentionally published, or implementation-ready

Chosen P2.4 schema direction:
- WebSite for overall site identity and search/track intent support only if implemented truthfully
- LocalBusiness for company/service identity on the homepage
- FAQ schema only if actual visible FAQ content exists on the page and matches exactly
- no ratings, reviews, fake prices, fake hours, or speculative claims

Route application direction:
- Home: WebSite + LocalBusiness
- Help: optional FAQ only if visible FAQ content exists and remains stable
- Partners: no misleading business-review schema
- Track/Login/Signup/Legal: no unnecessary schema clutter

## 10) Performance and Lighthouse Rules

Performance baseline for discoverability:
- public searchability work must not degrade mobile experience
- Core Web Vitals basics are part of SEO quality, not optional polish
- public pages must remain static-first or lean where possible
- metadata, OG assets, sitemap, robots, and schema implementation must not add avoidable payload bloat

Lighthouse verification discipline:
- run Lighthouse on the public routes
- verify indexability and basic best-practice readiness
- verify performance does not collapse on mobile simulation
- verify SEO fundamentals are present
- capture screenshots or outputs as evidence

Baseline acceptance expectation:
- public pages must pass baseline Lighthouse checks sufficiently to show no major structural SEO/performance failure
- if one page underperforms, the cause must be identified and logged before moving on

## 11) SEO Foundation Lock Statement

The SEO and searchability foundation is locked to a minimal, truthful, premium public-site system for https://mimolaundry.org. Every public route has one clear discoverability purpose, one canonical URL, disciplined metadata ownership, and a restrained social-preview strategy. Sitemap, robots, structured data, and performance rules are intentionally minimal so the site can be indexed cleanly without spam, duplication, or public page sprawl.
