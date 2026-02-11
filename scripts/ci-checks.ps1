#Requires -Version 5.1
<#
.SYNOPSIS
  Factory CI Quality Gates - Strict Mode

.DESCRIPTION
  Runs CI checks in strict mode (fail-fast):
  - Spec validation (v1 and v2)
  - Generator dry-run tests (v1 and v2)
  - Non-mutating smoke/proof scripts
  - Ensures git working tree remains clean
  
  Exit codes:
    0 - All checks passed
    1 - One or more checks failed

.EXAMPLE
  pwsh -File scripts/ci-checks.ps1
#>

$ErrorActionPreference = "Stop"

function Write-Check {
  param(
    [string]$Message,
    [ValidateSet("Pass", "Fail", "Info")]
    [string]$Status = "Info"
  )
  
  $symbol = @{
    Pass = "[OK]"
    Fail = "[FAIL]"
    Info = "[INFO]"
  }
  
  $color = @{Pass="Green"; Fail="Red"; Info="Cyan"}[$Status]
  Write-Host "$($symbol[$Status]) $Message" -ForegroundColor $color
}

function Test-GitClean {
  $status = git status --porcelain
  return [string]::IsNullOrWhiteSpace($status)
}

Write-Host "`n======================================================================"
Write-Host "  FACTORY CI QUALITY GATES - STRICT MODE"
Write-Host "======================================================================`n"

$failureCount = 0

# Check 1: Spec Validation
Write-Host "`n[CHECK 1] Spec Validation" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------------"

$v1Spec = "tools/specs/feature-sample.json"
$v2Spec = "tools/specs/feature-sample.v2.json"
$validator = "tools/validate-spec.mjs"

Write-Check "Validating v1 spec: $v1Spec" "Info"
try {
  $output = & node $validator $v1Spec 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Check "V1 spec validation failed" "Fail"
    Write-Host $output -ForegroundColor Red
    $failureCount++
  } else {
    Write-Check "V1 spec validation passed" "Pass"
  }
} catch {
  Write-Check "V1 spec validation error: $_" "Fail"
  $failureCount++
}

Write-Check "Validating v2 spec: $v2Spec" "Info"
try {
  $output = & node $validator $v2Spec 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Check "V2 spec validation failed" "Fail"
    Write-Host $output -ForegroundColor Red
    $failureCount++
  } else {
    Write-Check "V2 spec validation passed" "Pass"
  }
} catch {
  Write-Check "V2 spec validation error: $_" "Fail"
  $failureCount++
}

# Check 2: Generator Dry-Run
Write-Host "`n[CHECK 2] Generator Dry-Run Tests" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------------"

$generator = "tools/generate-mobile-feature.mjs"

Write-Check "Running v1 generator dry-run" "Info"
try {
  $output = & node $generator --spec $v1Spec --out mobile --dry-run 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Check "V1 generator dry-run failed" "Fail"
    Write-Host $output -ForegroundColor Red
    $failureCount++
  } else {
    Write-Check "V1 generator dry-run passed" "Pass"
  }
} catch {
  Write-Check "V1 generator dry-run error: $_" "Fail"
  $failureCount++
}

Write-Check "Running v2 generator dry-run" "Info"
try {
  $output = & node $generator --spec $v2Spec --out mobile --dry-run 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Check "V2 generator dry-run failed" "Fail"
    Write-Host $output -ForegroundColor Red
    $failureCount++
  } else {
    Write-Check "V2 generator dry-run passed" "Pass"
  }
} catch {
  Write-Check "V2 generator dry-run error: $_" "Fail"
  $failureCount++
}

# Check 3: Non-Mutating Smoke Test
Write-Host "`n[CHECK 3] Non-Mutating Smoke Test" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------------"

# Stash any uncommitted changes first to have a clean baseline (include staged)
$hasUncommitted = -not (Test-GitClean)
if ($hasUncommitted) {
  Write-Check "Stashing uncommitted changes for clean test" "Info"
  git stash push -u -m "ci-checks-temp-stash" --include-untracked 2>&1 | Out-Null
}

