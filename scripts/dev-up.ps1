param(
    [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

if (-not (Test-Path $ComposeFile)) {
    Write-Error "Compose file not found: $ComposeFile"
    exit 1
}

$args = @('compose', '-f', $ComposeFile, 'up', '-d')
if (-not $NoBuild) {
    $args += '--build'
}

Write-Host "[dev-up] docker $($args -join ' ')"
& docker @args
exit $LASTEXITCODE
