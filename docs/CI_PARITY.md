# CI Parity (Local vs Pull Request Proof Gate)

This project keeps CI proof behavior aligned with local proof behavior.

## Local command (source of truth)

```powershell
pwsh -File scripts/factory.ps1 proof:l2
```

## CI command (pull_request)

CI runs the same proof flow using PowerShell on Linux:

```powershell
pwsh -File scripts/proof-l2.ps1 -DownWithVolumes -Ci
```

## Required parity checks

- Docker compose config validation (`docker compose ... config`)
- Docker compose up/down lifecycle
- Docker compose service status + logs capture
- Web smoke (HTTP 200 on localhost:3000)
- API smoke (`/db/health` with `ok=true`)
- Proof artifact generation with `REPORT.md`

## CI artifacts

The PR gate uploads proof output from `proof/<timestamp>/` so local and CI logs can be compared without drift.

## Non-secret policy

- CI proof gate uses local docker-compose dev defaults only.
- No production secrets are consumed in this job.
