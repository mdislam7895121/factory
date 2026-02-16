param(
    [Parameter(Mandatory=$false)]
    [string]$WebUrl = $env:WEB_SMOKE_URL,

    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = $env:API_SMOKE_URL,

    [Parameter(Mandatory=$false)]
    [int]$WebExpectedStatus = 200,

    [Parameter(Mandatory=$false)]
    [int]$ApiExpectedStatus = 200,

    [Parameter(Mandatory=$false)]
    [int]$TimeoutSeconds = 20
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Test-Endpoint {
    param(
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)][string]$Url,
        [Parameter(Mandatory=$true)][int]$ExpectedStatus,
        [Parameter(Mandatory=$true)][int]$Timeout
    )

    if ([string]::IsNullOrWhiteSpace($Url)) {
        Write-Error "$Name URL is not set. Pass -$($Name)Url or set environment variable."
        return $false
    }

    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec $Timeout -SkipHttpErrorCheck
        $status = [int]$response.StatusCode
        Write-Host "$Name smoke: URL=$Url STATUS=$status EXPECTED=$ExpectedStatus"
        if ($status -ne $ExpectedStatus) {
            Write-Error "$Name smoke failed: expected $ExpectedStatus but got $status"
            return $false
        }
        return $true
    }
    catch {
        Write-Error "$Name smoke request failed: $($_.Exception.Message)"
        return $false
    }
}

Write-Host '=== PROOF: git status ==='
git status

Write-Host '=== PROOF: git diff --stat ==='
git diff --stat

$webOk = Test-Endpoint -Name 'Web' -Url $WebUrl -ExpectedStatus $WebExpectedStatus -Timeout $TimeoutSeconds
$apiOk = Test-Endpoint -Name 'Api' -Url $ApiUrl -ExpectedStatus $ApiExpectedStatus -Timeout $TimeoutSeconds

if (-not ($webOk -and $apiOk)) {
    Write-Host '=== PROOF RESULT: FAILED ==='
    exit 1
}

Write-Host '=== PROOF RESULT: SUCCESS ==='
exit 0
