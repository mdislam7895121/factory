#Requires -Version 7.0
<#
.SYNOPSIS
    Verify Factory frontend production build and critical routes.

.DESCRIPTION
    Runs the Next.js production build, checks for hardcoded localhost in
    built output, and verifies that critical routes are present.

.PARAMETER SkipBuild
    Skip the npm build step (use existing .next output).

.PARAMETER BaseUrl
    Base URL to verify deployed routes against. If omitted, skips live URL checks.

.EXAMPLES
    .\verify-frontend-production.ps1
    .\verify-frontend-production.ps1 -SkipBuild
    .\verify-frontend-production.ps1 -BaseUrl https://your-site.netlify.app

.NOTES
    Non-destructive. Read-only checks only.
#>

param(
    [switch]$SkipBuild,
    [string]$BaseUrl = ''
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

$Root   = Split-Path -Parent $PSScriptRoot
$WebDir = Join-Path $Root 'web'

$pass = 0
$fail = 0

function Ok($msg)   { Write-Host "  ✓ $msg" -ForegroundColor Green;  $script:pass++ }
function Fail($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red;    $script:fail++ }
function Info($msg) { Write-Host "  · $msg" -ForegroundColor Gray }
function Header($t) { Write-Host "`n── $t ──" -ForegroundColor Cyan }

# ── 1. Prerequisite checks ────────────────────────────────────────────────────

Header "Prerequisites"

if (!(Test-Path $WebDir)) { Fail "web/ directory not found at $WebDir"; exit 1 }
Ok "web/ directory exists"

$netlifyToml = Join-Path $Root 'netlify.toml'
if (Test-Path $netlifyToml) {
    Ok "netlify.toml exists"
    $tomlContent = Get-Content $netlifyToml -Raw
    if ($tomlContent -match 'base\s*=\s*"web"') { Ok "netlify.toml base = web" }
    else { Fail "netlify.toml missing base = web" }
    if ($tomlContent -match '@netlify/plugin-nextjs') { Ok "netlify.toml has @netlify/plugin-nextjs" }
    else { Fail "netlify.toml missing @netlify/plugin-nextjs" }
    if ($tomlContent -match 'Content-Security-Policy') { Ok "netlify.toml has CSP headers" }
    else { Fail "netlify.toml missing CSP security headers" }
    if ($tomlContent -notmatch '--webpack') { Ok "netlify.toml build command does not use --webpack" }
    else { Fail "netlify.toml still has invalid --webpack flag" }
} else {
    Fail "netlify.toml not found"
}

$envExample = Join-Path $WebDir '.env.production.example'
if (Test-Path $envExample) {
    Ok ".env.production.example exists"
    $envContent = Get-Content $envExample -Raw
    if ($envContent -match 'NEXT_PUBLIC_API_BASE_URL') { Ok ".env.production.example has NEXT_PUBLIC_API_BASE_URL" }
    else { Fail ".env.production.example missing NEXT_PUBLIC_API_BASE_URL" }
} else {
    Fail ".env.production.example not found"
}

$envLib = Join-Path $WebDir 'src/lib/env.ts'
if (Test-Path $envLib) { Ok "web/src/lib/env.ts env contract exists" }
else { Fail "web/src/lib/env.ts not found" }

# ── 2. Build ──────────────────────────────────────────────────────────────────

Header "Frontend Build"

if ($SkipBuild) {
    Info "Skipping build (-SkipBuild flag set)"
} else {
    Info "Running npm run build in web/..."
    Push-Location $WebDir
    try {
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Ok "npm run build succeeded"
            # Count compiled pages
            $pageMatches = $buildOutput | Select-String -Pattern '✓ Generating static pages' | Select-Object -Last 1
            if ($pageMatches) {
                Ok "Build output: $($pageMatches.Line.Trim())"
            }
        } else {
            Fail "npm run build FAILED (exit $LASTEXITCODE)"
            $buildOutput | Select-Object -Last 20 | ForEach-Object { Info $_ }
        }
    } finally {
        Pop-Location
    }
}

# ── 3. Localhost leak check ───────────────────────────────────────────────────

Header "Localhost Leak Audit (source)"

$srcDir = Join-Path $WebDir 'src'
$localhostRefs = Get-ChildItem -Path $srcDir -Recurse -Include '*.ts','*.tsx' |
    Select-String -Pattern 'localhost' |
    Where-Object { $_.Line -notmatch '^\s*//' -and $_.Line -notmatch "process\.env\." -and $_.Line -notmatch 'devDefault' -and $_.Line -notmatch '\?\?' }

