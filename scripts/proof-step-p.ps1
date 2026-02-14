$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $repoRoot

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$proofDir = Join-Path $repoRoot 'proof\runs'
$proofFile = Join-Path $proofDir "proof-step-p-$timestamp.txt"

if (-not (Test-Path $proofDir)) {
    New-Item -ItemType Directory -Path $proofDir -Force | Out-Null
}

Start-Transcript -Path $proofFile -Force | Out-Null

function Run {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][scriptblock]$ScriptBlock
    )

    Write-Host ""
    Write-Host "=== $Label ==="
    $result = & $ScriptBlock
    if ($null -ne $result) {
        $rendered = $result | Out-String
        if (-not [string]::IsNullOrWhiteSpace($rendered)) {
            Write-Host $rendered.TrimEnd()
        }
    }
    return $result
}

function Get-GitStatusLines {
    $lines = @(git status --short)
    return @($lines | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Assert-GitCleanlinessPolicy {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyCollection()][string[]]$StatusLines
    )

    if ($null -eq $StatusLines) {
        $StatusLines = @()
    }

    $scriptTracked = $true
    try {
        git ls-files --error-unmatch scripts/proof-step-p.ps1 *> $null
    } catch {
        $scriptTracked = $false
    }

    if ($scriptTracked) {
        if ($StatusLines.Count -gt 0) {
            throw 'git status contains changes after commit; expected empty status only'
        }
        return 'post-commit-empty'
    }

    $allowedPreCommitStatus = @('?? scripts/proof-step-p.ps1')
    $unexpected = @($StatusLines | Where-Object { $_ -notin $allowedPreCommitStatus })
    if ($unexpected.Count -gt 0) {
        throw 'git status contains unexpected changes in pre-commit mode'
    }
    if ($StatusLines.Count -gt $allowedPreCommitStatus.Count) {
        throw 'git status contains duplicate or unexpected pre-commit entries'
    }
    return 'pre-commit-allowlist'
}

try {
    Write-Host "SERIAL P - PRODUCTION SMOKE PROOF (NON-MUTATING)"
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K')"
    Write-Host "Repo root: $repoRoot"

    Run 'Baseline: git status --short' { git status --short }
    Run 'Baseline: git log -1 --oneline' { git log -1 --oneline }

    $API_BASE = 'https://factory-production-production.up.railway.app'
    $WEB_URL = 'https://factory-production-web.netlify.app'
    $NETLIFY_SITE_ID = '3183e6f7-59b4-4bce-87e6-6267e0ec5692'

    Write-Host ""
    Write-Host "API_BASE=$API_BASE"
    Write-Host "WEB_URL=$WEB_URL"
    Write-Host "NETLIFY_SITE_ID=$NETLIFY_SITE_ID"

    $apiRoot = Run 'API: GET /' {
        Invoke-WebRequest "$API_BASE/" -UseBasicParsing | Select-Object StatusCode
    }
    if ($apiRoot.StatusCode -ne 200) {
        throw "API / did not return 200"
    }

    $apiDbHealth = Run 'API: GET /db/health' {
        Invoke-RestMethod "$API_BASE/db/health" | ConvertTo-Json -Depth 6
    }
    $apiDbHealthObj = $apiDbHealth | ConvertFrom-Json
    if ($apiDbHealthObj.ok -ne $true) {
        throw 'API /db/health did not return ok:true'
    }

    $webRoot = Run 'WEB: GET /' {
        Invoke-WebRequest "$WEB_URL/" -UseBasicParsing | Select-Object StatusCode
    }
    if ($webRoot.StatusCode -ne 200) {
        throw 'WEB / did not return 200'
    }

    Run 'Netlify: sites:list' {
        netlify sites:list
    }

    try {
        Run 'Netlify: env:get with --site (expected failure on this CLI)' {
            $result = netlify env:get NEXT_PUBLIC_API_URL --context production --site $NETLIFY_SITE_ID 2>&1
            if ($LASTEXITCODE -ne 0) {
                throw (($result | Out-String).TrimEnd())
            }
            $result
        }
    } catch {
        Write-Host "Caught expected error for --site attempt:"
        Write-Host $_
    }

    $netlifyValue = Run 'Netlify: env:get via session-only NETLIFY_SITE_ID workaround' {
        $env:NETLIFY_SITE_ID = $NETLIFY_SITE_ID
        try {
            netlify env:get NEXT_PUBLIC_API_URL --context production
        } finally {
            Remove-Item Env:NETLIFY_SITE_ID -ErrorAction SilentlyContinue
        }
    }

    $netlifyUrl = ($netlifyValue | Out-String).Trim()
    Write-Host "Resolved NEXT_PUBLIC_API_URL=$netlifyUrl"

    if ($netlifyUrl -cne $API_BASE) {
        throw "NEXT_PUBLIC_API_URL mismatch. Expected '$API_BASE' but got '$netlifyUrl'"
    }

    if (Test-Path 'web\.netlify') {
        throw 'Unexpected web\.netlify created'
    }

    $finalStatus = Get-GitStatusLines
    $cleanPolicyMode = Assert-GitCleanlinessPolicy -StatusLines @($finalStatus)
    Write-Host ""
    Write-Host '=== Final: git status --short ==='
    if ($finalStatus) {
        $finalStatus | ForEach-Object { Write-Host $_ }
    } else {
        Write-Host '(clean)'
    }

    Write-Host ""
    Write-Host '[x] API / returns 200'
    Write-Host '[x] API /db/health returns ok:true'
    Write-Host '[x] WEB_URL returns 200'
    Write-Host '[x] Netlify NEXT_PUBLIC_API_URL equals API_BASE (verified)'
    Write-Host '[x] No web\.netlify created'
    if ($cleanPolicyMode -eq 'post-commit-empty') {
        Write-Host '[x] git status clean after run (post-commit strict)'
    } else {
        Write-Host '[x] git status policy passed (pre-commit allowlist: only ?? scripts/proof-step-p.ps1)'
    }
    Write-Host "[x] Raw proof saved to $proofFile"
} finally {
    Stop-Transcript | Out-Null
}
