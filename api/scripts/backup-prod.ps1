param(
  [string]$OutputFile = "backup.sql",
  [string]$DatabaseUrl = ""
)

if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
  if (-not [string]::IsNullOrWhiteSpace($env:DATABASE_PUBLIC_URL)) {
    $DatabaseUrl = $env:DATABASE_PUBLIC_URL
  } elseif (-not [string]::IsNullOrWhiteSpace($env:DATABASE_URL)) {
    $DatabaseUrl = $env:DATABASE_URL
  }
}

if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
  Write-Error "DATABASE_PUBLIC_URL or DATABASE_URL is required."
  exit 1
}

$outputPath = Resolve-Path -LiteralPath "." | ForEach-Object { Join-Path $_.Path $OutputFile }

pg_dump "$DatabaseUrl" -f "$outputPath"
if ($LASTEXITCODE -ne 0) {
  Write-Error "pg_dump failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Host "Backup created: $outputPath"
