# Incident Runbook — Factory Production

**Updated:** 2026-05-23  
**Branch:** `claude/code-audit-review-bERxc`  
**Scope:** Netlify frontend + Railway API/Orchestrator/Redis/PostgreSQL

---

## Severity Levels

| Level | Name | Response Time | Examples |
|-------|------|---------------|---------|
| SEV-1 | Critical | < 15 min | Full outage, data loss risk, auth broken |
| SEV-2 | Major | < 30 min | API down, database inaccessible |
| SEV-3 | Degraded | < 2 h | Slow responses, one non-critical feature broken |
| SEV-4 | Minor | Next business day | Cosmetic, docs, non-blocking warning |

---

## General Response Checklist

For any incident:

1. Open `#factory-incidents` Slack channel
2. Set status on `/status` page (update `INCIDENT_MESSAGE` env var or admin API)
3. Identify severity and assign incident commander
4. Follow the relevant scenario runbook below
5. Document timeline in the incident thread
6. Post resolution + RCA within 24 h of resolution

---

## Scenario Runbooks

---

### INC-01 — Netlify Frontend Outage (complete)

**Symptoms:**
- Frontend URLs return 5xx or DNS fails
- Smoke test SYNTH-01 fires

**Steps:**

1. Check Netlify status at `status.netlify.com`
2. If Netlify-wide outage: wait — no action possible
3. If deploy-specific: go to **Netlify → Deploys** → click **Rollback to previous deploy**
4. If DNS: verify CNAME/A records point to Netlify
5. If SSL expired: Netlify auto-renews — trigger manually via **Domain settings → Renew certificate**
6. Verify recovery: run `scripts/smoke-production.ps1 -BaseUrl <url> -ApiUrl <api-url>`

**Rollback time:** < 30 seconds (Netlify instant rollback).

---

### INC-02 — Railway API Down (5xx or timeout)

**Symptoms:**
- `GET /health` returns non-200 or times out
- Frontend shows "Could not reach API"
- Smoke test SYNTH-03 fires

**Steps:**

1. Open Railway dashboard → Factory project → API service
2. Check **Deployments** tab — look for failed deploy or crash loop
3. Check **Logs** tab for panic / OOM / startup error
4. If crash loop: click **Restart** service
5. If deploy broke it: click **Rollback** to previous successful deploy
6. If OOM: scale up RAM in **Settings → Resources**
7. Check `DATABASE_URL` and `REDIS_URL` env vars are set correctly
8. Verify: `curl https://your-api.railway.app/health`

**Common causes:**
- Missing env var (esp. `DATABASE_URL`, `AUTH_SECRET`)
- PostgreSQL max connection limit hit
- Out-of-memory during cold start

---

### INC-03 — Database (PostgreSQL) Unhealthy

**Symptoms:**
- `/health` returns `{"ok":false,"db":{"ok":false}}`
- Errors in API logs: `connection refused`, `too many connections`, `ECONNREFUSED`

**Steps:**

1. Railway → PostgreSQL service → check **Metrics** (CPU, connections, storage)
2. If max connections: restart API service to drop connection pool
3. If storage full: expand disk in Railway settings
4. If PostgreSQL crashed: Railway will auto-restart; check logs
5. If schema migration failed: check `prisma migrate status` in API logs
6. Emergency read-only mode: enable `readonly` kill switch via `/admin`
7. Notify users via status page incident message

**Never attempt:**
- Manual `DROP TABLE` or destructive SQL in production without explicit approval
- Prisma migrate with `--skip-generate` in production

---

### INC-04 — Redis Cache Down

**Symptoms:**
- `/health` returns `{"redis":{"ok":false}}`
- Activity stream stops updating
- Session/token operations may be slow

**Steps:**

1. Railway → Redis service → **Logs** and **Metrics**
2. If Redis crashed: Railway auto-restarts within 30s — wait
3. If memory full: flush non-critical keys or increase Railway Redis memory
4. API is designed to degrade gracefully without Redis — confirm core CRUD still works
5. Monitor: `watch-production.ps1 -IntervalMinutes 2` for faster recovery detection

**Impact without Redis:**
- Activity stream: degraded (events may be lost during outage)
- Session caching: degraded (higher DB load)
- Rate limiting: degraded (limits not enforced — monitor for abuse)

---

### INC-05 — Auth Broken (all users logged out / 401 everywhere)

**Symptoms:**
- All API requests return 401
- JWT verification failing
- `AUTH_SECRET` rotation gone wrong

**Steps:**

