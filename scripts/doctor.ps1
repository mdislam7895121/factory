param()

$ErrorActionPreference = 'Continue'

$repoRoot = Split-Path -Parent $PSScriptRoot
$composeFile = Join-Path $repoRoot 'docker\docker-compose.dev.yml'
$failed = $false

function Write-Result {
    param(
        [bool]$Ok,
        [string]$Check,
        [string]$Detail,
        [string]$Fix
    )

    if ($Ok) {
        Write-Host "PASS | $Check | $Detail" -ForegroundColor Green
    }
    else {
        $script:failed = $true
        Write-Host "FAIL | $Check | $Detail" -ForegroundColor Red
        if (-not [string]::IsNullOrWhiteSpace($Fix)) {
            Write-Host "      Fix: $Fix" -ForegroundColor Yellow
        }
    }
}

Write-Host "Factory Doctor" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot"
Write-Host "Compose: $composeFile"

Write-Host "`n[core commands]" -ForegroundColor Cyan
Write-Result -Ok ([bool](Get-Command git -ErrorAction SilentlyContinue)) -Check 'git available' -Detail (git --version 2>$null) -Fix 'Install Git and restart shell.'
Write-Result -Ok ([bool](Get-Command docker -ErrorAction SilentlyContinue)) -Check 'docker available' -Detail (docker --version 2>$null) -Fix 'Install Docker Desktop and reopen shell.'
Write-Result -Ok ([bool](Get-Command node -ErrorAction SilentlyContinue)) -Check 'node available' -Detail (node --version 2>$null) -Fix 'Install Node.js LTS and reopen shell.'

Write-Host "`n[docker daemon]" -ForegroundColor Cyan
try {
    $dockerVersionOutput = docker version 2>&1 | Out-String
    $dockerDaemonOk = ($LASTEXITCODE -eq 0) -and ($dockerVersionOutput -notmatch 'failed to connect')
    Write-Result -Ok $dockerDaemonOk -Check 'docker daemon' -Detail (($dockerVersionOutput -split "`n" | Select-Object -Last 1).Trim()) -Fix 'Start Docker Desktop, wait for engine, then run: docker version'
}
catch {
    Write-Result -Ok $false -Check 'docker daemon' -Detail ($_.Exception.Message) -Fix 'Start Docker Desktop, wait for engine, then run: docker version'
}

Write-Host "`n[docker compose]" -ForegroundColor Cyan
try {
    $composeVersion = docker compose version 2>&1 | Out-String
    Write-Result -Ok ($LASTEXITCODE -eq 0) -Check 'docker compose' -Detail ($composeVersion.Trim()) -Fix 'Update Docker Desktop (Compose plugin required).'
}
catch {
    Write-Result -Ok $false -Check 'docker compose' -Detail ($_.Exception.Message) -Fix 'Update Docker Desktop and ensure docker compose plugin is installed.'
}

Write-Host "`n[paths]" -ForegroundColor Cyan
Write-Result -Ok (Test-Path $composeFile) -Check 'compose file exists' -Detail $composeFile -Fix 'Verify repository path and file docker/docker-compose.dev.yml.'

Write-Host "`n[wsl]" -ForegroundColor Cyan
if ($IsWindows -and (Get-Command wsl -ErrorAction SilentlyContinue)) {
    try {
        $wslStatus = wsl --status 2>&1 | Out-String
        Write-Result -Ok $true -Check 'wsl status' -Detail (($wslStatus -split "`n" | Select-Object -First 1).Trim()) -Fix ''
    }
    catch {
        Write-Result -Ok $false -Check 'wsl status' -Detail ($_.Exception.Message) -Fix 'Run: wsl --install, then reboot. In Docker Desktop enable WSL2 engine.'
    }
}
else {
    Write-Result -Ok $true -Check 'wsl status' -Detail 'Non-Windows or wsl command unavailable in this shell.' -Fix ''
}

Write-Host "`n[ports]" -ForegroundColor Cyan
foreach ($port in @(3000, 4000, 5432)) {
    try {
        $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction Stop | Select-Object -First 1
        $owner = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        $procName = if ($owner) { $owner.ProcessName } else { "PID $($conn.OwningProcess)" }
        Write-Result -Ok $false -Check "port $port availability" -Detail "In use by $procName" -Fix "Stop process on $port or run: docker compose -f `"$composeFile`" down"
    }
    catch {
        Write-Result -Ok $true -Check "port $port availability" -Detail 'Available.' -Fix ''
    }
}

Write-Host "`n[next actions]" -ForegroundColor Cyan
Write-Host "- Start stack: pwsh -File scripts/factory.ps1 dev:up"
Write-Host "- Smoke check: pwsh -File scripts/factory.ps1 dev:smoke"
Write-Host "- Proof pack: pwsh -File scripts/factory.ps1 proof:l2"

if ($failed) {
    exit 1
}
exit 0
