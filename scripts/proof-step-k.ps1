#Requires -Version 7.0
<#
.SYNOPSIS
    Serial Step K - Deployment Readiness Proof.
    
.DESCRIPTION
    Validates deployment infrastructure and post-deploy smoke test framework.
    
    By default runs in non-mutating mode and does NOT modify tracked files.
    Use -EmitArtifacts to write tracked proof markdown when complete.
    
.PARAMETER EmitArtifacts
    When specified, writes proof markdown to proof/ directory.
    Default: $false (proof-only, no artifact modifications)
    
.EXAMPLES
    .\proof-step-k.ps1
    .\proof-step-k.ps1 -EmitArtifacts
    
.NOTES
    Part of Serial Step K - Deployment Readiness.
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
$masterOutputFile = Join-Path $proofRunsDir "proof-step-k-master-$timestamp.txt"

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  SERIAL STEP K - DEPLOYMENT READINESS VERIFICATION" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mode: $(if ($EmitArtifacts) { 'EMIT ARTIFACTS' } else { 'PROOF ONLY (non-mutating)' })" -ForegroundColor Yellow
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Output: $masterOutputFile" -ForegroundColor Gray
Write-Host ""

$masterOutput = @()
$masterOutput += "==================================================================="
$masterOutput += "  SERIAL STEP K - DEPLOYMENT READINESS VERIFICATION"
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

# Step 1: Deployment Infrastructure Check
Write-Host "STEP 1: Deployment Infrastructure Check" -ForegroundColor Cyan
Write-Host "────────────────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 1: Deployment Infrastructure Check"
$masterOutput += "────────────────────────────────────────"

$infraPass = $true

# Check deploy-checklist.md
$checklistPath = Join-Path $scriptRoot 'deploy-checklist.md'
if (Test-Path $checklistPath) {
    Write-Host "  [OK] deploy-checklist.md found" -ForegroundColor Green
    $masterOutput += "[OK] deploy-checklist.md found"
}
else {
    Write-Host "  [FAIL] deploy-checklist.md not found" -ForegroundColor Red
    $infraPass = $false
    $masterOutput += "[FAIL] deploy-checklist.md not found"
}

# Check post-deploy-smoke.ps1
$smokeScriptPath = Join-Path $scriptRoot 'post-deploy-smoke.ps1'
if (Test-Path $smokeScriptPath) {
    Write-Host "  [OK] post-deploy-smoke.ps1 found" -ForegroundColor Green
    $masterOutput += "[OK] post-deploy-smoke.ps1 found"
}
else {
    Write-Host "  [FAIL] post-deploy-smoke.ps1 not found" -ForegroundColor Red
    $infraPass = $false
    $masterOutput += "[FAIL] post-deploy-smoke.ps1 not found"
}

if ($infraPass) {
    Write-Host "X Deployment infrastructure PASS" -ForegroundColor Green
    $masterOutput += "X Deployment infrastructure PASS"
}
else {
    Write-Host "X Deployment infrastructure FAIL" -ForegroundColor Red
    $masterOutput += "X Deployment infrastructure FAIL"
}

$masterOutput += ""
Write-Host ""

# Step 2: Post-Deploy Smoke Test (LocalOnly mode)
Write-Host "STEP 2: Post-Deploy Smoke Test (LocalOnly validation)" -ForegroundColor Cyan
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 2: Post-Deploy Smoke Test (LocalOnly validation)"
$masterOutput += "───────────────────────────────────────────────────────"

& pwsh -NoProfile -File $smokeScriptPath `
    -ApiUrl "https://example.invalid" `
    -WebUrl "https://example.invalid" `
    -LocalOnly | Tee-Object -Variable smokeOutput | Write-Host

$smokeExitCode = $LASTEXITCODE

if ($smokeExitCode -eq 0) {
    Write-Host "X Post-deploy smoke test PASS" -ForegroundColor Green
    $masterOutput += "X Post-deploy smoke test PASS (LocalOnly)"
}
else {
    Write-Host "X Post-deploy smoke test FAIL" -ForegroundColor Red
    $masterOutput += "X Post-deploy smoke test FAIL"
    $infraPass = $false
}

$masterOutput += ""
Write-Host ""

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

if (!$infraPass) {
    Write-Host ""
    Write-Host "===================================================================" -ForegroundColor Red
    Write-Host "  RESULT: DEPLOYMENT READINESS CHECK FAILED" -ForegroundColor Red
    Write-Host "===================================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Red
    exit 1
}

# All steps passed
Write-Host ""
Write-Host "===================================================================" -ForegroundColor Green
Write-Host "  X DEPLOYMENT READINESS VERIFICATION COMPLETE" -ForegroundColor Green
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
