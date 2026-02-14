param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Name,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$OutDir
)

$ErrorActionPreference = 'Stop'

if ($Name.Trim().Length -eq 0) {
    Write-Error "Parameter -Name cannot be empty."
    exit 1
}

if ($OutDir.Trim().Length -eq 0) {
    Write-Error "Parameter -OutDir cannot be empty."
    exit 1
}

$resolvedOutDir = [System.IO.Path]::GetFullPath($OutDir)
$targetRoot = Join-Path $resolvedOutDir $Name

Write-Output "[fullstack-v1] Placeholder generator (Step 0)"
Write-Output "Mode: plan-only (no writes)"
Write-Output "Input Name: $Name"
Write-Output "Input OutDir: $OutDir"
Write-Output "Resolved OutDir: $resolvedOutDir"
Write-Output "Planned target root: $targetRoot"
Write-Output "Planned components: web, api, mobile"
Write-Output "Planned action 1: validate input contract"
Write-Output "Planned action 2: compute folder structure"
Write-Output "Planned action 3: emit templates (future step)"
Write-Output "Planned action 4: write summary README (future step)"
Write-Output "No files created."

exit 0
