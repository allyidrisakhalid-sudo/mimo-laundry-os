param(
  [Parameter(Mandatory = $true)]
  [string]$BackupFile,
  [string]$TargetDatabaseUrl = "",
  [switch]$DropAndRecreate,
  [switch]$RunMigrations
)

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
  Split-Path -Parent $PSScriptRoot
}

function Get-EnvDatabaseUrl {
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

  throw "DATABASE_URL not found in apps\api\.env or session environment."
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

if (-not (Test-Path $BackupFile)) {
  throw "Backup file not found: $BackupFile"
}

$repoRoot = Get-RepoRoot
$sourceUrl = Get-EnvDatabaseUrl

if (-not $TargetDatabaseUrl) {
  $TargetDatabaseUrl = $sourceUrl -replace 'mimo_laundry_os', 'mimo_laundry_os_staging_restore'
}

$target = Parse-DbUrl -Url $TargetDatabaseUrl

Write-Host "Restore source file: $BackupFile"
Write-Host "Restore target DB: $($target.Database)"

$psql = Get-Command psql -ErrorAction SilentlyContinue
$pgRestore = Get-Command pg_restore -ErrorAction SilentlyContinue

if ($psql -and $pgRestore) {
  Write-Host "Using local psql/pg_restore"
  $env:PGPASSWORD = $target.Password

  if ($DropAndRecreate) {
    & $psql.Source --host $target.Host --port $target.Port --username $target.Username --dbname postgres --command "DROP DATABASE IF EXISTS `"$($target.Database)`";"
  }

  & $psql.Source --host $target.Host --port $target.Port --username $target.Username --dbname postgres --command "CREATE DATABASE `"$($target.Database)`";" 2>$null

  & $pgRestore.Source `
    --host $target.Host `
    --port $target.Port `
    --username $target.Username `
    --dbname $target.Database `
    --clean `
    --if-exists `
    --no-owner `
    --no-privileges `
    $BackupFile

  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
else {
  Write-Host "Local restore tools not found; attempting Docker fallback"
  $containerId = Find-PostgresContainer
  if (-not $containerId) {
    throw "No local restore tools and no running postgres Docker container detected."
  }

  $containerBackup = "/tmp/" + [IO.Path]::GetFileName($BackupFile)
  docker cp $BackupFile "${containerId}:$containerBackup"

  if ($DropAndRecreate) {
    docker exec -e PGPASSWORD=$($target.Password) $containerId psql -h $target.Host -p $target.Port -U $target.Username -d postgres -c "DROP DATABASE IF EXISTS `"$($target.Database)`";"
  }

  docker exec -e PGPASSWORD=$($target.Password) $containerId psql -h $target.Host -p $target.Port -U $target.Username -d postgres -c "CREATE DATABASE `"$($target.Database)`";" 2>$null

  docker exec `
    -e PGPASSWORD=$($target.Password) `
    $containerId `
    pg_restore `
    -h $target.Host `
    -p $target.Port `
    -U $target.Username `
    -d $target.Database `
    --clean `
    --if-exists `
    --no-owner `
    --no-privileges `
    $containerBackup

  docker exec $containerId rm -f $containerBackup | Out-Null
}

if ($RunMigrations) {
  Write-Host "Running Prisma migrations against restored DB"
  $env:DATABASE_URL = $TargetDatabaseUrl
  Push-Location (Join-Path $repoRoot "apps\api")
  try {
    pnpm prisma migrate deploy
  }
  finally {
    Pop-Location
    Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
  }
}

Write-Host ""
Write-Host "RESTORE_OK"
Write-Host "TargetDatabase=$($target.Database)"
Write-Host "BackupFile=$BackupFile"
