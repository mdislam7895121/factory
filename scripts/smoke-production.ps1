#Requires -Version 7.0
<#
.SYNOPSIS
    Production smoke test runner — Factory web + API + preview gateway.

.DESCRIPTION
    Performs HTTP HEAD/GET checks against the deployed production endpoints.
    Exits 0 if all required checks pass, 1 if any required check fails.

.PARAMETER BaseUrl
    Netlify frontend base URL (e.g. https://factory.netlify.app). Required.

.PARAMETER ApiUrl
    Railway API base URL (e.g. https://factory-api.railway.app). Required.

.PARAMETER PreviewUrl
    Railway preview gateway URL. Optional — checks skipped if omitted.

.PARAMETER TimeoutSec
    HTTP request timeout in seconds. Default: 15.

.PARAMETER Verbose
    Show all response headers for debugging.

.EXAMPLES
    .\smoke-production.ps1 -BaseUrl https://factory.netlify.app -ApiUrl https://api.railway.app
    .\smoke-production.ps1 -BaseUrl $env:NEXT_PUBLIC_API_BASE_URL -ApiUrl $env:NEXT_PUBLIC_API_BASE_URL -PreviewUrl $env:NEXT_PUBLIC_PREVIEW_BASE_URL
#>

param(
    [Parameter(Mandatory)][string]$BaseUrl,
    [Parameter(Mandatory)][string]$ApiUrl,
    [string]$PreviewUrl   = '',
    [int]$TimeoutSec      = 15,
    [switch]$Verbose
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

$pass    = 0
$fail    = 0
$warn    = 0
$results = [System.Collections.Generic.List[PSCustomObject]]::new()

function Ok($msg, $detail = '')   {
    Write-Host "  ✓ $msg$(if($detail){" — $detail"})" -ForegroundColor Green
    $script:pass++
    $script:results.Add([PSCustomObject]@{ Status='PASS'; Check=$msg; Detail=$detail })
}
function Fail($msg, $detail = '') {
    Write-Host "  ✗ $msg$(if($detail){" — $detail"})" -ForegroundColor Red
    $script:fail++
    $script:results.Add([PSCustomObject]@{ Status='FAIL'; Check=$msg; Detail=$detail })
}
function Warn($msg, $detail = '') {
    Write-Host "  ⚠ $msg$(if($detail){" — $detail"})" -ForegroundColor Yellow
    $script:warn++
    $script:results.Add([PSCustomObject]@{ Status='WARN'; Check=$msg; Detail=$detail })
}
function Info($msg)  { Write-Host "  · $msg" -ForegroundColor Gray }
function Header($t)  { Write-Host "`n── $t ──" -ForegroundColor Cyan }

function Probe {
    param([string]$Url, [string]$Method = 'HEAD', [hashtable]$Headers = @{})
    try {
        $req = @{ Uri=$Url; Method=$Method; TimeoutSec=$TimeoutSec; SkipHttpErrorCheck=$true }
        if ($Headers.Count -gt 0) { $req['Headers'] = $Headers }
        $r = Invoke-WebRequest @req
        if ($Verbose) { $r.Headers | Format-Table -AutoSize | Out-String | Write-Host -ForegroundColor DarkGray }
        return $r
    } catch {
        return $null
    }
}

$baseUrl    = $BaseUrl.TrimEnd('/')
$apiUrl     = $ApiUrl.TrimEnd('/')
$previewUrl = $PreviewUrl.TrimEnd('/')

Write-Host "`nFactory Production Smoke Tests — $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')" -ForegroundColor White
Write-Host "  Frontend : $baseUrl"
Write-Host "  API      : $apiUrl"
if ($previewUrl) { Write-Host "  Preview  : $previewUrl" }

# ── 1. Frontend Routes ────────────────────────────────────────────────────────

Header "Frontend Routes ($baseUrl)"

$frontendRoutes = @(
    @{ Path='/';                        Label='Home';              Required=$true  },
    @{ Path='/demo';                    Label='Demo';              Required=$true  },
    @{ Path='/discover';                Label='Discover';          Required=$true  },
    @{ Path='/status';                  Label='Status Page';       Required=$true  },
    @{ Path='/workspace';               Label='Workspace List';    Required=$true  },
    @{ Path='/memory';                  Label='Memory';            Required=$true  },
    @{ Path='/quality';                 Label='Quality';           Required=$true  },
    @{ Path='/admin';                   Label='Admin (auth-gate)'; Required=$false },
    @{ Path='/apps/medibook-pro';       Label='App Detail';        Required=$false }
)

foreach ($route in $frontendRoutes) {
    $r = Probe "$baseUrl$($route.Path)"
    if ($null -eq $r) {
        if ($route.Required) { Fail "$($route.Label) ($($route.Path))" 'timeout/connection error' }
        else                 { Warn "$($route.Label) ($($route.Path))" 'timeout/connection error' }
    } elseif ($r.StatusCode -lt 400 -or $r.StatusCode -eq 401 -or $r.StatusCode -eq 403) {
        Ok "$($route.Label) ($($route.Path))" "HTTP $($r.StatusCode)"
    } else {
        if ($route.Required) { Fail "$($route.Label) ($($route.Path))" "HTTP $($r.StatusCode)" }
        else                 { Warn "$($route.Label) ($($route.Path))" "HTTP $($r.StatusCode)" }
    }
}

# ── 2. Security Headers ───────────────────────────────────────────────────────

Header "Security Headers"

$r = Probe "$baseUrl/"
if ($null -ne $r) {
    $h = $r.Headers
    $checks = @(
        @{ Key='x-frame-options';          Label='X-Frame-Options' },
        @{ Key='x-content-type-options';   Label='X-Content-Type-Options' },
        @{ Key='strict-transport-security';Label='HSTS' },
        @{ Key='content-security-policy';  Label='CSP' },
        @{ Key='referrer-policy';          Label='Referrer-Policy' }
    )
    foreach ($c in $checks) {
        $val = $h[$c.Key] ?? $h[($c.Key -replace '-', '')] ?? $null
        if ($val) { Ok "$($c.Label) present" "$val" }
        else      { Fail "$($c.Label) missing" }
    }
} else {
    Fail "Cannot reach frontend — skipping header checks"
}

# ── 3. Static Asset Cache ─────────────────────────────────────────────────────

Header "Static Asset Cache"

$staticR = Probe "$baseUrl/_next/static/chunks/main.js"
if ($null -ne $staticR -and $staticR.StatusCode -lt 400) {
    $cc = $staticR.Headers['cache-control'] ?? ''
    if ($cc -match 'immutable') { Ok "Static asset cache immutable" $cc }
    else                        { Warn "Static asset cache not immutable" $cc }
} else {
    Info "Static asset probe skipped (chunk name unknown — normal)"
}

# ── 4. API Health ─────────────────────────────────────────────────────────────

Header "API Health ($apiUrl)"

$apiHealth = Probe "$apiUrl/health" -Method 'GET'
if ($null -eq $apiHealth) {
    Fail "API /health" "timeout/connection error"
} elseif ($apiHealth.StatusCode -eq 200) {
    Ok "API /health" "HTTP 200"
    try {
        $body = $apiHealth.Content | ConvertFrom-Json
        if ($body.ok -eq $true)             { Ok "API health ok=true" }
        else                                { Fail "API health ok=false" }
        if ($body.db.ok -eq $true)          { Ok "DB healthy" }
        else                                { Fail "DB unhealthy" }
        if ($body.redis.ok -eq $true)       { Ok "Redis healthy" }
        else                                { Fail "Redis unhealthy" }
    } catch { Warn "API /health body not parseable" $_ }
} else {
    Fail "API /health" "HTTP $($apiHealth.StatusCode)"
}

# ── 5. Public Status Endpoint ─────────────────────────────────────────────────

Header "Public Status API"

$statusR = Probe "$apiUrl/v1/public/status" -Method 'GET'
if ($null -eq $statusR) {
    Fail "GET /v1/public/status" "timeout/connection error"
} elseif ($statusR.StatusCode -eq 200) {
    Ok "GET /v1/public/status" "HTTP 200"
    try {
        $body = $statusR.Content | ConvertFrom-Json
        if ($body.status)    { Ok "status field present" $body.status }
        else                 { Fail "status field missing" }
        if ($body.timestamp) { Ok "timestamp field present" }
        else                 { Fail "timestamp field missing" }
    } catch { Warn "Status body not parseable" }
} else {
    Fail "GET /v1/public/status" "HTTP $($statusR.StatusCode)"
}

# ── 6. Preview Gateway (optional) ─────────────────────────────────────────────

if ($previewUrl) {
    Header "Preview Gateway ($previewUrl)"
    $prevR = Probe "$previewUrl/health" -Method 'GET'
    if ($null -eq $prevR) {
        Warn "Preview /health" "timeout/connection error"
    } elseif ($prevR.StatusCode -lt 400) {
        Ok "Preview /health" "HTTP $($prevR.StatusCode)"
    } else {
        Warn "Preview /health" "HTTP $($prevR.StatusCode)"
    }
}

# ── 7. Response Time Budget ───────────────────────────────────────────────────

Header "Response Time"

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$rtR = Probe "$baseUrl/"
$sw.Stop()
$ms = $sw.ElapsedMilliseconds

if ($null -ne $rtR) {
    if ($ms -lt 3000)  { Ok "Frontend home < 3s" "${ms}ms" }
    elseif ($ms -lt 8000) { Warn "Frontend home 3-8s (slow)" "${ms}ms" }
    else               { Fail "Frontend home > 8s (critical)" "${ms}ms" }
}

$sw2 = [System.Diagnostics.Stopwatch]::StartNew()
$rtA = Probe "$apiUrl/health" -Method 'GET'
$sw2.Stop()
$ms2 = $sw2.ElapsedMilliseconds

if ($null -ne $rtA) {
    if ($ms2 -lt 2000)  { Ok "API /health < 2s" "${ms2}ms" }
    elseif ($ms2 -lt 5000) { Warn "API /health 2-5s (slow)" "${ms2}ms" }
    else                { Fail "API /health > 5s (critical)" "${ms2}ms" }
}

# ── Summary ───────────────────────────────────────────────────────────────────

Header "Summary"

$total = $pass + $fail + $warn
Write-Host ""
Write-Host "  Results: $pass passed, $warn warnings, $fail failed / $total checks" -ForegroundColor ($fail -gt 0 ? 'Red' : ($warn -gt 0 ? 'Yellow' : 'Green'))
Write-Host "  Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"

if ($fail -gt 0) {
    Write-Host "`n  SMOKE TEST FAILED — $fail required check(s) failed." -ForegroundColor Red
    exit 1
} elseif ($warn -gt 0) {
    Write-Host "`n  SMOKE TEST PASSED (with $warn warning(s))." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "`n  SMOKE TEST PASSED — all $pass checks green." -ForegroundColor Green
    exit 0
}
