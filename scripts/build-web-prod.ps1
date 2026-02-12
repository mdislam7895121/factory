#Requires -Version 7.0
<#
.SYNOPSIS
    Production build script for Factory Web.
    
.DESCRIPTION
    Builds the Web application for production using Next.js build system.
    
.EXAMPLES
    .\build-web-prod.ps1
    
.NOTES
    Non-destructive. Verifies .next/ directory exists after build.
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$webRoot = Join-Path $PSScriptRoot '..' 'web'
$nextDir = Join-Path $webRoot '.next'

Write-Host "Building Web for production..." -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Gray
Push-Location $webRoot
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
Push-Location $webRoot
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

# Verify .next directory exists
Write-Host "Verifying .next directory..." -ForegroundColor Gray
if (!(Test-Path $nextDir)) {
    throw "Web .next directory not found at $nextDir"
}

# Write build info
Write-Host "Writing build information..." -ForegroundColor Gray
$factoryRoot = Split-Path -Parent $webRoot
$versionFile = Join-Path $factoryRoot 'VERSION'
$version = (Get-Content $versionFile -Raw).Trim()

Push-Location $factoryRoot
try {
    $gitCommit = git rev-parse HEAD
}
finally {
    Pop-Location
}

$buildInfo = @{
    version = $version
    commit = $gitCommit
    timestamp = (Get-Date -Format 'o')
}

$buildInfoPath = Join-Path $nextDir 'build-info.json'
$buildInfo | ConvertTo-Json | Out-File -FilePath $buildInfoPath -Encoding UTF8

Write-Host "X Web production build completed successfully" -ForegroundColor Green
Write-Host "  .next directory: $nextDir" -ForegroundColor Green
Write-Host "  Build info: $buildInfoPath" -ForegroundColor Green
