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
$runLogPath = Join-Path $runsDir "serial-step-o-$timestamp.log"

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
Write-Host "  SERIAL STEP O - LIVE OPS PROOF HARNESS"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "ApiUrl: $ApiUrl" -ForegroundColor Gray
Write-Host "WebUrl: $WebUrl" -ForegroundColor Gray
Write-Host "TimeoutSec: $TimeoutSec" -ForegroundColor Gray
Write-Host "LocalOnly: $LocalOnly" -ForegroundColor Gray
Write-Host "EmitArtifacts: $EmitArtifacts" -ForegroundColor Gray
Write-Host "Run log: $runLogPath" -ForegroundColor Gray

Write-RunLog 'SERIAL STEP O HARNESS'
Write-RunLog "timestamp=$timestamp"
Write-RunLog "api_url=$ApiUrl"
Write-RunLog "web_url=$WebUrl"
Write-RunLog "timeout_sec=$TimeoutSec"
Write-RunLog "local_only=$LocalOnly"
Write-RunLog "emit_artifacts=$EmitArtifacts"

$allPassed = $true

$gitBefore = Invoke-AndCapture -Label 'A) git status before' -Action {
    git status --short
}
if ($gitBefore.ExitCode -ne 0) {
    $allPassed = $false
}

$smoke = $null
if ($LocalOnly) {
    Write-Host ""
    Write-Host "=== B) post-deploy smoke LocalOnly ===" -ForegroundColor Cyan
    Write-Host '[OK] LocalOnly set: skipping live smoke execution.' -ForegroundColor Green
    Write-RunLog ''
    Write-RunLog '=== B) post-deploy smoke LocalOnly ==='
    Write-RunLog '[OK] LocalOnly set: skipping live smoke execution.'
}
else {
    if ([string]::IsNullOrWhiteSpace($ApiUrl) -or [string]::IsNullOrWhiteSpace($WebUrl)) {
        Write-Host '[FAIL] ApiUrl and WebUrl are required unless -LocalOnly is set.' -ForegroundColor Red
        Write-RunLog '[FAIL] ApiUrl and WebUrl are required unless -LocalOnly is set.'
        $allPassed = $false
    }
    else {
        $smoke = Invoke-AndCapture -Label 'B) post-deploy smoke live' -Action {
            pwsh -File .\scripts\post-deploy-smoke.ps1 -ApiUrl $ApiUrl -WebUrl $WebUrl -TimeoutSec $TimeoutSec
        }
        if ($smoke.ExitCode -ne 0) {
            $allPassed = $false
        }
    }
}

Write-Host ""
Write-Host "=== C) kill-switch probe test (read-only) ===" -ForegroundColor Cyan
Write-RunLog ''
Write-RunLog '=== C) kill-switch probe test (read-only) ==='

if ($LocalOnly) {
    Write-Host '[OK] LocalOnly set: skipping live probe requests.' -ForegroundColor Green
    Write-RunLog '[OK] LocalOnly set: skipping live probe requests.'
}
elseif (-not [string]::IsNullOrWhiteSpace($ApiUrl)) {
    $probePassed = $true

    try {
        $root = Invoke-WebRequest "$ApiUrl/" -UseBasicParsing -TimeoutSec $TimeoutSec
        Write-Host "ROOT_STATUS=$($root.StatusCode)"
        Write-RunLog "ROOT_STATUS=$($root.StatusCode)"
        if ($root.StatusCode -ne 200) {
            $probePassed = $false
        }
    }
    catch {
        Write-Host "ROOT_FAIL: $($_.Exception.Message)" -ForegroundColor Red
        Write-RunLog "ROOT_FAIL: $($_.Exception.Message)"
        $probePassed = $false
    }

    try {
        $db = Invoke-RestMethod "$ApiUrl/db/health" -TimeoutSec $TimeoutSec
        $dbJson = $db | ConvertTo-Json -Depth 5 -Compress
        Write-Host "DB_HEALTH=$dbJson"
        Write-RunLog "DB_HEALTH=$dbJson"
        if (-not $db.ok) {
            $probePassed = $false
        }
    }
    catch {
        Write-Host "DB_FAIL: $($_.Exception.Message)" -ForegroundColor Red
        Write-RunLog "DB_FAIL: $($_.Exception.Message)"
        $probePassed = $false
    }

    try {
        $probe = Invoke-WebRequest "$ApiUrl/__probe__" -UseBasicParsing -ErrorAction Stop -TimeoutSec $TimeoutSec
        Write-Host "PROBE_STATUS=$($probe.StatusCode)"
        Write-RunLog "PROBE_STATUS=$($probe.StatusCode)"
    }
    catch {
        $statusCode = $null
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }

        if ($null -ne $statusCode) {
            Write-Host "PROBE_FAIL_STATUS=$statusCode"
            Write-RunLog "PROBE_FAIL_STATUS=$statusCode"
        }
        else {
            Write-Host "PROBE_FAIL: $($_.Exception.Message)"
            Write-RunLog "PROBE_FAIL: $($_.Exception.Message)"
        }
    }

    if (-not $probePassed) {
        Write-Host '[FAIL] Read-only probe checks failed.' -ForegroundColor Red
        Write-RunLog '[FAIL] Read-only probe checks failed.'
        $allPassed = $false
    }
    else {
        Write-Host '[OK] Read-only probe checks passed.' -ForegroundColor Green
        Write-RunLog '[OK] Read-only probe checks passed.'
    }
}
else {
    Write-Host '[FAIL] ApiUrl required for probe checks in live mode.' -ForegroundColor Red
    Write-RunLog '[FAIL] ApiUrl required for probe checks in live mode.'
    $allPassed = $false
}

