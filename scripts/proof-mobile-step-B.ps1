# Proof Script for Serial Step B - Local Auth + Identity Baseline (Mobile)
# Mobile-only implementation, non-breaking, proof-first

Write-Host "=== SERIAL STEP B - LOCAL AUTH + IDENTITY BASELINE (MOBILE) ===" -ForegroundColor Cyan
Write-Host ""

# Change to factory root
$factoryRoot = "C:\Users\vitor\Dev\factory"
Set-Location $factoryRoot

Write-Host "=== 1. GIT STATUS CHECK ===" -ForegroundColor Yellow
Write-Host "Checking for uncommitted changes in mobile/ directory..." -ForegroundColor Gray
git status mobile/
Write-Host ""

Write-Host "=== 2. VERIFY BASELINE ===" -ForegroundColor Yellow
Write-Host "Current commit:" -ForegroundColor Gray
git log -1 --oneline
Write-Host ""
Write-Host "Expected baseline: Serial Step A (commit a832a4e)" -ForegroundColor Gray
Write-Host ""

Write-Host "=== 3. FILE STRUCTURE VERIFICATION ===" -ForegroundColor Yellow
Write-Host "Verifying Step B files exist..." -ForegroundColor Gray

$requiredFiles = @(
    "mobile\src\auth\authTypes.js",
    "mobile\src\auth\tokenStore.js",
    "mobile\src\auth\AuthProvider.js",
    "mobile\src\screens\LoginScreen.js",
    "mobile\src\screens\ProfileScreen.js"
)

$allExist = $true
foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $factoryRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MISSING: $file" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "ERROR: Not all required files exist!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=== 4. DEPENDENCY CHECK ===" -ForegroundColor Yellow
Write-Host "Checking for expo-secure-store..." -ForegroundColor Gray
Set-Location mobile
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.dependencies.'expo-secure-store') {
        Write-Host "  ✅ expo-secure-store: $($packageJson.dependencies.'expo-secure-store')" -ForegroundColor Green
    } else {
        Write-Host "  ❌ expo-secure-store NOT FOUND in dependencies" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ package.json not found" -ForegroundColor Red
}
Set-Location ..
Write-Host ""

Write-Host "=== 5. CODE VERIFICATION ===" -ForegroundColor Yellow
Write-Host "Checking for key code patterns..." -ForegroundColor Gray

# Check App.js for AuthProvider
Write-Host "  Checking App.js for AuthProvider..." -ForegroundColor Gray
$appJs = Get-Content "mobile\App.js" -Raw
if ($appJs -match "import.*AuthProvider|from.*AuthProvider") {
    Write-Host "    ✅ AuthProvider imported" -ForegroundColor Green
} else {
    Write-Host "    ❌ AuthProvider NOT imported" -ForegroundColor Red
}

if ($appJs -match "<AuthProvider>") {
    Write-Host "    ✅ AuthProvider used in JSX" -ForegroundColor Green
} else {
    Write-Host "    ❌ AuthProvider NOT used in JSX" -ForegroundColor Red
}

# Check apiClient.js for Authorization header
Write-Host "  Checking apiClient.js for auth integration..." -ForegroundColor Gray
$apiClient = Get-Content "mobile\src\lib\apiClient.js" -Raw
if ($apiClient -match "Authorization.*Bearer") {
    Write-Host "    ✅ Bearer token injection found" -ForegroundColor Green
} else {
    Write-Host "    ❌ Bearer token injection NOT found" -ForegroundColor Red
}

# Check tokenStore.js for SecureStore
Write-Host "  Checking tokenStore.js for SecureStore..." -ForegroundColor Gray
$tokenStore = Get-Content "mobile\src\auth\tokenStore.js" -Raw
if ($tokenStore -match "expo-secure-store") {
    Write-Host "    ✅ SecureStore integration found" -ForegroundColor Green
} else {
    Write-Host "    ❌ SecureStore integration NOT found" -ForegroundColor Red
}

# Check AuthProvider.js for dev mock
Write-Host "  Checking AuthProvider.js for dev mock..." -ForegroundColor Gray
$authProvider = Get-Content "mobile\src\auth\AuthProvider.js" -Raw
if ($authProvider -match "generateDevToken|mock-dev-token") {
    Write-Host "    ✅ Dev mock authentication found" -ForegroundColor Green
} else {
    Write-Host "    ❌ Dev mock authentication NOT found" -ForegroundColor Red
}

