# Troubleshooting (AI Factory)

## Docker daemon not reachable

Symptom:
- `failed to connect to the docker API`

Fix:

```powershell
docker version
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Start-Sleep -Seconds 20
docker version
```

## Compose file not found

Symptom:
- Script reports compose path missing.

Fix:

```powershell
Test-Path "C:\Users\vitor\Dev\factory\docker\docker-compose.dev.yml"
pwsh -File scripts/factory.ps1 doctor
```

## Ports 3000, 4000 or 5432 busy

Fix:

```powershell
Get-NetTCPConnection -LocalPort 3000,4000,5432 -ErrorAction SilentlyContinue | Select-Object LocalPort,State,OwningProcess
pwsh -File scripts/factory.ps1 dev:down -DownWithVolumes
```

If still busy, stop owning process:

```powershell
Stop-Process -Id <PID> -Force
```

## Stack starts but smoke fails

Collect diagnostics first:

```powershell
pwsh -File scripts/factory.ps1 dev:status
pwsh -File scripts/factory.ps1 dev:logs
docker compose -f C:\Users\vitor\Dev\factory\docker\docker-compose.dev.yml logs --tail 400 api
docker compose -f C:\Users\vitor\Dev\factory\docker\docker-compose.dev.yml logs --tail 200 web
```

Then run proof again:

```powershell
pwsh -File scripts/factory.ps1 proof:l2
```

## Reset dev stack completely

```powershell
pwsh -File scripts/factory.ps1 dev:down -DownWithVolumes
pwsh -File scripts/factory.ps1 dev:up
pwsh -File scripts/factory.ps1 dev:smoke
```
