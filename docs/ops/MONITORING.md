# Ops Monitoring and Production Readiness (SERIAL 20)

## Scope

This runbook defines the production health gates and alerting configuration for Factory.

- API base: `https://factory-production-production.up.railway.app`
- Hard readiness gate: `GET /ready`
- Dependency health gate: `GET /db/health`

`/ready` must always return JSON:

- healthy: `200` + `{ "ok": true, ... }`
- unhealthy: `503` + `{ "ok": false, "reason": "...", ... }`

## UptimeRobot Setup

Create two HTTP(S) monitors with keyword checks:

1. **API DB Health**
	- URL: `https://factory-production-production.up.railway.app/db/health`
	- Method: `GET`
	- Expected status: `200`
	- Keyword: `"ok":true`
	- Interval: `1 minute`

2. **API Readiness (hard gate)**
	- URL: `https://factory-production-production.up.railway.app/ready`
	- Method: `GET`
	- Expected status: `200`
	- Keyword: `"ok":true`
	- Interval: `1 minute`

Alerting rules:

- Contact type: email at minimum (team mailbox preferred)
- Trigger after: 2-3 consecutive failures
- Recovery notification: enabled

## Sentry Setup

API Sentry is enabled when `SENTRY_DSN` is set in Railway.

Required alert rules (minimum):

1. **New issue**
	- Condition: first seen event in production
	- Action: email team

2. **Error spike**
	- Condition: elevated error event rate versus baseline
	- Action: email team (and chat/pager if configured)

3. **Performance degradation**
	- Condition: transaction latency regression for API service
	- Action: email team

Dashboard recommendation:

- Panels for error count, p95 transaction latency, and affected release/version.

## Incident Response (Ready/Health)

When `/ready` fails:

1. Run `pwsh scripts/prod-smoke.ps1`.
2. Inspect Railway API logs for the same timestamp window.
3. If reason is `schema_not_ready`, run migration deploy via release/start flow.
4. Re-check:
	- `curl.exe -sS -i https://factory-production-production.up.railway.app/db/health`
	- `curl.exe -sS -i https://factory-production-production.up.railway.app/ready`
5. Confirm monitor recovery event in UptimeRobot.

## Verification Commands

Run smoke checks directly:

- `curl.exe -sS -i https://factory-production-production.up.railway.app/db/health`
- `curl.exe -sS -i https://factory-production-production.up.railway.app/ready`
- `pwsh scripts/prod-smoke.ps1`
