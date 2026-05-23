# Public Beta Launch Checklist — Factory

**Updated:** 2026-05-23  
**Branch:** `claude/code-audit-review-bERxc`  
**Status:** PRE-LAUNCH — complete all items before flipping to LIVE

---

## URLs (fill in before launch)

| Service | URL |
|---------|-----|
| Netlify frontend | `https://YOUR-SITE.netlify.app` |
| Custom domain (if set) | `https://app.yourcompany.com` |
| Railway API | `https://YOUR-API.railway.app` |
| Preview gateway | `https://YOUR-PREVIEW.railway.app` |

---

## Pre-Launch Infrastructure

### Netlify Frontend

- [ ] Repo connected: `mdtazizulislam/factory`
- [ ] Branch: `claude/code-audit-review-bERxc`
- [ ] Build command: `npm run build` (reads from `netlify.toml`)
- [ ] Publish directory: `.next` (relative to `web/`)
- [ ] Build plugin: `@netlify/plugin-nextjs` installed
- [ ] Build passes: 25/25 pages
- [ ] Deploy preview URL tested manually
- [ ] Custom domain configured (optional — see `docs/launch/domain-dns-runbook.md`)
- [ ] HTTPS certificate provisioned (Netlify auto)

### Required Netlify Env Vars

- [ ] `NEXT_PUBLIC_API_BASE_URL` = `https://YOUR-API.railway.app`
- [ ] `NEXT_PUBLIC_PREVIEW_BASE_URL` = `https://YOUR-PREVIEW.railway.app`
- [ ] `NEXT_PUBLIC_APP_ENV` = `production`
- [ ] `NEXT_PUBLIC_ANALYTICS_ENABLED` = `true`
- [ ] `NEXT_PUBLIC_SENTRY_DSN` = *(optional — add for error monitoring)*
- [ ] `NEXT_PUBLIC_BETA_MODE` = `true` *(for beta-gate display)*

### Railway API

- [ ] API service deployed and healthy: `GET /health` → `{"ok":true}`
- [ ] `DATABASE_URL` set
- [ ] `REDIS_URL` set
- [ ] `AUTH_SECRET` set (min 32 chars)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` set (Railway injects)

### Railway Orchestrator

- [ ] Orchestrator service deployed
- [ ] `ORCHESTRATOR_API_KEY` set
- [ ] `PREVIEW_SHARE_SECRET` set
- [ ] `DATABASE_URL` set
- [ ] `REDIS_URL` set

### Optional / Feature-Gated

- [ ] `ANTHROPIC_API_KEY` *(for AI pair programmer, council, triage)*
- [ ] `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + `STRIPE_PUBLISHABLE_KEY` *(for billing)*
- [ ] `SENDGRID_API_KEY` *(for email delivery)*
- [ ] `SENTRY_DSN` *(server-side error monitoring)*

---

## Route Smoke Checklist

Run: `.\scripts\public-beta-smoke.ps1 -BaseUrl https://YOUR-SITE.netlify.app -ApiUrl https://YOUR-API.railway.app`

| Route | Expected | Result |
|-------|----------|--------|
| `/` | Home page loads, prompt input visible | ☐ |
| `/demo` | Demo page loads, animation plays | ☐ |
| `/discover` | App marketplace loads | ☐ |
| `/apps/medibook-pro` | App detail page loads | ☐ |
| `/status` | Status page shows "All Systems Operational" | ☐ |
| `/workspace` | Workspace list renders | ☐ |
| `/memory` | Memory module renders | ☐ |
| `/quality` | Quality dashboard renders | ☐ |
| `/admin` | Auth-gated (redirects or 401) | ☐ |

---

## Monitoring Checklist

- [ ] Uptime check configured for frontend (`/`) — 5 min interval
- [ ] Uptime check configured for API health (`/health`) — 1 min interval
- [ ] Uptime check for public status endpoint (`/v1/public/status`) — 1 min
- [ ] `ALERT_SLACK_WEBHOOK_URL` set in Railway API env vars
- [ ] `ALERT_EMAIL_TO` set
- [ ] `watch-production.ps1` tested locally at least once
- [ ] `/admin/health` page shows all green

---

## SEO / Analytics Checklist

- [ ] Root layout metadata: title, description, OG, Twitter card
- [ ] Per-route metadata: `/`, `/demo`, `/discover`, `/apps/[slug]`, `/status`
- [ ] `NEXT_PUBLIC_ANALYTICS_ENABLED=true` set on Netlify
- [ ] Analytics events fire on landing (check browser console in prod)
- [ ] `robots.txt` (Next.js default) allows crawling of public routes
- [ ] No internal URLs or localhost in any `<meta>` tags

---

## Billing / Legal Checklist

- [ ] Pricing page visible and accurate
- [ ] Free tier limits confirmed correct
- [ ] Terms of Service link present
- [ ] Privacy Policy link present
- [ ] GDPR / cookie notice if targeting EU users
- [ ] Billing dashboard accessible (admin only)
- [ ] Stripe test-mode → production-mode switch confirmed
- [ ] Refund policy documented

---

## Support Checklist

- [ ] Support email / feedback link visible on site
- [ ] Bug report template available (see `docs/launch/support-flow.md`)
- [ ] Founder daily review routine set up
- [ ] Incident runbook reviewed by all operators
- [ ] PagerDuty / on-call rotation set (or founder on-call for beta)

---

## Security Checklist

- [ ] No secrets in `NEXT_PUBLIC_*` vars
- [ ] No hardcoded localhost in production paths
- [ ] CSP headers verified (`Content-Security-Policy` present in HTTP response)
- [ ] HSTS verified (`Strict-Transport-Security` present)
- [ ] Admin routes auth-gated
- [ ] Kill switch `readonly` tested
- [ ] Audit log accessible at `/admin`

---

## Rollback Checklist

| Scenario | Action |
|----------|--------|
| Netlify build failure | Rollback to previous deploy in Netlify dashboard |
| Railway API crash | Restart service; rollback deploy if needed |
| Bad env var | Update in Railway/Netlify dashboard → redeploy |
| Data corruption | Enable `readonly` kill switch; assess DB state |
| Security incident | Enable `readonly`; rotate `AUTH_SECRET` |

---

## Known Beta Limitations

1. **Mobile service**: disabled/archived — no native mobile app in beta
2. **Billing**: may be in Stripe test mode — confirm before charging users
3. **AI generation**: rate-limited — 10 generations/day on free tier
4. **Preview gateway**: shared infrastructure — may have cold-start latency
5. **Email delivery**: Sendgrid optional — password-reset flows may be limited
6. **Analytics**: console fallback in development — production provider TBD
7. **Enterprise SSO**: not yet implemented — OAuth in roadmap (SERIAL 30+)

---

## Launch / No-Launch Verdict

Fill in on launch day:

```
Date: ________________
Operator: ________________

Infrastructure:  [ ] GO  [ ] NO-GO
Monitoring:      [ ] GO  [ ] NO-GO
Routes:          [ ] GO  [ ] NO-GO
Security:        [ ] GO  [ ] NO-GO
Support:         [ ] GO  [ ] NO-GO

FINAL VERDICT:   [ ] LAUNCH  [ ] HOLD

Notes:
_____________________________________________
```

---

## Related Docs

- `docs/launch/domain-dns-runbook.md`
- `docs/launch/risk-register.md`
- `docs/launch/support-flow.md`
- `docs/monitoring/synthetic-checks.md`
- `docs/incident/runbook.md`
- `docs/deployment/netlify-checklist.md`
- `scripts/public-beta-smoke.ps1`
- `scripts/smoke-production.ps1`
