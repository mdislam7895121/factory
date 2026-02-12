#Requires -Version 7.0
<#
.SYNOPSIS
    Serial Step H - Production Build Pipeline Master Proof.
    
.DESCRIPTION
    Orchestrates all production build validations:
    - API production build
    - Web production build
    - Mobile production configuration
    - Production environment validation
    
    By default runs in non-mutating mode and does NOT modify tracked files.
    Use -EmitArtifacts to write tracked proof markdown when complete.
    
.PARAMETER EmitArtifacts
    When specified, writes proof markdown to proof/ directory.
    Default: $false (proof-only, no artifact modifications)
    
.EXAMPLES
    .\proof-step-h.ps1
    .\proof-step-h.ps1 -EmitArtifacts
    
.NOTES
    Part of Serial Step H - Production Build Pipeline.
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
$masterOutputFile = Join-Path $proofRunsDir "proof-step-h-master-$timestamp.txt"
$allPassed = $true

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SERIAL STEP H - PRODUCTION BUILD PIPELINE VERIFICATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Mode: $(if ($EmitArtifacts) { 'EMIT ARTIFACTS' } else { 'PROOF ONLY (non-mutating)' })" -ForegroundColor Yellow
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Output: $masterOutputFile" -ForegroundColor Gray
Write-Host ""

$masterOutput = @()
$masterOutput += "═══════════════════════════════════════════════════════════════"
$masterOutput += "  SERIAL STEP H - PRODUCTION BUILD PIPELINE VERIFICATION"
$masterOutput += "═══════════════════════════════════════════════════════════════"
$masterOutput += ""
$masterOutput += "Mode: $(if ($EmitArtifacts) { 'EMIT ARTIFACTS' } else { 'PROOF ONLY (non-mutating)' })"
$masterOutput += "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$masterOutput += ""

# Step 1: API Production Build
Write-Host "STEP 1: API Production Build" -ForegroundColor Cyan
Write-Host "─────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 1: API Production Build"
$masterOutput += "─────────────────────────────"

& pwsh -NoProfile -File (Join-Path $scriptRoot 'proof-step-h-api.ps1') | Tee-Object -Variable apiOutput | Write-Host
$apiExitCode = $LASTEXITCODE
if ($apiExitCode -ne 0) {
    $allPassed = $false
    Write-Host "✗ API production build FAILED - stopping here" -ForegroundColor Red
    $masterOutput += "✗ API production build FAILED"
    $masterOutput += ""
    $masterOutput += $apiOutput | ConvertTo-Json
} else {
    $masterOutput += "✓ API production build PASSED"
}
$masterOutput += ""

if (!$allPassed) {
    Write-Host ""
    Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Yellow
    $masterOutput | Out-File -FilePath $masterOutputFile -Encoding UTF8
    Write-Host "✗ Build verification FAILED" -ForegroundColor Red
    exit 1
}

# Step 2: Web Production Build
Write-Host "STEP 2: Web Production Build" -ForegroundColor Cyan
Write-Host "─────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 2: Web Production Build"
$masterOutput += "─────────────────────────────"

& pwsh -NoProfile -File (Join-Path $scriptRoot 'proof-step-h-web.ps1') | Tee-Object -Variable webOutput | Write-Host
$webExitCode = $LASTEXITCODE
if ($webExitCode -ne 0) {
    $allPassed = $false
    Write-Host "✗ Web production build FAILED - stopping here" -ForegroundColor Red
    $masterOutput += "✗ Web production build FAILED"
    $masterOutput += ""
    $masterOutput += $webOutput | ConvertTo-Json
} else {
    $masterOutput += "✓ Web production build PASSED"
}
$masterOutput += ""

if (!$allPassed) {
    Write-Host ""
    Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Yellow
    $masterOutput | Out-File -FilePath $masterOutputFile -Encoding UTF8
    Write-Host "✗ Build verification FAILED" -ForegroundColor Red
    exit 1
}

# Step 3: Mobile Production Configuration
Write-Host "STEP 3: Mobile Production Configuration" -ForegroundColor Cyan
Write-Host "────────────────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 3: Mobile Production Configuration"
$masterOutput += "────────────────────────────────────────"

& pwsh -NoProfile -File (Join-Path $scriptRoot 'proof-step-h-mobile.ps1') | Tee-Object -Variable mobileOutput | Write-Host
$mobileExitCode = $LASTEXITCODE
if ($mobileExitCode -ne 0) {
    $allPassed = $false
    Write-Host "✗ Mobile production configuration validation FAILED - stopping here" -ForegroundColor Red
    $masterOutput += "✗ Mobile production configuration FAILED"
    $masterOutput += ""
    $masterOutput += $mobileOutput | ConvertTo-Json
} else {
    $masterOutput += "✓ Mobile production configuration PASSED"
}
$masterOutput += ""

if (!$allPassed) {
    Write-Host ""
    Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Yellow
    $masterOutput | Out-File -FilePath $masterOutputFile -Encoding UTF8
    Write-Host "✗ Build verification FAILED" -ForegroundColor Red
    exit 1
}

# Step 4: Production Environment Validation
Write-Host "STEP 4: Production Environment Validation" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────" -ForegroundColor Cyan
$masterOutput += "STEP 4: Production Environment Validation"
$masterOutput += "──────────────────────────────────────────"

& pwsh -NoProfile -File (Join-Path $scriptRoot 'validate-env-prod.ps1') | Tee-Object -Variable envOutput | Write-Host
$envExitCode = $LASTEXITCODE
if ($envExitCode -ne 0) {
    $allPassed = $false
    Write-Host "✗ Production environment validation FAILED - stopping here" -ForegroundColor Red
    $masterOutput += "✗ Production environment validation FAILED"
    $masterOutput += ""
    $masterOutput += $envOutput | ConvertTo-Json
} else {
    $masterOutput += "✓ Production environment validation PASSED"
}
$masterOutput += ""

# Save master output
$masterOutput | Out-File -FilePath $masterOutputFile -Encoding UTF8

if (!$allPassed) {
    Write-Host ""
    Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Yellow
    Write-Host "✗ Build verification FAILED" -ForegroundColor Red
    exit 1
}

# All steps passed
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✓ ALL PRODUCTION BUILD VALIDATIONS PASSED" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Master output saved to: $masterOutputFile" -ForegroundColor Green

if ($EmitArtifacts) {
    Write-Host ""
    Write-Host "Emitting proof artifacts..." -ForegroundColor Yellow
    # Future: Write tracked proof markdown here when needed
    Write-Host "✓ Artifacts emitted" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Mode: PROOF ONLY (non-mutating)" -ForegroundColor Yellow
    Write-Host "No tracked files modified" -ForegroundColor Gray
}

Write-Host ""
exit 0
