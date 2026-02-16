$ErrorActionPreference = 'Stop'

$repoRootCandidate = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$ensureRepoPath = Join-Path $PSScriptRoot 'ensure-repo.ps1'
$proofDir = Join-Path $repoRootCandidate 'proof\runs'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$proofFile = Join-Path $proofDir "proof-s7-$timestamp.txt"

New-Item -ItemType Directory -Path $proofDir -Force | Out-Null
New-Item -ItemType File -Path $proofFile -Force | Out-Null

function Write-Log {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string] $Message
    )

    Write-Host $Message
    Add-Content -Path $proofFile -Value $Message
}

function Invoke-LoggedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [int] $StepNumber,

        [Parameter(Mandatory = $true)]
        [string] $Command,

        [Parameter(Mandatory = $true)]
        [bool] $FailOnError,

        [string] $StatusName = ''
    )

    Write-Log "STEP_${StepNumber}_COMMAND=$Command"

    $output = & pwsh -NoProfile -Command $Command 2>&1
    $exitCode = $LASTEXITCODE

    if ($null -ne $output) {
        foreach ($line in @($output)) {
            Write-Log ([string]$line)
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($StatusName)) {
        if ($exitCode -eq 0) {
            Write-Log "$StatusName=PASS"
        }
        else {
            Write-Log "$StatusName=FAIL"
        }
    }

    if ($FailOnError -and $exitCode -ne 0) {
        Write-Log "EXIT_CODE=$exitCode"
        Write-Log "PROOF_FILE=$proofFile"
        exit $exitCode
    }

    return $exitCode
}

Write-Log 'VERIFY_REPO'
$verifyCommand = "Set-Location -LiteralPath '$repoRootCandidate'; & '$ensureRepoPath'"
$verifyOutput = & pwsh -NoProfile -Command $verifyCommand 2>&1
$verifyExitCode = $LASTEXITCODE

if ($null -ne $verifyOutput) {
    foreach ($line in @($verifyOutput)) {
        Write-Log ([string]$line)
    }
}

if ($verifyExitCode -ne 0) {
    Write-Log "EXIT_CODE=$verifyExitCode"
    Write-Log "PROOF_FILE=$proofFile"
    exit $verifyExitCode
}

Set-Location -LiteralPath $repoRootCandidate

Invoke-LoggedCommand -StepNumber 1 -Command 'git rev-parse --show-toplevel' -FailOnError $true | Out-Null
Invoke-LoggedCommand -StepNumber 2 -Command 'git status --short' -FailOnError $true | Out-Null
Invoke-LoggedCommand -StepNumber 3 -Command 'git log -1 --oneline' -FailOnError $true | Out-Null
Invoke-LoggedCommand -StepNumber 4 -Command 'npm -C api run lint' -FailOnError $true | Out-Null
Invoke-LoggedCommand -StepNumber 5 -Command 'npm -C api run build' -FailOnError $true | Out-Null
Invoke-LoggedCommand -StepNumber 6 -Command 'npm -C api run test:e2e' -FailOnError $true | Out-Null
Invoke-LoggedCommand -StepNumber 7 -Command 'rg -n "@(Post|Put|Patch|Delete)\(" api/src; if ($LASTEXITCODE -ne 0) { "NO_WRITE_ENDPOINTS"; exit 0 }' -FailOnError $false -StatusName 'STEP7_STATUS' | Out-Null
Invoke-LoggedCommand -StepNumber 8 -Command 'rg -n "app\.(post|put|patch|delete)\(" api/src; if ($LASTEXITCODE -ne 0) { "NO_EXPRESS_WRITE"; exit 0 }' -FailOnError $false -StatusName 'STEP8_STATUS' | Out-Null
Invoke-LoggedCommand -StepNumber 9 -Command 'gh run list --repo mdislam7895121/factory --limit 3 --json databaseId,headSha,status,conclusion,displayTitle,createdAt' -FailOnError $false -StatusName 'STEP9_STATUS' | Out-Null
Invoke-LoggedCommand -StepNumber 10 -Command 'git ls-remote --heads origin main' -FailOnError $false -StatusName 'STEP10_STATUS' | Out-Null

Write-Log 'EXIT_CODE=0'
Write-Log "PROOF_FILE=$proofFile"
exit 0
