param(
    [Parameter(Mandatory = $true)]
    [int]$PrNumber
)

$ErrorActionPreference = 'Stop'

function Invoke-Gh {
    param([string[]]$Args)

    & gh @Args
    return $LASTEXITCODE
}

Write-Output "=== PR VIEW ==="
$prViewExit = Invoke-Gh -Args @(
    'pr', 'view', "$PrNumber",
    '--json', 'number,url,state,mergeStateStatus,mergeable,reviewDecision'
)
Write-Output "gh pr view exit=$prViewExit"

Write-Output "=== MAIN PROTECTION REQUIRED CONTEXTS ==="
$protectionExit = Invoke-Gh -Args @(
    'api', 'repos/mdislam7895121/factory/branches/main/protection',
    '--jq', '{strict:.required_status_checks.strict, contexts:.required_status_checks.contexts, required_signatures:.required_signatures.enabled, enforce_admins:.enforce_admins.enabled, required_linear_history:.required_linear_history.enabled, required_conversation_resolution:.required_conversation_resolution.enabled}'
)
Write-Output "gh protection exit=$protectionExit"

Write-Output "=== PR CHECKS ==="
$checksExit = Invoke-Gh -Args @('pr', 'checks', "$PrNumber")
Write-Output "gh pr checks exit=$checksExit"

if ($prViewExit -ne 0 -or $protectionExit -ne 0) {
    exit 1
}

exit 0