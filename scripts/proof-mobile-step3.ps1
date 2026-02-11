param(
  [string]$ApiUrl = "http://localhost:4000",
  [string]$OutDir = (Join-Path (Get-Location) "proof")
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force $OutDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$out = Join-Path $OutDir ("serial-step-mobile-3-proof-" + $stamp + ".txt")

"=== Local Mobile Factory Proof (Step 3) ===" | Tee-Object -FilePath $out
("Date: " + (Get-Date)) | Tee-Object -FilePath $out -Append
("Repo: " + (Get-Location)) | Tee-Object -FilePath $out -Append
"" | Tee-Object -FilePath $out -Append

"## Git" | Tee-Object -FilePath $out -Append
(git rev-parse --short HEAD) | Tee-Object -FilePath $out -Append
(git status) | Tee-Object -FilePath $out -Append
"" | Tee-Object -FilePath $out -Append

"## API Runtime Proof" | Tee-Object -FilePath $out -Append
("GET " + $ApiUrl + "/") | Tee-Object -FilePath $out -Append
(Invoke-RestMethod ($ApiUrl + "/") | ConvertTo-Json -Depth 10) | Tee-Object -FilePath $out -Append
"" | Tee-Object -FilePath $out -Append

("GET " + $ApiUrl + "/db/health") | Tee-Object -FilePath $out -Append
(Invoke-RestMethod ($ApiUrl + "/db/health") | ConvertTo-Json -Depth 10) | Tee-Object -FilePath $out -Append
"" | Tee-Object -FilePath $out -Append

"## Mobile Folder Checks" | Tee-Object -FilePath $out -Append
if (!(Test-Path ".\mobile\package.json")) { throw "mobile/package.json missing" }
if (!(Test-Path ".\mobile\App.js")) { throw "mobile/App.js missing" }
if (!(Test-Path ".\mobile\config.js")) { throw "mobile/config.js missing" }
"OK: mobile files exist" | Tee-Object -FilePath $out -Append
"" | Tee-Object -FilePath $out -Append

"## Install/Build Sanity (non-breaking)" | Tee-Object -FilePath $out -Append
"Web: npm ci + build" | Tee-Object -FilePath $out -Append
Push-Location .\web
npm ci | Tee-Object -FilePath $out -Append
npm run build | Tee-Object -FilePath $out -Append
Pop-Location
"" | Tee-Object -FilePath $out -Append

"API: npm ci + build (+ prisma generate)" | Tee-Object -FilePath $out -Append
Push-Location .\api
npm ci | Tee-Object -FilePath $out -Append
npm run prisma:generate | Tee-Object -FilePath $out -Append
npm run build | Tee-Object -FilePath $out -Append
Pop-Location
"" | Tee-Object -FilePath $out -Append

"=== DONE ===" | Tee-Object -FilePath $out -Append
"Proof saved to:" | Tee-Object -FilePath $out -Append
$out | Tee-Object -FilePath $out -Append
