# Proof Script for Serial Step B - Mobile Auth Baseline
# Collects git status, code changes, and API test results

Write-Host "`n========== SERIAL MOBILE STEP B PROOF SCRIPT ==========" -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

# Ensure we're in the factory root
$factoryRoot = "C:\Users\vitor\Dev\factory"
if (-not (Test-Path "$factoryRoot\.git")) {
    Write-Host "ERROR: Not in factory git repository" -ForegroundColor Red
    exit 1
}
Set-Location $factoryRoot

# Section 1: Git Status
Write-Host "`n=== GIT STATUS ===" -ForegroundColor Yellow
git status

# Section 2: Current Commit
Write-Host "`n=== CURRENT COMMIT ===" -ForegroundColor Yellow
Write-Host "Short SHA: $(git rev-parse --short HEAD)"
Write-Host "Latest commit:"
git log --oneline -1

# Section 3: Git Diff Stats
Write-Host "`n=== CHANGES SUMMARY ===" -ForegroundColor Yellow
Write-Host "File statistics (HEAD~1..HEAD)"
git diff --stat HEAD~1..HEAD

# Section 4: API Test - Localhost
Write-Host "`n=== API TESTS - LOCALHOST ===" -ForegroundColor Yellow

Write-Host "Testing: http://localhost:4000/" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/" -Method GET -ErrorAction Stop
    Write-Host "✅ Root endpoint SUCCESS: $response"
} catch {
    Write-Host "❌ Root endpoint FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting: http://localhost:4000/db/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/db/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Health endpoint SUCCESS`nResponse: $(ConvertTo-Json -InputObject $response -Depth 5)"
} catch {
    Write-Host "❌ Health endpoint FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Section 5: API Test - LAN IP
Write-Host "`n=== API TESTS - LAN IP (192.168.12.178) ===" -ForegroundColor Yellow

Write-Host "Testing: http://192.168.12.178:4000/db/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "http://192.168.12.178:4000/db/health" -Method GET -ErrorAction Stop
    Write-Host "✅ LAN IP health endpoint SUCCESS`nResponse: $(ConvertTo-Json -InputObject $response -Depth 5)"
} catch {
    Write-Host "❌ LAN IP health endpoint FAILED: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Note: Expected if API not running on LAN IP" -ForegroundColor Gray
}

# Section 6: File Verification
Write-Host "`n=== MOBILE APP FILES ===" -ForegroundColor Yellow

$fileChecks = @(
    "mobile\src\auth\AuthProvider.js",
    "mobile\src\auth\authTypes.js",
    "mobile\src\auth\tokenStore.js",
    "mobile\src\screens\LoginScreen.js",
    "mobile\src\screens\HomeScreen.js",
    "mobile\src\screens\ProfileScreen.js",
    "mobile\src\screens\DiagnosticsScreen.js",
    "mobile\src\config\env.js",
    "mobile\src\lib\apiClient.js"
)

foreach ($file in $fileChecks) {
    if (Test-Path $file) {
        Write-Host "✅ $file"
    } else {
        Write-Host "❌ MISSING: $file" -ForegroundColor Red
    }
}

Write-Host "`n========== END OF PROOF SCRIPT ==========" -ForegroundColor Cyan
Write-Host ""
