#Requires -Version 5.1
<#
.SYNOPSIS
  Start Factory Development Environment

.DESCRIPTION
  Starts API, Web, and Mobile services for local development.
  Optionally start only specific services.

.PARAMETER ApiOnly
  Start only the API service

.PARAMETER WebOnly
  Start only the Web service

.PARAMETER MobileOnly
  Start only the Mobile service

.EXAMPLE
  ./scripts/start-factory.ps1
  # Starts all three services in separate windows

.EXAMPLE
  ./scripts/start-factory.ps1 -ApiOnly
  # Starts only the API service
#>

param(
  [switch]$ApiOnly = $false,
  [switch]$WebOnly = $false,
  [switch]$MobileOnly = $false
)

function Start-Service {
  param(
    [string]$ServiceName,
    [string]$WorkingDirectory,
    [string]$Command
  )

  Write-Host "[START] $ServiceName..." -ForegroundColor Cyan
  
  if (-not (Test-Path $WorkingDirectory -PathType Container)) {
    Write-Host "[FAIL] Directory not found: $WorkingDirectory" -ForegroundColor Red
    return $false
  }

  try {
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$WorkingDirectory'; $Command`"" -WindowStyle Normal
    Write-Host "[OK] $ServiceName started in new window" -ForegroundColor Green
    return $true
  } catch {
    Write-Host "[FAIL] Could not start $ServiceName: $_" -ForegroundColor Red
    return $false
  }
}

Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "[FACTORY] Development Environment Launcher" -ForegroundColor Cyan
Write-Host ("=" * 70) + "`n" -ForegroundColor Cyan

$services = @()
$startApi = -not $WebOnly -and -not $MobileOnly
$startWeb = -not $ApiOnly -and -not $MobileOnly
$startMobile = -not $ApiOnly -and -not $WebOnly

# Start API
if ($startApi) {
  $result = Start-Service "API" ".\api" "npm run start:dev"
  if ($result) { $services += @{ name = "API"; url = "http://localhost:4000"; port = "4000" } }
  Start-Sleep -Milliseconds 500
}

# Start Web
if ($startWeb) {
  $result = Start-Service "Web" ".\web" "npm run dev"
  if ($result) { $services += @{ name = "Web"; url = "http://localhost:3000"; port = "3000" } }
  Start-Sleep -Milliseconds 500
}

# Start Mobile
if ($startMobile) {
  $result = Start-Service "Mobile (Expo)" ".\mobile" "npm start"
  if ($result) { $services += @{ name = "Mobile (Expo)"; url = "http://localhost:19000"; port = "19000" } }
}

Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "[INFO] Services Started" -ForegroundColor Cyan
Write-Host ("=" * 70) + "`n" -ForegroundColor Cyan

if ($services.Count -eq 0) {
  Write-Host "[WARN] No services started" -ForegroundColor Yellow
  exit 1
}

Write-Host "[OPEN] Access services at:`n" -ForegroundColor Cyan
foreach ($service in $services) {
  Write-Host "  $($service.name.PadRight(20)): $($service.url)" -ForegroundColor White
}

Write-Host "`n[URLS] Quick Access:`n" -ForegroundColor Cyan
if ($startApi) {
  Write-Host "  API:" -ForegroundColor White
  Write-Host "    Health: http://localhost:4000/db/health" -ForegroundColor Gray
  Write-Host "    GraphQL: http://localhost:4000/graphql" -ForegroundColor Gray
}
if ($startWeb) {
  Write-Host "  Web:" -ForegroundColor White
  Write-Host "    Home: http://localhost:3000" -ForegroundColor Gray
  Write-Host "    Factory Preview: http://localhost:3000/factory-preview" -ForegroundColor Gray
}
if ($startMobile) {
  Write-Host "  Mobile:" -ForegroundColor White
  Write-Host "    Expo: http://localhost:19000" -ForegroundColor Gray
  Write-Host "    Web: http://localhost:19006" -ForegroundColor Gray
}

Write-Host "`n[STOP] Press Ctrl+C to stop services, or close the windows individually." -ForegroundColor Yellow
Write-Host "`n" + ("=" * 70) + "`n" -ForegroundColor Cyan

# Keep main window open
$null = Read-Host "Press Enter to exit"
