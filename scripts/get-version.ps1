#Requires -Version 7.0
<#
.SYNOPSIS
    Get Factory version and git hash.
    
.DESCRIPTION
    Reads VERSION file and outputs version with git commit hash.
    Non-mutating query only.
    
.EXAMPLES
    .\get-version.ps1
    
.NOTES
    Part of Step J - Release Packaging Discipline.
#>

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$factoryRoot = Split-Path -Parent $PSScriptRoot
$versionFile = Join-Path $factoryRoot 'VERSION'

if (!(Test-Path $versionFile)) {
    throw "VERSION file not found at $versionFile"
}

$version = (Get-Content $versionFile -Raw).Trim()

# Get git hash
Push-Location $factoryRoot
try {
    $gitHash = git rev-parse --short HEAD
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to get git hash"
        $gitHash = "unknown"
    }
}
finally {
    Pop-Location
}

Write-Host "$version+$gitHash"
