$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'
$ContainerName = 'factory-web-dev'
$MaxAttempts = 60
$DelaySeconds = 2

Write-Output '=== PREVIEW START ==='
docker compose -f $ComposeFile up -d web
if ($LASTEXITCODE -ne 0) {
    throw 'docker compose up -d web failed'
}

$healthy = $false
for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    $status = docker inspect --format "{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}" $ContainerName 2>$null
    if ($LASTEXITCODE -eq 0 -and $status -eq 'healthy') {
        $healthy = $true
        break
    }
    Start-Sleep -Seconds $DelaySeconds
}

if (-not $healthy) {
    throw 'web healthcheck did not reach healthy state in time'
}

Write-Output 'PREVIEW_URL=http://localhost:3000'
