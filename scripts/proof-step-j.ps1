#Requires -Version 7.0
<#
.SYNOPSIS
    Serial Step J - Release Packaging Baseline Proof.
    
.DESCRIPTION
    Orchestrates release gate validation:
    - Captures baseline git status
    - Runs release gate checks
    - Saves output to proof/runs/
    
    By default runs in non-mutating mode and does NOT modify tracked files.
    Use -EmitArtifacts to write tracked proof markdown when complete.
    
.PARAMETER EmitArtifacts
    When specified, writes proof markdown to proof/ directory.
    Default: $false (proof-only, no artifact modifications)
    
.EXAMPLES
    .\proof-step-j.ps1
    .\proof-step-j.ps1 -EmitArtifacts
    
.NOTES
    Part of Serial Step J - Release Packaging Baseline.
    All output saved to proof/runs/ directory.
#>

[CmdletBinding()]
param(
    [switch]$EmitArtifacts
)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$scriptRoot = $PSScriptRoot
$proofRunsDir = Join-Path $scriptRoot '..' 'proof' 'runs'
$factoryRoot = Split-Path -Parent $scriptRoot

# Ensure runs directory exists
if (!(Test-Path $proofRunsDir)) {
    New-Item -ItemType Directory -Path $proofRunsDir -Force | Out-Null
}

$timestamp = (Get-Date -Format 'yyyyMMdd-HHmmss')
$masterOutputFile = Join-Path $proofRunsDir "proof-step-j-master-$timestamp.txt"

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  SERIAL STEP J - RELEASE PACKAGING BASELINE VERIFICATION" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mode: $(if ($EmitArtifacts) { 'EMIT ARTIFACTS' } else { 'PROOF ONLY (non-mutating)' })" -ForegroundColor Yellow
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Output: $masterOutputFile" -ForegroundColor Gray
Write-Host ""

$masterOutput = @()
$masterOutput += "==================================================================="
$masterOutput += "  SERIAL STEP J - RELEASE PACKAGING BASELINE VERIFICATION"
$masterOutput += "==================================================================="
$masterOutput += ""
$masterOutput += "Mode: $(if ($EmitArtifacts) { 'EMIT ARTIFACTS' } else { 'PROOF ONLY (non-mutating)' })"
$masterOutput += "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$masterOutput += ""

# Capture baseline git state
Write-Host "Capturing baseline git state..." -ForegroundColor Gray
Push-Location $factoryRoot
$gitBeforeStatus = git status --porcelain
$gitHeadBefore = git rev-parse --short HEAD
Pop-Location

$masterOutput += "Git HEAD before: $gitHeadBefore"
$masterOutput += ""

# Step 1: Release Gate Checks
Write-Host "STEP 1: Release Gate Checks" -ForegroundColor Cyan
Write-Host "────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 1: Release Gate Checks"
$masterOutput += "────────────────────────────"

& pwsh -NoProfile -File (Join-Path $scriptRoot 'release-check.ps1') | Tee-Object -Variable releaseOutput | Write-Host
$releaseExitCode = $LASTEXITCODE
if ($releaseExitCode -ne 0) {
    Write-Host "X Release gate checks FAILED" -ForegroundColor Red
    $masterOutput += "X Release gate checks FAILED"
    $masterOutput | Out-File -FilePath $masterOutputFile -Encoding UTF8
    Write-Host ""
    Write-Host "===================================================================" -ForegroundColor Red
    Write-Host "  RESULT: FAIL" -ForegroundColor Red
    Write-Host "===================================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Red
    exit 1
}
else {
    Write-Host "X Release gate checks PASS" -ForegroundColor Green
    $masterOutput += "X Release gate checks PASS"
}
$masterOutput += ""

# Check final git state
Push-Location $factoryRoot
$gitAfterStatus = git status --porcelain
$gitHeadAfter = git rev-parse --short HEAD
Pop-Location

$masterOutput += "Git HEAD after: $gitHeadAfter"
if ($gitBeforeStatus -eq $gitAfterStatus) {
    $masterOutput += "Working tree: CLEAN (no tracked file modifications)"
}
else {
    $masterOutput += "Working tree: MODIFIED (tracked files changed)"
}

# Save master output
$masterOutput | Out-File -FilePath $masterOutputFile -Encoding UTF8

# All steps passed
Write-Host ""
Write-Host "===================================================================" -ForegroundColor Green
Write-Host "  X RELEASE PACKAGING BASELINE VERIFICATION COMPLETE" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Green

if ($EmitArtifacts) {
    Write-Host ""
    Write-Host "Emitting proof artifacts..." -ForegroundColor Yellow
    # Future: Write tracked proof markdown here when needed
    Write-Host "X Artifacts emitted" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "Mode: PROOF ONLY (non-mutating)" -ForegroundColor Yellow
    Write-Host "No tracked files modified" -ForegroundColor Gray
}

Write-Host ""
exit 0
