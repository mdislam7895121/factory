# Ops Monitoring and Alerts (Step M)

## Live Services

- API: https://factory-production-production.up.railway.app
- WEB: https://factory-production-web.netlify.app

## Uptime Monitoring (Vendor-Neutral)

Use any uptime provider that supports:

- HTTPS checks with custom paths
- Expected status code matching
- Alert notifications (email, chat, pager)
- Check history and incident timelines

Recommended endpoints:

- `GET /` on API (expect 200)
- `GET /db/health` on API (expect JSON with `ok: true`)
- `GET /` on WEB (expect 200)
- `GET /factory-preview` on WEB (expect 200)
- `GET /factory-preview/index.json` on WEB (expect 200 + routes array)

Recommended frequency:

- Production checks every 1 minute (critical)
- Secondary checks every 5 minutes from another region
- Alert escalation if 3 consecutive failures occur

Suggested alert channels:

- Email (default)
- Team chat (Slack / Teams / Discord)
- Pager escalation for out-of-hours critical failures

## Scripted Monitor

Run script:

`pwsh -File .\scripts\ops\uptime-check.ps1 -ApiUrl https://factory-production-production.up.railway.app -WebUrl https://factory-production-web.netlify.app -TimeoutSec 20`

Exit behavior:

- `0` when all checks pass
- `1` when any check fails

Output format is ASCII-only with `[OK]`, `[WARN]`, `[FAIL]`.

## Error Monitoring (Optional Sentry)

Sentry is optional and guarded by environment variables.

- API uses `SENTRY_DSN` if provided.
- WEB uses `NEXT_PUBLIC_SENTRY_DSN` if provided.
- If DSN values are missing, app startup and build continue normally.

## Railway Alerting Checklist

- Enable Railway deployment failure notifications.
- Review resource metrics (CPU, memory, restarts) and alert on sustained spikes.
- Watch application logs for repeated 5xx failures.
- Keep rollback path ready in Deployments history.

## Netlify Alerting Checklist

- Enable deploy failure email notifications.
- Review deploy logs for build/runtime warnings.
- Track production deploy status in Deployments dashboard.
- Keep previous stable deployment ready for publish rollback.

## Emergency Kill Switch (API)

Environment variable:

- `FACTORY_KILL_SWITCH=0` (default, normal operation)
- `FACTORY_KILL_SWITCH=1` (service-limited mode)

When enabled (`1`):

- `GET /` returns `200` with `Service temporarily limited`
- `GET /db/health` remains available
- Other routes return `503` with `{ "ok": false, "error": "SERVICE_DISABLED" }`

Validation:

`pwsh -File .\scripts\ops\validate-kill-switch.ps1 -LocalOnly`

Optional live check:

`pwsh -File .\scripts\ops\validate-kill-switch.ps1 -ApiUrl https://factory-production-production.up.railway.app -TimeoutSec 20`

## Rollback Guidance

- API rollback: Railway dashboard -> service Deployments -> redeploy previous healthy version.
- WEB rollback: Netlify dashboard -> Deployments -> publish previous successful deployment.
