# Factory Platform - Deployment Checklist

Comprehensive guide for deploying Factory Platform to production.

## Production URLs (current)

- API (Railway): https://factory-production-production.up.railway.app
- WEB (Netlify): https://factory-production-web.netlify.app

## Railway Deployment (API)

### Prerequisites
- Railway CLI installed
- Account with Railway
- Git repository connected

### Environment Variables

Copy `api/.env.production.example` and update values:

```
DATABASE_URL=postgresql://user:pass@your-db-host:5432/factory_db?schema=public
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
```

Other optional:
- `LOG_LEVEL=info` (default: info)
- `RATE_LIMIT_*` (optional rate limiting)
- `JWT_SECRET` (if using JWT)

### Build Configuration

Most recent settings for Railway:

- Build Command: `npm ci && npm run build`
- Start Command: `node dist/src/main.js`
- Runtime: Node.js (auto-detected)
- Port: 4000
- Health Check:
  - Path: `/`
  - Method: GET
  - Expected Status: 200

### Health URLs

After deployment, verify endpoints:
- `/` - API root (expect "Hello" in response)
- `/db/health` - Database health (expect JSON: `{ ok: true }`)

### Deploy via Railway CLI

```bash
railway up
```

Monitor logs:
```bash
railway logs
```

### Railway Dashboard

- Service status: https://railway.app/dashboard
- Environment variables: Settings > Environment
- Logs: Logging tab
- Rollback: Deploy History tab

---

## Netlify Deployment (Web)

### Prerequisites
- Netlify account
- Git repository connected to Netlify
- Node.js 18+ (auto-detected)

### Environment Variables

Copy `web/.env.production.example` and update values:

```
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
NODE_ENV=production
```

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to browser.

### Build Configuration

Netlify auto-detects Next.js. Verify settings:

- Build Command: `npm ci && npm run build`
- Publish Directory: `.next`
- Functions Directory: (leave empty, N/A for Next.js)
- Node Version: 18.x or higher (set in .nvmrc if needed)

### Routing Configuration

For SPA preview route support (`/factory-preview`):

Add `netlify.toml` (if not using Netlify UI):

```toml
[[redirects]]
  from = "/factory-preview/*"
  to = "/factory-preview/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Or configure in Netlify UI:
- Deployments > Deploy settings
- Post processing > Asset optimization

### Web URLs

After deployment, verify:
- `/` - Web root (expect HTML with Next.js content)
- `/factory-preview` - Feature preview page (expect 200)
- `/factory-preview/index.json` - Preview index (expect JSON with routes)

### Netlify Dashboard

- Deploy status: https://app.netlify.com/
- Environment variables: Site settings > Build & deploy > Environment
- Logs: Deployments tab
- Rollback: Choose previous deployment and Publish

---

## Post-Deployment Verification

Run post-deploy smoke tests:

```bash
pwsh -File scripts/post-deploy-smoke.ps1 `
  -ApiUrl https://your-api.up.railway.app `
  -WebUrl https://your-site.netlify.app `
  -TimeoutSec 15
```

Checks performed:
1. API root health (GET /)
2. API database health (GET /db/health)
3. Web root accessibility (GET /)
4. Feature preview availability (GET /factory-preview)
5. Preview index validation (GET /factory-preview/index.json)

---

## Rollback Procedures

### Railway API Rollback

1. Go to Railway Dashboard > Deployments
2. Click on previous stable deployment
3. Click "Redeploy"
4. Confirm redeployment
5. Monitor service health during rollback

### Netlify Web Rollback

1. Go to Netlify Dashboard > Site > Deployments
2. Click "Publish log" on previous stable build
3. Click "Restore this deployment"
4. Confirm
5. Verify site is live within 1-2 minutes

---

## Definition of Done - Deploy Checklist

Before deploying to production:

- [ ] All code committed to main branch
- [ ] `git status` shows clean working tree
- [ ] VERSION file updated to release version
- [ ] API build passes: `npm run build` in api/
- [ ] Web build passes: `npm run build` in web/
- [ ] Security scan passes: `pwsh -File scripts/security-scan.ps1 -CiStrict`
- [ ] Release check passes: `pwsh -File scripts/release-check.ps1`
- [ ] prod env examples populated: api/.env.production.example, web/.env.production.example
- [ ] CI pipeline passes (all jobs green)
- [ ] Feature review completed (manual QA on staging, if available)

### Deployment Execution

1. **API Deployment (Railway)**
   - [ ] Set DATABASE_URL in Railway environment
   - [ ] Deploy via railway up or Railway Dashboard
   - [ ] Verify deployment logs (no errors)
   - [ ] Test health endpoints

2. **Web Deployment (Netlify)**
   - [ ] Set NEXT_PUBLIC_API_URL to production API URL
   - [ ] Deploy via git push or Netlify Dashboard
   - [ ] Verify build logs (no errors)
   - [ ] Test web routes

3. **Post-Deploy Verification**
   - [ ] Run smoke tests: `post-deploy-smoke.ps1 -ApiUrl ... -WebUrl ...`
   - [ ] All checks pass
   - [ ] Monitor production logs for 15 minutes

### Post-Deployment Monitoring

- [ ] Monitor API logs for errors (Railway)
- [ ] Monitor Web analytics for traffic (Netlify)
- [ ] Set up alerts for critical errors
- [ ] Test key user flows manually
- [ ] Establish rollback criteria (if needed)

---

## Rollback Decision Tree

- **Critical bug found**: Execute rollback immediately
- **Performance degradation**: Monitor for 5 minutes, then rollback if not resolving
- **Expected behavior change**: Coordinate with stakeholders before rollback
- **Data migration issue**: Stop deployment, fix, then re-deploy

---

## Contact & Support

- Factory Platform: https://github.com/mdislam7895121/factory
- API Issues: Check Railway logs and error tracking
- Web Issues: Check Netlify build logs and browser console
- Security: Review security scan output and audit logs
