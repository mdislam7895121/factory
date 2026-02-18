param(
    [switch]$OpenBrowser,
    [int]$Attempts = 60
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'
. (Join-Path $PSScriptRoot 'readiness-retry.ps1')

function Assert-PortListening {
    param(
        [int]$Port,
        [string]$Name
    )

    $listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($null -eq $listening) {
        Write-Output ("port_" + $Port + "=NOT_LISTENING")
        throw ($Name + ' is not listening on port ' + $Port)
    }
    Write-Output ("port_" + $Port + "=LISTENING")
}

function Show-Diagnostics {
    Write-Output '=== DIAGNOSTICS: docker compose ps ==='
    docker compose -f $ComposeFile ps

    Write-Output '=== DIAGNOSTICS: web logs (tail 120) ==='
    docker compose -f $ComposeFile logs web --tail 120

    Write-Output '=== DIAGNOSTICS: orchestrator logs (tail 120) ==='
    docker compose -f $ComposeFile logs orchestrator --tail 120

    Write-Output '=== DIAGNOSTICS: api logs (tail 120) ==='
    docker compose -f $ComposeFile logs api --tail 120

    Write-Output 'SUGGESTED_FIX=Verify Docker Desktop is running, then rerun: docker compose -f docker/docker-compose.dev.yml up -d --build. If web is still refused, inspect logs above and confirm web port mapping includes 3000:3000 in docker/docker-compose.dev.yml.'
}

Write-Output '=== STEP 1: compose up -d --build ==='
docker compose -f $ComposeFile up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Output 'compose_up_result=failed'
    Show-Diagnostics
    throw 'compose up failed'
}

Write-Output '=== STEP 2: wait web http://localhost:3000 ==='
$webReady = Wait-HttpReady -Name 'web' -Url 'http://localhost:3000' -Attempts $Attempts -DelaySec 2 -TimeoutSec 10 -ExpectedStatus 200
Write-Output ("web_ready=" + $webReady.Ready + " attempt=" + $webReady.Attempt + " status=" + $webReady.StatusCode)

Write-Output '=== STEP 3: verify published/listening ports ==='
Assert-PortListening -Port 3000 -Name 'web'
Assert-PortListening -Port 4100 -Name 'orchestrator'
Assert-PortListening -Port 4000 -Name 'api'

$dockerPsText = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Out-String
$has3000Mapping = $dockerPsText -match '(:|\[::\]:)3000->3000/tcp'

if (-not $webReady.Ready -or -not $has3000Mapping) {
    if (-not $has3000Mapping) {
        Write-Output 'port_3000_mapping=missing'
    }
    Show-Diagnostics
    throw 'dashboard preview is not reachable on localhost:3000'
}

Write-Output 'CUSTOMER_LANDING_URL=http://localhost:3000/'
Write-Output 'ADMIN_DASHBOARD_URL=http://localhost:3000/dashboard'

$landingStatus = (Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/' -TimeoutSec 15).StatusCode
$dashboardStatus = (Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/dashboard' -TimeoutSec 15).StatusCode
Write-Output ("landing_status=" + $landingStatus)
Write-Output ("dashboard_status=" + $dashboardStatus)

Write-Output '=== STEP 4: orchestrator health ==='
$health = Invoke-RestMethodWithRetry -Name 'orchestrator_health' -Method Get -Uri 'http://localhost:4100/health' -Attempts 20 -DelaySec 2 -TimeoutSec 20
$health | ConvertTo-Json -Depth 6 | Write-Output

Write-Output '=== STEP 5: published ports summary ==='
$dockerPsText.TrimEnd() | Write-Output

if ($OpenBrowser) {
    Start-Process 'http://localhost:3000' | Out-Null
    Write-Output 'open_browser=launched'
} else {
    Write-Output 'open_browser=skipped'
}
