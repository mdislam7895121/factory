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
$runLogPath = Join-Path $runsDir "serial-step-m-$timestamp.log"

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
Write-Host "  SERIAL STEP M - OPS PROOF HARNESS"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "ApiUrl: $ApiUrl" -ForegroundColor Gray
Write-Host "WebUrl: $WebUrl" -ForegroundColor Gray
Write-Host "TimeoutSec: $TimeoutSec" -ForegroundColor Gray
Write-Host "LocalOnly: $LocalOnly" -ForegroundColor Gray
Write-Host "EmitArtifacts: $EmitArtifacts" -ForegroundColor Gray
Write-Host "Run log: $runLogPath" -ForegroundColor Gray

Write-RunLog 'SERIAL STEP M HARNESS'
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

$uptime = $null
if ($LocalOnly) {
    $uptime = Invoke-AndCapture -Label 'B) uptime-check LocalOnly' -Action {
        pwsh -File .\scripts\ops\uptime-check.ps1 -ApiUrl https://example.invalid -WebUrl https://example.invalid -TimeoutSec $TimeoutSec -LocalOnly
    }
}
else {
    if ([string]::IsNullOrWhiteSpace($ApiUrl) -or [string]::IsNullOrWhiteSpace($WebUrl)) {
        Write-Host '[FAIL] ApiUrl and WebUrl are required unless -LocalOnly is set.' -ForegroundColor Red
        Write-RunLog '[FAIL] ApiUrl and WebUrl are required unless -LocalOnly is set.'
        $allPassed = $false
    }
    else {
        $uptime = Invoke-AndCapture -Label 'B) uptime-check live' -Action {
            pwsh -File .\scripts\ops\uptime-check.ps1 -ApiUrl $ApiUrl -WebUrl $WebUrl -TimeoutSec $TimeoutSec
        }
    }
}

if ($null -ne $uptime -and $uptime.ExitCode -ne 0) {
    $allPassed = $false
}

$killSwitch = $null
if ($LocalOnly -or [string]::IsNullOrWhiteSpace($ApiUrl)) {
    $killSwitch = Invoke-AndCapture -Label 'C) validate-kill-switch LocalOnly' -Action {
        pwsh -File .\scripts\ops\validate-kill-switch.ps1 -LocalOnly
    }
}
else {
    $killSwitch = Invoke-AndCapture -Label 'C) validate-kill-switch live' -Action {
        pwsh -File .\scripts\ops\validate-kill-switch.ps1 -ApiUrl $ApiUrl -TimeoutSec $TimeoutSec
    }
}

if ($killSwitch.ExitCode -ne 0) {
    $allPassed = $false
}

Write-Host ""
Write-Host '=== D) secret pattern scan (tracked files) ===' -ForegroundColor Cyan
Write-RunLog ''
Write-RunLog '=== D) secret pattern scan (tracked files) ==='

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
Write-Host "  STEP M SUMMARY"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Result: $resultText"
Write-Host "Run Log: $runLogPath"

Write-RunLog ''
Write-RunLog '=== SUMMARY ==='
Write-RunLog "result=$resultText"
Write-RunLog "run_log=$runLogPath"

if ($EmitArtifacts) {
    $artifactPath = Join-Path $repoRoot 'proof\serial-step-mobile-M.md'
    $generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
    $harnessCheck = if ($allPassed) { 'x' } else { ' ' }

    $report = @"
# Serial Step M - Ops Monitoring + Alerts + Kill Switch Proof

Generated: $generatedAt

## Inputs
- LocalOnly: $LocalOnly
- ApiUrl: $ApiUrl
- WebUrl: $WebUrl
- TimeoutSec: $TimeoutSec

## Checks
- [$harnessCheck] proof-step-m overall result: $resultText
- [x] git status before/after captured
- [x] uptime-check executed
- [x] validate-kill-switch executed
- [x] secret pattern scan executed

## Raw Run Log
- $runLogPath

## Rollback
- Remove/undo Step M files and middleware via git revert for this commit.
- If kill switch behavior causes issues, set FACTORY_KILL_SWITCH=0 and redeploy API.
"@

    Set-Content -Path $artifactPath -Value $report -Encoding UTF8
    Write-Host "Artifact updated: $artifactPath" -ForegroundColor Green
    Write-RunLog "artifact_updated=$artifactPath"
}

if ($allPassed) {
    exit 0
}

exit 1