Write-Host ""

Write-Host "=== 6. NON-BREAKING VERIFICATION ===" -ForegroundColor Yellow
Write-Host "Verifying no changes in api/ or web/ directories..." -ForegroundColor Gray
$apiDiff = git diff HEAD api/ 2>$null
$webDiff = git diff HEAD web/ 2>$null

if ([string]::IsNullOrWhiteSpace($apiDiff)) {
    Write-Host "  ✅ No api/ changes" -ForegroundColor Green
} else {
    Write-Host "  ❌ WARNING: api/ has changes!" -ForegroundColor Red
}

if ([string]::IsNullOrWhiteSpace($webDiff)) {
    Write-Host "  ✅ No web/ changes" -ForegroundColor Green
} else {
    Write-Host "  ❌ WARNING: web/ has changes!" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== 7. MANUAL TEST CHECKLIST ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Before marking Step B complete, manually verify:" -ForegroundColor White
Write-Host ""
Write-Host "  [ ] 1. Start mobile app (npm start)" -ForegroundColor Cyan
Write-Host "  [ ] 2. Verify Login screen shows on first launch" -ForegroundColor Cyan
Write-Host "  [ ] 3. Verify dev mode warning is visible" -ForegroundColor Cyan
Write-Host "  [ ] 4. Try invalid email (no @): Should show error" -ForegroundColor Cyan
Write-Host "  [ ] 5. Try short password (<6 chars): Should show error" -ForegroundColor Cyan
Write-Host "  [ ] 6. Login with valid credentials (test@factory.local / password123)" -ForegroundColor Cyan
Write-Host "  [ ] 7. Verify home screen shows with user email" -ForegroundColor Cyan
Write-Host "  [ ] 8. Tap Profile button (👤): Should show profile screen" -ForegroundColor Cyan
Write-Host "  [ ] 9. Verify token is displayed (truncated)" -ForegroundColor Cyan
Write-Host "  [ ] 10. Navigate back to home" -ForegroundColor Cyan
Write-Host "  [ ] 11. Tap Diagnostics button (🔧): Should show diagnostics screen" -ForegroundColor Cyan
Write-Host "  [ ] 12. Run API test: Should succeed (auth doesn't break existing endpoints)" -ForegroundColor Cyan
Write-Host "  [ ] 13. Navigate back to home" -ForegroundColor Cyan
Write-Host "  [ ] 14. Go to Profile, tap Logout, confirm" -ForegroundColor Cyan
Write-Host "  [ ] 15. Verify returns to Login screen" -ForegroundColor Cyan
Write-Host "  [ ] 16. Kill app completely, restart" -ForegroundColor Cyan
Write-Host "  [ ] 17. Login again, kill app, restart" -ForegroundColor Cyan
Write-Host "  [ ] 18. Verify you're still logged in (token persistence)" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== 8. PROOF REPORT ===" -ForegroundColor Yellow
Write-Host "After manual testing, create proof report at:" -ForegroundColor Gray
Write-Host "  docs\proof\serial-mobile-step-B.md" -ForegroundColor White
Write-Host ""
Write-Host "Report should include:" -ForegroundColor Gray
Write-Host "  - Definition of Done checklist (all items checked)" -ForegroundColor Gray
Write-Host "  - File changes summary (git diff --stat)" -ForegroundColor Gray
Write-Host "  - Code snippets showing auth integration" -ForegroundColor Gray
Write-Host "  - Screenshots or terminal output of manual tests" -ForegroundColor Gray
Write-Host "  - Confirmation that api/ and web/ are unchanged" -ForegroundColor Gray
Write-Host ""

Write-Host "=== PROOF SCRIPT COMPLETE ===" -ForegroundColor Cyan
Write-Host "If all checks pass and manual testing succeeds, proceed to commit:" -ForegroundColor White
Write-Host "  git add mobile/" -ForegroundColor Gray
Write-Host "  git commit -m 'feat(mobile): add local auth baseline (Serial Step B)'" -ForegroundColor Gray
Write-Host "  git push origin main" -ForegroundColor Gray
Write-Host ""
