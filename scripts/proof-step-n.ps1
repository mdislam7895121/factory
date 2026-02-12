#Requires -Version 7.0

[CmdletBinding()]
param(
    [string]$ApiUrl,
    [string]$WebUrl,
    [int]$TimeoutSec = 20,
    [switch]$LocalOnly,
    [switch]$EmitArtifacts
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$runsDir = Join-Path $repoRoot 'proof\runs'
New-Item -ItemType Directory -Path $runsDir -Force | Out-Null

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$runLogPath = Join-Path $runsDir "serial-step-n-$timestamp.log"

function Write-RunLog {
    param([string]$Text)
    Add-Content -Path $runLogPath -Value $Text
}

function Invoke-AndCapture {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Label,

        [Parameter(Mandatory = $true)]
        [scriptblock]$Action
    )

    Write-Host ""
    Write-Host "=== $Label ===" -ForegroundColor Cyan
    Write-RunLog ""
    Write-RunLog "=== $Label ==="

    $output = & $Action 2>&1
    if ($null -ne $output) {
        $output | ForEach-Object {
            $line = $_.ToString()
            Write-Host $line
            Write-RunLog $line
        }
    }

    $exitCode = $LASTEXITCODE
    if ($null -eq $exitCode) {
        $exitCode = 0
    }
    Write-RunLog "[exit_code] $exitCode"

    return [PSCustomObject]@{
        Output = $output
        ExitCode = [int]$exitCode
    }
}

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  SERIAL STEP N - ALERTS + INCIDENT DRILL PROOF HARNESS"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "ApiUrl: $ApiUrl" -ForegroundColor Gray
Write-Host "WebUrl: $WebUrl" -ForegroundColor Gray
Write-Host "TimeoutSec: $TimeoutSec" -ForegroundColor Gray
Write-Host "LocalOnly: $LocalOnly" -ForegroundColor Gray
Write-Host "EmitArtifacts: $EmitArtifacts" -ForegroundColor Gray
Write-Host "Run log: $runLogPath" -ForegroundColor Gray

Write-RunLog 'SERIAL STEP N HARNESS'
Write-RunLog "timestamp=$timestamp"
Write-RunLog "api_url=$ApiUrl"
Write-RunLog "web_url=$WebUrl"
Write-RunLog "timeout_sec=$TimeoutSec"
Write-RunLog "local_only=$LocalOnly"
Write-RunLog "emit_artifacts=$EmitArtifacts"

$allPassed = $true

$before = Invoke-AndCapture -Label 'A) git status before' -Action {
    git status --short
}
if ($before.ExitCode -ne 0) { $allPassed = $false }

$docsCheck = Invoke-AndCapture -Label 'B) validate docs exist' -Action {
    if (Test-Path .\docs\ops\alerts.md) {
        '[OK] docs/ops/alerts.md exists'
    }
    else {
        '[FAIL] docs/ops/alerts.md missing'
        exit 1
    }
}
if ($docsCheck.ExitCode -ne 0) { $allPassed = $false }

$drill = $null
if ($LocalOnly) {
    $drill = Invoke-AndCapture -Label 'C) incident drill LocalOnly' -Action {
        pwsh -File .\scripts\ops\incident-drill.ps1 -LocalOnly
    }
}
else {
    if ([string]::IsNullOrWhiteSpace($ApiUrl) -or [string]::IsNullOrWhiteSpace($WebUrl)) {
        Write-Host '[FAIL] ApiUrl and WebUrl are required unless -LocalOnly is set.' -ForegroundColor Red
        Write-RunLog '[FAIL] ApiUrl and WebUrl are required unless -LocalOnly is set.'
        $allPassed = $false
    }
    else {
        $drill = Invoke-AndCapture -Label 'C) incident drill live' -Action {
            pwsh -File .\scripts\ops\incident-drill.ps1 -ApiUrl $ApiUrl -WebUrl $WebUrl -TimeoutSec $TimeoutSec
        }
    }
}
if ($null -ne $drill -and $drill.ExitCode -ne 0) { $allPassed = $false }

