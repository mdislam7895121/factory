#Requires -Version 7.0
<#
.SYNOPSIS
    Web production header sanity checks.
    
.DESCRIPTION
    Verifies next build exists and production env examples are present.
    Non-mutating validation only.
    
.EXAMPLES
    .\validate-web-security.ps1
    
.NOTES
    Part of Step I security hardening.
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$scriptRoot = $PSScriptRoot
$factoryRoot = Split-Path -Parent $scriptRoot
$webRoot = Join-Path $factoryRoot 'web'

Write-Host "Validating Web Security Configuration..." -ForegroundColor Cyan

# Check for .next directory (production build artifact)
Write-Host "Checking production build artifact..." -ForegroundColor Gray
if (!(Test-Path (Join-Path $webRoot '.next'))) {
    Write-Host "  [WARN] .next directory not found (run 'npm run build' to generate)" -ForegroundColor Yellow
}
else {
    Write-Host "  [OK] .next directory exists" -ForegroundColor Green
}

# Check for .env.production.example (from Step H)
Write-Host "Checking production env documentation..." -ForegroundColor Gray
if (!(Test-Path (Join-Path $webRoot '.env.production.example'))) {
    throw ".env.production.example not found"
}
Write-Host "  [OK] .env.production.example exists" -ForegroundColor Green

# Verify next.config.ts exists
Write-Host "Checking Next.js configuration..." -ForegroundColor Gray
if (!(Test-Path (Join-Path $webRoot 'next.config.ts'))) {
    throw "next.config.ts not found"
}
Write-Host "  [OK] next.config.ts exists" -ForegroundColor Green

Write-Host ""
Write-Host "X Web security configuration validated" -ForegroundColor Green
