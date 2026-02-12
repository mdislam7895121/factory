#Requires -Version 7.0
<#
.SYNOPSIS
    Production build script for Factory API.
    
.DESCRIPTION
    Builds the API for production using NestJS build system.
    
.EXAMPLES
    .\build-api-prod.ps1
    
.NOTES
    Non-destructive. Verifies dist/ directory exists after build.
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$apiRoot = Join-Path $PSScriptRoot '..' 'api'
$distDir = Join-Path $apiRoot 'dist'

Write-Host "Building API for production..." -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Gray
Push-Location $apiRoot
try {
    npm ci
    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

# Build
Write-Host "Running production build..." -ForegroundColor Gray
Push-Location $apiRoot
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

# Verify dist directory exists
Write-Host "Verifying dist directory..." -ForegroundColor Gray
if (!(Test-Path $distDir)) {
    throw "API dist directory not found at $distDir"
}

# Check for built artifacts (NestJS builds to dist/src/main.js)
$mainJs = Join-Path $distDir 'src' 'main.js'
if (!(Test-Path $mainJs)) {
    throw "main.js not found at $mainJs"
}

Write-Host "✓ API production build completed successfully" -ForegroundColor Green
Write-Host "  Dist directory: $distDir" -ForegroundColor Green
