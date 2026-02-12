#Requires -Version 7.0
<#
.SYNOPSIS
    Proof step H - Mobile production configuration validation.
    
.DESCRIPTION
    Validates mobile app configuration for production builds.
    Captures output and exits with appropriate status.
    
.EXAMPLES
    .\proof-step-h-mobile.ps1
    
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
$outputFile = Join-Path $proofRunsDir "proof-step-h-mobile-$timestamp.txt"

Write-Host "Mobile Production Configuration Validation" -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Output file: $outputFile" -ForegroundColor Gray

# Run validation script and capture output
$output = & pwsh -NoProfile -File (Join-Path $scriptRoot 'validate-mobile-prod.ps1') 2>&1
$exitCode = $LASTEXITCODE

# Save output
$output | Out-File -FilePath $outputFile -Encoding UTF8

# Display output
$output | Write-Host

# Check result
if ($exitCode -ne 0) {
    Write-Host ""
    Write-Host "✗ Mobile production validation FAILED" -ForegroundColor Red
    Write-Host "Output saved to: $outputFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Mobile production validation passed" -ForegroundColor Green
Write-Host "Output saved to: $outputFile" -ForegroundColor Green
exit 0
