param(
    [switch]$DownWithVolumes,
    [switch]$KeepStack,
    [switch]$Ci,
    [string]$OutputDir
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'
$ProofRoot = Join-Path $RepoRoot 'proof'
. (Join-Path $PSScriptRoot 'readiness-retry.ps1')

if (-not (Test-Path $ComposeFile)) {
    Write-Error "Compose file not found: $ComposeFile"
    exit 1
}

if (-not (Test-Path $ProofRoot)) {
    New-Item -ItemType Directory -Path $ProofRoot -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$runDir = if ([string]::IsNullOrWhiteSpace($OutputDir)) { Join-Path $ProofRoot $timestamp } else { $OutputDir }
New-Item -ItemType Directory -Path $runDir -Force | Out-Null

$reportPath = Join-Path $runDir 'REPORT.md'
$failedStep = ''
$failureMessage = ''
$rawOutputs = [System.Collections.Generic.List[string]]::new()
$rerunOutputs = [System.Collections.Generic.List[string]]::new()
$composeBase = @('compose', '-f', $ComposeFile)

function Invoke-ComposeUpWithRetry {
    param(
        [int]$Attempts = 3,
        [int]$DelaySec = 5
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        Write-Output "compose_up_attempt=$attempt"
        & docker @($composeBase + @('up', '-d', '--build'))
        if ($LASTEXITCODE -eq 0) {
            return
        }

        Write-Output "compose_up_attempt=$attempt exit_code=$LASTEXITCODE"
        if ($attempt -ge $Attempts) {
            throw "docker compose up failed after $Attempts attempts"
        }
        Start-Sleep -Seconds $DelaySec
    }
}

function Invoke-Captured {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][scriptblock]$Action,
        [switch]$AllowFailure
    )

    $path = Join-Path $runDir ("{0}.txt" -f $Name)
    "# $Name`n# UTC: $(Get-Date -Format o)" | Set-Content -Path $path -Encoding UTF8
    try {
        & $Action *>&1 | Tee-Object -FilePath $path -Append | Out-Host
        if ($LASTEXITCODE -ne 0 -and -not $AllowFailure) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        $_ | Out-String | Tee-Object -FilePath $path -Append | Out-Host
        if (-not $AllowFailure) {
            throw
        }
    }
    $script:rawOutputs.Add([IO.Path]::GetFileName($path))
    return $path
}

function Write-Report {
    param(
        [bool]$Success
    )

    $diffSummary = (git diff --stat 2>&1 | Out-String).Trim()
    if ([string]::IsNullOrWhiteSpace($diffSummary)) {
        $diffSummary = 'No source changes applied by proof run.'
    }

    $failedText = if ($Success) { 'None (proof run completed).' } else { "$failedStep`n$failureMessage" }
    $rawList = if ($rawOutputs.Count -gt 0) { ($rawOutputs | ForEach-Object { "- $_" }) -join "`n" } else { '- No raw outputs captured.' }
    $rerunList = if ($rerunOutputs.Count -gt 0) { ($rerunOutputs | ForEach-Object { "- $_" }) -join "`n" } else { '- Re-run not executed in this run.' }

    $content = @(
        '# L2 Proof Report'
        ''
        '## What failed'
        $failedText
        ''
        '## Raw outputs'
        $rawList
        ''
        '## Minimal fix applied (diff summary)'
        '```'
        $diffSummary
        '```'
        ''
        '## Re-run proof outputs'
        $rerunList
        ''
        '## Rollback steps'
        '```powershell'
        'git restore --source=HEAD -- scripts docs .github/workflows .gitignore docker/docker-compose.dev.yml api/Dockerfile.dev web/Dockerfile.dev'
        'git clean -fd proof'
        '```'
    ) -join "`n"

    $content | Set-Content -Path $reportPath -Encoding UTF8
}

