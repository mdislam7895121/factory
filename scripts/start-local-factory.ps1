param(
  [string]$RepoRoot = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

function Start-Terminal {
  param(
    [string]$Title,
    [string]$WorkDir,
    [string]$Cmd
  )
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location `"$WorkDir`"; `$Host.UI.RawUI.WindowTitle = `"$Title`"; $Cmd"
  ) | Out-Null
}

$apiDir    = Join-Path $RepoRoot "api"
$webDir    = Join-Path $RepoRoot "web"
$mobileDir = Join-Path $RepoRoot "mobile"

if (!(Test-Path $apiDir))    { throw "Missing folder: api" }
if (!(Test-Path $webDir))    { throw "Missing folder: web" }
if (!(Test-Path $mobileDir)) { throw "Missing folder: mobile" }

Start-Terminal -Title "FACTORY API"    -WorkDir $apiDir    -Cmd "npm run start:dev"
Start-Terminal -Title "FACTORY WEB"    -WorkDir $webDir    -Cmd "npm run dev"
Start-Terminal -Title "FACTORY MOBILE" -WorkDir $mobileDir -Cmd "npx expo start"

Write-Host "Started 3 terminals: API, WEB, MOBILE"
