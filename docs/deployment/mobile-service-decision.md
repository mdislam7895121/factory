# Mobile Service — Deployment Decision

**Date:** 2026-05-22  
**Decision owner:** Factory Engineering  
**Status:** Deferred — mobile service excluded from current production graph

---

## Background

The `mobile/` directory contains a React Native / Expo mobile client for Factory.  
During earlier development, a Railway service was provisioned for the mobile build pipeline.

That service has entered a **failed / unhealthy state** and is not part of the current web production launch.

---

## Decision

**The mobile service is archived / disabled until a dedicated mobile serial is allocated.**

Reasons:
1. Current production milestone is web frontend (Netlify) + API (Railway) only
2. Mobile requires separate build tooling (Expo EAS, or native CI runners) not yet configured
3. A failed Railway service should not block the web production deployment graph
4. Mobile features are intentionally out of scope for SERIALs 22–26

---

## Production Graph (Current)

```
┌────────────────────────────────────────────────┐
│  Netlify                                        │
│  Factory Web Frontend (Next.js)                │
│  Branch: claude/code-audit-review-bERxc        │
└──────────────────┬─────────────────────────────┘
                   │ NEXT_PUBLIC_API_BASE_URL
                   ▼
┌────────────────────────────────────────────────┐
│  Railway                                        │
│  ├── API service (NestJS)                      │
│  ├── Orchestrator / Preview Gateway            │
│  ├── Redis                                     │
│  └── PostgreSQL                                │
└────────────────────────────────────────────────┘

❌  Mobile service — DISABLED / ARCHIVED
```

---

## Recommendation

1. **Disable** the failed Railway mobile service from the production deployment graph
2. **Archive** the service in Railway (stop billing, keep config)
3. **Do not block** web deploys on mobile health checks
4. **Revisit** mobile in a future dedicated serial (SERIAL 30+ tentative)

---

## Future Mobile Serial Scope (Tentative)

When mobile is re-enabled:
- Expo EAS Build integration
- Separate Railway service or dedicated mobile CI
- Deep link configuration
- Push notification service
- App store submission pipeline

---

## Impact on Current Serials

| Serial | Impact |
|--------|--------|
| SERIAL 26 (Netlify deployment) | None — web-only |
| SERIAL 27 (Monitoring) | Health checks exclude mobile endpoint |
| SERIAL 28+ | TBD |
