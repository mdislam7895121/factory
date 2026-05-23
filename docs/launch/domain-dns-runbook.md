# Domain + DNS Runbook — Factory Production

**Updated:** 2026-05-23  
**Scope:** Custom domain setup for Netlify frontend + Railway API + preview gateway

---

## Recommended Domain Structure

| Subdomain | Target | Service |
|-----------|--------|---------|
| `app.yourcompany.com` | Netlify frontend | Factory web UI |
| `api.yourcompany.com` | Railway API | NestJS API (custom domain via Railway) |
| `preview.yourcompany.com` | Railway preview gateway | Preview runtime URLs |
| `yourcompany.com` | Redirect → `app.yourcompany.com` | Root domain (optional) |
| `www.yourcompany.com` | Redirect → `app.yourcompany.com` | WWW redirect (optional) |

> Using subdomains (`app.`, `api.`) over bare domain gives flexibility to split services without affecting root domain DNS.

---

## Step 1 — Netlify Custom Domain

### 1a. Add Domain in Netlify Dashboard

1. Go to **Site Settings → Domain management**
2. Click **Add a domain**
3. Enter: `app.yourcompany.com`
4. Click **Verify** (Netlify checks ownership via DNS)

### 1b. Configure DNS

**Option A — CNAME (recommended for subdomains):**

```
Type:  CNAME
Name:  app
Value: YOUR-SITE.netlify.app
TTL:   300
```

**Option B — Netlify DNS (if using Netlify as nameserver):**

Netlify auto-creates CNAME when you delegate nameservers to Netlify.

**Option C — Root domain (`yourcompany.com` → Netlify):**

```
Type:  A
Name:  @
Value: 75.2.60.5   (Netlify load balancer IP — verify current IP in Netlify docs)
TTL:   300

Type:  CNAME
Name:  www
Value: YOUR-SITE.netlify.app
TTL:   300
```

### 1c. HTTPS Certificate

- Netlify provisions Let's Encrypt automatically within 5 minutes of DNS propagation
- If stuck: **Site Settings → Domain management → Verify DNS configuration** → **Renew certificate**
- Do not move DNS until HTTPS is confirmed green

### 1d. Verify

```powershell
# DNS propagation check
Resolve-DnsName app.yourcompany.com

# HTTPS check
Invoke-WebRequest -Uri https://app.yourcompany.com -Method HEAD
```

---

## Step 2 — Railway API Custom Domain

### 2a. Add Domain in Railway Dashboard

1. Open Railway → Factory project → API service
2. Go to **Settings → Networking → Custom Domain**
3. Enter: `api.yourcompany.com`
4. Railway shows you a CNAME target

### 2b. Configure DNS

```
Type:  CNAME
Name:  api
Value: [CNAME shown in Railway dashboard]
TTL:   300
```

### 2c. Verify

```powershell
curl https://api.yourcompany.com/health
# Expected: {"ok":true,...}
```

### 2d. Update Netlify Env Var

After Railway API domain is live:
- Update `NEXT_PUBLIC_API_BASE_URL` on Netlify from `https://YOUR-API.railway.app` → `https://api.yourcompany.com`
- Trigger Netlify redeploy

---

## Step 3 — Preview Gateway Custom Domain (Optional)

Same process as Railway API:
1. Railway → Orchestrator service → **Custom Domain**
2. Enter: `preview.yourcompany.com`
3. Add CNAME in DNS registrar
4. Update `NEXT_PUBLIC_PREVIEW_BASE_URL` on Netlify

---

## Step 4 — Root Domain Redirect (Optional)

To redirect `yourcompany.com` → `app.yourcompany.com`:

**Option A — Netlify redirect rule** (if using Netlify DNS):

Add to `netlify.toml`:
```toml
[[redirects]]
  from   = "https://yourcompany.com/*"
  to     = "https://app.yourcompany.com/:splat"
  status = 301
  force  = true
```

**Option B — DNS registrar redirect** (most registrars support URL forwarding):

Set root domain to forward to `https://app.yourcompany.com`

---

## DNS Rollback

If custom domain causes issues:

1. In Netlify: **Site Settings → Domain management → Remove custom domain**
2. Your Netlify `YOUR-SITE.netlify.app` URL continues to work immediately
3. Revert DNS CNAME at your registrar
4. DNS TTL: allow 5 min — 24 h for full propagation

---

## SSL / HTTPS Notes

- Netlify and Railway both auto-provision Let's Encrypt certificates
- Do **not** upload manual certificates unless required by compliance
- HSTS is enabled via `netlify.toml` — do not remove without planning
- HSTS `preload` is active — browsers will cache HTTPS-only for 2 years; plan accordingly before first deployment

---

## Common Issues

| Issue | Solution |
|-------|---------|
| DNS not propagated | Wait up to 48 h; check TTL was low at time of change |
| Netlify cert not provisioning | Verify CNAME points correctly; try "Renew certificate" |
| Railway custom domain 502 | Service may be starting — wait 30s then retry |
| HSTS blocks HTTP | Expected — HSTS forces HTTPS on all subdomains |
| www vs non-www redirect loop | Set only one as primary in Netlify; redirect the other |

---

## DNS TTL Guidance

| Phase | Recommended TTL |
|-------|----------------|
| Before migration | Lower to 300 (5 min) — 24 h before cutover |
| During migration | 60–300 s |
| After stable | Raise to 3600 (1 h) or 86400 (1 day) |

---

## Related

- `docs/deployment/netlify-checklist.md`
- `docs/deployment/env-map.md`
- `docs/launch/public-beta-checklist.md`
