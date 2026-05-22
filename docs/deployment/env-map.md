# Factory — Environment Variable Map

**Updated:** 2026-05-22  
**Scope:** All production services

No secret values are documented here — placeholders only.

---

## Netlify (Frontend)

Set these in the Netlify Dashboard → Site Settings → Environment Variables.

| Variable | Required | Description | Example Placeholder |
|----------|----------|-------------|---------------------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Required | Railway API base URL (no trailing slash) | `https://factory-api.railway.app` |
| `NEXT_PUBLIC_PREVIEW_BASE_URL` | ✅ Required | Preview gateway URL | `https://factory-preview.railway.app` |
| `NEXT_PUBLIC_APP_ENV` | ✅ Required | App environment identifier | `production` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Optional | Enable analytics events | `true` |
| `NEXT_PUBLIC_BETA_MODE` | Optional | Enable beta feature flags | `false` |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry error monitoring DSN | `https://xxx@sentry.io/yyy` |

> **Never put secrets, tokens, API keys, or database URLs in `NEXT_PUBLIC_` variables.**  
> They are embedded in the browser bundle and publicly visible.

---

## Railway (Backend / API / Runtime)

Set these in Railway → Project → Variables.

### API Service (`api/`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `AUTH_SECRET` | ✅ | JWT signing secret (min 32 chars) |
| `NODE_ENV` | ✅ | `production` |
| `PORT` | ✅ | API listen port (Railway injects) |

### Orchestrator Service (`orchestrator/`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Shared or separate Postgres |
| `REDIS_URL` | ✅ | Shared Redis |
| `ORCHESTRATOR_API_KEY` | ✅ | Internal service auth key |
| `PREVIEW_SHARE_SECRET` | ✅ | Preview URL signing secret |
| `PORT` | ✅ | Orchestrator listen port |

### Optional / Feature-Gated

| Variable | Service | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | API | Claude AI features (pair programmer, review gate) |
| `STRIPE_SECRET_KEY` | API | Stripe billing integration |
| `STRIPE_WEBHOOK_SECRET` | API | Stripe webhook verification |
| `STRIPE_PUBLISHABLE_KEY` | API | Exposed to billing frontend only |
| `SENDGRID_API_KEY` | API | Email delivery (future — SERIAL 27+) |
| `SENTRY_DSN` | API/Orchestrator | Server-side error monitoring |

---

## Local Development

Copy `web/.env.production.example` → `web/.env.local` and fill in:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_PREVIEW_BASE_URL=http://localhost:4100
NEXT_PUBLIC_APP_ENV=development
```

Copy `api/.env.production.example` → `api/.env` for the backend.

---

## Security Rules

1. `NEXT_PUBLIC_*` vars: browser-visible, no secrets ever
2. All Railway secrets: rotated via Railway dashboard, never in git
3. `.env` files: gitignored — only `.env.example` committed
4. Audit: any var containing `SECRET`, `KEY`, `PASSWORD`, `TOKEN` must never be `NEXT_PUBLIC_`
