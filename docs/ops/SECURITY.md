# API Security Hardening v2

## Scope

This document covers API-only hardening for `api` service.

## Added Controls

1. Helmet baseline security headers (`helmet()`)
2. CORS allow-list from `CORS_ORIGINS` (comma-separated)
3. In-memory request rate limiting
4. Request body size limit via `BODY_LIMIT`
5. Environment validation and production DB URL requirement
6. Production guard for `/debug-sentry`

## Environment Variables

- `NODE_ENV` (`development` | `test` | `production`)
- `WEB_URL` (optional helper default)
- `CORS_ORIGINS` (comma-separated allowed origins)
- `RATE_LIMIT_WINDOW_MS` (default `60000`)
- `RATE_LIMIT_MAX` (default `120`)
- `RATE_LIMIT_HEALTH_MAX` (default `240`)
- `BODY_LIMIT` (default `1mb`)
- `DEBUG_TOKEN` (required to allow `/debug-sentry` in production)

## /debug-sentry Production Behavior

- If `DEBUG_TOKEN` is missing in production: returns `404`
- If `X-DEBUG-TOKEN` is wrong: returns `403`
- If `X-DEBUG-TOKEN` matches `DEBUG_TOKEN`: route throws `500` for Sentry test

## CORS Behavior

- Non-browser requests (no `Origin`) are allowed.
- Browser requests are allowed only when origin is in configured allow-list.

## Rate Limit Behavior

- Global in-memory limiter by client and route group.
- `/db/health` uses a higher threshold (`RATE_LIMIT_HEALTH_MAX`).
- Limit exceeded response: `429` with `TOO_MANY_REQUESTS`.

## Tuning Guidance

- Keep `RATE_LIMIT_MAX` conservative for public APIs.
- Keep `BODY_LIMIT` small unless uploads are required.
- Set explicit `CORS_ORIGINS` in production.
- Rotate `DEBUG_TOKEN` periodically and keep it secret.
