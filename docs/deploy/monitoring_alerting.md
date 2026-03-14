# Production monitoring and alerting

## Health checks

- GET https://api.mimolaundry.org/v1/health
- GET https://api.mimolaundry.org/v1/health/db

## Error monitoring

- Tool: Sentry

## Alert channel

- Primary channel: Email

## Thresholds

- API down for more than 2 minutes -> alert
- DB health failure -> alert
- 5xx error spike -> alert
- job failures exceed threshold within 10 minutes -> alert

## Verification notes

- Production health monitor configured for https://api.mimolaundry.org/v1/health
- Production DB health monitor configured for https://api.mimolaundry.org/v1/health/db
- Alert destination configured and tested
- Error monitoring enabled for production API

## Pending operator evidence

- Monitoring dashboard screenshot
- Alert test screenshot or log
