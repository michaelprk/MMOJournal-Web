# MMOJournal - Rebuild schema by applying all migrations in order

param(
    [string]$Url = "postgresql://postgres:postgres@127.0.0.1:5433/mmojournal"
)

$MigrationsDir = "backend\migrations"

Write-Host "🔄 MMOJournal Schema Rebuild" -ForegroundColor Blue
Write-Host "📍 Target: $Url" -ForegroundColor Cyan
Write-Host "📁 Migrations: $MigrationsDir" -ForegroundColor Cyan
Write-Host

# Check if psql exists
$psqlCommand = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCommand) {
    Write-Host "❌ psql not found. Please install PostgreSQL client tools." -ForegroundColor Red
    exit 1
}

# Check if migrations directory exists
if (-not (Test-Path $MigrationsDir)) {
    Write-Host "❌ Migrations directory not found: $MigrationsDir" -ForegroundColor Red
    exit 1
}

# Test connection
Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow
$testResult = psql $Url -c "SELECT 1;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to connect to database. Is the container running?" -ForegroundColor Red
    Write-Host "   Try: .\scripts\db_start_docker.ps1" -ForegroundColor Gray
    exit 1
}
Write-Host "✅ Database connection successful" -ForegroundColor Green
Write-Host

# Find all .sql files in migrations directory
$SqlFiles = Get-ChildItem -Path $MigrationsDir -Filter "*.sql" -File | Sort-Object Name

if ($SqlFiles.Count -eq 0) {
    Write-Host "⚠️  No SQL migration files found in $MigrationsDir" -ForegroundColor Yellow
    exit 0
}

Write-Host "📋 Found $($SqlFiles.Count) migration file(s):" -ForegroundColor Blue
foreach ($file in $SqlFiles) {
    Write-Host "   📄 $($file.Name)" -ForegroundColor Gray
}
Write-Host

# Apply each migration
foreach ($file in $SqlFiles) {
    Write-Host "🔄 Applying: $($file.Name)" -ForegroundColor Yellow
    
    $result = psql $Url -v ON_ERROR_STOP=1 -f $file.FullName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Success: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed: $($file.Name)" -ForegroundColor Red
        Write-Host "   Migration failed. Stopping here." -ForegroundColor Red
        exit 1
    }
    Write-Host
}

Write-Host "🎉 All migrations applied successfully!" -ForegroundColor Green
Write-Host "💡 Next steps:" -ForegroundColor Blue
Write-Host "   • Verify schema: psql `"$Url`" -c `"\dt`"" -ForegroundColor Gray
Write-Host "   • Check RLS: psql `"$Url`" -c `"SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`"" -ForegroundColor Gray
