param(
    [switch]$NoTeardown
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'
. (Join-Path $PSScriptRoot 'readiness-retry.ps1')

function Invoke-Compose {
    param([string[]]$ComposeArgs)

    & docker compose -f $ComposeFile @ComposeArgs
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose failed: $($ComposeArgs -join ' ')"
    }
}

function Invoke-ComposeWithRetry {
    param(
        [Parameter(Mandatory = $true)][string[]]$ComposeArgs,
        [int]$Attempts = 3,
        [int]$DelaySec = 5
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            Write-Output ("compose_attempt=" + $attempt + " cmd=" + ($ComposeArgs -join ' '))
            Invoke-Compose -ComposeArgs $ComposeArgs
            return
        }
        catch {
            Write-Output ("compose_attempt=" + $attempt + " error=" + $_.Exception.Message)
            if ($attempt -ge $Attempts) {
                throw
            }
            Start-Sleep -Seconds $DelaySec
        }
    }
}

Write-Output '=== STEP 1: compose down -v ==='
Invoke-Compose -ComposeArgs @('down', '-v')

Write-Output '=== STEP 2: compose up -d --build ==='
Invoke-ComposeWithRetry -ComposeArgs @('up', '-d', '--build') -Attempts 3 -DelaySec 5

Write-Output '=== STEP 3: wait web 200 ==='
$webReady = Wait-HttpReady -Name 'web' -Url 'http://localhost:3000' -Attempts 40 -DelaySec 2 -TimeoutSec 10 -ExpectedStatus 200
$webStatus = [int]$webReady.StatusCode
if (-not $webReady.Ready) {
    throw 'web not ready'
}

Write-Output '=== STEP 4: orchestrator health ==='
$health = Invoke-RestMethodWithRetry -Name 'orchestrator_health' -Method Get -Uri 'http://localhost:4100/health' -Attempts 20 -DelaySec 2 -TimeoutSec 20
$health | ConvertTo-Json -Depth 6 | Write-Output

Write-Output '=== STEP 5: create project ==='
$create = Invoke-RestMethodWithRetry -Name 'create_project' -Method Post -Uri 'http://localhost:4100/v1/projects' -ContentType 'application/json' -Body '{"name":"LocalProof","template":"basic-web"}' -Attempts 30 -DelaySec 2 -TimeoutSec 20
$create | ConvertTo-Json -Depth 8 | Write-Output
$id = [string]$create.project.id
$previewUrl = "http://localhost:3000/p/$id/"
Write-Output ("PROJECT_ID=" + $id)

Write-Output '=== STEP 6: start project ==='
$start = Invoke-RestMethodWithRetry -Name 'start_project' -Method Post -Uri ("http://localhost:4100/v1/projects/" + $id + "/start") -ContentType 'application/json' -Body '{}' -Attempts 30 -DelaySec 2 -TimeoutSec 20
$start | ConvertTo-Json -Depth 8 | Write-Output

Write-Output '=== STEP 7: logs endpoint ==='
$logsReady = Wait-HttpReady -Name 'logs' -Url ("http://localhost:4100/v1/projects/" + $id + "/logs") -Attempts 20 -DelaySec 2 -TimeoutSec 20 -ExpectedStatus 200
$logsStatus = [int]$logsReady.StatusCode
if (-not $logsReady.Ready) {
    throw 'logs endpoint not ready'
}

Write-Output '=== STEP 8: preview endpoint ==='
$previewReady = Wait-HttpReady -Name 'preview' -Url $previewUrl -Attempts 20 -DelaySec 2 -TimeoutSec 20 -ExpectedStatus 200
$previewStatus = [int]$previewReady.StatusCode
if (-not $previewReady.Ready) {
    throw 'preview endpoint not ready'
}

Write-Output '=== STEP 9: stop project ==='
$stop = Invoke-RestMethodWithRetry -Name 'stop_project' -Method Post -Uri ("http://localhost:4100/v1/projects/" + $id + "/stop") -ContentType 'application/json' -Body '{}' -Attempts 30 -DelaySec 2 -TimeoutSec 20
$stop | ConvertTo-Json -Depth 8 | Write-Output

Write-Output '=== SUMMARY ==='
Write-Output ("project_id=" + $id)
Write-Output ("preview_url=" + $previewUrl)
Write-Output ("web_status=" + $webStatus)
Write-Output ("logs_status=" + $logsStatus)
Write-Output ("preview_status=" + $previewStatus)

if (-not $NoTeardown) {
    Write-Output '=== STEP 10: compose down -v ==='
    Invoke-Compose -ComposeArgs @('down', '-v')
} else {
    Write-Output '=== STEP 10: skipped teardown (-NoTeardown) ==='
}
