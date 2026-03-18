# Public Site Spec  Mimo Phase 2

## 1) Public Experience Principles

Locked principles:
- mobile-first
- one-page purpose clarity
- premium but mass-market understandable
- fast trust building
- visible next step within seconds
- no duplicate content across public pages
- WhatsApp support available but not spammy
- all public pages visually unified under Midnight Silk
- all public screens use the approved component system
- the public experience must guide users to action in under 60 seconds

## 2) Global Public Header

Locked header structure:
- logo left
- primary nav links: Track, Partners, Help
- language toggle
- Login
- primary CTA: Start now
- mobile menu collapses cleanly
- no excessive navigation items
- no secondary promo bar

Header behavior rules:
- the header must stay visually calm and minimal
- the primary CTA must remain visually dominant over Login
- language toggle must be available without cluttering the header
- mobile navigation must expose only the same approved routes, not extra promotional destinations
- header styling must follow Midnight Silk public rhythm and not feel like an internal app shell

## 3) Landing Page Spec

### Route
- /

### Purpose
- Establish Mimo as a premium, trustworthy, mobile-friendly laundry service and move the visitor to the correct next step within seconds.

### Primary User Intent
- understand what Mimo does, whether Mimo serves them, and how to start

### Primary CTA
- Start now

### Secondary CTA
- Track order

### Above-the-Fold Goal
- a new user must understand the service, trust it, and see the next action without scrolling deeply

### Section Order
1. Hero
2. How It Works
3. Areas Served
4. Trust and Service Proof
5. Partner Entry
6. Help and Contact CTA
7. Final CTA
8. Footer

### Section-by-Section Rules

#### Hero
Locked structure:
- one clear headline
- one short supporting paragraph
- one primary CTA
- one secondary CTA
- one visual support area using Midnight Silk premium framing
- one short reassurance strip below fold line

Hero message intent:
- premium laundry pickup and care made simple

Hero content rules:
- headline must say what Mimo does directly
- support copy must stay under 2 short sentences
- primary CTA must route to signup or appropriate start path
- secondary CTA must route to /track
- no slider
- no rotating banners
- no multiple competing offers
- no vague slogans without service explanation

#### How It Works
Locked structure:
- 3 steps only
- step 1: schedule or start order
- step 2: pickup or shop handoff
- step 3: clean, track, and return
- each step has icon, short title, one-line support copy
- no long process essay
- no duplicate operational detail from internal portals

#### Areas Served
Locked structure:
- one short service coverage explanation
- one compact area list or coverage summary
- one fallback note directing unsupported visitors to help/contact path
- no giant map dependency in P2.3
- no fake national coverage claim

#### Trust and Service Proof
Locked structure:
- short trust headline
- 3 proof cards max

Proof themes:
- tracked order progress
- clear handoff and proof
- premium care and support

Rules:
- no fake testimonials in this chapter
- no inflated metrics unless already verified and approved

#### Partner Entry
Locked structure:
- one concise block introducing shop partnership
- one CTA to /partners
- no full partner page duplication

#### Help and Contact CTA
Locked structure:
- direct link to /help
- visible WhatsApp CTA
- support contact reassurance
- one calm sentence only

#### Final CTA
Locked structure:
- repeat the single primary public action
- concise copy only
- no additional new information

### Mobile Rules
- hero CTA visible without deep scroll
- section spacing compact but premium
- no overlong paragraphs
- cards stack vertically
- trust and process content must remain scan-friendly
- footer must not bury the main CTA

### Copy Rules
- warm
- simple
- premium
- direct
- no hardcoded strings; map all public-facing text to i18n later
- no jargon
- no oversized marketing promises

### Visual Rules
- Midnight Silk public hero treatment
- premium card rhythm
- restrained gradients
- mobile-first content width and spacing
- imagery supports trust, not decoration
- all sections feel visually connected

### Forbidden Patterns
- pricing page duplication
- FAQ overload on home
- long founder-story section
- blog/news section
- multiple audience funnels above the fold
- cluttered hero with too many buttons
- animation-heavy gimmicks

## 4) Track Order Page Spec

### Route
- /track

### Purpose
- give users one fast route to see order progress without making them navigate the app first

### Primary CTA
- View order status

### Section Order
1. Page Header
2. Tracking Form
3. Result State
4. Timeline Explanation
5. Help Escalation Block

### Page Header Rules
- exact plain title
- one-line reassurance
- no marketing hero duplication

### Tracking Form Rules
- one clean input group
- order reference and any required lookup input according to actual product behavior
- one primary button
- clear validation state
- no unnecessary supporting fields

### Result State Rules
- status summary
- latest step
- next expected state if available
- link to login if the user needs deeper account access
- one fallback support path if lookup fails

### Timeline Explanation Rules
- use the approved Timeline direction in public-friendly simplified form
- explain status progression clearly
- keep it compact

### Help Escalation Block Rules
- support route to /help
- WhatsApp CTA visible
- no generic dead-end contact us later copy

### Track Page Forbidden Patterns
- full account dashboard
- public hero duplication
- unrelated marketing sections
- forcing login for basic tracking if the chosen product flow supports guest lookup
- duplicate FAQ wall already housed in /help

