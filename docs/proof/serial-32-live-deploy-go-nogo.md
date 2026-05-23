# SERIAL 32 — Go/No-Go Report: Netlify Live Deploy Verification

**Date:** 2026-05-23  
**Branch:** `claude/code-audit-review-bERxc`  
**Latest Commit:** `df8bbeb` (SERIAL 31)  
**Investigator:** Claude Code (automated operator review)

---

## Executive Summary

The Factory codebase is **build-verified and configuration-complete** for Netlify deployment.
The `netlify.toml` is correctly authored, the frontend build passes locally (25 pages),
and all required env var contracts are defined.

**However: No Netlify site has been created and connected to the `mdtazizulislam/factory` repository.**
No live URL exists. No route verification, smoke test, or API connectivity check
can be performed until the site is connected and the first deploy fires.

**Verdict: `NO_GO` — Precondition: Netlify site must be created and first deploy completed.**

---

## 32-01 — Netlify Site Config Verification

### Build Configuration (from `netlify.toml`)

| Setting | Value | Status |
|---------|-------|--------|
| Base directory | `web` | ✅ Correct |
| Build command | `npm run build` | ✅ Correct |
| Publish directory | `.next` | ✅ Correct |
| Plugin | `@netlify/plugin-nextjs` | ✅ Declared |
| Node version | `20` (via `NODE_VERSION=20`) | ✅ Correct |
| Telemetry | `NEXT_TELEMETRY_DISABLED=1` | ✅ Set |
| NPM flags | `--no-fund --no-audit` | ✅ Set |

### Context Configuration

| Context | ENV override |
|---------|-------------|
| `production` | `NEXT_PUBLIC_APP_ENV=production` |
| `claude/code-audit-review-bERxc` | `NEXT_PUBLIC_APP_ENV=staging` |
| `deploy-preview` | `NEXT_PUBLIC_APP_ENV=preview` |

### Security Headers (configured in `netlify.toml`)

All routes `/*`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), ...`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval'; ...`

Static asset caching `/_next/static/*`:
- `Cache-Control: public, max-age=31536000, immutable`

### Netlify Account

| Field | Value |
|-------|-------|
| Account slug | `md-tazizul-islam-c5abzm8` |
| Plan | `nf_team_dev` |
| Factory site exists | ❌ NO — not yet created |
| Deployed branch | N/A — pending site creation |

**FINDING:** The `netlify.toml` is complete and correct. The Factory site has not been
created in the Netlify account. This is the primary blocker.

---

## 32-02 — Netlify Env Var Verification

### Required Public Vars (to be set on Netlify dashboard)

| Var | Scope | Required | Secret? | Status |
|-----|-------|----------|---------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | Builds + Runtime | ✅ Yes | No | ❌ Not yet set (no site) |
| `NEXT_PUBLIC_PREVIEW_BASE_URL` | Builds + Runtime | Optional | No | ❌ Not yet set (no site) |
| `NEXT_PUBLIC_APP_ENV` | Builds | ✅ Yes | No | ✅ Set via netlify.toml context |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Builds | Optional | No | ❌ Not yet set (no site) |
| `NEXT_PUBLIC_BETA_MODE` | Builds | Optional | No | ❌ Not yet set (no site) |

### Secrets That Must NEVER be in Netlify public scope

| Var | Reason |
|-----|--------|
| `AUTH_SECRET` | Auth signing key — API only |
| `DATABASE_URL` | Postgres connection — API only |
| `REDIS_URL` | Cache connection — API only |
| `STRIPE_SECRET_KEY` | Payment key — API only |
| `ADMIN_API_KEY` | Internal API auth — API only |
| `ANTHROPIC_API_KEY` | AI key — API only |
| `ALERT_SLACK_WEBHOOK_URL` | Alert hook — API/script only |

**RULE:** No var prefixed `NEXT_PUBLIC_` may contain a secret. Values for all
`NEXT_PUBLIC_*` vars will be safe: they are URLs and feature flags only.

**FINDING:** Env var contract is correctly defined and documented. No secret leakage
risk from the current codebase design. Values cannot be verified until site exists.

---

## 32-03 — First Live Deploy

**Status: BLOCKED**

**Reason:** The `mdtazizulislam/factory` repository has not been connected to a Netlify site.
A Netlify site must be created and the GitHub repo connected before any deploy can fire.

**Local build proof (substitute for live deploy until site is connected):**

```
✓ Compiled successfully in 15.8s
✓ Generating static pages (25/25) in 566.9ms
✓ 0 TypeScript errors
✓ 0 build warnings

Pages generated:
  / (static)         /demo (static)      /discover (static)
  /status (static)   /workspace (static) /memory (static)
  /quality (static)  /onboarding (static)
  /admin (static)    /admin/analytics    /admin/health
  /admin/support     /admin/onboarding   /admin/customer-success
  /apps/[slug] (dynamic)    /workspace/[id] (dynamic)
  ... + all other dynamic routes
```

