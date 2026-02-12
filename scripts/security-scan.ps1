#Requires -Version 7.0
<#
.SYNOPSIS
    Repository security baseline scanner.
    
.DESCRIPTION
    Performs dependency audits and secret pattern scanning across workspaces.
    
.PARAMETER CiStrict
    When specified, fails on HIGH/CRITICAL vulnerabilities and any detected secrets.
    Default: local mode (WARN only, no failures)
    
.EXAMPLES
    .\security-scan.ps1
    .\security-scan.ps1 -CiStrict
    
.NOTES
    Non-mutating. Local mode does not fail on vulnerabilities.
    CI mode (-CiStrict) fails on security issues.
#>

[CmdletBinding()]
param(
    [switch]$CiStrict
)

$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$factoryRoot = Split-Path -Parent $PSScriptRoot
$workspaces = @('api', 'web', 'mobile')

$results = @{
    AuditIssues = @()
    Secrets = @()
    HasHighCritical = $false
    HasSecrets = $false
}

Write-Host ""
Write-Host "==========================================================================="
Write-Host "  SECURITY BASELINE SCAN"
Write-Host "==========================================================================="
Write-Host ""
Write-Host "Mode: $(if ($CiStrict) { 'CI STRICT' } else { 'LOCAL (non-blocking)' })"
Write-Host ""

# Phase 1: Dependency Audits
Write-Host "PHASE 1: Dependency Audits"
Write-Host "───────────────────────────"

foreach ($workspace in $workspaces) {
    $workspacePath = Join-Path $factoryRoot $workspace
    
    Write-Host "Scanning $workspace..."
    
    Push-Location $workspacePath
    try {
        $auditOutput = npm audit --omit=dev 2>&1
        $auditExitCode = $LASTEXITCODE
        
        # Parse for HIGH/CRITICAL
        if ($auditOutput -match '(HIGH|CRITICAL)') {
            $results.HasHighCritical = $true
            $results.AuditIssues += "[HIGH/CRITICAL] $workspace`n$auditOutput"
            Write-Host "  [WARN] Found HIGH/CRITICAL vulnerabilities" -ForegroundColor Yellow
        }
        else {
            Write-Host "  [OK] No HIGH/CRITICAL vulnerabilities" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  [SKIP] Could not run audit" -ForegroundColor Gray
    }
    finally {
        Pop-Location
    }
}

Write-Host ""

# Phase 2: Secret Pattern Scanning
Write-Host "PHASE 2: Secret Pattern Scanning"
Write-Host "─────────────────────────────────"

$secretPatterns = @(
    'BEGIN PRIVATE KEY'
    'AWS_SECRET'
    'OPENAI_API_KEY'
    'DATABASE_URL='
)

# Scan project files (exclude node_modules, .git, proof/runs, scripts)
$filesToScan = Get-ChildItem -Path $factoryRoot -Recurse -File `
    -Exclude *.node_modules*, *.git* `
    | Where-Object { 
        $_.FullName -notmatch '(node_modules|\.git|proof\\runs|scripts)' `
        -and $_.Extension -in @('.ts', '.js', '.json', '.env*') `
        -and $_.Length -lt 1MB
    }

Write-Host "Scanning $($filesToScan.Count) source files..."

$secretsFound = @()
foreach ($pattern in $secretPatterns) {
    $matches = $filesToScan | Select-String -Pattern $pattern -ErrorAction SilentlyContinue
    if ($matches) {
        $secretsFound += @($matches)
        $results.HasSecrets = $true
    }
}

if ($secretsFound.Count -gt 0) {
    Write-Host "  [WARN] Potential secrets detected in:" -ForegroundColor Yellow
    foreach ($finding in $secretsFound) {
        Write-Host "    - $($finding.Filename):$($finding.LineNumber)" -ForegroundColor Yellow
        $results.Secrets += "$($finding.Filename):$($finding.LineNumber)"
    }
}
else {
    Write-Host "  [OK] No obvious secret patterns detected" -ForegroundColor Green
}

Write-Host ""

# Final Summary
Write-Host "==========================================================================="
if ($CiStrict) {
    if ($results.HasSecrets) {
        Write-Host "  RESULT: FAIL (Secrets detected in CI mode)" -ForegroundColor Red
        Write-Host "==========================================================================="
        exit 1
    }
    
    if ($results.HasHighCritical) {
        Write-Host "  RESULT: FAIL (HIGH/CRITICAL vulnerabilities in CI mode)" -ForegroundColor Red
        Write-Host "==========================================================================="
        exit 1
    }
    
    Write-Host "  RESULT: PASS (No security issues in CI mode)" -ForegroundColor Green
}
else {
    if ($results.HasSecrets -or $results.HasHighCritical) {
        Write-Host "  RESULT: WARN (Issues detected, local mode non-blocking)" -ForegroundColor Yellow
    }
    else {
        Write-Host "  RESULT: PASS" -ForegroundColor Green
    }
}
Write-Host "==========================================================================="
Write-Host ""

exit 0
