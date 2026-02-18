# Permanent Live Preview (Track B)

This setup provides a stable browser-based preview while the agent continues coding.

## One-command start (Windows PowerShell)

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
```

Expected output includes:
- `DASHBOARD_URL=http://localhost:3000/`
- `LANDING_URL=http://localhost:3000/landing`
- `ORCHESTRATOR_HEALTH_URL=http://localhost:4100/health`
- web status `200`
- orchestrator `ok: true`

## One-command logs

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-logs.ps1 -Follow
```

## One-command stop

Default (removes volumes):

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-down.ps1
```

Keep volumes:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-down.ps1 -KeepVolumes
```

## Troubleshooting

### Port 3000 not responding
1. Run preview up again:
   ```powershell
   pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1
   ```
2. Verify listening:
   ```powershell
   netstat -ano | findstr :3000
   ```

### Docker Desktop running but web not reachable
1. Check container status:
   ```powershell
   docker compose -f docker/docker-compose.dev.yml ps
   ```
2. Follow logs:
   ```powershell
   pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-logs.ps1 -Follow
   ```

### `ResponseEnded` occurs
This is a warmup/network transient on local startup. `scripts/preview-up.ps1` uses retries and backoff.
Rerun preview-up and wait for `web_ready=True` and `status=200`.

### Port conflict detection and cleanup
1. Identify process using the port:
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :4100
   ```
2. Map PID to process:
   ```powershell
   Get-Process -Id <PID>
   ```
3. Stop conflicting process only if safe.

## Why VS Code Live Preview extension is not the right tool here
Factory preview is a Docker-hosted Next.js app with multiple services and runtime dependencies.
Use your browser directly with `http://localhost:3000/` (or forwarded port URL in remote environments).
The extension is intended for simple/static local server previews and does not replace service orchestration.