1. Check Railway API env vars — `AUTH_SECRET` must be set and match what issued existing tokens
2. If `AUTH_SECRET` was rotated: all existing sessions are invalidated (expected)
3. If `AUTH_SECRET` is missing: add it to Railway → redeploy
4. If issuer/audience mismatch: check `AUTH_JWT_ISSUER` env var
5. Test: create a new test session and verify JWT works end-to-end
6. Do NOT set `AUTH_SECRET` to empty string — this disables verification

**Note:** `AUTH_SECRET` rotation requires all users to re-login. Plan accordingly.

---

### INC-06 — Preview Gateway Unreachable

**Symptoms:**
- Factory preview links fail to load
- `SYNTH-05` fires (3 consecutive failures)
- Editor preview tab shows error

**Steps:**

1. Railway → Orchestrator service → check status
2. If orchestrator crashed: restart it
3. If `PREVIEW_SHARE_SECRET` env var missing: add it and redeploy
4. Temporary mitigation: users can still work in Code + Team modes
5. Preview is non-critical — mobile service already deferred

**Impact:**
- Preview tab in editor broken
- Factory Preview page (`/factory-preview`) degraded
- Core workspace/project features unaffected

---

### INC-07 — High Error Rate (frontend JS errors)

**Symptoms:**
- Sentry alert: high error rate
- Users reporting blank screens or broken UI

**Steps:**

1. Check Sentry (`NEXT_PUBLIC_SENTRY_DSN`) for the specific error + stack trace
2. Identify the route / component throwing
3. If it's a deploy regression: Netlify → **Rollback to previous deploy**
4. If it's a data issue: check API returning unexpected shape
5. If it's a CSP violation: check browser console → widen `connect-src` in `netlify.toml` if legitimate
6. Hotfix: commit + push to `claude/code-audit-review-bERxc` → Netlify auto-deploys

**CSP violations:**
- Legitimate new domain → add to `connect-src` in `netlify.toml`
- Injected third-party script → investigate XSS vector immediately

---

### INC-08 — Suspicious Activity / Security Event

**Symptoms:**
- Unusual API traffic spike
- RBAC bypass attempt in audit log
- Blocked content patterns triggering frequently
- Auth token forgery attempt

**Steps:**

1. Enable `readonly` kill switch immediately: POST `/admin/kill-switches/readonly/enable`
2. Check audit log: `/admin/audit`
3. Rotate `AUTH_SECRET` if tokens are suspected compromised (forces all re-login)
4. Block specific IP at Railway or Netlify level if identified
5. Check for leaked `NEXT_PUBLIC_*` secrets (they should never contain secrets)
6. Escalate to SEV-1 if user data is at risk

**Never do:**
- Disable auth entirely to "test" if it's the problem
- Log raw JWT tokens in production
- Expose stack traces to public endpoints

---

### INC-09 — Deploy Regression (new feature broke something)

**Symptoms:**
- Smoke test starts failing after a deploy
- Specific route returns 500 after push

**Steps:**

1. Identify the breaking commit: `git log --oneline origin/claude/code-audit-review-bERxc`
2. Immediate mitigation: Netlify rollback (< 30s) for frontend; Railway rollback for API
3. Reproduce locally: `cd web && npm run build` — does it fail?
4. Run: `scripts/verify-frontend-production.ps1 -SkipBuild`
5. Fix forward or revert commit
6. Re-run smoke tests before declaring resolved

**Prevention:**
- All merges require passing `npm run test` (819+ tests)
- `npm run build` must pass locally
- Verify-frontend script must pass

---

## Recovery Verification

After resolving any incident:

```powershell
.\scripts\smoke-production.ps1 -BaseUrl https://your-site.netlify.app -ApiUrl https://your-api.railway.app
```

Expected: all checks green, exit 0.

Also verify `/status` page shows all services operational.

---

## Post-Incident Template

```
## Incident Report — [DATE]

**Severity:** SEV-X
**Duration:** HH:MM — HH:MM UTC (N minutes)
**Impact:** [Who was affected and how]

**Timeline:**
- HH:MM — First alert
- HH:MM — Root cause identified
- HH:MM — Mitigation applied
- HH:MM — Fully resolved

**Root Cause:**
[What went wrong]

**Fix:**
[What was done]

**Prevention:**
[What will prevent recurrence]
```

---

## Related

- `docs/monitoring/synthetic-checks.md` — uptime checks
- `docs/monitoring/alert-env.md` — alert variable reference
- `docs/deployment/netlify-checklist.md` — deployment runbook
- `scripts/smoke-production.ps1` — verification script
- `web/src/app/status/page.tsx` — public status page
