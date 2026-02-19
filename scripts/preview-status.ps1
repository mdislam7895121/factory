$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'
$ContainerName = 'factory-web-dev'

Write-Output '=== PREVIEW STATUS ==='
docker compose -f $ComposeFile ps web

$containerRunning = $false
$healthStatus = 'unknown'
$portBinding = ''
$httpStatus = 0

$inspect = docker inspect --format "{{.State.Running}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}" $ContainerName 2>$null
if ($LASTEXITCODE -eq 0 -and $inspect) {
    $parts = $inspect -split '\|'
    $containerRunning = ($parts[0] -eq 'true')
    if ($parts.Length -gt 1) {
        $healthStatus = $parts[1]
    }
}

$portBinding = docker port $ContainerName 3000/tcp 2>$null
if ($LASTEXITCODE -ne 0) {
    $portBinding = '<missing>'
}

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 15
    $httpStatus = $response.StatusCode
} catch {
    $httpStatus = 0
}

Write-Output ("ContainerRunning=" + $containerRunning)
Write-Output ("HealthStatus=" + $healthStatus)
Write-Output ("PortBinding=" + $portBinding)
Write-Output ("HttpStatus=" + $httpStatus)

if ($containerRunning -and $healthStatus -eq 'healthy' -and $portBinding -ne '<missing>' -and $httpStatus -eq 200) {
    Write-Output 'SUCCESS'
    exit 0
}

Write-Output 'FAIL'
exit 1
