#Requires -Version 7.0

[CmdletBinding()]
param(
    [string]$ApiUrl,
    [string]$WebUrl,
    [int]$TimeoutSec = 20,
    [switch]$LocalOnly,
    [switch]$ExpectKillSwitch
)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$allPassed = $true
$checkCount = 0
$passCount = 0

function Write-Result {
    param([string]$Level, [string]$Message)
    Write-Host "[$Level] $Message"
}

function Test-UrlFormat {
    param(
        [string]$Name,
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        Write-Result -Level 'FAIL' -Message "$Name is required"
        return $false
    }

    if ($Value -notmatch '^https?://') {
        Write-Result -Level 'FAIL' -Message "$Name must start with http:// or https://"
        return $false
    }

    Write-Result -Level 'OK' -Message "$Name format is valid"
    return $true
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [scriptblock]$Validator
    )

    $script:checkCount++
    Write-Result -Level 'OK' -Message "CHECK $checkCount START $Name $Url"

    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
        $isValid = & $Validator $response
        if ($isValid) {
            $script:passCount++
            Write-Result -Level 'OK' -Message "CHECK $checkCount PASS $Name status=$($response.StatusCode)"
            return $true
        }

        Write-Result -Level 'FAIL' -Message "CHECK $checkCount FAIL $Name status=$($response.StatusCode)"
        return $false
    }
    catch {
        Write-Result -Level 'FAIL' -Message "CHECK $checkCount FAIL $Name error=$($_.Exception.Message)"
        return $false
    }
}

Write-Result -Level 'OK' -Message 'Incident drill started (safe mode: read-only HTTP checks)'

if ($LocalOnly) {
    if (-not [string]::IsNullOrWhiteSpace($ApiUrl)) {
        if (-not (Test-UrlFormat -Name 'ApiUrl' -Value $ApiUrl)) {
            $allPassed = $false
        }
    }
    else {
        Write-Result -Level 'WARN' -Message 'ApiUrl not provided in LocalOnly mode; format validation skipped'
    }

    if (-not [string]::IsNullOrWhiteSpace($WebUrl)) {
        if (-not (Test-UrlFormat -Name 'WebUrl' -Value $WebUrl)) {
            $allPassed = $false
        }
    }
    else {
        Write-Result -Level 'WARN' -Message 'WebUrl not provided in LocalOnly mode; format validation skipped'
    }

    Write-Result -Level 'OK' -Message 'Intended live checks:'
    Write-Result -Level 'OK' -Message ' - GET API /'
    Write-Result -Level 'OK' -Message ' - GET API /db/health'
    Write-Result -Level 'OK' -Message ' - GET WEB /'
    Write-Result -Level 'OK' -Message ' - GET WEB /factory-preview'
    Write-Result -Level 'OK' -Message ' - GET WEB /factory-preview/index.json'
    if ($ExpectKillSwitch) {
        Write-Result -Level 'OK' -Message ' - GET API /__non_allowlisted_probe__ expect 503 and SERVICE_DISABLED when kill switch is ON'
    }
    else {
        Write-Result -Level 'OK' -Message ' - GET API /__non_allowlisted_probe__ expect non-503 when kill switch is OFF'
    }

    if ($allPassed) {
        Write-Result -Level 'OK' -Message 'LocalOnly drill validation passed'
        exit 0
    }

    Write-Result -Level 'FAIL' -Message 'LocalOnly drill validation failed'
    exit 1
}

if (-not (Test-UrlFormat -Name 'ApiUrl' -Value $ApiUrl)) { $allPassed = $false }
if (-not (Test-UrlFormat -Name 'WebUrl' -Value $WebUrl)) { $allPassed = $false }
if (-not $allPassed) { exit 1 }

$c1 = Test-Endpoint -Name 'API_ROOT' -Url "$ApiUrl/" -Validator {
    param($response)
    return ($response.StatusCode -eq 200)
}
if (-not $c1) { $allPassed = $false }

$c2 = Test-Endpoint -Name 'API_DB_HEALTH' -Url "$ApiUrl/db/health" -Validator {
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
if (-not $c2) { $allPassed = $false }

$c3 = Test-Endpoint -Name 'WEB_ROOT' -Url "$WebUrl/" -Validator {
    param($response)
    return ($response.StatusCode -eq 200)
}
if (-not $c3) { $allPassed = $false }

$c4 = Test-Endpoint -Name 'WEB_FACTORY_PREVIEW' -Url "$WebUrl/factory-preview" -Validator {
    param($response)
    return ($response.StatusCode -eq 200)
}
if (-not $c4) { $allPassed = $false }

$c5 = Test-Endpoint -Name 'WEB_FACTORY_PREVIEW_INDEX' -Url "$WebUrl/factory-preview/index.json" -Validator {
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
if (-not $c5) { $allPassed = $false }

$probe = Test-Endpoint -Name 'API_NON_ALLOWLISTED_PROBE' -Url "$ApiUrl/__non_allowlisted_probe__" -Validator {
    param($response)
    if ($ExpectKillSwitch) {
        return ($response.StatusCode -eq 503 -and $response.Content -like '*SERVICE_DISABLED*')
    }

    return ($response.StatusCode -ne 503)
}
if (-not $probe) { $allPassed = $false }

$failedCount = $checkCount - $passCount
if ($allPassed) {
    Write-Result -Level 'OK' -Message "SUMMARY pass=$passCount fail=$failedCount"
    exit 0
}

Write-Result -Level 'FAIL' -Message "SUMMARY pass=$passCount fail=$failedCount"
exit 1