**What is needed to unblock:**

1. Create Netlify site connected to `mdtazizulislam/factory`
2. Set build settings (already in `netlify.toml` — Netlify reads it automatically)
3. Set env vars: `NEXT_PUBLIC_API_BASE_URL`, others as available
4. Trigger first deploy (auto-triggers on GitHub push or manual click)

---

## 32-04 — Public Route Verification

**Status: BLOCKED — no live URL**

Routes ready in the build (would be verified post-deploy):

| Route | Type | Expected Status | Notes |
|-------|------|-----------------|-------|
| `/` | Static | 200 | Home + landing page |
| `/demo` | Static | 200 | AI build demo flow |
| `/discover` | Static | 200 | App marketplace |
| `/status` | Static | 200 | Public status page |
| `/workspace` | Static | 200 | Auth-gated shell |
| `/memory` | Static | 200 | Auth-gated shell |
| `/quality` | Static | 200 | Auth-gated shell |
| `/onboarding` | Static | 200 | Onboarding flow |
| `/apps/medibook-pro` | Dynamic SSR | 200 | App detail page |
| `/admin` | Static | 200 or 401/403 | Auth-gated |

**Gating:** `/workspace`, `/memory`, `/quality`, `/admin` all render a shell client-side.
If no auth system is configured, they load a UI shell without API data — not a blank crash.

---

## 32-05 — Railway API Connection Verification

**Status: BLOCKED / DEFERRED**

No Railway API URL is available in this session. The frontend's `env.ts` is correctly
wired to use `NEXT_PUBLIC_API_BASE_URL` from Netlify env vars. It falls back to
`http://localhost:3001` in non-production builds (safe — never hits localhost in a Netlify build).

**What happens when `NEXT_PUBLIC_API_BASE_URL` is not set at build time:**

```typescript
// From web/src/lib/env.ts:
if (!val) {
  if (IS_PROD) {
    console.warn(`[factory:env] MISSING REQUIRED PUBLIC VAR: ${name}`);
  }
  return IS_PROD ? '' : devDefault;
}
```

- Production build with missing var → empty string + console warn (no crash)
- Frontend loads → API calls return errors → status page shows degraded state
- Not a blank-screen failure — graceful degradation

**BLOCKER status:** Railway API is a dependency for dynamic features but
NOT required for the static shell to load. Route verification can proceed without it.

**Classification:** `DEFERRED — not blocking static frontend launch`

---

## 32-06 — Preview Gateway Verification

**Status: DEFERRED**

No preview gateway URL is available. The `NEXT_PUBLIC_PREVIEW_BASE_URL` env var
is optional — the frontend renders a UI shell and shows a "preview not available"
state when the gateway does not respond.

`previewUrl()` in `env.ts` constructs the gateway URL safely. No hardcoded URLs.

**Classification:** `DEFERRED — preview is a non-critical feature for internal testing phase`

---

## 32-07 — Smoke Script Execution

**Status: BLOCKED — no live URL**

Script ready at: `scripts/public-beta-smoke.ps1`

Invocation (for post-deploy execution):

```powershell
.\scripts\public-beta-smoke.ps1 `
  -BaseUrl https://YOUR-SITE.netlify.app `
  -ApiUrl  https://YOUR-API.railway.app
