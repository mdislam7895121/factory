# Alert Severity Model

Sev1:
- /db/health != 200
- Production unreachable

Sev2:
- Smoke Prod fails
- / root != 200
- debug-sentry behavior unexpected

Sev3:
- CI fails but production is healthy

# Workflow → Runbook Mapping

| Workflow | Symptom | Runbook Section |
|---|---|---|
| Uptime Prod | health/root/debug mismatch | #uptime-prod-failing |
| Smoke Prod | SMOKE_* mismatch | #smoke-prod-failing |
| CI | build/lint/test fail | #ci-failing |

# Notification Model

- Primary: GitHub Actions email
- If emails stop:
  - Check GitHub → Settings → Notifications
  - Ensure Actions failures are enabled
