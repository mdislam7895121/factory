param(
    [Parameter(Position = 0)]
    [string]$Command,
    [switch]$Help,
    [switch]$DownWithVolumes,
    [switch]$NoBuild,
    [switch]$KeepStack
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $RepoRoot 'docker\docker-compose.dev.yml'

function Show-Help {
    @"
Factory CLI (PowerShell)

Usage:
  pwsh -File scripts/factory.ps1 -Help
  pwsh -File scripts/factory.ps1 <command> [options]

Commands:
  dev:up        Start docker dev stack
  dev:down      Stop docker dev stack
  dev:status    Show docker compose ps
  dev:logs      Tail docker compose logs
  dev:smoke     Check web and api health endpoints
  doctor        Run environment diagnostics (PASS/FAIL)
  proof:l2      Run L2 proof pack and generate proof/<timestamp>/REPORT.md

Options:
  -DownWithVolumes   Include -v on compose down
  -NoBuild           Skip image build on dev:up
  -KeepStack         Do not down stack after proof:l2
"@ | Write-Host
}

function Invoke-Compose {
    param([string[]]$ComposeArgs)
    if (-not (Test-Path $ComposeFile)) {
        Write-Error "Compose file not found: $ComposeFile"
        exit 1
    }

    $args = @('compose', '-f', $ComposeFile) + $ComposeArgs
    & docker @args
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

if ($Help -or [string]::IsNullOrWhiteSpace($Command)) {
    Show-Help
    exit 0
}

switch ($Command.ToLowerInvariant()) {
    'dev:up' {
        & (Join-Path $PSScriptRoot 'dev-up.ps1') -NoBuild:$NoBuild
        exit $LASTEXITCODE
    }
    'dev:down' {
        & (Join-Path $PSScriptRoot 'dev-down.ps1') -Volumes:$DownWithVolumes
        exit $LASTEXITCODE
    }
    'dev:status' {
        Invoke-Compose -ComposeArgs @('ps')
        exit 0
    }
    'dev:logs' {
        Invoke-Compose -ComposeArgs @('logs', '--tail', '250')
        exit 0
    }
    'dev:smoke' {
        $web = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 20
        $api = Invoke-RestMethod -Uri 'http://localhost:4000/db/health' -TimeoutSec 20
        Write-Host "web.status=$($web.StatusCode)"
        $api | ConvertTo-Json -Depth 8 | Write-Host
        if ($web.StatusCode -ne 200 -or $api.ok -ne $true) {
            Write-Error 'Smoke failed.'
            exit 1
        }
        exit 0
    }
    'doctor' {
        & (Join-Path $PSScriptRoot 'doctor.ps1')
        exit $LASTEXITCODE
    }
    'proof:l2' {
        & (Join-Path $PSScriptRoot 'proof-l2.ps1') -DownWithVolumes:$DownWithVolumes -KeepStack:$KeepStack
        exit $LASTEXITCODE
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
