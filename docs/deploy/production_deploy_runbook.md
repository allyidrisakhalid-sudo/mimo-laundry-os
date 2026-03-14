# Production deploy runbook

## Required order

1. Push reviewed code to main
2. CI runs lint / typecheck / tests / build
3. Run database migrate deploy before boot
4. Deploy API
5. Deploy worker
6. Deploy web
7. Verify health endpoints
8. Run smoke tests
9. Confirm monitoring sees service as up

## Rollback

- Follow rollback strategy documented in Chapter 11.1
- Roll back app deployment first
- Restore database only if migration rollback plan explicitly supports it
