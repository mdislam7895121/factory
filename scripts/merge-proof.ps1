param(
    [Parameter(Mandatory = $true)]
    [int]$PrNumber
)

$ErrorActionPreference = 'Stop'

$env:GH_PAGER = ''

Write-Output "=== PR VIEW ==="
& gh pr view "$PrNumber" --json number,url,state,mergeStateStatus,mergeable,reviewDecision
$prViewExit = [int]$LASTEXITCODE
Write-Output "gh pr view exit=$prViewExit"

Write-Output "=== MAIN PROTECTION REQUIRED CONTEXTS ==="
& gh api repos/mdislam7895121/factory/branches/main/protection --jq '{strict:.required_status_checks.strict, contexts:.required_status_checks.contexts, required_signatures:.required_signatures.enabled, enforce_admins:.enforce_admins.enabled, required_linear_history:.required_linear_history.enabled, required_conversation_resolution:.required_conversation_resolution.enabled}'
$protectionExit = [int]$LASTEXITCODE
Write-Output "gh protection exit=$protectionExit"

Write-Output "=== PR CHECKS ==="
& gh pr checks "$PrNumber"
$checksExit = [int]$LASTEXITCODE
Write-Output "gh pr checks exit=$checksExit"

if ($prViewExit -ne 0 -or $protectionExit -ne 0) {
    exit 1
}

exit 0