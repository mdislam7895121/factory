#Requires -Version 7.0
[CmdletBinding()]
param(
  [string]$BaseUrl = 'https://factory-production-production.up.railway.app',
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Invoke-EndpointProbe {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
  $statusCode = [int]$response.StatusCode
  $rawBody = [string]($response.Content ?? '')
  $bodyPreview = ($rawBody -split "`r?`n" | Select-Object -First 20) -join [Environment]::NewLine

  Write-Host "URL=$Url"
  Write-Host "STATUS=$statusCode"
  Write-Host 'BODY_PREVIEW_START'
  Write-Host $bodyPreview
  Write-Host 'BODY_PREVIEW_END'
  Write-Host ''

  return [pscustomobject]@{
    StatusCode = $statusCode
    Body = $rawBody
  }
}

function Test-IsJson {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Text
  )

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return $false
  }

  try {
    $null = $Text | ConvertFrom-Json
    return $true
  }
  catch {
    return $false
  }
}

$dbUrl = "$($BaseUrl.TrimEnd('/'))/db/health"
$readyUrl = "$($BaseUrl.TrimEnd('/'))/ready"

Write-Host "[PROD_SMOKE] Base URL: $BaseUrl"
Write-Host "[PROD_SMOKE] TimeoutSec: $TimeoutSec"
Write-Host ''

$dbProbe = Invoke-EndpointProbe -Url $dbUrl
$readyProbe = Invoke-EndpointProbe -Url $readyUrl

$readyIsJson = Test-IsJson -Text $readyProbe.Body

if ($dbProbe.StatusCode -ne 200) {
  Write-Error "/db/health returned non-200 status: $($dbProbe.StatusCode)"
  exit 1
}

if ($readyProbe.StatusCode -ne 200) {
  Write-Error "/ready returned non-200 status: $($readyProbe.StatusCode)"
  exit 1
}

if (-not $readyIsJson) {
  Write-Error '/ready body is not valid JSON'
  exit 1
}

$readyJson = $readyProbe.Body | ConvertFrom-Json
if ($readyJson.ok -ne $true) {
  Write-Error '/ready JSON did not report ok=true'
  exit 1
}

Write-Host '[PROD_SMOKE] PASS'
exit 0
