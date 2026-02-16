$ErrorActionPreference = 'Stop'

$expectedRepoRoot = 'C:\Users\vitor\Dev\factory'

function Normalize-PathForCompare {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path
    )

    $full = [System.IO.Path]::GetFullPath($Path)
    return $full.TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
}

$currentDirectory = (Get-Location).Path
$candidateRepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

$gitCommand = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCommand) {
    Write-Host 'ERROR: Git is not available in PATH. Please install Git and try again.'
    exit 1
}

$detectedRepoRoot = ''
try {
    $detectedRepoRoot = (git -C $candidateRepoRoot rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($detectedRepoRoot)) {
        throw 'git rev-parse failed'
    }
}
catch {
    Write-Host "ERROR: Unable to determine git repository root via 'git -C <candidateRoot> rev-parse --show-toplevel'."
    Write-Host 'Candidate repo root:' $candidateRepoRoot
    exit 1
}

$normalizedExpected = Normalize-PathForCompare -Path $expectedRepoRoot
$normalizedDetected = Normalize-PathForCompare -Path $detectedRepoRoot
$normalizedCurrent = Normalize-PathForCompare -Path $currentDirectory

if (
    (-not [string]::Equals($normalizedDetected, $normalizedExpected, [System.StringComparison]::OrdinalIgnoreCase)) -or
    (-not [string]::Equals($normalizedCurrent, $normalizedExpected, [System.StringComparison]::OrdinalIgnoreCase))
) {
    Write-Host 'ERROR: Repository root mismatch.'
    Write-Host 'Current directory:' $currentDirectory
    Write-Host 'Detected repo root:' $detectedRepoRoot
    Write-Host 'Expected repo root:' $expectedRepoRoot
    exit 1
}

Write-Host "OK: repo root verified: $detectedRepoRoot"
exit 0
