param(
    [int]$Attempts = 60,
    [int]$DelaySeconds = 2
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

docker compose -f $ComposeFile up -d --build web
if ($LASTEXITCODE -ne 0) {
    throw 'docker compose up -d --build web failed'
}

$ready = $false
for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 5
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
            $ready = $true
            break
        }
    } catch {
    }

    Start-Sleep -Seconds $DelaySeconds
}

if (-not $ready) {
    throw 'preview did not become reachable on localhost:3000 in time'
}

Write-Output 'PREVIEW_READY'
