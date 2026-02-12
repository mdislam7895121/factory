#Requires -Version 7.0

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ApiUrl,

    [Parameter(Mandatory = $true)]
    [string]$WebUrl,

    [int]$TimeoutSec = 20,

    [switch]$LocalOnly
)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$allPassed = $true
$checkCount = 0
$passCount = 0

function Write-ResultLine {
    param(
        [string]$Level,
        [string]$Message
    )

    Write-Host "[$Level] $Message"
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [scriptblock]$Validator
    )

    $script:checkCount++
    Write-ResultLine -Level 'OK' -Message "CHECK $checkCount START $Name $Url"

    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
        $valid = & $Validator $response
        if ($valid) {
            $script:passCount++
            Write-ResultLine -Level 'OK' -Message "CHECK $checkCount PASS $Name status=$($response.StatusCode)"
            return $true
        }

        Write-ResultLine -Level 'FAIL' -Message "CHECK $checkCount FAIL $Name status=$($response.StatusCode)"
        return $false
    }
    catch {
        Write-ResultLine -Level 'FAIL' -Message "CHECK $checkCount FAIL $Name error=$($_.Exception.Message)"
        return $false
    }
}

if ($ApiUrl -notmatch '^https?://') {
    Write-ResultLine -Level 'FAIL' -Message 'ApiUrl must start with http:// or https://'
    exit 1
}

if ($WebUrl -notmatch '^https?://') {
    Write-ResultLine -Level 'FAIL' -Message 'WebUrl must start with http:// or https://'
    exit 1
}

if ($LocalOnly) {
    Write-ResultLine -Level 'OK' -Message 'LocalOnly format validation passed'
    Write-ResultLine -Level 'OK' -Message "ApiUrl=$ApiUrl"
    Write-ResultLine -Level 'OK' -Message "WebUrl=$WebUrl"
    exit 0
}

$check1 = Test-Endpoint -Name 'API_ROOT' -Url "$ApiUrl/" -Validator {
    param($response)
    return ($response.StatusCode -eq 200 -and $response.Content -like '*Hello*' -or $response.Content -like '*Service temporarily limited*')
}
if (-not $check1) { $allPassed = $false }

$check2 = Test-Endpoint -Name 'API_DB_HEALTH' -Url "$ApiUrl/db/health" -Validator {
    param($response)
    if ($response.StatusCode -ne 200) { return $false }
    try {
        $json = $response.Content | ConvertFrom-Json
        return ($json.ok -eq $true)
    }
    catch {
        return $false
    }
}
if (-not $check2) { $allPassed = $false }

$check3 = Test-Endpoint -Name 'WEB_ROOT' -Url "$WebUrl/" -Validator {
    param($response)
    return ($response.StatusCode -eq 200)
}
if (-not $check3) { $allPassed = $false }

$check4 = Test-Endpoint -Name 'WEB_FACTORY_PREVIEW' -Url "$WebUrl/factory-preview" -Validator {
    param($response)
    return ($response.StatusCode -eq 200)
}
if (-not $check4) { $allPassed = $false }

$check5 = Test-Endpoint -Name 'WEB_FACTORY_PREVIEW_INDEX' -Url "$WebUrl/factory-preview/index.json" -Validator {
    param($response)
    if ($response.StatusCode -ne 200) { return $false }
    try {
        $json = $response.Content | ConvertFrom-Json
        return ($json.routes -is [array])
    }
    catch {
        return $false
    }
}
if (-not $check5) { $allPassed = $false }

$failedCount = $checkCount - $passCount
if ($allPassed) {
    Write-ResultLine -Level 'OK' -Message "SUMMARY pass=$passCount fail=$failedCount"
    exit 0
}

Write-ResultLine -Level 'FAIL' -Message "SUMMARY pass=$passCount fail=$failedCount"
exit 1
