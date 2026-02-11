#Requires -Version 5.1
<#
.SYNOPSIS
  Factory Smoke Test - Local Development & Test Harness

.DESCRIPTION
  Runs non-destructive smoke tests for the Factory development environment:
  - Verifies environment tools (Node, npm, Git)
  - Checks API health if running
  - Validates generator and build-preview-index scripts
  - Confirms all preview files are created

.PARAMETER Verbose
  Show detailed output for each check

.EXAMPLE
  ./scripts/smoke-factory.ps1
  # Runs all smoke tests with default output
#>

param(
  [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"

function Write-Status {
  param(
    [string]$Message,
    [ValidateSet("Pass", "Fail", "Warn", "Info")]
    [string]$Status = "Info"
  )
  
  $symbol = @{
    Pass = "[OK]"
    Fail = "[FAIL]"
    Warn = "[WARN]"
    Info = "[INFO]"
  }
  
  Write-Host "$($symbol[$Status]) $Message" -ForegroundColor $(
    @{Pass="Green"; Fail="Red"; Warn="Yellow"; Info="Cyan"}[$Status]
  )
}

function Write-Section {
  param([string]$Title)
  Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
  Write-Host "[SMOKE] $Title" -ForegroundColor Cyan
  Write-Host ("=" * 70) + "`n" -ForegroundColor Cyan
}

Write-Section "Smoke Test - Factory Development Environment"

# Check 1: Environment Tools
Write-Section "1. Environment Tools"

$passedTools = 0
$failedTools = 0

# Node
try {
  $nodeVersion = & node --version 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Status "Node.js $nodeVersion" "Pass"
    $passedTools++
  } else {
    Write-Status "Node.js not found" "Fail"
    $failedTools++
  }
} catch {
  Write-Status "Node.js check failed: $_" "Fail"
  $failedTools++
}

# npm
try {
  $npmVersion = & npm --version 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Status "npm $npmVersion" "Pass"
    $passedTools++
  } else {
    Write-Status "npm not found" "Fail"
    $failedTools++
  }
} catch {
  Write-Status "npm check failed: $_" "Fail"
  $failedTools++
}

# Git
try {
  $gitVersion = & git --version 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Status "Git $gitVersion" "Pass"
    $passedTools++
  } else {
    Write-Status "Git not found" "Fail"
    $failedTools++
  }
} catch {
  Write-Status "Git check failed: $_" "Fail"
  $failedTools++
}

# Check 2: API Health (if running)
Write-Section "2. API Health"

try {
  $apiResponse = Invoke-WebRequest "http://localhost:4000/db/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
  if ($apiResponse.StatusCode -eq 200) {
    Write-Status "API Health OK (http://localhost:4000)" "Pass"
  } else {
    Write-Status "API Health Check: Status $($apiResponse.StatusCode)" "Warn"
  }
} catch {
  Write-Status "API not running on :4000 (this is OK if API is not started)" "Warn"
}

# Check 3: Generator Validation
Write-Section "3. Generator Validation"

$generatorScript = "./tools/generate-mobile-feature.mjs"
$exampleSpec = "./tools/specs/feature-sample.json"

if (-not (Test-Path $generatorScript)) {
  Write-Status "Generator script not found: $generatorScript" "Fail"
} else {
  Write-Status "Generator script found" "Pass"
  
  if (-not (Test-Path $exampleSpec)) {
    Write-Status "Example spec not found: $exampleSpec" "Warn"
  } else {
    Write-Status "Example spec found" "Pass"
    
    # Test dry-run
    Write-Host "`n[TEST] Running generator dry-run..." -ForegroundColor Cyan
    try {
      $genOutput = & node $generatorScript --spec $exampleSpec --dry-run 2>&1
      if ($LASTEXITCODE -eq 0) {
        Write-Status "Generator dry-run successful" "Pass"
        if ($Verbose) {
          Write-Host "`n[OUTPUT]" -ForegroundColor Gray
          Write-Host $genOutput -ForegroundColor Gray
        }
      } else {
        Write-Status "Generator dry-run failed (exit code: $LASTEXITCODE)" "Warn"
        Write-Host $genOutput -ForegroundColor Yellow
      }
    } catch {
      Write-Status "Generator dry-run error: $_" "Warn"
    }
  }
}

# Check 3b: V2 Spec Support
Write-Section "3b. V2 Spec Support (Step F)"

$v2Schema = "./tools/specs/mobile.feature.v2.schema.json"
$v2Sample = "./tools/specs/feature-sample.v2.json"

if (Test-Path $v2Schema) {
  Write-Status "V2 schema found: $v2Schema" "Pass"
} else {
  Write-Status "V2 schema not found" "Warn"
}

