# Serial Step L - Production Proof Pack

Date: 2026-02-12

## Live URLs

- API (Railway): https://factory-production-production.up.railway.app
- WEB (Netlify): https://factory-production-web.netlify.app

## Exact Commands Used (PowerShell)

- `git status --short`
- `pwsh -File .\scripts\proof-step-l.ps1 -ApiUrl https://factory-production-production.up.railway.app -WebUrl https://factory-production-web.netlify.app -TimeoutSec 20`
- `railway status`
- `pwsh -File .\scripts\post-deploy-smoke.ps1 -ApiUrl https://factory-production-production.up.railway.app -WebUrl https://factory-production-web.netlify.app -TimeoutSec 20`

## Raw Output Excerpts (key lines)

- `GET / => 200`
- `GET /factory-preview => 200`
- `GET /factory-preview/index.json => 200`
- `Passed: 5`
- `Failed: 0`
- `RESULT: ALL CHECKS PASSED`

## Definition of Done Checklist

- [x] API URL reachable
- [x] WEB URL reachable
- [x] `/factory-preview` returns 200
- [x] `/factory-preview/index.json` returns 200 and includes `routes`
- [x] `post-deploy-smoke.ps1` passes with real URLs
- [x] No secrets included in this report

## Rollback Notes

### Railway rollback

1. Open Railway dashboard for `factory-production`.
2. Go to Deployments for the API service.
3. Select previous healthy deployment.
4. Redeploy selected deployment.
5. Re-run health checks (`/`, `/db/health`).

### Netlify rollback

1. Open Netlify dashboard for `factory-production-web`.
2. Open Deployments.
3. Select previous successful deploy.
4. Publish deploy.
5. Re-run web checks (`/`, `/factory-preview`, `/factory-preview/index.json`).

## Artifact Policy

- This tracked report is only overwritten by explicit harness execution with `-EmitArtifacts`.
- Default harness mode writes raw logs only to `proof/runs/`.
