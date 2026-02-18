param(
    [int]$Tail = 150,
    [switch]$Follow
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

$args = @('compose', '-f', $ComposeFile, 'logs', '--tail', [string]$Tail, 'web', 'orchestrator', 'api')
if ($Follow) {
    $args = @('compose', '-f', $ComposeFile, 'logs', '-f', '--tail', [string]$Tail, 'web', 'orchestrator', 'api')
}

& docker @args
if ($LASTEXITCODE -ne 0) {
    throw 'docker compose logs failed'
}
