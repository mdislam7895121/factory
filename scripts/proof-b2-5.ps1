<#
.SYNOPSIS
  Validates Serial B2-5 proof steps for web + api and writes a proof report.

.DESCRIPTION
  - Assumes web dev server is already running on port 3000
  - Assumes api dev server is already running on port 4000
  - Runs web build
  - Calls required endpoints
  - Writes docs/proof/serial-b2-5.md and logs
  - Fails on any error (exit 1)
#>

param(
  [int]$TimeoutSeconds = 30
)

$ErrorActionPreference = "Stop"

function Write-Section($Text) {
  Write-Host "`n=== $Text ===" -ForegroundColor Cyan
}

function Write-Log($LogFile, $Text) {
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Text
  Add-Content -Path $LogFile -Value $line
}

$Root = Split-Path -Parent $PSScriptRoot
$WebDir = Join-Path $Root "web"
$ProofDir = Join-Path $Root "docs\proof"
$LogDir = Join-Path $Root "logs"

New-Item -ItemType Directory -Path $ProofDir -Force | Out-Null
New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ProofFile = Join-Path $ProofDir "serial-b2-5.md"
$RawLog = Join-Path $LogDir "proof-b2-5-$Timestamp.log"

New-Item -ItemType File -Path $RawLog -Force | Out-Null

$webStatus = $null
$webBuildOutput = ""
$apiRoot = $null
$db1 = $null
$db2 = $null
$failure = $null

try {
  Write-Section "Web GET / (port 3000)"
  $webResp = Invoke-WebRequest -Uri "http://localhost:3000/" -Method Get -UseBasicParsing
  $webStatus = $webResp.StatusCode
  Write-Host "Web StatusCode: $webStatus" -ForegroundColor Green
  Write-Log $RawLog "Web GET / StatusCode: $webStatus"
  if ($webStatus -ne 200) {
    throw "Web GET / returned status $webStatus"
  }

  Write-Section "Web build (npm run build)"
  Push-Location $WebDir
  try {
    $webBuildOutput = (npm run build 2>&1 | Out-String)
  } finally {
    Pop-Location
  }
  Write-Log $RawLog "Web build output:"
  Write-Log $RawLog $webBuildOutput
  if ($LASTEXITCODE -ne 0) {
    throw "Web build failed. See $RawLog"
  }

  Write-Section "API GET / (port 4000)"
  $apiRoot = Invoke-RestMethod -Uri "http://localhost:4000/" -Method Get
  Write-Log $RawLog "API GET / Response: $apiRoot"
  if ($apiRoot -ne "Hello World!") {
    throw "API GET / unexpected response: $apiRoot"
  }

  Write-Section "API GET /db/health (1)"
  $db1 = Invoke-RestMethod -Uri "http://localhost:4000/db/health" -Method Get
  Write-Log $RawLog "API db/health (1): $(ConvertTo-Json $db1 -Depth 5)"
  if (-not $db1.ok) {
    throw "API db/health (1) ok=false"
  }

  Write-Section "API GET /db/health (2)"
  $db2 = Invoke-RestMethod -Uri "http://localhost:4000/db/health" -Method Get
  Write-Log $RawLog "API db/health (2): $(ConvertTo-Json $db2 -Depth 5)"
  if (-not $db2.ok) {
    throw "API db/health (2) ok=false"
  }

  $count1 = [int]$db1.count
  $count2 = [int]$db2.count
  if ($count2 -le $count1) {
    throw "db/health count did not increase: $count1 -> $count2"
  }
}
catch {
  $failure = $_.Exception.Message
  Write-Host "ERROR: $failure" -ForegroundColor Red
  Write-Log $RawLog "ERROR: $failure"
}

$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$webBuildTail = if ($webBuildOutput) { ($webBuildOutput -split "`r?`n" | Select-Object -Last 60) -join "`n" } else { "" }
$webStatusLine = if ($webStatus) { $webStatus } else { "N/A" }
$apiRootLine = if ($apiRoot) { $apiRoot } else { "N/A" }
$db1Json = if ($db1) { ConvertTo-Json $db1 -Depth 5 } else { "N/A" }
$db2Json = if ($db2) { ConvertTo-Json $db2 -Depth 5 } else { "N/A" }
$webBuildTailSafe = if ($webBuildTail) { $webBuildTail } else { "N/A" }

$proof = @"
# Serial B2-5 Proof Report

**Date/Time:** $now

## Commands Run
- web: npm run dev (already running)
- web: npm run build
- api: npm run start:dev (already running)
- web GET /: Invoke-WebRequest http://localhost:3000/
- api GET /: Invoke-RestMethod http://localhost:4000/
- api GET /db/health (x2)

## Output Snippets

### Web GET / StatusCode
~~~
$webStatusLine
~~~

### Web build output (tail)
~~~
$webBuildTailSafe
~~~

### API GET / Response
~~~
$apiRootLine
~~~

### API GET /db/health Response 1
~~~
$db1Json
~~~

### API GET /db/health Response 2
~~~
$db2Json
~~~

## Raw Log
- $RawLog

## Definition of Done
- [$(if ($webStatus -eq 200) { "x" } else { " " })] Web dev server starts on port 3000 and GET / returns 200
- [$(if ($webBuildOutput -and $LASTEXITCODE -eq 0) { "x" } else { " " })] Web build succeeds
- [$(if ($apiRoot -eq "Hello World!") { "x" } else { " " })] API GET / returns Hello World
- [$(if ($db1 -and $db2 -and $count2 -gt $count1) { "x" } else { " " })] db/health count increases across two calls

## Failure (if any)
$(if ($failure) { "- $failure" } else { "- None" })

## Rollback Steps
- git revert <commit-hash>
- git checkout -- docs/proof/serial-b2-5.md scripts/proof-b2-5.ps1
"@

$proof | Out-File -FilePath $ProofFile -Encoding UTF8
Write-Host "Proof report written: $ProofFile" -ForegroundColor Green

if ($failure) {
  exit 1
}