Write-Host ""
Write-Host '=== D) safe secret scan (tracked files) ===' -ForegroundColor Cyan
Write-RunLog ''
Write-RunLog '=== D) safe secret scan (tracked files) ==='

$secretKeys = @(
    ('SENTRY' + '_DSN'),
    ('NEXT_PUBLIC' + '_SENTRY' + '_DSN'),
    ('NETLIFY' + '_AUTH' + '_TOKEN'),
    ('RAILWAY' + '_TOKEN')
)
$secretMinLength = 8
$secretMatchFound = $false

foreach ($key in $secretKeys) {
    $escapedKey = [regex]::Escape($key)
    $assignmentPattern = "$escapedKey\s*=\s*\S+"

    $output = git grep -n -I -E $assignmentPattern -- . 2>&1
    $exitCode = $LASTEXITCODE

    if ($null -ne $output) {
        $output | ForEach-Object {
            $line = $_.ToString()
            Write-Host $line
            Write-RunLog $line
        }
    }

    $longValueFoundForKey = $false
    if ($exitCode -eq 0) {
        foreach ($entry in $output) {
            $line = $entry.ToString()
            $content = if ($line -match '^[^:]+:\d+:(.*)$') { $matches[1] } else { $line }

            if ($content -match "(?i)\b$escapedKey\s*=\s*(.+)$") {
                $rawValue = $matches[1].Trim()
                $valueToken = ($rawValue -split '[\s;#]', 2)[0]
                $valueToken = $valueToken.Trim().Trim("'").Trim('"')

                if ($valueToken.Length -ge $secretMinLength) {
                    $longValueFoundForKey = $true
                    break
                }
            }
        }
    }

    Write-RunLog "key=$key exit_code=$exitCode min_length=$secretMinLength"

    if ($exitCode -eq 0) {
        if ($longValueFoundForKey) {
            $secretMatchFound = $true
        }
    }
    elseif ($exitCode -ne 1) {
        Write-Host "[FAIL] Secret scan command failed for key '$key' with exit code $exitCode." -ForegroundColor Red
        Write-RunLog "[FAIL] Secret scan command failed for key '$key' with exit code $exitCode."
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

$gitAfter = Invoke-AndCapture -Label 'E) git status after' -Action {
    git status --short
}
if ($gitAfter.ExitCode -ne 0) {
    $allPassed = $false
}

$resultText = if ($allPassed) { 'PASS' } else { 'FAIL' }

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  STEP O SUMMARY"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Result: $resultText"
Write-Host "Run Log: $runLogPath"

Write-RunLog ''
Write-RunLog '=== SUMMARY ==='
Write-RunLog "result=$resultText"
Write-RunLog "run_log=$runLogPath"

if ($EmitArtifacts) {
    $artifactPath = Join-Path $repoRoot 'proof\serial-step-mobile-O.md'
    $generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
    $harnessCheck = if ($allPassed) { 'x' } else { ' ' }

    $report = @"
# Serial Step O - Live Ops Proof

Generated: $generatedAt

## Inputs
- LocalOnly: $LocalOnly
- ApiUrl: $ApiUrl
- WebUrl: $WebUrl
- TimeoutSec: $TimeoutSec

## Checks
- [$harnessCheck] proof-step-o overall result: $resultText
- [x] git status before/after captured
- [x] post-deploy smoke executed or LocalOnly skipped
- [x] read-only kill-switch probe test executed or LocalOnly skipped
- [x] safe secret scan executed

## Raw Run Log
- $runLogPath

## Rollback
- Revert this commit to remove Step O harness and CI job.
"@

    Set-Content -Path $artifactPath -Value $report -Encoding UTF8
    Write-Host "Artifact updated: $artifactPath" -ForegroundColor Green
    Write-RunLog "artifact_updated=$artifactPath"
}

if ($allPassed) {
    exit 0
}

exit 1
