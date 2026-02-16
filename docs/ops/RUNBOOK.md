# Alert Triage Map

## uptime-prod-failing

1) What it means:
- `Uptime Prod` detected endpoint status drift in production (`/db/health`, `/`, or `/debug-sentry`).

2) Immediate verification commands (PowerShell):

```powershell
$base="https://factory-production-production.up.railway.app"
Invoke-WebRequest "$base/db/health" -UseBasicParsing
Invoke-WebRequest "$base/" -UseBasicParsing
try { Invoke-WebRequest "$base/debug-sentry" -UseBasicParsing } catch { $_.Exception.Response.StatusCode.value__ }
railway deployment list -s factory-production -e production --limit 5
gh run list --workflow "Uptime Prod" --limit 3
```

3) If last deploy caused issue:

```powershell
git log -n 3 --oneline
git revert <sha> --no-edit
git push origin main
```

## smoke-prod-failing

1) What it means:
- `Smoke Prod` failed on `SMOKE_DB_HEALTH`, `SMOKE_ROOT`, or `SMOKE_DEBUG_NOHEADER` checks.

2) Immediate verification commands (PowerShell):

```powershell
$base="https://factory-production-production.up.railway.app"
Invoke-WebRequest "$base/db/health" -UseBasicParsing
Invoke-WebRequest "$base/" -UseBasicParsing
try { Invoke-WebRequest "$base/debug-sentry" -UseBasicParsing } catch { $_.Exception.Response.StatusCode.value__ }
gh run list --workflow "Smoke Prod" --limit 3
railway deployment list -s factory-production -e production --limit 5
```

3) If last deploy caused issue:

```powershell
git log -n 3 --oneline
git revert <sha> --no-edit
git push origin main
```

## ci-failing

1) What it means:
- CI build/lint/test/proof checks failed; production may still be healthy but release gate is blocked.

2) Immediate verification commands (PowerShell):

```powershell
gh run list --workflow CI --limit 3
$base="https://factory-production-production.up.railway.app"
Invoke-WebRequest "$base/db/health" -UseBasicParsing
railway deployment list -s factory-production -e production --limit 5
```

3) If last deploy caused issue:

```powershell
git log -n 3 --oneline
git revert <sha> --no-edit
git push origin main
```

## db-health-not-200

1) What it means:
- Production database health path is degraded or inaccessible.

2) Immediate verification commands (PowerShell):

```powershell
$base="https://factory-production-production.up.railway.app"
Invoke-WebRequest "$base/db/health" -UseBasicParsing
railway deployment list -s factory-production -e production --limit 5
gh run list --workflow "Uptime Prod" --limit 3
gh run list --workflow "Smoke Prod" --limit 3
```

3) If last deploy caused issue:

```powershell
git log -n 3 --oneline
git revert <sha> --no-edit
git push origin main
```

## debug-sentry-unexpected

1) What it means:
- `/debug-sentry` behavior changed unexpectedly (for example no-header request is not guarded as expected).

2) Immediate verification commands (PowerShell):

```powershell
$base="https://factory-production-production.up.railway.app"
try { Invoke-WebRequest "$base/debug-sentry" -UseBasicParsing } catch { $_.Exception.Response.StatusCode.value__ }
gh run list --workflow "Uptime Prod" --limit 3
gh run list --workflow "Smoke Prod" --limit 3
gh run list --workflow CI --limit 3
```

3) If last deploy caused issue:

```powershell
git log -n 3 --oneline
git revert <sha> --no-edit
git push origin main
```

---

# Factory Production Incident Runbook

## 1. Severity Classification

### SEV1 – Critical Outage
- Production API down
- /db/health failing
- Data corruption
- Security breach

Response time: Immediate (0–5 minutes)

### SEV2 – Major Degradation
- Partial endpoint failure
- Background jobs failing
- Elevated error rate
- Uptime workflow red but service partially available

Response time: 15 minutes

### SEV3 – Minor Issue
- Non-critical feature issue
- Monitoring false positive
- Cosmetic issue

Response time: Next working window

---

## 2. Immediate Triage Checklist (Proof-First)

Run:

curl -i https://factory-production-production.up.railway.app/
curl -i https://factory-production-production.up.railway.app/db/health
curl -i https://factory-production-production.up.railway.app/debug-sentry

Check:
- HTTP status
- Response body
- Recent Railway logs

Railway logs:

railway logs --service factory-production --environment production

---

## 3. Rollback Procedure

If last deployment caused failure:

1) Identify last successful commit:

git log --oneline -n 5

2) Revert faulty commit:

git revert <commit-hash>
git push origin main

3) Verify deployment status:

railway deployment list

---

## 4. Recovery Verification

After fix or rollback:

1) Confirm GitHub Action green:
   Repo → Actions → Uptime Prod

2) Re-run manual dispatch if needed:

gh workflow run "Uptime Prod" --repo mdislam7895121/factory --ref main

3) Verify endpoints:

curl -s -o /dev/null -w "%{http_code}" https://factory-production-production.up.railway.app/
curl -s -o /dev/null -w "%{http_code}" https://factory-production-production.up.railway.app/db/health

Expected:
200 / 200 / 500

---

## 5. Escalation Path

SEV1:
- Immediate investigation
- Notify owner
- Document timeline

SEV2:
- Create GitHub issue
- Monitor until stable

SEV3:
- Backlog task

---

## 6. Monitoring References

- GitHub Actions: Uptime Prod
- Railway Dashboard
- Sentry (Production project)

---

## 7. Post-Incident Report Template

- Incident start time:
- Detection source:
- Root cause:
- Resolution:
- Preventive action:
- Proof links:

---
