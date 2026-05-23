# Netlify Site Creation Checklist — Factory

**Status:** REQUIRED — blocking Wave 1 beta  
**Account:** md-tazizul-islam-c5abzm8 (Personal — Owner)  
**Repo:** mdtazizulislam/factory

---

## Pre-Flight Check

Before starting:

- [ ] You are logged into Netlify as `md-tazizul-islam-c5abzm8`
- [ ] GitHub repo `mdtazizulislam/factory` exists and is accessible
- [ ] Branch `claude/code-audit-review-bERxc` exists on the remote (confirmed)
- [ ] You have the Railway API public URL available (or accept limited beta without it)

---

## Step 1 — Create the Netlify Site

1. Go to: https://app.netlify.com/teams/md-tazizul-islam-c5abzm8
2. Click **"Add new site"**
3. Select **"Import an existing project"**
4. Choose **"Deploy with GitHub"**
5. Authorise Netlify to access your GitHub account if prompted
6. Search for and select: **`mdtazizulislam/factory`**

---

## Step 2 — Configure Build Settings

Netlify should auto-detect these from `netlify.toml`. Verify:

| Setting | Required value |
|---------|---------------|
| Base directory | `web` |
| Build command | `npm run build` |
| Publish directory | `.next` |
| Branch to deploy | `main` OR `claude/code-audit-review-bERxc` |

> **Branch choice:** Use `claude/code-audit-review-bERxc` for the staging/beta deploy.
> Use `main` only if that branch is unavailable to Netlify.
> Document which branch was used in the go/no-go tracker.

Plugins: `@netlify/plugin-nextjs` — this is declared in `netlify.toml` and
Netlify installs it automatically.

---

## Step 3 — Set Environment Variables

Before the first deploy, set these on the Netlify dashboard:
**Site settings → Environment variables → Add a variable**

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-api.railway.app` | Railway public URL — set this first |
| `NEXT_PUBLIC_PREVIEW_BASE_URL` | `https://your-preview.railway.app` | Preview gateway URL — can be set later |
| `NEXT_PUBLIC_APP_ENV` | `production` | Set via `netlify.toml` but override here to be explicit |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` | Keep off until PostHog/Segment configured |
| `NEXT_PUBLIC_BETA_MODE` | `true` | Shows beta labels in UI |

**Scope:** Set all vars to scope `All contexts` initially.

**⚠️ DO NOT add any of these to Netlify:**
- `DATABASE_URL`
- `AUTH_SECRET`
- `REDIS_URL`
- `STRIPE_SECRET_KEY`
- `ANTHROPIC_API_KEY`
- `ADMIN_API_KEY`
- Any `ALERT_*` variable

Those are API-only secrets and must only be set on Railway.

---

## Step 4 — First Deploy

1. Click **"Deploy site"**
2. Watch the build log — expected timeline:
   - Install: 60–90 seconds
   - Build (`npm run build`): 60–120 seconds
   - Deploy: 10–20 seconds
   - Total: ~3–5 minutes

**Expected build log markers:**
```
✓ Installing @netlify/plugin-nextjs
✓ Compiled successfully
✓ Generating static pages (25/25)
✓ Deploy is live
```

**If the build fails:**

| Error | Fix |
|-------|-----|
| `Cannot find module` | Check Node version — must be 20 |
| `MISSING REQUIRED PUBLIC VAR` | Set `NEXT_PUBLIC_API_BASE_URL` and redeploy |
| `publish directory does not exist` | Verify base directory is `web`, not root |
| `font network error` | Confirm no `next/font/google` in codebase (not present — safe) |
| Timeout | Retry — cold install can be slow first time |

---

## Step 5 — Copy the Live URL

After deploy succeeds, copy:
- **Primary URL:** `https://YOUR-SITE.netlify.app` (auto-assigned)
- **Branch deploy URL:** `https://claude-code-audit-review-berxc--YOUR-SITE.netlify.app`

Record both in the Go/No-Go tracker.

---

## Step 6 — Run Smoke Script

From a Windows PowerShell 7+ terminal:

```powershell
cd path\to\factory

.\scripts\public-beta-smoke.ps1 `
  -BaseUrl "https://YOUR-SITE.netlify.app" `
  -ApiUrl  "https://your-api.railway.app"
```

If no Railway API URL yet, run without `-ApiUrl`:

```powershell
.\scripts\public-beta-smoke.ps1 -BaseUrl "https://YOUR-SITE.netlify.app"
```

**Expected output (frontend-only):**
```
── Public Routes ──
  ✓ Home page (HTTP 200)
  ✓ Demo page (HTTP 200)
  ✓ Discover (marketplace) (HTTP 200)
  ✓ Status page (HTTP 200)
  ✓ Workspace list (HTTP 200)
  ✓ Memory module (HTTP 200)
  ✓ Quality dashboard (HTTP 200)

── Security Headers ──
  ✓ Header: x-frame-options
  ✓ Header: x-content-type-options
  ✓ Header: strict-transport-security
  ✓ Header: content-security-policy

  BETA SMOKE PASSED
```

---

## Step 7 — Update Go/No-Go Tracker

Open: `docs/beta/go-no-go-tracker.md`

Mark:
- [ ] Netlify site created ✅
- [ ] Frontend route smoke pass ✅ (if smoke passed)
- Update verdict field

---

## Step 8 — Optional: Set Custom Domain

If you have a domain (e.g. `app.yourdomain.com`):

1. Site settings → Domain management → Add a domain
2. Enter `app.yourdomain.com`
3. Follow DNS instructions in `docs/launch/domain-dns-runbook.md`

This is not required for Wave 1 beta — the `.netlify.app` URL is sufficient.

---

## Site Name (optional)

To rename from the auto-generated slug:
1. Site settings → General → Site name
2. Enter: `factory-app` (or any hyphenated name)
3. URL becomes: `https://factory-app.netlify.app`

---

## Rollback

If the deploy causes issues:
1. Netlify → Deploys tab → Select previous successful deploy → "Publish deploy"
2. Instant rollback — no downtime

To stop all deploys temporarily:
1. Netlify → Site configuration → Deploys → Deploy lock → Lock deploys
