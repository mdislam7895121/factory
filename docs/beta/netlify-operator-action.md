# Netlify Operator Action — Factory Beta Deployment

**Status:** BLOCKED — awaiting manual operator execution  
**Last updated:** 2026-05-23  
**Blocker type:** Browser OAuth flow — cannot be completed programmatically  
**Operator:** Founder / account holder for `md-tazizul-islam-c5abzm8`

---

## Why This File Exists

The Netlify MCP API confirmed no Factory site exists on account `md-tazizul-islam-c5abzm8`.

Creating a Netlify site connected to a GitHub repository requires completing an OAuth flow in a browser. This cannot be done by an automated agent. The operator (you, the founder) must complete these steps manually.

Estimated time: **15–30 minutes.**

Until this is done, the Go/No-Go verdict remains `NO_GO` and no beta invites should be sent.

---

## Pre-Flight Check

Before you start, confirm:

- [ ] You have access to `https://app.netlify.com` and can log in as `md-tazizul-islam-c5abzm8`
- [ ] You have GitHub access to `mdtazizulislam/factory`
- [ ] You know the Railway API URL (for `NEXT_PUBLIC_API_BASE_URL`) — or you'll skip that env var for now
- [ ] You have 30 uninterrupted minutes

---

## Step 1 — Log In to Netlify

1. Open `https://app.netlify.com` in your browser
2. Log in as `md-tazizul-islam-c5abzm8`
3. Confirm you are on the correct account (check the account name in the top-left dropdown)

---

## Step 2 — Create a New Site

1. Click **"Add new site"** (top-right or on the Sites dashboard)
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorise Netlify to access your GitHub account if prompted (OAuth step — browser only)

---

## Step 3 — Select the Repository

1. Search for `factory` in the repository search
2. Select `mdtazizulislam/factory`
3. If the repo doesn't appear, click "Configure Netlify on GitHub" and grant access to this repository

---

## Step 4 — Configure Build Settings

Set the following values exactly:

| Field | Value |
|-------|-------|
| Base directory | `web` |
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | `20` |

The `netlify.toml` at the root of the repo already specifies these — Netlify should auto-detect them. Verify they match before proceeding.

---

## Step 5 — Set Environment Variables

Click **"Show advanced"** before deploying, then add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | Your Railway API URL | Leave blank if Railway URL not available — app will run in demo mode |
| `NODE_VERSION` | `20` | Ensures correct Node version |

**Do NOT add:**
- `AUTH_SECRET`
- `DATABASE_URL`
- `REDIS_URL`
- `STRIPE_SECRET_KEY`
- `ADMIN_API_KEY`

These are Railway/backend secrets and must never be added to Netlify.

---

## Step 6 — Deploy

1. Click **"Deploy site"**
2. Wait for the first deploy to complete — expected time: 3–5 minutes
3. Watch the deploy log for errors

**Common build errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Module not found` | Missing dependency | Run `npm install` locally, push, redeploy |
| `Cannot find module 'next'` | Wrong base directory | Change base directory to `web` |
| `Build script returned non-zero` | TypeScript error | Check `web/` for type errors locally |
| `Publish directory not found` | Wrong publish directory | Change to `.next` |

---

## Step 7 — Copy the Live URL

1. Once deploy succeeds, copy the Netlify URL — format: `https://[site-name].netlify.app`
2. (Optional) Click **"Site settings" → "Site information" → "Change site name"** and set it to `factory-app`
3. The URL becomes: `https://factory-app.netlify.app`

---

## Step 8 — Add NEXT_PUBLIC_API_BASE_URL If Skipped

If you skipped this env var in Step 5:

1. Go to **Site settings → Environment variables**
2. Add `NEXT_PUBLIC_API_BASE_URL` = [your Railway API URL]
3. Trigger a redeploy: **Deploys → Trigger deploy → Deploy site**

---

## Step 9 — Run the Smoke Script

Open PowerShell and run:

```powershell
$LIVE_URL = "https://factory-app.netlify.app"  # replace with your actual URL
.\scripts\public-beta-smoke.ps1 -BaseUrl $LIVE_URL
```

The script checks:
- Homepage loads (HTTP 200)
- `/demo` route loads
- `/status` route loads
- Security headers present
- No critical console errors

Record the result in `docs/beta/go-no-go-tracker.md`.

---

## Step 10 — Update the Go/No-Go Tracker

Open `docs/beta/go-no-go-tracker.md` and update:

1. Change Infrastructure row 1 (Netlify site created) from ❌ to ✅
2. Change row 2 (GitHub repo connected) from ❌ to ✅
3. Change row 3 (Branch deployed) from ❌ to ✅ — note the branch name
4. Change row 4 (Live URL exists) from ❌ to ✅ — paste the URL
5. If smoke script passed: change row in Smoke Script from ❌ to ✅
6. Update the **Current verdict** at the top to `GO_INTERNAL_TESTING`
7. Add a row to the Verdict Log:

```
| 2026-[date] | `GO_INTERNAL_TESTING` | Netlify live, smoke passed |
```

8. Commit and push:

```bash
git add docs/beta/go-no-go-tracker.md
git commit -m "Go/No-Go: Netlify live — GO_INTERNAL_TESTING"
git push origin claude/code-audit-review-bERxc
```

---

## After These Steps

You are now at `GO_INTERNAL_TESTING`.

To reach `GO_PRIVATE_ALPHA` (invite external users):
1. Test the Railway API connection from the live Netlify URL
2. Verify the feedback widget works
3. Verify `/demo` completes end-to-end
4. Update tracker → `GO_PRIVATE_ALPHA`

To reach `GO_FIRST_5_BETA`:
- Follow the 10-step path in `docs/beta/go-no-go-tracker.md`

---

## Rollback Instructions

If the deploy causes problems:

1. Go to Netlify → **Deploys**
2. Click any previous successful deploy
3. Click **"Publish deploy"**

Rollback is instant. There is no risk of data loss on the frontend.

---

## Custom Domain (Optional, Later)

After the beta is stable, set up a custom domain via:  
`docs/launch/domain-dns-runbook.md`

Do not do this during Wave 1 — it adds complexity before the product is validated.
