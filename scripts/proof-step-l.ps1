#Requires -Version 7.0

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ApiUrl,

    [Parameter(Mandatory = $true)]
    [string]$WebUrl,

    [int]$TimeoutSec = 20,

    [switch]$EmitArtifacts
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$runsDir = Join-Path $repoRoot 'proof\runs'
New-Item -ItemType Directory -Path $runsDir -Force | Out-Null

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$runLogPath = Join-Path $runsDir "serial-step-l-$timestamp.log"

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
        Output   = $output
        ExitCode = [int]$exitCode
    }
}

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  SERIAL STEP L - PRODUCTION PROOF HARNESS"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "ApiUrl: $ApiUrl" -ForegroundColor Gray
Write-Host "WebUrl: $WebUrl" -ForegroundColor Gray
Write-Host "TimeoutSec: $TimeoutSec" -ForegroundColor Gray
Write-Host "EmitArtifacts: $EmitArtifacts" -ForegroundColor Gray
Write-Host "Run log: $runLogPath" -ForegroundColor Gray

Write-RunLog "SERIAL STEP L HARNESS"
Write-RunLog "timestamp=$timestamp"
Write-RunLog "api_url=$ApiUrl"
Write-RunLog "web_url=$WebUrl"
Write-RunLog "timeout_sec=$TimeoutSec"
Write-RunLog "emit_artifacts=$EmitArtifacts"

$allPassed = $true
$railwayStatus = 'SKIPPED'

$gitBaseline = Invoke-AndCapture -Label 'A) git status baseline' -Action {
    git status --short
}
if ($gitBaseline.ExitCode -ne 0) {
    $allPassed = $false
}

$smoke = Invoke-AndCapture -Label 'B) post-deploy smoke' -Action {
    pwsh -File .\scripts\post-deploy-smoke.ps1 -ApiUrl $ApiUrl -WebUrl $WebUrl -TimeoutSec $TimeoutSec
}
if ($smoke.ExitCode -ne 0) {
    $allPassed = $false
}

$railway = Invoke-AndCapture -Label 'C) railway status (best-effort)' -Action {
    railway status
}

$railwayText = ($railway.Output | ForEach-Object { $_.ToString() }) -join "`n"
if ($railway.ExitCode -eq 0) {
    $railwayStatus = 'OK'
}
elseif ($railwayText -match 'Invalid RAILWAY_TOKEN|Not logged in|not authenticated|Unable to authenticate') {
    $railwayStatus = 'WARN_NOT_AUTHENTICATED'
    Write-Host 'WARN: Railway CLI not authenticated in this shell. Continuing without failing run.' -ForegroundColor Yellow
    Write-RunLog 'WARN: Railway CLI not authenticated in this shell. Continued by design.'
}
else {
    $railwayStatus = 'WARN_FAILED'
    Write-Host 'WARN: railway status failed; continuing by design.' -ForegroundColor Yellow
    Write-RunLog 'WARN: railway status failed; continued by design.'
}

$resultText = if ($allPassed) { 'PASS' } else { 'FAIL' }

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  STEP L SUMMARY"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Result: $resultText"
Write-Host "Smoke ExitCode: $($smoke.ExitCode)"
Write-Host "Railway Status Check: $railwayStatus"
Write-Host "Run Log: $runLogPath"

Write-RunLog ""
Write-RunLog '=== SUMMARY ==='
Write-RunLog "result=$resultText"
Write-RunLog "smoke_exit_code=$($smoke.ExitCode)"
Write-RunLog "railway_status_check=$railwayStatus"
Write-RunLog "run_log=$runLogPath"

if ($EmitArtifacts) {
    $artifactPath = Join-Path $repoRoot 'proof\serial-step-mobile-L.md'
    $harnessCheck = if ($allPassed) { 'x' } else { ' ' }
    $smokeCheck = if ($smoke.ExitCode -eq 0) { 'x' } else { ' ' }
    $railwayCheck = if ($railwayStatus -eq 'OK' -or $railwayStatus -like 'WARN*') { 'x' } else { ' ' }
    $generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'

    $report = @"
# Serial Step L - Production Proof Pack

Generated: $generatedAt

## Live URLs
- API: $ApiUrl
- WEB: $WebUrl

## Commands (PowerShell)
- `git status --short`
- `pwsh -File .\scripts\proof-step-l.ps1 -ApiUrl $ApiUrl -WebUrl $WebUrl -TimeoutSec $TimeoutSec`
- `railway status`

## Raw Output Excerpts
- Result: $resultText
- Smoke ExitCode: $($smoke.ExitCode)
- Railway Status Check: $railwayStatus
- Raw run log: $runLogPath

## Definition of Done
- [$harnessCheck] Harness executed against live URLs
- [$smokeCheck] post-deploy-smoke passed
- [$railwayCheck] railway status check executed (best-effort)
- [x] Raw log saved under proof/runs/

## Rollback Notes
- Railway: Dashboard -> service Deployments -> select previous healthy deployment -> Redeploy.
- Netlify: Site Deployments -> select previous successful deploy -> Publish deploy.
"@

    Set-Content -Path $artifactPath -Value $report -Encoding UTF8
    Write-Host "Artifact updated: $artifactPath" -ForegroundColor Green
    Write-RunLog "artifact_updated=$artifactPath"
}

if ($allPassed) {
    exit 0
}

exit 1
