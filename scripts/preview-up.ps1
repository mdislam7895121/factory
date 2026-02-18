param(
    [switch]$OpenBrowser,
    [switch]$Smoke,
    [int]$MaxAttempts = 40
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'
. (Join-Path $PSScriptRoot 'readiness-retry.ps1')

function Assert-DockerDesktopRunning {
    try {
        docker info | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw 'docker info failed'
        }
    }
    catch {
        throw 'Docker Desktop is not reachable. Start Docker Desktop and rerun scripts/preview-up.ps1.'
    }
}

function Test-HttpReadyWithBackoff {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Url,
        [int]$ExpectedStatus = 200,
        [int]$Attempts = 40,
        [int]$BaseDelaySec = 2,
        [int]$MaxDelaySec = 12
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        $status = 0
        try {
            $statusText = curl.exe -sS -o NUL -w "%{http_code}" $Url
            [void][int]::TryParse(($statusText | Out-String).Trim(), [ref]$status)
            Write-Output ("{0}_attempt={1} status={2}" -f $Name, $attempt, $status)
            if ($status -eq $ExpectedStatus) {
                return [pscustomobject]@{ Ready = $true; Attempt = $attempt; StatusCode = $status }
            }
        }
        catch {
            Write-Output ("{0}_attempt={1} error={2}" -f $Name, $attempt, $_.Exception.Message)
        }

        if ($attempt -lt $Attempts) {
            $delay = [Math]::Min($BaseDelaySec * [Math]::Pow(1.4, $attempt - 1), $MaxDelaySec)
            Start-Sleep -Seconds ([int][Math]::Ceiling($delay))
        }
    }

    return [pscustomobject]@{ Ready = $false; Attempt = $Attempts; StatusCode = 0 }
}

function Assert-PortListening {
    param([Parameter(Mandatory = $true)][int]$Port)

    $listening = netstat -ano | Select-String -Pattern (":{0}\s" -f $Port) | Select-String -Pattern 'LISTENING'
    if (-not $listening) {
        throw "Port $Port is not listening on host."
    }
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
Assert-DockerDesktopRunning
docker compose -f $ComposeFile up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Output 'compose_up_result=failed'
    Show-Diagnostics
    throw 'compose up failed'
}

Write-Output '=== STEP 2: wait web http://localhost:3000 ==='
$webReady = Test-HttpReadyWithBackoff -Name 'web' -Url 'http://localhost:3000/' -Attempts $MaxAttempts -BaseDelaySec 2 -ExpectedStatus 200
Write-Output ("web_ready=" + $webReady.Ready + " attempt=" + $webReady.Attempt + " status=" + $webReady.StatusCode)

$dockerPsText = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Out-String
$has3000Mapping = $dockerPsText -match '(:|\[::\]:)3000->3000/tcp'

if (-not $webReady.Ready -or -not $has3000Mapping) {
    if (-not $has3000Mapping) {
        Write-Output 'port_3000_mapping=missing'
    }
    Show-Diagnostics
    throw 'dashboard preview is not reachable on localhost:3000'
}

try {
    Assert-PortListening -Port 3000
    Assert-PortListening -Port 4100
    Write-Output 'port_3000=LISTENING'
    Write-Output 'port_4100=LISTENING'
}
catch {
    Write-Output ("port_check_error=" + $_.Exception.Message)
    Show-Diagnostics
    throw
}

Write-Output 'OPEN THIS: http://localhost:3000/'
Write-Output 'Dashboard route (if exists): http://localhost:3000/dashboard'

$landingReady = Test-HttpReadyWithBackoff -Name 'landing' -Url 'http://localhost:3000/landing' -Attempts 5 -BaseDelaySec 1 -ExpectedStatus 200
if ($landingReady.Ready) {
    Write-Output 'Landing route (if exists): http://localhost:3000/landing'
} else {
    Write-Output 'Landing route (if exists): not present on current branch'
}

Write-Output 'ORCHESTRATOR_HEALTH_URL=http://localhost:4100/health'

Write-Output '=== STEP 3: orchestrator health ==='
$health = Invoke-RestMethodWithRetry -Name 'orchestrator_health' -Method Get -Uri 'http://localhost:4100/health' -Attempts $MaxAttempts -DelaySec 2 -TimeoutSec 20
$health | ConvertTo-Json -Depth 6 | Write-Output

if ($health.ok -ne $true) {
    Show-Diagnostics
    throw 'orchestrator health did not return ok=true'
}

if ($Smoke) {
    Write-Output '=== STEP 3B: optional smoke create/start/preview/stop ==='
    $create = Invoke-RestMethodWithRetry -Name 'smoke_create' -Method Post -Uri 'http://localhost:4100/v1/projects' -ContentType 'application/json' -Body '{"name":"PreviewSmoke","template":"basic-web"}' -Attempts 30 -DelaySec 2 -TimeoutSec 20
    $projectId = [string]$create.project.id
    Write-Output ("smoke_project_id=" + $projectId)

    [void](Invoke-RestMethodWithRetry -Name 'smoke_start' -Method Post -Uri ("http://localhost:4100/v1/projects/" + $projectId + "/start") -ContentType 'application/json' -Body '{}' -Attempts 30 -DelaySec 2 -TimeoutSec 20)

    $previewReady = Test-HttpReadyWithBackoff -Name 'smoke_preview' -Url ("http://localhost:3000/p/" + $projectId + "/") -Attempts 45 -BaseDelaySec 2 -ExpectedStatus 200
    Write-Output ("smoke_preview_ready=" + $previewReady.Ready + " attempt=" + $previewReady.Attempt + " status=" + $previewReady.StatusCode)

    [void](Invoke-RestMethodWithRetry -Name 'smoke_stop' -Method Post -Uri ("http://localhost:4100/v1/projects/" + $projectId + "/stop") -ContentType 'application/json' -Body '{}' -Attempts 30 -DelaySec 2 -TimeoutSec 20)
}

Write-Output '=== STEP 4: published ports summary ==='
$dockerPsText.TrimEnd() | Write-Output

if ($OpenBrowser) {
    Start-Process 'http://localhost:3000/' | Out-Null
    Write-Output 'open_browser=launched'
} else {
    Write-Output 'open_browser=skipped'
}
