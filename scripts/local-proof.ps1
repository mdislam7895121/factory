param(
    [switch]$NoTeardown
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

function Invoke-Compose {
    param([string[]]$ComposeArgs)

    & docker compose -f $ComposeFile @ComposeArgs
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose failed: $($ComposeArgs -join ' ')"
    }
}

Write-Output '=== STEP 1: compose down -v ==='
Invoke-Compose -ComposeArgs @('down', '-v')

Write-Output '=== STEP 2: compose up -d --build ==='
Invoke-Compose -ComposeArgs @('up', '-d', '--build')

Write-Output '=== STEP 3: wait web 200 ==='
$webStatus = 0
$ready = $false
for ($i = 1; $i -le 40; $i++) {
    try {
        $resp = Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 10
        $webStatus = [int]$resp.StatusCode
        Write-Output ("web_attempt=" + $i + " status=" + $webStatus)
        if ($webStatus -eq 200) {
            $ready = $true
            break
        }
    } catch {
        Write-Output ("web_attempt=" + $i + " error=" + $_.Exception.Message)
    }
    Start-Sleep -Seconds 2
}
if (-not $ready) {
    throw 'web not ready'
}

Write-Output '=== STEP 4: orchestrator health ==='
$health = Invoke-RestMethod http://localhost:4100/health
$health | ConvertTo-Json -Depth 6 | Write-Output

Write-Output '=== STEP 5: create project ==='
$create = Invoke-RestMethod -Method Post -Uri http://localhost:4100/v1/projects -ContentType 'application/json' -Body '{"name":"LocalProof","template":"basic-web"}'
$create | ConvertTo-Json -Depth 8 | Write-Output
$id = [string]$create.project.id
$previewUrl = "http://localhost:3000/p/$id/"
Write-Output ("PROJECT_ID=" + $id)

Write-Output '=== STEP 6: start project ==='
$start = Invoke-RestMethod -Method Post -Uri ("http://localhost:4100/v1/projects/" + $id + "/start") -ContentType 'application/json' -Body '{}'
$start | ConvertTo-Json -Depth 8 | Write-Output

Write-Output '=== STEP 7: logs endpoint ==='
$logsResp = Invoke-WebRequest -Uri ("http://localhost:4100/v1/projects/" + $id + "/logs") -UseBasicParsing -TimeoutSec 20
$logsStatus = [int]$logsResp.StatusCode
Write-Output ("logs_status=" + $logsStatus)

Write-Output '=== STEP 8: preview endpoint ==='
$previewStatus = 0
for ($j = 1; $j -le 20; $j++) {
    try {
        $previewResp = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 20
        $previewStatus = [int]$previewResp.StatusCode
        Write-Output ("preview_attempt=" + $j + " status=" + $previewStatus)
        if ($previewStatus -eq 200) {
            break
        }
    } catch {
        Write-Output ("preview_attempt=" + $j + " error=" + $_.Exception.Message)
        Start-Sleep -Seconds 2
    }
}

Write-Output '=== STEP 9: stop project ==='
$stop = Invoke-RestMethod -Method Post -Uri ("http://localhost:4100/v1/projects/" + $id + "/stop") -ContentType 'application/json' -Body '{}'
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
