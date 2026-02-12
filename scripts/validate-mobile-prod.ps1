#Requires -Version 7.0
<#
.SYNOPSIS
    Production validation script for Factory Mobile (Expo).
    
.DESCRIPTION
    Validates mobile app configuration for production builds.
    Checks app.json, eas.json, and Expo SDK version.
    
.EXAMPLES
    .\validate-mobile-prod.ps1
    
.NOTES
    Non-mutating. Exits with appropriate status codes.
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$mobileRoot = Join-Path $PSScriptRoot '..' 'mobile'
$appJsonPath = Join-Path $mobileRoot 'app.json'
$easJsonPath = Join-Path $mobileRoot 'eas.json'
$packageJsonPath = Join-Path $mobileRoot 'package.json'

Write-Host "Validating Mobile Production Configuration..." -ForegroundColor Cyan

# Check app.json
Write-Host "Checking app.json..." -ForegroundColor Gray
if (!(Test-Path $appJsonPath)) {
    throw "app.json not found at $appJsonPath"
}
Write-Host "✓ app.json found" -ForegroundColor Green

# Check eas.json
Write-Host "Checking eas.json..." -ForegroundColor Gray
if (!(Test-Path $easJsonPath)) {
    throw "eas.json not found at $easJsonPath"
}
Write-Host "✓ eas.json found" -ForegroundColor Green

# Validate app.json JSON
Write-Host "Validating app.json syntax..." -ForegroundColor Gray
try {
    $appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json
}
catch {
    throw "Invalid JSON syntax in app.json: $_"
}

# Check Expo config
if (!$appJson.expo) {
    throw "Missing 'expo' section in app.json"
}
Write-Host "✓ app.json has valid expo config" -ForegroundColor Green

# Validate eas.json JSON
Write-Host "Validating eas.json syntax..." -ForegroundColor Gray
try {
    $easJson = Get-Content $easJsonPath -Raw | ConvertFrom-Json
}
catch {
    throw "Invalid JSON syntax in eas.json: $_"
}

# Check build profiles
if (!$easJson.build) {
    throw "Missing 'build' section in eas.json"
}
Write-Host "✓ eas.json has build profiles" -ForegroundColor Green

# Check package.json for Expo SDK version
Write-Host "Checking Expo SDK version..." -ForegroundColor Gray
try {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
}
catch {
    throw "Invalid JSON syntax in package.json: $_"
}

if (!$packageJson.dependencies.expo) {
    throw "Expo dependency not found in package.json"
}

$expoVersion = $packageJson.dependencies.expo
Write-Host "✓ Expo SDK version pinned: $expoVersion" -ForegroundColor Green

Write-Host ""
Write-Host "✓ Mobile production validation completed successfully" -ForegroundColor Green
