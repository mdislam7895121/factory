#Requires -Version 5.1
<#
.SYNOPSIS
  Factory Development Environment Health Check
  
.DESCRIPTION
  Verifies all dependencies, configurations, and API availability
  for Factory Platform development (API, Web, Mobile).
  
.OUTPUTS
  Status report to console with ✅ (pass) and ❌ (fail) indicators
  
.NOTES
  Run from PowerShell in the workspace root directory
  Serial Step D: Platform Kit Environment Doctor
#>

param(
  [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# Colors for output
$colors = @{
  Pass = "Green"
  Fail = "Red"
  Warn = "Yellow"
  Info = "Cyan"
}

function Write-Status {
  param(
    [string]$Message,
    [ValidateSet("Pass", "Fail", "Warn", "Info")]
    [string]$Status = "Info"
  )
  
  $symbol = @{
    Pass = "✅"
    Fail = "❌"
    Warn = "⚠️"
    Info = "ℹ️"
  }
  
  Write-Host "$($symbol[$Status]) $Message" -ForegroundColor $colors[$Status]
}

function Test-Command {
  param([string]$Command)
  try {
    $null = & $Command --version 2>&1
    return $LASTEXITCODE -eq 0
  } catch {
    return $false
  }
}

function Get-CommandVersion {
  param([string]$Command)
  try {
    $output = & $Command --version 2>&1 | Select-Object -First 1
    return $output -replace "^[^\d]*", ""
  } catch {
    return "unknown"
  }
}

Write-Host "`n🏥 Factory Environment Doctor`n" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "Checking dependencies and configurations...`n"

$allPass = $true

# ============================================================================
# Node.js & NPM
# ============================================================================
Write-Host "📦 Node.js & NPM" -ForegroundColor Cyan
Write-Host "-" * 50

if (Test-Command "node") {
  $nodeVersion = Get-CommandVersion "node"
  Write-Status "Node.js installed: v$nodeVersion" "Pass"
} else {
  Write-Status "Node.js not found (required)" "Fail"
  $allPass = $false
}

if (Test-Command "npm") {
  $npmVersion = Get-CommandVersion "npm"
  Write-Status "npm installed: v$npmVersion" "Pass"
} else {
  Write-Status "npm not found (required)" "Fail"
  $allPass = $false
}

# ============================================================================
# Git
# ============================================================================
Write-Host "`n🔗 Version Control (Git)" -ForegroundColor Cyan
Write-Host "-" * 50

if (Test-Command "git") {
  $gitVersion = Get-CommandVersion "git"
  Write-Status "Git installed: v$gitVersion" "Pass"
  
  # Check git status
  try {
    $gitStatus = git status --porcelain 2>&1 | Measure-Object -Line | Select-Object -ExpandProperty Lines
    if ($gitStatus -eq 0) {
      Write-Status "Git working directory clean" "Pass"
    } else {
      Write-Status "Git has $gitStatus uncommitted changes" "Warn"
    }
  } catch {
    Write-Status "Could not check git status" "Warn"
  }
} else {
  Write-Status "Git not found (required)" "Fail"
  $allPass = $false
}

# ============================================================================
# API Health
# ============================================================================
Write-Host "`n🚀 API Server" -ForegroundColor Cyan
Write-Host "-" * 50

$apiEndpoints = @(
  @{ url = "http://localhost:4000"; name = "Local API" }
  @{ url = "http://localhost:4000/db/health"; name = "DB Health" }
)

foreach ($endpoint in $apiEndpoints) {
  try {
    $response = Invoke-WebRequest -Uri $endpoint.url -TimeoutSec 2 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
      Write-Status "$($endpoint.name) is up ($($endpoint.url))" "Pass"
    } else {
      Write-Status "$($endpoint.name) returned $($response.StatusCode)" "Warn"
    }
  } catch {
    Write-Status "$($endpoint.name) not accessible ($($endpoint.url))" "Warn"
  }
}

# ============================================================================
# Mobile Environment
# ============================================================================
Write-Host "`n📱 Mobile (React Native / Expo)" -ForegroundColor Cyan
Write-Host "-" * 50

$mobileDir = "./mobile"
if (Test-Path $mobileDir -PathType Container) {
  Write-Status "Mobile directory exists" "Pass"
  
  if (Test-Path "$mobileDir/package.json") {
    Write-Status "Mobile package.json exists" "Pass"
  } else {
    Write-Status "Mobile package.json missing" "Fail"
    $allPass = $false
  }
  
  if (Test-Path "$mobileDir/node_modules" -PathType Container) {
    Write-Status "Mobile node_modules exists" "Pass"
  } else {
    Write-Status "Mobile node_modules missing (run: npm install)" "Warn"
  }
} else {
  Write-Status "Mobile directory not found" "Fail"
  $allPass = $false
}

if (Test-Command "expo") {
  $expoVersion = Get-CommandVersion "expo"
  Write-Status "Expo CLI installed: v$expoVersion" "Pass"
} else {
  Write-Status "Expo CLI not found (recommended: npm install -g expo-cli)" "Warn"
}

# ============================================================================
# Web Environment
# ============================================================================
Write-Host "`n🌐 Web (Next.js)" -ForegroundColor Cyan
Write-Host "-" * 50

$webDir = "./web"
if (Test-Path $webDir -PathType Container) {
  Write-Status "Web directory exists" "Pass"
  
  if (Test-Path "$webDir/package.json") {
    Write-Status "Web package.json exists" "Pass"
  } else {
    Write-Status "Web package.json missing" "Fail"
    $allPass = $false
  }
  
  if (Test-Path "$webDir/node_modules" -PathType Container) {
    Write-Status "Web node_modules exists" "Pass"
  } else {
    Write-Status "Web node_modules missing (run: npm install)" "Warn"
  }
} else {
  Write-Status "Web directory not found" "Fail"
  $allPass = $false
}

# ============================================================================
# API Environment
# ============================================================================
Write-Host "`n⚙️  API (NestJS)" -ForegroundColor Cyan
Write-Host "-" * 50

$apiDir = "./api"
if (Test-Path $apiDir -PathType Container) {
  Write-Status "API directory exists" "Pass"
  
  if (Test-Path "$apiDir/package.json") {
    Write-Status "API package.json exists" "Pass"
  } else {
    Write-Status "API package.json missing" "Fail"
    $allPass = $false
  }
  
  if (Test-Path "$apiDir/node_modules" -PathType Container) {
    Write-Status "API node_modules exists" "Pass"
  } else {
    Write-Status "API node_modules missing (run: npm install)" "Warn"
  }
  
  if (Test-Path "$apiDir/prisma/schema.prisma") {
    Write-Status "Prisma schema exists" "Pass"
  } else {
    Write-Status "Prisma schema missing" "Warn"
  }
} else {
  Write-Status "API directory not found" "Fail"
  $allPass = $false
}

# ============================================================================
# Ports Availability
# ============================================================================
Write-Host "`n🔌 Port Availability" -ForegroundColor Cyan
Write-Host "-" * 50

$ports = @(3000, 4000, 8081, 8082)
foreach ($port in $ports) {
  try {
    $hostInfo = "." # localhost
    $tcpClient = [System.Net.Sockets.TcpClient]::new()
    $tcpClient.ConnectAsync($hostInfo, $port).Wait(500)
    
    if ($tcpClient.Connected) {
      Write-Status "Port $port is in use" "Warn"
      $tcpClient.Close()
    } else {
      Write-Status "Port $port is available" "Pass"
    }
  } catch {
    Write-Status "Port $port is available" "Pass"
  }
}

# ============================================================================
# Factory Kit Infrastructure
# ============================================================================
Write-Host "`n🏭 Factory Platform Kit" -ForegroundColor Cyan
Write-Host "-" * 50

$kitFiles = @(
  @{ path = "./specs"; name = "Specs directory" }
  @{ path = "./specs/mobile.feature.v1.schema.json"; name = "Feature schema" }
  @{ path = "./specs/examples/feature-sample.json"; name = "Example spec" }
  @{ path = "./tools/generate-mobile-feature.mjs"; name = "Generator script" }
  @{ path = "./mobile/src/routes/routeRegistry.js"; name = "Route registry" }
  @{ path = "./mobile/src/lib/mockMode.js"; name = "Mock mode library" }
  @{ path = "./mobile/src/screens/DemoHubScreen.js"; name = "Demo Hub screen" }
)

foreach ($file in $kitFiles) {
  if (Test-Path $file.path) {
    Write-Status "$($file.name) exists" "Pass"
  } else {
    Write-Status "$($file.name) missing" "Warn"
  }
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "`n" + ("=" * 50)
if ($allPass) {
  Write-Status "✨ All critical checks passed!" "Pass"
  exit 0
} else {
  Write-Status "⚠️  Some critical checks failed. Please review above." "Warn"
  exit 1
}
Write-Host ("=" * 50) + "`n"
