param(
    [switch]$Wipe
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

$args = @('compose', '-f', $ComposeFile, 'down')
if ($Wipe) {
    $args += '-v'
}

Write-Output ('preview_down_mode=' + $(if ($Wipe) { 'wipe_volumes' } else { 'safe_down' }))
& docker @args
if ($LASTEXITCODE -ne 0) {
    throw 'docker compose down failed'
}

Write-Output 'preview_down_result=ok'
