# Alert Environment Variable Contract

**Updated:** 2026-05-23  
**Scope:** All alerting integrations (Slack, email, PagerDuty, SMS)

No secret values here — placeholders only.

---

## Variable Reference

### Required for Basic Alerting

| Variable | Service | Description | Example |
|----------|---------|-------------|---------|
| `ALERT_SLACK_WEBHOOK_URL` | Railway API / CI | Incoming webhook URL for #alerts channel | `https://hooks.slack.com/services/T00/B00/xxx` |
| `ALERT_EMAIL_TO` | Railway API / CI | Comma-separated recipient list | `oncall@company.com,eng@company.com` |

### Optional — Escalation

| Variable | Service | Description | Example |
|----------|---------|-------------|---------|
| `ALERT_PAGERDUTY_KEY` | Railway API | PagerDuty Events API v2 integration key | `abc123...` |
| `ALERT_SMS_TO` | CI | E.164 phone number for Twilio SMS | `+1555000111` |
| `ALERT_TWILIO_SID` | CI | Twilio account SID | `ACxxx` |
| `ALERT_TWILIO_TOKEN` | CI | Twilio auth token | `xxx` |
| `ALERT_TWILIO_FROM` | CI | Twilio from number | `+1555999000` |

### Operational

| Variable | Service | Description | Default |
|----------|---------|-------------|---------|
| `ALERT_THRESHOLD_CONSECUTIVE` | watch-production.ps1 | Failures before Slack alert | `2` |
| `ALERT_INTERVAL_MINUTES` | watch-production.ps1 | Smoke test poll interval | `5` |
| `MAINTENANCE_WINDOW` | CI | ISO 8601 interval (suppress alerts) | — |

---

## Usage in Scripts

### watch-production.ps1

```powershell
$env:ALERT_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/...'
.\scripts\watch-production.ps1 -BaseUrl $env:NEXT_PUBLIC_PROD_FRONTEND_URL -ApiUrl $env:NEXT_PUBLIC_API_BASE_URL
```

### API — NestJS Public Status Module

The `public-status` module reads these at startup (Railway env vars):

```env
ALERT_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
ALERT_EMAIL_TO=oncall@company.com
```

---

## Security Rules

1. `ALERT_*` vars are **backend-only** — never prefix with `NEXT_PUBLIC_`
2. Webhook URLs are secrets — treat like API keys, rotate every 90 days
3. PagerDuty key has write access — store in Railway secrets, never in git
4. Twilio tokens have billing implications — restrict IP allowlist in Twilio console

---

## Slack Channel Convention

| Channel | Purpose |
|---------|---------|
| `#factory-alerts` | All automated alerts |
| `#factory-incidents` | Active incident coordination |
| `#factory-deploys` | Deploy notifications (Netlify webhook) |

Configure `ALERT_SLACK_WEBHOOK_URL` to target `#factory-alerts`.  
Create a separate webhook for `#factory-incidents` for SEV-1/SEV-2 escalations.

---

## Alert Payload Format

### Slack (smoke watcher)

```json
{
  "text": ":fire: *Factory smoke test FAILED* (run #12, 2x in a row)\nhttps://factory.netlify.app"
}
```

### API Health Alert

```json
{
  "text": ":warning: *Factory API degraded*\nService: db\nStatus: unhealthy\nTime: 2026-05-23T10:15:00Z"
}
```

---

## Related

- `docs/monitoring/synthetic-checks.md` — uptime check definitions
- `docs/incident/runbook.md` — incident runbooks
- `scripts/watch-production.ps1` — uses `ALERT_SLACK_WEBHOOK_URL`
- `docs/deployment/env-map.md` — full env var reference