```

Checks the script performs:
1. 9 routes (7 required, 2 optional) — HEAD request, expect 200/401/403
2. Security headers (X-Frame-Options, HSTS, CSP, X-Content-Type-Options)
3. SEO meta tags (title, og:title, og:description, twitter:card, no localhost)
4. API health + public status JSON (if `-ApiUrl` provided)
5. Response time budget (< 3s PASS, 3–8s WARN, > 8s FAIL)

**Run this immediately after first successful Netlify deploy.**

---

## 32-08 — Env Var Checklist

| Var | Where to set | Value source | Done? |
|-----|-------------|--------------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | Netlify Dashboard → Site vars | Railway API public URL | ❌ Pending |
| `NEXT_PUBLIC_PREVIEW_BASE_URL` | Netlify Dashboard → Site vars | Railway preview gateway URL | ❌ Pending |
| `NEXT_PUBLIC_APP_ENV` | `netlify.toml` (already set) | `production` | ✅ |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Netlify Dashboard → Site vars | `false` to start | ❌ Pending |
| `NEXT_PUBLIC_BETA_MODE` | Netlify Dashboard → Site vars | `true` during beta | ❌ Pending |

---

## 32-09 — Deployment Risk Assessment

From `docs/launch/risk-register.md`:

| Risk | Severity | Likelihood | Mitigation | Status |
|------|----------|------------|------------|--------|
| Frontend deploy failure | Medium | Low | Netlify instant rollback | ✅ Plan exists |
| Railway API outage | High | Low | Runbook INC-02; status page | ✅ Plan exists |
| Preview gateway failure | Medium | Medium | Graceful degradation | ✅ Plan exists |
| Cost spike | High | Medium | Tier limits | ⚠️ Conditional |
| Abuse / prompt injection | High | Medium | BLOCKED_CONTENT patterns | ✅ Implemented |

**Additional deployment-phase risks (new findings):**

| Risk | Description | Mitigation |
|------|-------------|------------|
| `NEXT_PUBLIC_API_BASE_URL` empty | API calls fail silently | Set before deploy; monitor /status page |
| Branch mismatch | Dev branch not connected | Use `main` for production deploy; merge when stable |
| No live Railway API | Frontend loads but all API features offline | Accept for internal testing phase; deploy API first |
| First deploy build time | Cold build with new plugin may be slower | Budget 5–10 min; retry if timeout |

---

## 32-10 — Operator Next Actions

Ordered by priority:

**IMMEDIATE (do now):**

1. **Create Netlify site** — connect `mdtazizulislam/factory` GitHub repo
   - In Netlify UI: Add new site → Import from GitHub → `mdtazizulislam/factory`
   - Branch to deploy: `main` (or `claude/code-audit-review-bERxc` for staging)
   - Build settings auto-detected from `netlify.toml`

2. **Set env vars** — on Netlify dashboard before or immediately after first deploy
   ```
   NEXT_PUBLIC_API_BASE_URL      = <Railway API URL>
   NEXT_PUBLIC_ANALYTICS_ENABLED = false
   NEXT_PUBLIC_BETA_MODE         = true
   ```

3. **Trigger first deploy** — push to connected branch or click "Deploy site" in Netlify

4. **Run smoke script** — immediately post-deploy
   ```powershell
   .\scripts\public-beta-smoke.ps1 -BaseUrl https://YOUR-SITE.netlify.app
   ```

**SHORT TERM (this week):**

5. **Deploy Railway API** — get a public API URL; set `NEXT_PUBLIC_API_BASE_URL`
6. **Verify CORS** — ensure Railway API allows Netlify domain origin
7. **Set custom domain** — follow `docs/launch/domain-dns-runbook.md`
8. **Enable monitoring** — connect `scripts/watch-production.ps1` to a cron or CI schedule
9. **Invite first 5 beta users** — use `/admin/customer-success` to create Wave 1 cohort

**DEFERRED (not blocking internal testing):**

10. **Preview gateway deploy** — required for full demo flow; set `NEXT_PUBLIC_PREVIEW_BASE_URL`
11. **Set `NEXT_PUBLIC_ANALYTICS_ENABLED=true`** — once PostHog/Segment is configured

---

## Rollback Plan

If the first deploy causes an issue:

1. **Netlify instant rollback:** Deploys → select previous deploy → Publish deploy
2. **Branch deploy:** Switch Netlify to deploy from `main` instead of dev branch
3. **Full stop:** Set "Deploy lock" on Netlify to prevent further auto-deploys
4. **Local proof:** Build still passes locally — codebase is not broken

---

## Verdict

```
╔══════════════════════════════════════════════════════╗
║  VERDICT: NO_GO                                      ║
║                                                      ║
║  Reason: No live Netlify deploy exists.              ║
║  The codebase is ready; the infrastructure is not.  ║
║                                                      ║
║  Nearest achievable state after operator action:     ║
║  GO_INTERNAL_TESTING                                 ║
║                                                      ║
║  Blocking conditions to clear:                       ║
║  ☐ Create Netlify site + connect GitHub repo         ║
║  ☐ Set NEXT_PUBLIC_API_BASE_URL                      ║
║  ☐ First deploy completes successfully               ║
║  ☐ Smoke script passes (or failures documented)      ║
║                                                      ║
║  Non-blocking (accept for internal testing):         ║
║  ○ Railway API not verified — DEFERRED               ║
║  ○ Preview gateway not verified — DEFERRED           ║
║  ○ Custom domain not set — DEFERRED                  ║
╚══════════════════════════════════════════════════════╝
```

---

## Supporting Evidence

| Item | Evidence |
|------|---------|
| `netlify.toml` | `/home/user/factory/netlify.toml` — fully authored |
| Build passes locally | 25 pages, 0 errors, 15.8s compile |
| API test suite | 1012/1013 (1 pre-existing skip) |
| Netlify account | `md-tazizul-islam-c5abzm8` — verified via MCP |
| Factory site on Netlify | None — confirmed via MCP project list |
| Branch on remote | `origin/claude/code-audit-review-bERxc` — exists |
| `web/src/lib/env.ts` | Correctly uses `NEXT_PUBLIC_API_BASE_URL`; no hardcoded URLs |
| Security headers | Configured in `netlify.toml` |
| Smoke script | `scripts/public-beta-smoke.ps1` — ready to run post-deploy |
| Risk register | `docs/launch/risk-register.md` — 11 risks, all documented |
| Incident runbook | `docs/incident/runbook.md` — 9 scenarios covered |
