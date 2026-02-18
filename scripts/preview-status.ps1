$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

function Show-PortStatus {
    param(
        [int]$Port,
        [string]$Name
    )

    $listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($null -eq $listening) {
        Write-Output ($Name + '_port_' + $Port + '=NOT_LISTENING')
        return
    }

    Write-Output ($Name + '_port_' + $Port + '=LISTENING')
}

Write-Output '=== PREVIEW STATUS: docker compose ps ==='
docker compose -f $ComposeFile ps

Write-Output '=== PREVIEW STATUS: docker ps ports ==='
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Output '=== PREVIEW STATUS: listening ports ==='
Show-PortStatus -Port 3000 -Name 'web'
Show-PortStatus -Port 4100 -Name 'orchestrator'
Show-PortStatus -Port 4000 -Name 'api'

Write-Output '=== PREVIEW STATUS: HTTP checks ==='
try {
    $web = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 15
    Write-Output ('web_http_status=' + $web.StatusCode)
} catch {
    Write-Output ('web_http_error=' + $_.Exception.Message)
}

try {
    $health = Invoke-RestMethod -Uri 'http://localhost:4100/health' -TimeoutSec 15
    Write-Output 'orchestrator_health_json='
    $health | ConvertTo-Json -Depth 6 | Write-Output
} catch {
    Write-Output ('orchestrator_health_error=' + $_.Exception.Message)
}
