$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$proofDir = Join-Path $RepoRoot 'proof\runs'
$proofFile = Join-Path $proofDir "serial21-demo-$timestamp.txt"

New-Item -ItemType Directory -Path $proofDir -Force | Out-Null
New-Item -ItemType File -Path $proofFile -Force | Out-Null

function Write-Proof {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Message
    )
    Write-Host $Message
    Add-Content -Path $proofFile -Value $Message
}

function Invoke-Logged {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][scriptblock]$Action,
        [bool]$FailOnError = $true
    )

    Write-Proof "## $Label"
    try {
        $global:LASTEXITCODE = 0
        $result = & $Action 2>&1
        if ($null -ne $result) {
            foreach ($line in @($result)) {
                Write-Proof ([string]$line)
            }
        }
        if ($LASTEXITCODE -ne 0) {
            throw "$Label failed with exit code $LASTEXITCODE"
        }
        return $result
    }
    catch {
        Write-Proof ("ERROR=" + $_.Exception.Message)
        if ($FailOnError) {
            Write-Proof 'EXIT_CODE=1'
            Write-Proof "PROOF_FILE=$proofFile"
            throw
        }
    }
}

function Wait-Http200 {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Url,
        [int]$Attempts = 40,
        [int]$DelaySec = 2,
        [int]$TimeoutSec = 10
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
            $status = [int]$response.StatusCode
            Write-Proof ("{0}_attempt={1} status={2}" -f $Name, $attempt, $status)
            if ($status -eq 200) {
                return $response
            }
        }
        catch {
            Write-Proof ("{0}_attempt={1} error={2}" -f $Name, $attempt, $_.Exception.Message)
        }
        if ($attempt -lt $Attempts) {
            Start-Sleep -Seconds $DelaySec
        }
    }

    throw "$Name did not return HTTP 200 within retry budget."
}

Set-Location -LiteralPath $RepoRoot

Write-Proof "# SERIAL 21 Demo Proof - $timestamp"
Write-Proof ("REPO_ROOT=" + $RepoRoot)

Invoke-Logged -Label 'Prerequisites: node --version' -Action { node --version }
Invoke-Logged -Label 'Prerequisites: docker --version' -Action { docker --version }
Invoke-Logged -Label 'Prerequisites: docker compose version' -Action { docker compose version }
Invoke-Logged -Label 'Optional: railway --version' -Action { railway --version } -FailOnError $false

Invoke-Logged -Label 'Start stack: pwsh scripts/dev-up.ps1' -Action { pwsh -NoProfile -File (Join-Path $RepoRoot 'scripts/dev-up.ps1') }

$null = Wait-Http200 -Name 'db_health' -Url 'http://localhost:4000/db/health' -Attempts 50 -DelaySec 2 -TimeoutSec 10
$dbHealth = Invoke-WebRequest -Uri 'http://localhost:4000/db/health' -UseBasicParsing -TimeoutSec 10
Write-Proof ("db_health_status=" + [int]$dbHealth.StatusCode)
Write-Proof ("db_health_body=" + (($dbHealth.Content -replace "`r", '') -replace "`n", ''))

$null = Wait-Http200 -Name 'ready' -Url 'http://localhost:4000/ready' -Attempts 50 -DelaySec 2 -TimeoutSec 10
$ready = Invoke-WebRequest -Uri 'http://localhost:4000/ready' -UseBasicParsing -TimeoutSec 10
Write-Proof ("ready_status=" + [int]$ready.StatusCode)
Write-Proof ("ready_body=" + (($ready.Content -replace "`r", '') -replace "`n", ''))

$templates = Invoke-WebRequest -Uri 'http://localhost:4000/v1/templates' -UseBasicParsing -TimeoutSec 10
Write-Proof ("templates_status=" + [int]$templates.StatusCode)
Write-Proof ("templates_body=" + (($templates.Content -replace "`r", '') -replace "`n", ''))

$null = Wait-Http200 -Name 'web' -Url 'http://localhost:3000/' -Attempts 60 -DelaySec 2 -TimeoutSec 10
$web = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 10
Write-Proof ("web_status=" + [int]$web.StatusCode)

Write-Proof 'EXIT_CODE=0'
Write-Proof "PROOF_FILE=$proofFile"

Write-Host "SERIAL21_DEMO_PROOF=$proofFile"