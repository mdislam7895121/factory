# QUICKSTART (SERIAL 10)

This quickstart gives a predictable first local run with clear warmup and recovery steps.

## Prerequisites

- Docker Desktop (WSL2 engine enabled)
- PowerShell 7+
- Node.js LTS (recommended for local scripts)
- GitHub CLI (`gh`) optional (only for PR/CI operations)

## One command dev start

```powershell
pwsh -File scripts/factory.ps1 dev:up
```

## Expected URLs

- Web dashboard: http://localhost:3000
- Orchestrator health: http://localhost:4100/health
- API health: http://localhost:4000/db/health
- Stable preview route: http://localhost:3000/p/<projectId>/

## Warmup expectation (first run)

First load can take around 10-60 seconds while containers install dependencies and warm up.

Use this retry loop and wait for `StatusCode=200`:

```powershell
$ready=$false
for($i=1;$i -le 40;$i++){
  try {
    $resp = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 10
    Write-Output ("web_attempt="+$i+" status="+$resp.StatusCode)
    if($resp.StatusCode -eq 200){ $ready=$true; break }
  } catch {
    Write-Output ("web_attempt="+$i+" error="+$_.Exception.Message)
  }
  Start-Sleep -Seconds 2
}
if(-not $ready){ throw "web not ready" }
```

## Troubleshooting

| Symptom | Quick check | Recovery |
|---|---|---|
| web not ready | `docker compose -f docker/docker-compose.dev.yml ps` | `docker compose -f docker/docker-compose.dev.yml down -v` then `up -d --build` |
| ResponseEnded | retry web/preview request for 10-30s | rerun request loop; if persistent, check `docker compose ... logs` |
| port in use | container start fails with bind/port error | `docker ps --format json`, stop conflicting container, rerun compose |
| stale local state | inconsistent startup behavior | full reset with `docker compose -f docker/docker-compose.dev.yml down -v` then `up -d --build` |

## Live Dashboard Preview (Local Windows)

Use the preview bring-up script:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
```

Optional browser launch:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1 -OpenBrowser
```

Teardown:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-down.ps1
```

The dashboard URL is always:

- `http://localhost:3000`

## Live Dashboard Preview (Remote/DevContainer)

If your workspace runs remotely (Dev Container/Codespaces/SSH), `localhost` in your browser is not the container host.

1. Run:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
```

2. In VS Code, open **PORTS** view and forward port `3000`.
3. Open the forwarded URL shown by VS Code (for example `https://<forwarded-host>/`).

Use URL preview for this project. VS Code Live Preview extension is for static/simple servers; this app runs in Docker with Next.js and should be accessed through `http://localhost:3000` (or the forwarded URL).

## Web UI Live Note

- Use your browser at `http://localhost:3000` for live UI updates while developing.
- VS Code Live Preview extension is not required for this Docker + Next.js setup.
- If `localhost:3000` is refused, run:

```powershell
docker compose -f docker/docker-compose.dev.yml up -d --build
```

Then wait for warmup and retry the URL.
