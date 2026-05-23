#Requires -Version 7.0
<#
.SYNOPSIS
    Continuous production watcher — polls smoke tests on a schedule.

.DESCRIPTION
    Runs smoke-production.ps1 on a configurable interval. Logs each run.
    Sends Slack alert on failure if ALERT_SLACK_WEBHOOK_URL is set.
    Ctrl+C to stop.

.PARAMETER BaseUrl
    Netlify frontend base URL. Defaults to $env:NEXT_PUBLIC_API_BASE_URL fallback NEXT_PUBLIC_PROD_API_BASE.

.PARAMETER ApiUrl
    Railway API base URL. Defaults to $env:NEXT_PUBLIC_API_BASE_URL.

.PARAMETER PreviewUrl
    Preview gateway URL. Defaults to $env:NEXT_PUBLIC_PREVIEW_BASE_URL.

.PARAMETER IntervalMinutes
    Polling interval in minutes. Default: 5.

.PARAMETER SlackWebhook
    Slack webhook URL for failure alerts. Defaults to $env:ALERT_SLACK_WEBHOOK_URL.

.PARAMETER LogFile
    Path to write JSON log lines. Default: ./smoke-watch.log.

.EXAMPLES
    .\watch-production.ps1 -BaseUrl https://factory.netlify.app -ApiUrl https://api.railway.app
    .\watch-production.ps1 -IntervalMinutes 10
#>

param(
    [string]$BaseUrl        = ($env:NEXT_PUBLIC_API_BASE_URL ?? $env:NEXT_PUBLIC_PROD_API_BASE ?? ''),
    [string]$ApiUrl         = ($env:NEXT_PUBLIC_API_BASE_URL ?? ''),
    [string]$PreviewUrl     = ($env:NEXT_PUBLIC_PREVIEW_BASE_URL ?? ''),
    [int]$IntervalMinutes   = 5,
    [string]$SlackWebhook   = ($env:ALERT_SLACK_WEBHOOK_URL ?? ''),
    [string]$LogFile        = (Join-Path $PSScriptRoot 'smoke-watch.log')
)

$ErrorActionPreference = 'Continue'
$ProgressPreference    = 'SilentlyContinue'

if (!$BaseUrl) { Write-Error "BaseUrl is required (or set NEXT_PUBLIC_API_BASE_URL)."; exit 1 }
if (!$ApiUrl)  { Write-Error "ApiUrl is required."; exit 1 }

$SmokeScript = Join-Path $PSScriptRoot 'smoke-production.ps1'
if (!(Test-Path $SmokeScript)) { Write-Error "smoke-production.ps1 not found at $SmokeScript"; exit 1 }

function SendSlackAlert([string]$Text) {
    if (!$SlackWebhook) { return }
    try {
        $body = @{ text = $Text } | ConvertTo-Json
        Invoke-RestMethod -Uri $SlackWebhook -Method Post -ContentType 'application/json' -Body $body | Out-Null
    } catch {
        Write-Host "  [warn] Slack alert failed: $_" -ForegroundColor Yellow
    }
}

function LogResult([bool]$Passed, [int]$DurationMs, [string]$Detail) {
    $entry = @{
        ts         = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')
        passed     = $Passed
        durationMs = $DurationMs
        detail     = $Detail
    } | ConvertTo-Json -Compress
    Add-Content -Path $LogFile -Value $entry
}

$consecutiveFails = 0
$run = 0

Write-Host "`nFactory Production Watcher" -ForegroundColor Cyan
Write-Host "  Frontend : $BaseUrl"
Write-Host "  API      : $ApiUrl"
Write-Host "  Interval : ${IntervalMinutes}m"
Write-Host "  Log      : $LogFile"
Write-Host "  Press Ctrl+C to stop.`n"

while ($true) {
    $run++
    $ts  = Get-Date -Format 'HH:mm:ss'
    Write-Host "[$ts] Run #$run" -ForegroundColor White

    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    $args = @('-BaseUrl', $BaseUrl, '-ApiUrl', $ApiUrl)
    if ($PreviewUrl) { $args += @('-PreviewUrl', $PreviewUrl) }

    $output  = & $SmokeScript @args 2>&1
    $exitCode = $LASTEXITCODE
    $sw.Stop()

    $passed = ($exitCode -eq 0)
    $ms     = $sw.ElapsedMilliseconds

    if ($passed) {
        Write-Host "  ✓ PASSED (${ms}ms)" -ForegroundColor Green
        $consecutiveFails = 0
        LogResult $true $ms 'ok'
    } else {
        $consecutiveFails++
        Write-Host "  ✗ FAILED (${ms}ms) — consecutive: $consecutiveFails" -ForegroundColor Red

        # Print last 20 lines of output for context
        $output | Select-Object -Last 20 | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkRed }

        LogResult $false $ms "consecutive_fails=$consecutiveFails"

        if ($consecutiveFails -ge 2) {
            $msg = ":fire: *Factory smoke test FAILED* (run #$run, ${consecutiveFails}x in a row)`n$BaseUrl"
            SendSlackAlert $msg
        }
    }

    Write-Host "  Next check in ${IntervalMinutes}m…`n" -ForegroundColor Gray
    Start-Sleep -Seconds ($IntervalMinutes * 60)
}
