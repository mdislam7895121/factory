<#
.SYNOPSIS
    Captures proof evidence for Factory serial phases.

.DESCRIPTION
    This script captures system state, versions, git status, and other
    relevant information for documenting completion of serial phases.

.PARAMETER Serial
    The serial number (e.g., "01", "02", etc.)

.PARAMETER Title
    The title of the serial phase (optional)

.EXAMPLE
    .\scripts\proof.ps1 -Serial "01" -Title "Factory Repo Hygiene"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Serial,
    
    [Parameter(Mandatory=$false)]
    [string]$Title = ""
)

# Set error action preference
$ErrorActionPreference = "Continue"

# Get factory root directory (parent of scripts folder)
$FactoryRoot = Split-Path -Parent $PSScriptRoot
Set-Location $FactoryRoot

# Create proof directory for this serial
$ProofDir = Join-Path $FactoryRoot "docs\proof\serial-$Serial"
if (-not (Test-Path $ProofDir)) {
    New-Item -ItemType Directory -Path $ProofDir -Force | Out-Null
    Write-Host "Created proof directory: $ProofDir" -ForegroundColor Green
}

# Create proof file
$ProofFile = Join-Path $ProofDir "proof.md"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Start building proof content
$Content = @"
# Serial $Serial Proof Evidence
$( if ($Title) { "`n## $Title`n" } else { "" })
**Generated:** $Timestamp

## Environment

### Timestamp
``````
$Timestamp
``````

### Working Directory
``````
$(Get-Location)
``````

### Git Status
``````
$(git status 2>&1)
``````

### Git Log (Last 5 Commits)
``````
$(git log --oneline -5 2>&1)
``````

## System Versions

### PowerShell
``````
$($PSVersionTable.PSVersion.ToString())
``````

### Node.js & npm
``````
$(node --version 2>&1)
$(npm --version 2>&1)
``````

### Git
``````
$(git --version 2>&1)
``````

### Docker
``````
$(docker --version 2>&1)
``````

### Java
``````
$(java -version 2>&1)
``````

### Python
``````
$(python --version 2>&1)
``````

## Files Changed in This Serial
``````
$(git diff --name-only 2>&1)
``````

## Uncommitted Changes
``````
$(git diff --stat 2>&1)
``````

---
*End of automated proof capture*

"@

# Write to file
$Content | Out-File -FilePath $ProofFile -Encoding UTF8

Write-Host "`n✓ Proof file created: $ProofFile" -ForegroundColor Green
Write-Host "`nTo add manual notes, edit: $ProofFile" -ForegroundColor Cyan
Write-Host "`nTo view:" -ForegroundColor Cyan
Write-Host "  cat `"$ProofFile`"" -ForegroundColor Yellow

return $ProofFile
