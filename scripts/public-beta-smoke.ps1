#Requires -Version 7.0
<#
.SYNOPSIS
    Public beta smoke test — Factory frontend routes + API health.

.DESCRIPTION
    Performs HTTP checks against the deployed public beta endpoints.
    Designed for manual launch-day verification and CI integration.
    Exits 0 if all required checks pass, 1 if any required check fails.

.PARAMETER BaseUrl
    Netlify frontend base URL. Required.

.PARAMETER ApiUrl
    Railway API base URL. Optional — skips API checks if omitted.

.PARAMETER TimeoutSec
    HTTP request timeout in seconds. Default: 20.

.EXAMPLES
    .\public-beta-smoke.ps1 -BaseUrl https://factory.netlify.app
    .\public-beta-smoke.ps1 -BaseUrl https://app.yourcompany.com -ApiUrl https://api.yourcompany.com
#>

param(
    [Parameter(Mandatory)][string]$BaseUrl,
    [string]$ApiUrl     = '',
    [int]$TimeoutSec    = 20
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

$pass = 0; $fail = 0; $warn = 0

function Ok($msg, $d = '')   { Write-Host "  ✓ $msg$(if($d){" ($d)"})" -ForegroundColor Green;  $script:pass++ }
function Fail($msg, $d = '') { Write-Host "  ✗ $msg$(if($d){" ($d)"})" -ForegroundColor Red;    $script:fail++ }
function Warn($msg, $d = '') { Write-Host "  ⚠ $msg$(if($d){" ($d)"})" -ForegroundColor Yellow; $script:warn++ }
function Info($msg)          { Write-Host "  · $msg" -ForegroundColor Gray }
function Header($t)          { Write-Host "`n── $t ──" -ForegroundColor Cyan }

function Probe([string]$Url, [string]$Method = 'HEAD') {
    try {
        return Invoke-WebRequest -Uri $Url -Method $Method -TimeoutSec $TimeoutSec -SkipHttpErrorCheck
    } catch { return $null }
}

$base = $BaseUrl.TrimEnd('/')
$api  = $ApiUrl.TrimEnd('/')

Write-Host "`nFactory Public Beta Smoke Test — $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')" -ForegroundColor White
Write-Host "  Frontend : $base"
if ($api) { Write-Host "  API      : $api" }

# ── 1. Public Routes ──────────────────────────────────────────────────────────

Header "Public Routes"

$routes = @(
    @{ Path='/';                  Label='Home page';           Required=$true  },
    @{ Path='/demo';              Label='Demo page';           Required=$true  },
    @{ Path='/discover';          Label='Discover (marketplace)'; Required=$true  },
    @{ Path='/status';            Label='Status page';         Required=$true  },
    @{ Path='/workspace';         Label='Workspace list';      Required=$true  },
    @{ Path='/memory';            Label='Memory module';       Required=$true  },
    @{ Path='/quality';           Label='Quality dashboard';   Required=$true  },
    @{ Path='/apps/medibook-pro'; Label='App detail page';     Required=$false },
    @{ Path='/admin';             Label='Admin (auth-gated)';  Required=$false }
)

foreach ($r in $routes) {
    $res = Probe "$base$($r.Path)"
    if ($null -eq $res) {
        if ($r.Required) { Fail $r.Label 'timeout/connection error' }
        else             { Warn $r.Label 'timeout/connection error' }
    } elseif ($res.StatusCode -lt 400 -or $res.StatusCode -in @(401, 403)) {
        Ok $r.Label "HTTP $($res.StatusCode)"
    } else {
        if ($r.Required) { Fail $r.Label "HTTP $($res.StatusCode)" }
        else             { Warn $r.Label "HTTP $($res.StatusCode)" }
    }
}

# ── 2. Security Headers ───────────────────────────────────────────────────────

Header "Security Headers"

$home = Probe "$base/"
if ($null -ne $home) {
    foreach ($hdr in @('x-frame-options','x-content-type-options','strict-transport-security','content-security-policy')) {
        $val = $home.Headers[$hdr]
        if ($val) { Ok "Header: $hdr" }
        else      { Warn "Header missing: $hdr" }
    }
} else {
    Warn "Could not check security headers (frontend unreachable)"
}

# ── 3. Meta Tags (SEO) ────────────────────────────────────────────────────────

Header "SEO Meta Tags"

$homeGet = Probe "$base/" -Method 'GET'
if ($null -ne $homeGet -and $homeGet.StatusCode -eq 200) {
    $html = $homeGet.Content
    if ($html -match '<title[^>]*>') { Ok "Title tag present" }
    else                             { Warn "Title tag missing" }
    if ($html -match 'og:title')     { Ok "OG:title present" }
    else                             { Warn "og:title missing" }
    if ($html -match 'og:description') { Ok "OG:description present" }
    else                               { Warn "og:description missing" }
    if ($html -match 'twitter:card')   { Ok "Twitter card present" }
    else                               { Warn "twitter:card missing" }
    if ($html -match 'robots')         { Ok "Robots meta present" }
    else                               { Info "No robots meta (using default: index,follow)" }
    if ($html -notmatch 'localhost')   { Ok "No localhost in meta tags" }
    else                               { Fail "localhost found in page HTML — check OG metadata" }
} else {
    Info "Skipping SEO meta check (GET on home failed)"
}

# ── 4. API Health (optional) ─────────────────────────────────────────────────

if ($api) {
    Header "API Health ($api)"

    $health = Probe "$api/health" -Method 'GET'
    if ($null -eq $health) {
        Fail "GET /health" "timeout/connection error"
    } elseif ($health.StatusCode -eq 200) {
        Ok "GET /health" "HTTP 200"
        try {
            $body = $health.Content | ConvertFrom-Json
            if ($body.ok -eq $true)       { Ok "health ok=true" }
            else                          { Fail "health ok=false or missing" }
            if ($body.db.ok -eq $true)    { Ok "DB healthy" }
            else                          { Fail "DB unhealthy" }
            if ($body.redis.ok -eq $true) { Ok "Redis healthy" }
            else                          { Warn "Redis unhealthy" }
        } catch { Warn "Health body not parseable" }
    } else {
        Fail "GET /health" "HTTP $($health.StatusCode)"
    }

    Header "Public Status API"

    $status = Probe "$api/v1/public/status" -Method 'GET'
    if ($null -eq $status) {
        Fail "GET /v1/public/status" "timeout/connection error"
    } elseif ($status.StatusCode -eq 200) {
        Ok "GET /v1/public/status" "HTTP 200"
        try {
            $body = $status.Content | ConvertFrom-Json
            if ($body.status) { Ok "status field: $($body.status)" }
            else              { Fail "status field missing" }
            $body_str = $status.Content
            if ($body_str -notmatch 'DATABASE_URL|AUTH_SECRET|railway\.internal') {
                Ok "No internal secrets in response"
            } else {
                Fail "Internal data found in public status response"
            }
        } catch { Warn "Status body not parseable" }
    } else {
        Fail "GET /v1/public/status" "HTTP $($status.StatusCode)"
    }
}

# ── 5. Response Times ────────────────────────────────────────────────────────

Header "Response Times"

$sw = [System.Diagnostics.Stopwatch]::StartNew()
Probe "$base/" | Out-Null
$sw.Stop()
$ms = $sw.ElapsedMilliseconds
if ($ms -lt 3000)  { Ok "Home page < 3s" "${ms}ms" }
elseif ($ms -lt 8000) { Warn "Home page 3–8s (slow)" "${ms}ms" }
else               { Fail "Home page > 8s (critical)" "${ms}ms" }

# ── Summary ──────────────────────────────────────────────────────────────────

Header "Summary"

$total = $pass + $fail + $warn
Write-Host ""
Write-Host "  Results: $pass passed / $warn warnings / $fail failed / $total checks" -ForegroundColor ($fail -gt 0 ? 'Red' : ($warn -gt 0 ? 'Yellow' : 'Green'))

if ($fail -gt 0) {
    Write-Host "`n  BETA SMOKE FAILED — $fail required check(s) failed." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`n  BETA SMOKE PASSED$(if($warn -gt 0){" (with $warn warning(s))"})." -ForegroundColor ($warn -gt 0 ? 'Yellow' : 'Green')
    exit 0
}
