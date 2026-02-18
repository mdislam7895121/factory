param(
    [switch]$KeepVolumes
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

$args = @('compose', '-f', $ComposeFile, 'down')
if (-not $KeepVolumes) {
    $args += '-v'
}

& docker @args
if ($LASTEXITCODE -ne 0) {
    throw ('docker compose down failed (KeepVolumes=' + $KeepVolumes + ')')
}
