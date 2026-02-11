# Proof Script - Mobile Networking (Physical Device)
# Serial Step B Hotfix: LAN IP + API binding verification

Write-Host "=== MOBILE NETWORKING PROOF (PHYSICAL DEVICE) ===" -ForegroundColor Cyan
Write-Host ""

$repoRoot = "C:\Users\vitor\Dev\factory"
Set-Location $repoRoot

Write-Host "=== 1) GIT STATUS + COMMIT ===" -ForegroundColor Yellow
Write-Host "Repo: $repoRoot" -ForegroundColor Gray
git status
Write-Host ""
git log -1 --oneline
Write-Host ""

Write-Host "=== 2) DETECT LOCAL IPV4 ===" -ForegroundColor Yellow
Write-Host "Using Get-NetIPAddress (fallback to ipconfig)" -ForegroundColor Gray
try {
    $ip = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*"
    } | Select-Object -First 1 -ExpandProperty IPAddress
    if ($ip) {
        Write-Host "Detected IPv4: $ip" -ForegroundColor Green
    } else {
        Write-Host "No IPv4 found via Get-NetIPAddress" -ForegroundColor Yellow
        ipconfig | Select-String "IPv4"
    }
} catch {
    Write-Host "Get-NetIPAddress failed, using ipconfig" -ForegroundColor Yellow
    ipconfig | Select-String "IPv4"
}
Write-Host ""

Write-Host "=== 3) LOCAL API CALLS (PC) ===" -ForegroundColor Yellow
Write-Host "GET http://localhost:4000/" -ForegroundColor Gray
try {
    Invoke-RestMethod "http://localhost:4000/" | ConvertTo-Json -Depth 5
} catch {
    Write-Host "ERROR calling / : $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
Write-Host "GET http://localhost:4000/db/health" -ForegroundColor Gray
try {
    Invoke-RestMethod "http://localhost:4000/db/health" | ConvertTo-Json -Depth 5
} catch {
    Write-Host "ERROR calling /db/health : $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== 4) MANUAL CHECKLIST (IPHONE) ===" -ForegroundColor Yellow
Write-Host "On your iPhone (Expo Go):" -ForegroundColor White
Write-Host "  [ ] Open Diagnostics screen" -ForegroundColor Cyan
Write-Host "  [ ] Enable 'Use LAN IP'" -ForegroundColor Cyan
Write-Host "  [ ] Set LAN IP to the detected IPv4 above" -ForegroundColor Cyan
Write-Host "  [ ] Confirm Base URL shows http://<LAN_IP>:4000" -ForegroundColor Cyan
Write-Host "  [ ] Tap 'Test All Endpoints'" -ForegroundColor Cyan
Write-Host "  [ ] Capture screenshot: Base URL shows LAN IP" -ForegroundColor Cyan
Write-Host "  [ ] Capture screenshot: Root + Health show SUCCESS" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== PROOF SCRIPT COMPLETE ===" -ForegroundColor Cyan
Write-Host "Include outputs + screenshots in your proof report." -ForegroundColor White
