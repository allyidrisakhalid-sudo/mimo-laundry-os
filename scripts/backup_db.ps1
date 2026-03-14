param(
  [string]$DatabaseUrl = "",
  [string]$OutputDir = "",
  [switch]$Compress
)

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
  Split-Path -Parent $PSScriptRoot
}

function Get-DatabaseUrl {
  param([string]$Provided)

  if ($Provided -and $Provided.Trim()) {
    return $Provided.Trim().Trim('"')
  }

  $repoRoot = Get-RepoRoot
  $envPath = Join-Path $repoRoot "apps\api\.env"
  if (Test-Path $envPath) {
    $line = Get-Content $envPath | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
    if ($line) {
      return $line.Substring("DATABASE_URL=".Length).Trim().Trim('"')
    }
  }

  if ($env:DATABASE_URL -and $env:DATABASE_URL.Trim()) {
    return $env:DATABASE_URL.Trim().Trim('"')
  }

  throw "DATABASE_URL not provided, not found in apps\api\.env, and not present in session environment."
}

function Parse-DbUrl {
  param([string]$Url)

  $uri = [Uri]$Url
  $dbName = $uri.AbsolutePath.TrimStart("/")
  $userInfo = $uri.UserInfo.Split(":", 2)

  [pscustomobject]@{
    Url = $Url
    Host = $uri.Host
    Port = if ($uri.Port -gt 0) { $uri.Port } else { 5432 }
    Username = if ($userInfo.Count -ge 1) { [Uri]::UnescapeDataString($userInfo[0]) } else { "" }
    Password = if ($userInfo.Count -ge 2) { [Uri]::UnescapeDataString($userInfo[1]) } else { "" }
    Database = $dbName
  }
}

function Find-PostgresContainer {
  $containerId = docker ps --filter "ancestor=postgres" --format "{{.ID}}" | Select-Object -First 1
  if (-not $containerId) {
    $containerId = docker ps --filter "name=postgres" --format "{{.ID}}" | Select-Object -First 1
  }
  return $containerId
}

$repoRoot = Get-RepoRoot
$dbUrl = Get-DatabaseUrl -Provided $DatabaseUrl
$db = Parse-DbUrl -Url $dbUrl

if (-not $OutputDir) {
  $OutputDir = Join-Path $repoRoot "backups\db"
}

New-Item -ItemType Directory -Force $OutputDir | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$baseName = "mimo-db-$($db.Database)-$timestamp"
$dumpPath = Join-Path $OutputDir "$baseName.dump"

Write-Host "Backup source DB: $($db.Database)"
Write-Host "Backup output: $dumpPath"

$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue

if ($pgDump) {
  Write-Host "Using local pg_dump"
  $env:PGPASSWORD = $db.Password
  & $pgDump.Source `
    --host $db.Host `
    --port $db.Port `
    --username $db.Username `
    --dbname $db.Database `
    --format custom `
    --file $dumpPath `
    --no-owner `
    --no-privileges
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
else {
  Write-Host "Local pg_dump not found; attempting Docker fallback"
  $containerId = Find-PostgresContainer
  if (-not $containerId) {
    throw "No pg_dump found locally and no running postgres Docker container detected."
  }

  $containerDumpPath = "/tmp/$baseName.dump"
  docker exec `
    -e PGPASSWORD=$($db.Password) `
    $containerId `
    pg_dump `
    --host $db.Host `
    --port $db.Port `
    --username $db.Username `
    --dbname $db.Database `
    --format custom `
    --file $containerDumpPath `
    --no-owner `
    --no-privileges

  docker cp "${containerId}:$containerDumpPath" $dumpPath
  docker exec $containerId rm -f $containerDumpPath | Out-Null
}

if (-not (Test-Path $dumpPath)) {
  throw "Backup file was not created."
}

$file = Get-Item $dumpPath
if ($file.Length -le 0) {
  throw "Backup file is empty."
}

if ($Compress) {
  $zipPath = "$dumpPath.zip"
  Compress-Archive -Path $dumpPath -DestinationPath $zipPath -Force
  Remove-Item $dumpPath -Force
  $file = Get-Item $zipPath
}

Write-Host ""
Write-Host "BACKUP_OK"
Write-Host "Path=$($file.FullName)"
Write-Host "SizeBytes=$($file.Length)"
Write-Host "Timestamp=$timestamp"

