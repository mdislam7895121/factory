# Factory Workspace

Factory is a proof-first software factory workspace for building and demoing a full-stack product pipeline.

## Who it's for

- Platform engineers and full-stack teams that need a repeatable local demo path.
- Operators who require readiness/health verification before presenting or shipping.

## What problem it solves

- Provides one predictable workflow to bring up the stack, verify service readiness, and show core template capability.
- Produces timestamped proof artifacts under `proof/runs/` so demo evidence is auditable and repeatable.

## What's included

- API service (`api/`) with health/readiness endpoints and template listing.
- Web dashboard (`web/`) served locally on port `3000`.
- Template and orchestration components (`templates/`, `orchestrator/`) used by the factory flow.
- Automation scripts (`scripts/`) and operational runbooks (`docs/ops/`).

## 10-minute quick start

### Windows (PowerShell)

Prerequisites:

- Docker Desktop
- Node.js LTS
- PowerShell 7+
- `railway` CLI optional (not required for local demo)

Run from repo root:

```powershell
pwsh -File scripts/demo.ps1
```

Expected local URLs:

- API health: `http://localhost:4000/db/health`
- API readiness: `http://localhost:4000/ready`
- Templates: `http://localhost:4000/v1/templates`
- Web: `http://localhost:3000/`

### macOS/Linux (bash)

Prerequisites:

- Docker Engine / Docker Desktop
- Node.js LTS
- Bash
- `railway` CLI optional (not required for local demo)

Run from repo root:

```bash
bash scripts/demo.sh
```

## Demo workflow (single happy path)

1. Start local stack (`docker compose -f docker/docker-compose.dev.yml up -d --build`).
2. Wait for API `/db/health` and `/ready` to return `200`.
3. Request `/v1/templates` and confirm the response includes template payload.
4. Verify web root responds with HTTP `200`.
5. Save a proof transcript to `proof/runs/serial21-demo-<timestamp>.txt`.

Detailed steps: `docs/DEMO_WORKFLOW.md`

## Architecture overview

High-level architecture and runtime ports are documented in `docs/ARCHITECTURE.md`.

## Security and operations notes

- Production monitoring/runbook: `docs/ops/MONITORING.md`
- Production smoke checks: `scripts/prod-smoke.ps1`
- Readiness contract: API `/ready` and `/db/health` are hard gates for operational checks.

## License

This project is licensed under the MIT License. See `LICENSE`.
