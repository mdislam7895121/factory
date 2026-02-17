param(
    [switch]$Volumes
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

if (-not (Test-Path $ComposeFile)) {
    Write-Error "Compose file not found: $ComposeFile"
    exit 1
}

$args = @('compose', '-f', $ComposeFile, 'down')
if ($Volumes) {
    $args += '-v'
}

Write-Host "[dev-down] docker $($args -join ' ')"
& docker @args
exit $LASTEXITCODE
