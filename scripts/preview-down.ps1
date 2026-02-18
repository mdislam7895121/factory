$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

docker compose -f $ComposeFile down -v
if ($LASTEXITCODE -ne 0) {
    throw 'docker compose down -v failed'
}
