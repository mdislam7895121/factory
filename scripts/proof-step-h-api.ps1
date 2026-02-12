#Requires -Version 7.0
<#
.SYNOPSIS
    Proof step H - API production build validation.
    
.DESCRIPTION
    Validates that the API can be built for production.
    Captures build output and exits with appropriate status.
    
.EXAMPLES
    .\proof-step-h-api.ps1
    
.NOTES
    Part of Serial Step H - Production Build Pipeline.
#>

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$scriptRoot = $PSScriptRoot
$proofRunsDir = Join-Path $scriptRoot '..' 'proof' 'runs'

# Ensure runs directory exists
if (!(Test-Path $proofRunsDir)) {
    New-Item -ItemType Directory -Path $proofRunsDir -Force | Out-Null
}

$timestamp = (Get-Date -Format 'yyyyMMdd-HHmmss')
$outputFile = Join-Path $proofRunsDir "proof-step-h-api-$timestamp.txt"

Write-Host "API Production Build Validation" -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Output file: $outputFile" -ForegroundColor Gray

# Run build script and capture output
$output = & pwsh -NoProfile -File (Join-Path $scriptRoot 'build-api-prod.ps1') 2>&1
$exitCode = $LASTEXITCODE

# Save output
$output | Out-File -FilePath $outputFile -Encoding UTF8

# Display output
$output | Write-Host

# Check result
if ($exitCode -ne 0) {
    Write-Host ""
    Write-Host "✗ API production build FAILED" -ForegroundColor Red
    Write-Host "Output saved to: $outputFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ API production build validation passed" -ForegroundColor Green
Write-Host "Output saved to: $outputFile" -ForegroundColor Green
exit 0