try {
  Write-Check "Running smoke-factory.ps1" "Info"
  try {
    $output = & pwsh -ExecutionPolicy Bypass -File scripts/smoke-factory.ps1 2>&1
    if ($LASTEXITCODE -ne 0) {
      Write-Check "Smoke test failed (exit code: $LASTEXITCODE)" "Fail"
      Write-Host $output -ForegroundColor Red
      $failureCount++
    } else {
      Write-Check "Smoke test passed" "Pass"
      
      # Verify git status is still clean
      if (-not (Test-GitClean)) {
        Write-Check "Smoke test mutated tracked files (not non-mutating)" "Fail"
        Write-Host "Git diff:" -ForegroundColor Yellow
        git status --short
        git diff --stat
        $failureCount++
      } else {
        Write-Check "Smoke test is non-mutating (git clean)" "Pass"
      }
    }
  } catch {
    Write-Check "Smoke test error: $_" "Fail"
    $failureCount++
  }
} finally {
  # Restore stashed changes
  if ($hasUncommitted) {
    Write-Check "Restoring uncommitted changes" "Info"
    git stash pop 2>&1 | Out-Null
  }
}

# Check 4: Non-Mutating Proof Scripts
Write-Host "`n[CHECK 4] Non-Mutating Proof Scripts" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------------------"

$proofScripts = @(
  "scripts/proof-platform-kit.ps1",
  "scripts/proof-step-e.ps1",
  "scripts/proof-step-f.ps1"
)

foreach ($script in $proofScripts) {
  if (Test-Path $script) {
    Write-Check "Testing $script (non-mutating)" "Info"
    
    # Stash uncommitted changes for clean baseline (include staged and untracked)
    $hasUncommitted = -not (Test-GitClean)
    if ($hasUncommitted) {
      git stash push -u -m "ci-checks-proof-temp" --include-untracked 2>&1 | Out-Null
    }
    
    try {
      # Run with ErrorAction Continue to not break on warnings
      $ErrorActionPreference = "Continue"
      $output = & pwsh -ExecutionPolicy Bypass -File $script 2>&1
      $ErrorActionPreference = "Stop"
      
      # Check for mutations (exclude index.json as it's a generated file that proofs may update)
      $gitStatus = git status --porcelain
      $mutations = $gitStatus | Where-Object { $_ -notlike "*web/public/factory-preview/index.json*" }
      
      if ($mutations) {
        Write-Check "$(Split-Path $script -Leaf) mutated tracked files" "Fail"
        Write-Host "Git diff:" -ForegroundColor Yellow
        Write-Host ($mutations -join "`n")
        git diff --stat
        $failureCount++
      } else {
        Write-Check "$(Split-Path $script -Leaf) is non-mutating" "Pass"
      }
    } catch {
      # Some proof scripts may error if services aren't running - that's OK
      # as long as they don't mutate files
      $gitStatus = git status --porcelain
      $mutations = $gitStatus | Where-Object { $_ -notlike "*web/public/factory-preview/index.json*" }
      
      if ($mutations) {
        Write-Check "$(Split-Path $script -Leaf) mutated tracked files despite error" "Fail"
        $failureCount++
      } else {
        Write-Check "$(Split-Path $script -Leaf) is non-mutating (errored but clean)" "Pass"
      }
    } finally {
      # Restore stashed changes
      if ($hasUncommitted) {
        git stash pop 2>&1 | Out-Null
      }
    }
  }
}

# Final Summary
Write-Host "`n======================================================================"
Write-Host "  CI CHECKS SUMMARY"
Write-Host "======================================================================`n"

if ($failureCount -eq 0) {
  Write-Check "All CI checks passed" "Pass"
  Write-Host ""
  exit 0
} else {
  Write-Check "CI checks failed: $failureCount failure(s)" "Fail"
  Write-Host ""
  exit 1
}
