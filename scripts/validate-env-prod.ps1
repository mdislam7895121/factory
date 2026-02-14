#Requires -Version 7.0
<#
.SYNOPSIS
    Production environment validation script.
    
.DESCRIPTION
    Validates that required environment variable example files exist
    and contain properly documented keys. Does NOT expose secrets.
    
.EXAMPLES
    .\validate-env-prod.ps1
    
.NOTES
    Non-mutating. Checks documentation, not actual values.
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$factoryRoot = Split-Path -Parent $PSScriptRoot
$apiEnvExample = Join-Path $factoryRoot 'api' '.env.production.example'
$webEnvExample = Join-Path $factoryRoot 'web' '.env.production.example'
$placeholderDomainPattern = '(?i)example\.com|factory\.example\.com'

Write-Host "Validating Production Environment Configuration..." -ForegroundColor Cyan

# Check API env example
Write-Host "Checking API .env.production.example..." -ForegroundColor Gray
if (!(Test-Path $apiEnvExample)) {
    throw ".env.production.example not found in api directory"
}

$apiEnvContent = Get-Content $apiEnvExample -Raw
if ($apiEnvContent -notmatch 'DATABASE_URL') {
    throw "DATABASE_URL key not documented in api/.env.production.example"
}

if ($apiEnvContent -notmatch 'FACTORY_KILL_SWITCH') {
    throw "FACTORY_KILL_SWITCH key not documented in api/.env.production.example"
}

if ($apiEnvContent -match $placeholderDomainPattern) {
    throw "Placeholder domain detected in api/.env.production.example"
}

Write-Host "✓ API .env.production.example found with required keys" -ForegroundColor Green

# Check Web env example
Write-Host "Checking Web .env.production.example..." -ForegroundColor Gray
if (!(Test-Path $webEnvExample)) {
    throw ".env.production.example not found in web directory"
}

$webEnvContent = Get-Content $webEnvExample -Raw
if ($webEnvContent -notmatch 'NEXT_PUBLIC_API_URL') {
    throw "NEXT_PUBLIC_API_URL key not documented in web/.env.production.example"
}

if ($webEnvContent -match $placeholderDomainPattern) {
    throw "Placeholder domain detected in web/.env.production.example"
}

Write-Host "✓ Web .env.production.example found with required keys" -ForegroundColor Green

Write-Host ""
Write-Host "✓ Production environment validation completed successfully" -ForegroundColor Green
Write-Host "  Documentation: api/.env.production.example" -ForegroundColor Green
Write-Host "  Documentation: web/.env.production.example" -ForegroundColor Green
