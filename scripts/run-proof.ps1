[CmdletBinding(DefaultParameterSetName = 'Command')]
param(
    [Parameter(ParameterSetName = 'Command', Mandatory = $true)]
    [string] $Command,

    [Parameter(ParameterSetName = 'File', Mandatory = $true)]
    [string] $File,

    [Parameter(ParameterSetName = 'File', ValueFromRemainingArguments = $true)]
    [string[]] $FileArgs = @()
)

$ErrorActionPreference = 'Stop'

$ensureRepoPath = Join-Path $PSScriptRoot 'ensure-repo.ps1'

Write-Host 'VERIFY_REPO'
& $ensureRepoPath
$verifyExitCode = $LASTEXITCODE
if ($verifyExitCode -ne 0) {
    Write-Host "EXIT_CODE=$verifyExitCode"
    exit $verifyExitCode
}

$commandExitCode = 0

if ($PSCmdlet.ParameterSetName -eq 'Command') {
    Write-Host 'RUN_MODE=COMMAND'
    pwsh -NoProfile -Command $Command
    $commandExitCode = $LASTEXITCODE
}
else {
    Write-Host 'RUN_MODE=FILE'

    $resolvedFile = $File
    if (-not [System.IO.Path]::IsPathRooted($resolvedFile)) {
        $resolvedFile = Join-Path (Get-Location).Path $resolvedFile
    }

    $resolvedFile = [System.IO.Path]::GetFullPath($resolvedFile)

    pwsh -NoProfile -File $resolvedFile @FileArgs
    $commandExitCode = $LASTEXITCODE
}

Write-Host "EXIT_CODE=$commandExitCode"
exit $commandExitCode