try {
    Invoke-Captured -Name '00-env' -Action {
        Write-Output "PWD=$((Get-Location).Path)"
        Write-Output "RepoRoot=$RepoRoot"
        Write-Output "ComposeFile=$ComposeFile"
        Write-Output "PowerShell=$($PSVersionTable.PSVersion)"
        git status --short --branch
        git log -3 --oneline
        git diff --stat
        docker version
        docker compose version
    }

    $failedStep = 'docker compose config'
    Invoke-Captured -Name '10-compose-config' -Action { & docker @composeBase config }

    $failedStep = 'docker compose down pre-clean'
    Invoke-Captured -Name '11-compose-down-pre' -Action {
        $args = $composeBase + @('down')
        if ($DownWithVolumes) { $args += '-v' }
        & docker @args
    } -AllowFailure

    $failedStep = 'docker compose up -d --build'
    Invoke-Captured -Name '12-compose-up' -Action { Invoke-ComposeUpWithRetry -Attempts 3 -DelaySec 5 }

    $failedStep = 'docker compose ps'
    Invoke-Captured -Name '13-compose-ps' -Action { & docker @($composeBase + @('ps')) }

    $failedStep = 'docker compose logs'
    Invoke-Captured -Name '14-compose-logs' -Action {
        & docker @($composeBase + @('logs', '--tail', '250', 'db', 'api', 'web'))
    }

    $failedStep = 'smoke web'
    $webReady = Wait-HttpReady -Name 'web' -Url 'http://localhost:3000' -Attempts 36 -DelaySec 5 -TimeoutSec 10 -ExpectedStatus 200
    if (-not $webReady.Ready) {
        throw 'Web endpoint http://localhost:3000 did not return HTTP 200 in time.'
    }
    Invoke-Captured -Name '15-smoke-web' -Action {
        $web = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 15
        Write-Output "StatusCode=$($web.StatusCode)"
    }

    $failedStep = 'smoke api'
    $apiReady = Wait-HttpReady -Name 'api_db_health' -Url 'http://localhost:4000/db/health' -Attempts 36 -DelaySec 5 -TimeoutSec 10 -ExpectedStatus 200
    if (-not $apiReady.Ready) {
        throw 'API endpoint http://localhost:4000/db/health did not return HTTP 200 in time.'
    }
    Invoke-Captured -Name '16-smoke-api' -Action {
        $api = Invoke-RestMethod -Uri 'http://localhost:4000/db/health' -TimeoutSec 15
        $api | ConvertTo-Json -Depth 8
        if ($api.ok -ne $true) {
            throw 'API health returned ok != true'
        }
    }

    if (-not $KeepStack) {
        $failedStep = 'docker compose down post-run'
        Invoke-Captured -Name '17-compose-down-post' -Action {
            $args = $composeBase + @('down')
            if ($DownWithVolumes) { $args += '-v' }
            & docker @args
        } -AllowFailure
    }

    Write-Report -Success $true
    Write-Host "[proof-l2] Proof pack created: $runDir"
    Write-Host "[proof-l2] Report: $reportPath"
    exit 0
}
catch {
    $failureMessage = ($_ | Out-String).Trim()

    Invoke-Captured -Name '98-diagnostics-ps' -Action { & docker @($composeBase + @('ps')) } -AllowFailure
    Invoke-Captured -Name '99-diagnostics-api-logs' -Action { & docker @($composeBase + @('logs', '--tail', '400', 'api')) } -AllowFailure
    Invoke-Captured -Name '99-diagnostics-web-logs' -Action { & docker @($composeBase + @('logs', '--tail', '200', 'web')) } -AllowFailure

    if (-not $KeepStack) {
        Invoke-Captured -Name '97-compose-down-on-fail' -Action {
            $args = $composeBase + @('down')
            if ($DownWithVolumes) { $args += '-v' }
            & docker @args
        } -AllowFailure
    }

    Write-Report -Success $false
    Write-Host "[proof-l2] FAILED at step: $failedStep" -ForegroundColor Red
    Write-Host "[proof-l2] Proof pack created: $runDir"
    Write-Host "[proof-l2] Report: $reportPath"
    exit 1
}