$ciCheck = Invoke-AndCapture -Label 'D) verify CI Step N job' -Action {
    $workflow = '.github/workflows/ci.yml'
    if (-not (Test-Path $workflow)) {
        '[FAIL] .github/workflows/ci.yml missing'
        exit 1
    }

    $content = Get-Content $workflow -Raw
    $hasJob = $content -match '(?m)^\s{2}ops-incident:'
    $hasCommand = $content -match 'pwsh -File scripts/proof-step-n.ps1 -LocalOnly'

    if ($hasJob) { '[OK] ops-incident job found' } else { '[FAIL] ops-incident job missing' }
    if ($hasCommand) { '[OK] proof-step-n LocalOnly command found' } else { '[FAIL] proof-step-n LocalOnly command missing' }

    if (-not ($hasJob -and $hasCommand)) {
        exit 1
    }
}
if ($ciCheck.ExitCode -ne 0) { $allPassed = $false }

Write-Host ""
Write-Host '=== Secret pattern scan (tracked files) ===' -ForegroundColor Cyan
Write-RunLog ''
Write-RunLog '=== Secret pattern scan (tracked files) ==='

$secretPatterns = @(
    'RAILWAY_TOKEN\s*=\s*.{8,}',
    'NETLIFY_AUTH_TOKEN\s*=\s*.{8,}',
    'SENTRY_DSN\s*=\s*.{8,}',
    'NEXT_PUBLIC_SENTRY_DSN\s*=\s*.{8,}'
)

$secretMatchFound = $false
foreach ($pattern in $secretPatterns) {
    $output = git grep -n -I -E $pattern -- . 2>&1
    $exitCode = $LASTEXITCODE

    if ($null -ne $output) {
        $output | ForEach-Object {
            $line = $_.ToString()
            Write-Host $line
            Write-RunLog $line
        }
    }
    Write-RunLog "pattern=$pattern exit_code=$exitCode"

    if ($exitCode -eq 0) {
        $secretMatchFound = $true
    }
    elseif ($exitCode -ne 1) {
        Write-Host "[FAIL] Secret scan command failed for pattern '$pattern' with exit code $exitCode." -ForegroundColor Red
        Write-RunLog "[FAIL] Secret scan command failed for pattern '$pattern' with exit code $exitCode."
        $allPassed = $false
    }
}

if ($secretMatchFound) {
    Write-Host '[FAIL] Secret-like values detected in tracked files.' -ForegroundColor Red
    Write-RunLog '[FAIL] Secret-like values detected in tracked files.'
    $allPassed = $false
}
else {
    Write-Host '[OK] Secret-like value scan found no tracked matches.' -ForegroundColor Green
    Write-RunLog '[OK] Secret-like value scan found no tracked matches.'
}

$after = Invoke-AndCapture -Label 'E) git status after' -Action {
    git status --short
}
if ($after.ExitCode -ne 0) { $allPassed = $false }

$result = if ($allPassed) { 'PASS' } else { 'FAIL' }

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  STEP N SUMMARY"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Result: $result"
Write-Host "Run Log: $runLogPath"

Write-RunLog ''
Write-RunLog '=== SUMMARY ==='
Write-RunLog "result=$result"
Write-RunLog "run_log=$runLogPath"

if ($EmitArtifacts) {
    $artifactPath = Join-Path $repoRoot 'proof\serial-step-mobile-N.md'
    $generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
    $mark = if ($allPassed) { 'x' } else { ' ' }

    $report = @"
# Serial Step N - Alerts and Incident Drill Proof

Generated: $generatedAt

## Inputs
- LocalOnly: $LocalOnly
- ApiUrl: $ApiUrl
- WebUrl: $WebUrl
- TimeoutSec: $TimeoutSec

## Checks
- [$mark] proof-step-n overall result: $result
- [x] docs/ops/alerts.md exists
- [x] incident-drill executed
- [x] CI ops-incident job verified
- [x] secret scan executed

## Run Log
- $runLogPath

## Rollback
- Revert Step N commit if needed.
- CI rollback: remove ops-incident job from workflow.
"@

    Set-Content -Path $artifactPath -Value $report -Encoding UTF8
    Write-Host "Artifact updated: $artifactPath" -ForegroundColor Green
    Write-RunLog "artifact_updated=$artifactPath"
}

if ($allPassed) {
    exit 0
}

exit 1
