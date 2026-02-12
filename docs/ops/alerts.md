# Step N - Alerting Configuration and Incident Readiness

## Scope

This document defines alerting setup and incident drill guidance for:

- Railway API: https://factory-production-production.up.railway.app
- Netlify WEB: https://factory-production-web.netlify.app

No secrets are required in repository files for this setup.

## Railway Alerts

Set up alerts in Railway dashboard for the production project/service:

1. Deploy failure notifications
   - Trigger: failed deploy/build/restart loops
   - Action: notify on-call channel and owners

2. Service health and restart anomalies
   - Trigger: repeated crashes, high restart count
   - Action: investigate logs and latest deploy diff

3. Resource spikes
   - Trigger: sustained CPU/memory spikes
   - Action: scale review, dependency/runtime review

4. Log-based error review
   - Trigger: repeated 5xx or exception bursts
   - Action: incident drill and rollback decision

## Netlify Alerts

Set up notifications in Netlify site settings:

1. Deploy failed notifications
   - Trigger: build/deploy failure
   - Action: notify web owners and open incident thread

2. Production deploy status watch
   - Trigger: failed production publish
   - Action: rollback to previous known-good deploy

## Who Gets Alerted

Use placeholders in your operations runbook:

- Primary email: ops-team@example.com
- Secondary email: engineering-leads@example.com
- Chat channel: #factory-ops-alerts
- Escalation channel: #factory-incidents

Replace placeholders in platform dashboards only. Do not store tokens/secrets in repo.

## Kill Switch Procedure Reference

Related scripts:

- `scripts/ops/validate-kill-switch.ps1`
- `scripts/ops/incident-drill.ps1`

Kill switch env var:

- `FACTORY_KILL_SWITCH=0` normal mode
- `FACTORY_KILL_SWITCH=1` limited-service mode

When kill switch is enabled:

- `GET /` should return `200` with maintenance-limited message
- `GET /db/health` remains available
- non-allowlisted routes should return `503` with `SERVICE_DISABLED`

## Suggested Check Frequencies

- API `/` and `/db/health`: every 1 minute
- WEB `/` and `/factory-preview`: every 1 minute
- WEB `/factory-preview/index.json`: every 5 minutes

## Rollback Summary

- Railway: redeploy previous stable deployment from Deployments history
- Netlify: publish previous stable deployment from Deployments history
