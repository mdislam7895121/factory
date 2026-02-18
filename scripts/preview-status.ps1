$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

Write-Output '=== PREVIEW STATUS: docker ps summary ==='
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Output '=== PREVIEW STATUS: compose ps ==='
docker compose -f $ComposeFile ps

Write-Output '=== PREVIEW STATUS: netstat :3000 ==='
netstat -ano | findstr :3000

Write-Output '=== PREVIEW STATUS: netstat :4100 ==='
netstat -ano | findstr :4100

Write-Output '=== PREVIEW STATUS: web health ==='
$webOk = $false
try {
    $web = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
    Write-Output ("web_status=" + [int]$web.StatusCode)
    $webOk = ([int]$web.StatusCode -eq 200)
}
catch {
    Write-Output ("web_status_error=" + $_.Exception.Message)
}

Write-Output '=== PREVIEW STATUS: orchestrator health ==='
try {
    $health = Invoke-RestMethod http://localhost:4100/health -TimeoutSec 15 -ErrorAction Stop
    $health | ConvertTo-Json -Depth 6 | Write-Output
}
catch {
    Write-Output ("orchestrator_health_error=" + $_.Exception.Message)
}

if (-not $webOk) {
    Write-Output '=== TROUBLESHOOTING NEXT STEPS ==='
    Write-Output '1) docker compose -f docker/docker-compose.dev.yml ps'
    Write-Output '2) docker compose -f docker/docker-compose.dev.yml logs web --tail 120'
    Write-Output '3) docker compose -f docker/docker-compose.dev.yml logs orchestrator --tail 120'
    Write-Output '4) netstat -ano | findstr :3000'
    Write-Output '5) pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/preview-up.ps1'
}