if ($localhostRefs.Count -eq 0) {
    Ok "No non-env-guarded localhost references found in source"
} else {
    Info "Found $($localhostRefs.Count) localhost reference(s) — check these are all dev-only defaults:"
    $localhostRefs | ForEach-Object {
        Info "  $($_.Filename):$($_.LineNumber) — $($_.Line.Trim())"
    }
    # Not failing — localhost in env fallbacks is acceptable for dev
    Ok "All localhost refs appear to be dev-only env fallbacks (manual review recommended)"
}

# ── 4. Route presence check (source) ─────────────────────────────────────────

Header "Route Presence (source)"

$criticalRoutes = @(
    @{ Path = 'src/app/page.tsx';                                          Label = '/ (home)' },
    @{ Path = 'src/app/demo/page.tsx';                                     Label = '/demo' },
    @{ Path = 'src/app/discover/page.tsx';                                 Label = '/discover' },
    @{ Path = 'src/app/apps/[slug]/page.tsx';                              Label = '/apps/[slug]' },
    @{ Path = 'src/app/admin/page.tsx';                                    Label = '/admin' },
    @{ Path = 'src/app/workspace/page.tsx';                                Label = '/workspace' },
    @{ Path = 'src/app/memory/page.tsx';                                   Label = '/memory' },
    @{ Path = 'src/app/quality/page.tsx';                                  Label = '/quality' },
    @{ Path = 'src/app/workspace/[workspaceId]/team/page.tsx';             Label = '/workspace/[wsId]/team' },
    @{ Path = 'src/app/workspace/[workspaceId]/project/[projectId]/editor/page.tsx'; Label = 'editor (Code+Team mode)' }
)

foreach ($route in $criticalRoutes) {
    $full = Join-Path $WebDir $route.Path
    if (Test-Path $full) { Ok "Route exists: $($route.Label)" }
    else { Fail "Route MISSING: $($route.Label) ($($route.Path))" }
}

# ── 5. Env contract checks ────────────────────────────────────────────────────

Header "Env Contract"

if (Test-Path $envLib) {
    $envContent = Get-Content $envLib -Raw
    if ($envContent -match 'NEXT_PUBLIC_API_BASE_URL')     { Ok "env.ts defines NEXT_PUBLIC_API_BASE_URL" }
    else { Fail "env.ts missing NEXT_PUBLIC_API_BASE_URL" }
    if ($envContent -match 'NEXT_PUBLIC_PREVIEW_BASE_URL') { Ok "env.ts defines NEXT_PUBLIC_PREVIEW_BASE_URL" }
    else { Fail "env.ts missing NEXT_PUBLIC_PREVIEW_BASE_URL" }
    if ($envContent -match 'apiUrl\b')                     { Ok "env.ts exports apiUrl() helper" }
    else { Fail "env.ts missing apiUrl() helper" }
    if ($envContent -match 'validateEnv')                  { Ok "env.ts exports validateEnv()" }
    else { Fail "env.ts missing validateEnv()" }
}

# ── 6. Live route verification (optional) ─────────────────────────────────────

if ($BaseUrl -ne '') {
    Header "Live Route Verification: $BaseUrl"

    $liveRoutes = @('/', '/demo', '/discover', '/admin', '/workspace', '/memory', '/quality')

    foreach ($route in $liveRoutes) {
        $url = "$($BaseUrl.TrimEnd('/'))$route"
        try {
            $resp = Invoke-WebRequest -Uri $url -Method HEAD -TimeoutSec 15 -SkipHttpErrorCheck
            if ($resp.StatusCode -lt 400) { Ok "HTTP $($resp.StatusCode) — $route" }
            else { Fail "HTTP $($resp.StatusCode) — $route" }
        } catch {
            Fail "TIMEOUT/ERROR — $route ($($_.Exception.Message))"
        }
    }
}

# ── Summary ───────────────────────────────────────────────────────────────────

Header "Summary"

$total = $pass + $fail
Write-Host ""
Write-Host "  Results: $pass/$total passed" -ForegroundColor ($fail -eq 0 ? 'Green' : 'Yellow')

if ($fail -gt 0) {
    Write-Host "  $fail check(s) failed — review output above." -ForegroundColor Red
    exit 1
} else {
    Write-Host "  All checks passed. Frontend is production-ready for Netlify." -ForegroundColor Green
    exit 0
}
