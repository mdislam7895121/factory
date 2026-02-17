# AI Factory (Local Replit-style Workflow)

This repository provides a single-command local workflow for start, preview, proof, and repair diagnostics.

## Prerequisites

- Windows PowerShell 7+
- Docker Desktop (WSL2 engine)
- Node.js LTS

## One command bootstrap

```powershell
pwsh -File scripts/factory.ps1 dev:up
```

## Browser preview URLs

- Web preview: http://localhost:3000
- API health: http://localhost:4000/db/health
- Orchestrator health: http://localhost:4100/health
- Dashboard preview route: http://localhost:3000/p/<projectId>/

## Daily commands

```powershell
pwsh -File scripts/factory.ps1 dev:status
pwsh -File scripts/factory.ps1 dev:logs
pwsh -File scripts/factory.ps1 dev:smoke
pwsh -File scripts/factory.ps1 dev:down
```

## Dashboard (Replit-like local control)

Open `http://localhost:3000`.

From the dashboard you can:

- Create a project from `orchestrator/templates/basic-web`
- Start and stop project containers
- See status (running/healthy/port)
- Stream live project logs (WebSocket)
- Open stable preview route `/p/<projectId>/`

## One command proof pack

```powershell
pwsh -File scripts/factory.ps1 proof:l2
```

Output is written to `proof/<timestamp>/` and includes:

- compose config/up/ps/logs/down
- smoke outputs
- environment diagnostics
- `REPORT.md`

## AI repair loop

When proof fails:

1. `scripts/proof-l2.ps1` captures `ps` and service logs automatically.
2. `proof/<timestamp>/REPORT.md` is generated with:
   - What failed
   - Raw outputs
   - Minimal fix applied (diff summary)
   - Re-run proof outputs
   - Rollback steps
3. Apply minimal fix, then run proof again:

```powershell
pwsh -File scripts/factory.ps1 proof:l2
```

## Environment doctor

```powershell
pwsh -File scripts/factory.ps1 doctor
```

Doctor validates Docker daemon, Compose availability, WSL status, compose file path, and required ports.
