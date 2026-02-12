#Requires -Version 7.0
<#
.SYNOPSIS
    Release gate quality checks.
    
.DESCRIPTION
    Verifies release readiness:
    - VERSION file exists
    - Git working tree is clean
    - Production builds pass
    - Security scan passes (local mode)
    - CI configuration is complete
    
.EXAMPLES
    .\release-check.ps1
    
.NOTES
    Fail-fast on any error. Part of Step J - Release Packaging.
#>

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$factoryRoot = Split-Path -Parent $PSScriptRoot
$allPassed = $true

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  RELEASE GATE QUALITY CHECKS"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: VERSION file
Write-Host "CHECK 1: VERSION file" -ForegroundColor Cyan
Write-Host "──────────────────────"
$versionFile = Join-Path $factoryRoot 'VERSION'
if (!(Test-Path $versionFile)) {
    Write-Host "X FAIL: VERSION file not found" -ForegroundColor Red
    $allPassed = $false
}
else {
    $version = (Get-Content $versionFile -Raw).Trim()
    Write-Host "X PASS: VERSION = $version" -ForegroundColor Green
}
Write-Host ""

if (!$allPassed) {
    exit 1
}

# Check 2: Git working tree clean
Write-Host "CHECK 2: Git working tree" -ForegroundColor Cyan
Write-Host "──────────────────────────"
Push-Location $factoryRoot
try {
    $gitStatus = git status --porcelain
}
finally {
    Pop-Location
}

if ($gitStatus) {
    Write-Host "X FAIL: Git working tree is not clean" -ForegroundColor Red
    Write-Host "  Modified files:" -ForegroundColor Red
    $gitStatus | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    $allPassed = $false
}
else {
    Write-Host "X PASS: Git working tree is clean" -ForegroundColor Green
}
Write-Host ""

if (!$allPassed) {
    exit 1
}

# Check 3: API production build
Write-Host "CHECK 3: API production build" -ForegroundColor Cyan
Write-Host "───────────────────────────────"
$apiBuildScript = Join-Path $factoryRoot 'scripts' 'build-api-prod.ps1'
$apiOutput = & pwsh -NoProfile -File $apiBuildScript 2>&1
$apiExitCode = $LASTEXITCODE

if ($apiExitCode -ne 0) {
    Write-Host "X FAIL: API production build failed" -ForegroundColor Red
    $apiOutput | Write-Host
    $allPassed = $false
}
else {
    $distBuildInfo = Join-Path $factoryRoot 'api' 'dist' 'build-info.json'
    if (!(Test-Path $distBuildInfo)) {
        Write-Host "X FAIL: API build-info.json not found" -ForegroundColor Red
        $allPassed = $false
    }
    else {
        Write-Host "X PASS: API production build succeeded" -ForegroundColor Green
        Write-Host "  build-info.json verified" -ForegroundColor Green
    }
}
Write-Host ""

if (!$allPassed) {
    exit 1
}

# Check 4: Web production build
Write-Host "CHECK 4: Web production build" -ForegroundColor Cyan
Write-Host "───────────────────────────────"
$webBuildScript = Join-Path $factoryRoot 'scripts' 'build-web-prod.ps1'
$webOutput = & pwsh -NoProfile -File $webBuildScript 2>&1
$webExitCode = $LASTEXITCODE

if ($webExitCode -ne 0) {
    Write-Host "X FAIL: Web production build failed" -ForegroundColor Red
    $webOutput | Write-Host
    $allPassed = $false
}
else {
    $nextBuildInfo = Join-Path $factoryRoot 'web' '.next' 'build-info.json'
    if (!(Test-Path $nextBuildInfo)) {
        Write-Host "X FAIL: Web build-info.json not found" -ForegroundColor Red
        $allPassed = $false
    }
    else {
        Write-Host "X PASS: Web production build succeeded" -ForegroundColor Green
        Write-Host "  build-info.json verified" -ForegroundColor Green
    }
}
Write-Host ""

if (!$allPassed) {
    exit 1
}

# Check 5: Security baseline
Write-Host "CHECK 5: Security baseline scan" -ForegroundColor Cyan
Write-Host "─────────────────────────────────"
$securityScript = Join-Path $factoryRoot 'scripts' 'security-scan.ps1'
$secOutput = & pwsh -NoProfile -File $securityScript 2>&1
$secExitCode = $LASTEXITCODE

if ($secExitCode -ne 0) {
    Write-Host "X FAIL: Security scan reported issues" -ForegroundColor Red
    $allPassed = $false
}
else {
    Write-Host "X PASS: Security baseline scan passed" -ForegroundColor Green
}
Write-Host ""

if (!$allPassed) {
    exit 1
}

# Check 6: CI configuration
Write-Host "CHECK 6: CI configuration" -ForegroundColor Cyan
Write-Host "──────────────────────────"
$ciFile = Join-Path $factoryRoot '.github' 'workflows' 'ci.yml'
if (!(Test-Path $ciFile)) {
    Write-Host "X FAIL: CI workflow not found" -ForegroundColor Red
    $allPassed = $false
}
else {
    $ciContent = Get-Content $ciFile -Raw
    $hasSecurityJob = $ciContent -match 'security:'
    $hasProductionBuild = $ciContent -match 'production-build:'
    
    if (!$hasSecurityJob) {
        Write-Host "X FAIL: CI workflow missing security job" -ForegroundColor Red
        $allPassed = $false
    }
    elseif (!$hasProductionBuild) {
        Write-Host "X FAIL: CI workflow missing production-build job" -ForegroundColor Red
        $allPassed = $false
    }
    else {
        Write-Host "X PASS: CI configuration verified" -ForegroundColor Green
        Write-Host "  security job present" -ForegroundColor Green
        Write-Host "  production-build job present" -ForegroundColor Green
    }
}
Write-Host ""

# Final result
Write-Host "===================================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  RESULT: READY FOR RELEASE" -ForegroundColor Green
    Write-Host "===================================================================" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "  RESULT: RELEASE GATE FAILED" -ForegroundColor Red
    Write-Host "===================================================================" -ForegroundColor Red
    exit 1
}
