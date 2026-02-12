#Requires -Version 7.0
<#
.SYNOPSIS
    Post-deployment smoke tests for Factory Platform.
    
.DESCRIPTION
    Validates deployed API and Web services via HTTP checks.
    Supports local dry-run mode for CI validation.
    
.PARAMETER ApiUrl
    Base URL of deployed API. Example: https://your-api.up.railway.app
    
.PARAMETER WebUrl
    Base URL of deployed Web. Example: https://your-site.netlify.app
    
.PARAMETER TimeoutSec
    HTTP request timeout in seconds. Default: 10
    
.PARAMETER LocalOnly
    When specified, performs URL validation only (no HTTP calls).
    Used for CI syntax/param validation. Always exits 0.
    
.EXAMPLES
    # Real deployment verification
    .\post-deploy-smoke.ps1 -ApiUrl https://api.example.com -WebUrl https://web.example.com
    
    # CI syntax validation mode
    .\post-deploy-smoke.ps1 -ApiUrl https://api.example.com -WebUrl https://web.example.com -LocalOnly
    
.NOTES
    Non-mutating. Fail-fast on check failures unless -LocalOnly is used.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$WebUrl,
    
    [int]$TimeoutSec = 10,
    
    [switch]$LocalOnly
)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$allPassed = $true
$checkCount = 0
$passCount = 0

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  POST-DEPLOYMENT SMOKE TESTS"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

if ($LocalOnly) {
    Write-Host "Mode: LOCAL VALIDATION (no HTTP checks)" -ForegroundColor Yellow
}
else {
    Write-Host "Mode: PRODUCTION VERIFICATION" -ForegroundColor Yellow
}

Write-Host "Api URL: $ApiUrl" -ForegroundColor Gray
Write-Host "Web URL: $WebUrl" -ForegroundColor Gray
Write-Host "Timeout: ${TimeoutSec}s" -ForegroundColor Gray
Write-Host ""

# Validate URL formats
if ($ApiUrl -notmatch '^https?://') {
    Write-Host "X FAIL: Invalid API URL format (must start with http:// or https://)" -ForegroundColor Red
    $allPassed = $false
}

if ($WebUrl -notmatch '^https?://') {
    Write-Host "X FAIL: Invalid Web URL format (must start with http:// or https://)" -ForegroundColor Red
    $allPassed = $false
}

if (!$allPassed) {
    exit 1
}

if ($LocalOnly) {
    Write-Host "URL Formats: VALID" -ForegroundColor Green
    Write-Host ""
    Write-Host "Intended checks (not executed in -LocalOnly mode):" -ForegroundColor Gray
    Write-Host "  - CHECK 1: GET $ApiUrl/ (expect 200, body contains 'Hello')" -ForegroundColor Gray
    Write-Host "  - CHECK 2: GET $ApiUrl/db/health (expect JSON with ok:true)" -ForegroundColor Gray
    Write-Host "  - CHECK 3: GET $WebUrl/ (expect 200)" -ForegroundColor Gray
    Write-Host "  - CHECK 4: GET $WebUrl/factory-preview (expect 200)" -ForegroundColor Gray
    Write-Host "  - CHECK 5: GET $WebUrl/factory-preview/index.json (expect JSON)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "===================================================================" -ForegroundColor Green
    Write-Host "  VALIDATION PASSED (LocalOnly mode)" -ForegroundColor Green
    Write-Host "===================================================================" -ForegroundColor Green
    Write-Host ""
    exit 0
}

# Helper function for HTTP GET with error handling
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description,
        [scriptblock]$ValidationScript
    )
    
    Write-Host "CHECK $($Global:checkCount + 1): $Description" -ForegroundColor Cyan
    Write-Host "  GET $Url"
    
    $Global:checkCount++
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSec -SkipHttpErrorCheck -SkipCertificateCheck
        
        # Run validation
        if ($ValidationScript) {
            $result = & $ValidationScript $response
            if ($result) {
                Write-Host "  [OK] $Description" -ForegroundColor Green
                $Global:passCount++
                return $true
            }
            else {
                Write-Host "  [FAIL] Validation failed" -ForegroundColor Red
                return $false
            }
        }
        else {
            if ($response.StatusCode -eq 200) {
                Write-Host "  [OK] Status 200" -ForegroundColor Green
                $Global:passCount++
                return $true
            }
            else {
                Write-Host "  [FAIL] Status $($response.StatusCode)" -ForegroundColor Red
                return $false
            }
        }
    }
    catch {
        Write-Host "  [FAIL] $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# CHECK 1: API root
$check1Pass = Test-Endpoint -Url "$ApiUrl/" -Description "API root health" -ValidationScript {
    param($response)
    return ($response.StatusCode -eq 200 -and $response.Content -like "*Hello*")
}

if (!$check1Pass) {
    $allPassed = $false
}

Write-Host ""

# CHECK 2: API database health
$check2Pass = Test-Endpoint -Url "$ApiUrl/db/health" -Description "API database health" -ValidationScript {
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

if (!$check2Pass) {
    $allPassed = $false
}

Write-Host ""

# CHECK 3: Web root
$check3Pass = Test-Endpoint -Url "$WebUrl/" -Description "Web root accessibility" -ValidationScript {
    param($response)
    return ($response.StatusCode -eq 200)
}

if (!$check3Pass) {
    $allPassed = $false
}

Write-Host ""

# CHECK 4: Factory preview
$check4Pass = Test-Endpoint -Url "$WebUrl/factory-preview" -Description "Feature preview availability" -ValidationScript {
    param($response)
    return ($response.StatusCode -eq 200)
}

if (!$check4Pass) {
    $allPassed = $false
}

Write-Host ""

# CHECK 5: Preview index
$check5Pass = Test-Endpoint -Url "$WebUrl/factory-preview/index.json" -Description "Preview index validation" -ValidationScript {
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

if (!$check5Pass) {
    $allPassed = $false
}

Write-Host ""

# Summary
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  SUMMARY"
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Total checks: $Global:checkCount"
Write-Host "Passed: $passCount"
Write-Host "Failed: $($Global:checkCount - $passCount)"
Write-Host ""

if ($allPassed) {
    Write-Host "X RESULT: ALL CHECKS PASSED" -ForegroundColor Green
    Write-Host ""
    exit 0
}
else {
    Write-Host "X RESULT: SOME CHECKS FAILED" -ForegroundColor Red
    Write-Host ""
    exit 1
}
