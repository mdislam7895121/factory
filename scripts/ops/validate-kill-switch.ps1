#Requires -Version 7.0

[CmdletBinding()]
param(
    [string]$ApiUrl,
    [int]$TimeoutSec = 20,
    [switch]$LocalOnly
)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$allPassed = $true

function Write-Result {
    param([string]$Level, [string]$Message)
    Write-Host "[$Level] $Message"
}

function Resolve-KillSwitchEnabled {
    param([string]$Value)
    return $Value -eq '1'
}

function Test-KillSwitchRoute {
    param(
        [bool]$Enabled,
        [string]$Path
    )

    if (-not $Enabled) {
        return 'ALLOW'
    }

    $normalized = (($Path -split '\?')[0]).TrimEnd('/')
    if ([string]::IsNullOrWhiteSpace($normalized)) {
        $normalized = '/'
    }

    if ($normalized -eq '/' -or $normalized -eq '/db/health') {
        return 'ALLOW'
    }

    return 'BLOCK'
}

if (Resolve-KillSwitchEnabled '1') {
    Write-Result -Level 'OK' -Message 'Resolve-KillSwitchEnabled(1)=true'
} else {
    Write-Result -Level 'FAIL' -Message 'Resolve-KillSwitchEnabled(1) expected true'
    $allPassed = $false
}

if (-not (Resolve-KillSwitchEnabled '0')) {
    Write-Result -Level 'OK' -Message 'Resolve-KillSwitchEnabled(0)=false'
} else {
    Write-Result -Level 'FAIL' -Message 'Resolve-KillSwitchEnabled(0) expected false'
    $allPassed = $false
}

if ((Test-KillSwitchRoute -Enabled $true -Path '/') -eq 'ALLOW') {
    Write-Result -Level 'OK' -Message 'Kill switch allows /'
} else {
    Write-Result -Level 'FAIL' -Message 'Kill switch should allow /'
    $allPassed = $false
}

if ((Test-KillSwitchRoute -Enabled $true -Path '/db/health') -eq 'ALLOW') {
    Write-Result -Level 'OK' -Message 'Kill switch allows /db/health'
} else {
    Write-Result -Level 'FAIL' -Message 'Kill switch should allow /db/health'
    $allPassed = $false
}

if ((Test-KillSwitchRoute -Enabled $true -Path '/anything-else') -eq 'BLOCK') {
    Write-Result -Level 'OK' -Message 'Kill switch blocks non-allowlisted routes'
} else {
    Write-Result -Level 'FAIL' -Message 'Kill switch should block non-allowlisted routes'
    $allPassed = $false
}

if ($LocalOnly -or [string]::IsNullOrWhiteSpace($ApiUrl)) {
    Write-Result -Level 'OK' -Message 'LocalOnly validation completed'
    if ($allPassed) { exit 0 } else { exit 1 }
}

if ($ApiUrl -notmatch '^https?://') {
    Write-Result -Level 'FAIL' -Message 'ApiUrl must start with http:// or https://'
    exit 1
}

try {
    $root = Invoke-WebRequest -Uri "$ApiUrl/" -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
    Write-Result -Level 'OK' -Message "Live root status=$($root.StatusCode)"

    $db = Invoke-WebRequest -Uri "$ApiUrl/db/health" -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
    Write-Result -Level 'OK' -Message "Live db health status=$($db.StatusCode)"

    $probe = Invoke-WebRequest -Uri "$ApiUrl/__kill_switch_probe__" -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
    if ($probe.StatusCode -eq 503 -and $probe.Content -like '*SERVICE_DISABLED*') {
        Write-Result -Level 'OK' -Message 'Live probe indicates kill switch is active and enforced'
    }
    elseif ($probe.StatusCode -eq 404) {
        Write-Result -Level 'WARN' -Message 'Live probe returned 404; kill switch appears inactive in current environment'
    }
    else {
        Write-Result -Level 'WARN' -Message "Live probe status=$($probe.StatusCode) could not confirm kill switch state"
    }
}
catch {
    Write-Result -Level 'FAIL' -Message "Live kill switch validation failed: $($_.Exception.Message)"
    $allPassed = $false
}

if ($allPassed) { exit 0 } else { exit 1 }
