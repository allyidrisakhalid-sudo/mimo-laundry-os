# Domains and DNS

## Root domain

- mimolaundry.org

## Production domains

- Web: app.mimolaundry.org
- API: api.mimolaundry.org

## DNS model

- app.mimolaundry.org uses CNAME to the Vercel target shown in project domain settings
- api.mimolaundry.org uses CNAME to the Render target shown in service custom domain settings

## Notes

- Use DNS-only mode during first verification
- Managed TLS must be enabled by providers
- HTTPS redirect must be enforced

## Production web project decision

- The current Vercel project is being used as the production web target for app.mimolaundry.org.
- Production web custom domain: https://app.mimolaundry.org
- Production API custom domain: https://api.mimolaundry.org

## Verified DNS records

- app CNAME -> d7fbc21f1a12633f.vercel-dns-017.com
- api CNAME -> mimo-laundry-os-prod-api.onrender.com

## TLS status

- app.mimolaundry.org verified in Vercel
- api.mimolaundry.org verified in Render with certificate issued
