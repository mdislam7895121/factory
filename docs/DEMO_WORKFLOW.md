# Demo Workflow (SERIAL 21)

This document defines one happy-path local demo flow for a clean machine.

## Scope

- Local dev stack only (no production changes).
- Verifies API health/readiness, template listing, and web HTTP 200.
- Generates a proof transcript under `proof/runs/`.

## Prerequisites

- Docker Desktop or Docker Engine
- Node.js LTS
- PowerShell 7+ (Windows) or Bash (macOS/Linux)
- Optional: Railway CLI (`railway`)

## Run the demo

### Windows PowerShell

```powershell
pwsh -File scripts/demo.ps1
```

### macOS/Linux

```bash
bash scripts/demo.sh
```

## Expected checks

1. Starts local stack via Docker Compose (`docker/docker-compose.dev.yml`).
2. Waits until `http://localhost:4000/db/health` returns HTTP 200.
3. Waits until `http://localhost:4000/ready` returns HTTP 200.
4. Calls `http://localhost:4000/v1/templates` and logs response.
5. Waits until `http://localhost:3000/` returns HTTP 200.
6. Writes `proof/runs/serial21-demo-<timestamp>.txt`.

## Idempotency and safety

- The workflow uses `docker compose up -d --build` and can be re-run safely.
- Each run writes a new timestamped proof file and does not overwrite previous proofs.
- No database-destructive commands are executed by these demo scripts.

## Troubleshooting

- If startup is slow, re-run the same command; bounded retries are built in.
- Check container state with:

```powershell
docker compose -f docker/docker-compose.dev.yml ps
```

- Optional cleanup:

```powershell
pwsh -File scripts/dev-down.ps1
```