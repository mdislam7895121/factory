# Synthetic Checks — Factory Production Monitoring

**Updated:** 2026-05-23  
**Branch:** `claude/code-audit-review-bERxc`

---

## Overview

Synthetic checks are external HTTP probes that verify service availability and
response quality from outside the infrastructure. They complement server-side
health endpoints and catch issues that internal metrics miss (CDN failures,
DNS problems, SSL expiry, routing outages).

---

## Check Definitions

### SYNTH-01 — Frontend Home

| Field | Value |
|-------|-------|
| URL | `https://your-site.netlify.app/` |
| Method | `GET` |
| Interval | 5 minutes |
| Timeout | 15 s |
| Expected status | `200` |
| Expected body | `<title>` present |
| Alert after | 2 consecutive failures |
| Notify | `ALERT_SLACK_WEBHOOK_URL`, `ALERT_EMAIL_TO` |

### SYNTH-02 — Public Status API

| Field | Value |
|-------|-------|
| URL | `https://your-api.railway.app/v1/public/status` |
| Method | `GET` |
| Interval | 1 minute |
| Timeout | 10 s |
| Expected status | `200` |
| Expected body | `{"status":"ok"` or `"degraded"` — must have `status` field |
| Alert after | 2 consecutive failures |
| Notify | `ALERT_SLACK_WEBHOOK_URL`, `ALERT_EMAIL_TO` |

### SYNTH-03 — API Health Internal

| Field | Value |
|-------|-------|
| URL | `https://your-api.railway.app/health` |
| Method | `GET` |
| Interval | 1 minute |
| Timeout | 10 s |
| Expected status | `200` |
| Expected body | `{"ok":true}` |
| Alert after | 1 failure (critical) |
| Notify | `ALERT_SLACK_WEBHOOK_URL`, `ALERT_EMAIL_TO`, `ALERT_PAGERDUTY_KEY` |

### SYNTH-04 — Frontend Status Page

| Field | Value |
|-------|-------|
| URL | `https://your-site.netlify.app/status` |
| Method | `GET` |
| Interval | 5 minutes |
| Timeout | 15 s |
| Expected status | `200` |
| Alert after | 2 consecutive failures |
| Notify | `ALERT_SLACK_WEBHOOK_URL` |

### SYNTH-05 — Preview Gateway

| Field | Value |
|-------|-------|
| URL | `https://your-preview.railway.app/health` |
| Method | `GET` |
| Interval | 5 minutes |
| Timeout | 15 s |
| Expected status | `200` |
| Alert after | 3 consecutive failures |
| Notify | `ALERT_SLACK_WEBHOOK_URL` |
| Note | Non-critical — mobile service excluded |

### SYNTH-06 — SSL Certificate Expiry

| Field | Value |
|-------|-------|
| Target | Frontend domain |
| Check type | SSL certificate expiry |
| Alert threshold | 14 days before expiry |
| Notify | `ALERT_EMAIL_TO` |

---

## Performance Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Frontend TTFB | > 3 s | > 8 s |
| API response | > 2 s | > 5 s |
| Preview gateway | > 4 s | > 10 s |

---

## Uptime SLA Targets

| Service | Target |
|---------|--------|
| Netlify frontend | 99.9% |
| Railway API | 99.5% |
| Preview gateway | 99.0% |

---

## Tool Configuration Examples

### UptimeRobot (Free Tier)

1. Create monitor: **HTTP(s)**
2. URL: `https://your-site.netlify.app/`
3. Monitoring interval: **5 minutes**
4. Alert contacts: add email and Slack webhook

### Better Uptime

```
Monitor type: HTTP/HTTPS
URL: https://your-api.railway.app/v1/public/status
Interval: 60 seconds
Expected status code: 200
JSON response key: status (must exist)
```

### GitHub Actions (self-hosted smoke test)

```yaml
name: Smoke Test
on:
  schedule:
    - cron: '*/15 * * * *'
jobs:
  smoke:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - run: .\scripts\smoke-production.ps1 -BaseUrl ${{ vars.FRONTEND_URL }} -ApiUrl ${{ vars.API_URL }}
```

---

## Alert Suppression Rules

| Scenario | Rule |
|----------|------|
| Scheduled maintenance | Suppress all alerts during `MAINTENANCE_WINDOW` |
| Known flaky check | Use 3-failure threshold instead of 2 |
| Netlify deploy in progress | Suppress frontend alerts for 10 min post-deploy |
| Railway redeploy | Suppress API alerts for 5 min post-deploy |

---

## Related

- `docs/monitoring/alert-env.md` — alert variable reference
- `docs/incident/runbook.md` — incident response procedures
- `scripts/smoke-production.ps1` — local smoke test runner
- `scripts/watch-production.ps1` — polling watcher