## 5) Partners Page Spec

### Route
- /partners

### Purpose
- convert shop owners and operators into qualified affiliate partnership leads

### Primary CTA
- Apply to partner with Mimo

### Section Order
1. Partner Hero
2. Why Partner With Mimo
3. How Partnership Works
4. Who This Is For
5. CTA Block
6. Mini FAQ

### Partner Hero Rules
- one headline
- one short support paragraph
- one CTA
- no customer-facing duplication

### Why Partner With Mimo Rules
- 3 benefit cards max

Benefit themes:
- more customer convenience
- clearer order handling
- visibility and payout structure

Rules:
- no vague grow faster fluff

### How Partnership Works Rules
- 3 or 4 steps max
- application
- onboarding
- daily operation
- commission/payout visibility
- concise only

### Who This Is For Rules
- define the right partner profile clearly
- define basic expectations
- keep it realistic

### CTA Block Rules
- one clear partnership CTA
- support fallback for questions
- WhatsApp CTA allowed here

### Mini FAQ Rules
- 4 FAQs max
- affiliate-specific only
- no general support duplication

### Partners Page Forbidden Patterns
- general public landing duplication
- full policy library
- full signup flow duplicated inside this page
- customer-order marketing content dominating the page

## 6) Help Page Spec

### Route
- /help

### Purpose
- provide one clear place for support guidance, common questions, and policy summaries without scattering help content across the site

### Primary CTA
- Get help now

### Section Order
1. Help Header
2. Top Questions
3. Issue Categories
4. Policy Summaries
5. Contact and Escalation CTA

### Help Header Rules
- one clear title
- one-line reassurance
- optional search prompt framing only if implemented later
- no large marketing block

### Top Questions Rules
- 6 FAQs max

Must cover:
- how ordering works
- how tracking works
- what areas are served
- payment clarity
- delivery/pickup timing
- what to do if there is a problem

### Issue Categories Rules
- delivery delay
- missing item or issue
- payment question
- partner/shop question
- account/login help
- each category has one short description and one next-step path

### Policy Summaries Rules
- short summaries only
- link out to minimal footer policy pages
- must include:
  - terms
  - privacy
  - refund policy
- do not dump full legal text on /help

### Contact and Escalation CTA Rules
- visible WhatsApp CTA
- direct support wording
- help route must always offer a next step

### Help Page Forbidden Patterns
- giant accordion overload
- duplicating the full legal pages
- duplicating tracking form behavior
- turning help into a blog/article center in P2.3

## 7) Contact and WhatsApp CTA Rules

Locked public support contact:
- WhatsApp / support contact: +255788558975

Placement rules:
- visible in landing page help/contact section
- visible on /track help escalation block
- visible on /partners CTA/support block
- visible on /help contact and escalation section
- visible in site footer contact area
- not repeated excessively in every section

Wording rules:
- concise
- reassuring
- action-based
- no desperate sales tone
- no shouting
- no duplicate CTA text in every placement

Visual rules:
- use approved button/card styling
- WhatsApp treatment must harmonize with Midnight Silk, not visually clash
- icon usage follows Lucide rules
- contact block must feel premium and trustworthy

Anti-spam rules:
- no floating aggressive popup in P2.3
- no repeated sticky CTA overlays
- one fixed or repeated contact pattern only where structurally appropriate
- support CTA must assist, not harass

## 8) Footer and Legal Page Rules

Locked primary footer links:
- Home
- Track Order
- Partners
- Help
- Login
- Sign Up

Locked legal footer links:
- Terms
- Privacy
- Refund Policy

Locked footer support block:
- support/WhatsApp CTA using +255788558975
- concise service reassurance line

Footer rules:
- minimal
- premium
- no giant sitemap footer
- no duplicate full-page content summaries
- legal links remain visible and easy to reach

Locked legal routes:
- /terms
- /privacy
- /refund-policy

Public/legal system rules:
- footer must visually belong to the same public family as the rest of the site
- legal pages must feel calm, readable, and intentionally minimal
- policy access must remain possible from /help and the footer
- legal routes must not become promotional landing pages

## 9) Public Performance and Mobile Rules

Locked rules:
- landing page must feel complete on mobile first
- headline and CTA visible quickly
- public pages must avoid heavy image/video dependence
- no autoplay video in P2.3
- imagery must be optimized and secondary to content clarity
- section count must remain disciplined
- page length must feel concise
- no complex animation sequences blocking comprehension
- first-time understanding must happen in under 60 seconds
- support and next-step pathways must be visible without hunting

Additional implementation rules:
- page sections should load in a readable order without visual jumps
- typography scale must prioritize fast scanning over decorative display treatment
- CTA buttons must remain thumb-friendly on small screens
- public forms must keep field count minimal and validation obvious
- visual polish must not reduce clarity or page speed

## 10) Public Experience Lock Statement

The Phase 2 public experience is locked as a minimal, mobile-first, premium, non-duplicative public system for mimolaundry.org. Home owns the service story and first-action path. Track owns public tracking utility. Partners owns affiliate conversion. Help owns support guidance and policy summaries. Legal pages own policy detail. All public screens must remain unified under Midnight Silk and guide users to the correct next action in under 60 seconds.