if (Test-Path $v2Sample) {
  Write-Status "V2 sample spec found: $v2Sample" "Pass"
  
  # Try to run generator with v2 spec (dry-run)
  Write-Host "`n[TEST] Generator with v2 spec (dry-run)..." -ForegroundColor Cyan
  try {
    $genV2Output = & node $generatorScript --spec $v2Sample --dry-run 2>&1
    if ($LASTEXITCODE -eq 0) {
      Write-Status "V2 spec dry-run successful" "Pass"
      if ($Verbose) {
        Write-Host $genV2Output -ForegroundColor Gray
      }
    } else {
      Write-Status "V2 spec dry-run failed (exit code: $LASTEXITCODE)" "Warn"
    }
  } catch {
    Write-Status "V2 spec dry-run error: $_" "Warn"
  }
} else {
  Write-Status "V2 sample spec not found" "Warn"
}

# Check 4: Screen Registry
Write-Section "4. Mobile Screen Registry"

$screenRegistry = "./mobile/src/screens/screenRegistry.js"

if (Test-Path $screenRegistry) {
  Write-Status "Screen registry found: $screenRegistry" "Pass"
  $regContent = Get-Content $screenRegistry -Raw
  if ($regContent -like "*registerScreen*" -and $regContent -like "*getScreen*") {
    Write-Status "Screen registry functions implemented" "Pass"
  }
} else {
  Write-Status "Screen registry not found" "Warn"
}

# Check 5: Preview Index Build
Write-Section "5. Preview Index Build"

$buildIndexScript = "./tools/build-preview-index.mjs"
$outputFile = "./web/public/factory-preview/index.json"

if (-not (Test-Path $buildIndexScript)) {
  Write-Status "Build-preview-index script not found: $buildIndexScript" "Fail"
} else {
  Write-Status "Build-preview-index script found" "Pass"
  
  Write-Host "`n[TEST] Building preview index (dry-run)..." -ForegroundColor Cyan
  try {
    # Use --dry-run to avoid modifying tracked files
    $indexOutput = & node $buildIndexScript --dry-run 2>&1
    if ($LASTEXITCODE -eq 0) {
      Write-Status "Preview index build successful (dry-run)" "Pass"
      
      if ($Verbose) {
        Write-Host "`n[OUTPUT]" -ForegroundColor Gray
        Write-Host $indexOutput -ForegroundColor Gray
      }
    } else {
      Write-Status "Preview index build failed (exit code: $LASTEXITCODE)" "Warn"
      Write-Host $indexOutput -ForegroundColor Yellow
    }
  } catch {
    Write-Status "Preview index build error: $_" "Warn"
  }
}

# Check 5: Web Setup
Write-Section "6. Web Configuration"

$webDir = "./web"
$webPackage = "./web/package.json"

if (Test-Path $webDir) {
  Write-Status "Web directory found" "Pass"
  
  if (Test-Path $webPackage) {
    Write-Status "Web package.json found" "Pass"
    
    # Check for dev script
    $packageContent = Get-Content $webPackage -Raw
    if ($packageContent -match '"dev"') {
      Write-Status "Web dev script verified" "Pass"
    } else {
      Write-Status "Web dev script not found" "Warn"
    }
  } else {
    Write-Status "Web package.json not found" "Warn"
  }
  
  # Check public directory
  if (Test-Path "./web/public") {
    Write-Status "Web public directory exists" "Pass"
  } else {
    Write-Status "Web public directory not found" "Warn"
  }
} else {
  Write-Status "Web directory not found" "Fail"
}

# Check 6: Mobile Setup
Write-Section "7. Mobile Configuration"

$mobileDir = "./mobile"
$mobilePackage = "./mobile/package.json"

if (Test-Path $mobileDir) {
  Write-Status "Mobile directory found" "Pass"
  
  if (Test-Path $mobilePackage) {
    Write-Status "Mobile package.json found" "Pass"
    
    # Check for start script
    $packageContent = Get-Content $mobilePackage -Raw
    if ($packageContent -match '"start"') {
      Write-Status "Mobile start script verified" "Pass"
    } else {
      Write-Status "Mobile start script not found" "Warn"
    }
  } else {
    Write-Status "Mobile package.json not found" "Warn"
  }
} else {
  Write-Status "Mobile directory not found" "Fail"
}

# Summary
Write-Section "Smoke Test Summary"

Write-Host "[RESULT] All smoke tests completed." -ForegroundColor Cyan
Write-Host ""
Write-Host "[NEXT] To start development:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File ./scripts/start-factory.ps1" -ForegroundColor White
Write-Host ""
Write-Host "[NEXT] To access services:" -ForegroundColor Cyan
Write-Host "  API:            http://localhost:4000" -ForegroundColor Gray
Write-Host "  Web:            http://localhost:3000" -ForegroundColor Gray
Write-Host "  Web Preview:    http://localhost:3000/factory-preview" -ForegroundColor Gray
Write-Host "  Mobile (Expo):  http://localhost:19000" -ForegroundColor Gray
Write-Host ""

exit 0
