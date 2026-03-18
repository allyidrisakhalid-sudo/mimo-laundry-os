# Domain Routing and TLS Spec  Mimo Phase 2

## 1) Domain and Routing Principles

Locked domain and routing principles:
- one production apex for web
- one production subdomain for API
- no duplicate public hosts
- routing must be obvious and stable
- DNS must reflect real deployment targets only
- public hostnames must stay minimal
- web and API separation must be explicit
- redirects must eliminate ambiguity
- secure transport is mandatory
- infrastructure clarity beats cleverness

## 2) Production Host Map

Locked production hostnames:
- mimolaundry.org  public web app
- www.mimolaundry.org  redirect to mimolaundry.org
- api.mimolaundry.org  production API

No additional public production hostnames are defined in this chapter.

## 3) DNS Record Model

### Apex Web Record Rules
- mimolaundry.org must point to the production web origin
- use the correct Cloudflare-supported record type for the actual hosting target
- keep the public hostname proxied through Cloudflare unless the hosting provider requires otherwise for a specific verified reason
- do not create duplicate apex aliases

### API Record Rules
- api.mimolaundry.org must point to the production API origin
- use one clean record target only
- keep the API hostname proxied through Cloudflare unless a documented provider constraint requires otherwise
- do not expose extra API aliases

### WWW Redirect Rules
- www.mimolaundry.org exists only to redirect permanently to mimolaundry.org
- www must not serve as an alternate canonical production site
- the redirect target must preserve path and query where appropriate

### Proxy Rules
- web and API public hostnames must be clearly documented as proxied or DNS-only according to the real deployment requirement
- the chosen mode must be explicit, not left ambiguous
- this chapter defaults to proxied public delivery through Cloudflare for both web and API unless the live origin constraint explicitly prevents that

### Forbidden Patterns
- multiple public web hosts serving the same content
- duplicate API aliases
- staging hostnames mixed into production DNS
- undocumented DNS-only exceptions
- path-based domain confusion between web and API

## 4) Origin Mapping Rules

- web origin must only receive web traffic for mimolaundry.org
- API origin must only receive API traffic for api.mimolaundry.org
- origin hostnames or provider URLs must not become the public canonical brand URLs
- origin exposure must be minimized

## 5) Redirect Rules

- www.mimolaundry.org redirects permanently to https://mimolaundry.org
- mimolaundry.org remains the canonical public host
- all public requests redirect to HTTPS
- redirects preserve path and query where appropriate
- redirects must reinforce the canonical host used in SEO metadata and sitemap
- redirects must not conflict with canonical URL rules from P2.4
- redirect loops are forbidden
- dual-canonical hosts are forbidden
- protocol confusion is forbidden
- provider-domain redirects visible to end users are forbidden

## 6) TLS Rules

### SSL/TLS Mode
- Cloudflare SSL/TLS mode must be Full (strict)

### Edge Certificate Rules
- edge certificates must be active for public production hosts
- web and API must both serve valid HTTPS
- certificate coverage must include:
  - mimolaundry.org
  - www.mimolaundry.org
  - api.mimolaundry.org

### Origin Certificate / Validity Rules
- origin endpoints behind Cloudflare must present a valid certificate chain acceptable for Full (strict)
- do not rely on weak or mismatched origin certificate handling
- strict origin trust is non-negotiable

### HTTPS Redirect Rules
- HTTP must redirect to HTTPS
- redirects must be deterministic and permanent where appropriate
- no mixed protocol experience for public users

### HSTS Rollout Rules
- HSTS is not enabled aggressively at first touch unless stable verification is complete
- enable HSTS only after web and API routing are confirmed stable in production
- once enabled later, configure deliberately and do not guess
- preload is not enabled in this chapter

### Forbidden Patterns
- Flexible SSL
- Full (non-strict) as final production mode
- mixed HTTP/HTTPS availability
- HSTS enabled before stability verification
- certificate ambiguity between edge and origin

## 7) Routing Verification Model

Locked routing verification model:
- test apex host:
  - https://mimolaundry.org
- test www redirect:
  - https://www.mimolaundry.org
- test API host:
  - https://api.mimolaundry.org
- verify public pages resolve on the apex host
- verify the app still calls the API host successfully
- verify certificates are valid
- verify redirects are correct
- verify secure transport only
- verify no loop, no mismatch, no exposed provider-domain host confusion

## 8) Domain Lock Statement

The production domain model is locked to one clear public apex for web, one explicit API subdomain, and one permanent WWW redirect. TLS is locked to Full (strict), origin trust is mandatory, and routing must stay minimal, obvious, and stable so the production experience remains secure, canonical, and operationally clear.
