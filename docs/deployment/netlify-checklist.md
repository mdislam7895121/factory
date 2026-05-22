# Netlify Deployment Checklist — Factory Frontend

**Updated:** 2026-05-22  
**Branch:** `claude/code-audit-review-bERxc`  
**Plugin:** `@netlify/plugin-nextjs`

---

## Pre-Deployment

- [ ] Railway API service is deployed and healthy
- [ ] Railway API base URL is known (`https://your-api.railway.app`)
- [ ] Railway preview gateway URL is known
- [ ] `netlify.toml` is committed and pushed on the target branch
- [ ] Local build passes: `cd web && npm run build`
- [ ] Verification script passes: `scripts/verify-frontend-production.ps1 -SkipBuild`

---

## Step 1 — Connect GitHub Repository

1. Log in to [app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect to GitHub
4. Select repository: `mdtazizulislam/factory`

---

## Step 2 — Configure Build Settings

| Setting | Value |
|---------|-------|
| Branch to deploy | `claude/code-audit-review-bERxc` |
| Base directory | `web` |
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | `20` (set in `netlify.toml`) |

> Netlify reads `netlify.toml` automatically — these values are pre-configured.

---

## Step 3 — Add Environment Variables

Go to **Site Settings → Environment Variables** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-api.railway.app` | No trailing slash |
| `NEXT_PUBLIC_PREVIEW_BASE_URL` | `https://your-preview.railway.app` | Preview gateway |
| `NEXT_PUBLIC_APP_ENV` | `production` | |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` | Optional |

> See `docs/deployment/env-map.md` for full variable reference.

---

## Step 4 — Deploy

Click **Deploy site**.

Monitor the build log. Expected output:
```
✓ Compiled successfully
✓ Generating static pages (19/19)
✓ Build completed in Xs
```

---

## Step 5 — Verify Public URLs

After deploy, verify these routes load correctly:

| Route | Expected |
|-------|----------|
| `/` | Home page renders |
| `/demo` | Demo page renders |
| `/discover` | Discover / marketplace renders |
| `/apps/medibook-pro` | App detail renders |
| `/admin` | Admin panel (auth-gated) renders |
| `/workspace` | Workspace list renders |
| `/memory` | Memory module renders |
| `/quality` | Quality dashboard renders |
| `/workspace/ws-founder-1/team` | Team Settings page renders |

Run with deployment URL:
```powershell
.\scripts\verify-frontend-production.ps1 -SkipBuild -BaseUrl https://your-site.netlify.app
```

---

## Step 6 — Configure Custom Domain (Optional)

1. Go to **Domain settings** → **Add custom domain**
2. Add your domain (e.g. `app.factory.com`)
3. Follow DNS verification steps
4. Netlify provisions HTTPS automatically via Let's Encrypt

---

## Step 7 — Set Up Deploy Notifications (Optional)

1. Go to **Site Settings → Build & deploy → Deploy notifications**
2. Add Slack/email notification on deploy success/failure

---

## Rollback

If the deployment fails or causes regressions:

1. Go to **Deploys** tab on Netlify
2. Find the last known-good deploy
3. Click **Publish deploy** to instantly revert

> Rollback is instant — no rebuild required.

---

## Branch Deploys

Every push to `claude/code-audit-review-bERxc` triggers a new deploy.  
Each deploy gets a unique preview URL (e.g. `https://abc123--your-site.netlify.app`).

To disable branch deploys: **Site Settings → Build & deploy → Branch deploys → None**.

---

## Security Notes

- Security headers (CSP, HSTS, X-Frame-Options) are configured in `netlify.toml`
- `unsafe-inline` in `style-src` is required by Next.js inline styles — documented accepted risk
- `unsafe-eval` in `script-src` is required by Next.js hydration — accepted in Next.js deployments
- No open API proxy — frontend calls Railway directly via `NEXT_PUBLIC_API_BASE_URL`
- Mobile service is **excluded** from production graph — see `docs/deployment/mobile-service-decision.md`
