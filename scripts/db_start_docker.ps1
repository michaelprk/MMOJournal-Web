# MMOJournal - Start local Postgres container for schema rebuild testing

param()

$ContainerName = "mmoj-db"
$Port = "5433"
$Password = "postgres"
$DbName = "mmojournal"

Write-Host "🐳 Starting local Postgres container for MMOJournal..." -ForegroundColor Blue

# Check if container already exists (running or stopped)
$ExistingContainer = docker ps -a --format 'table {{.Names}}' | Where-Object { $_ -eq $ContainerName }

if ($ExistingContainer) {
    Write-Host "ℹ️  Container '$ContainerName' already exists." -ForegroundColor Yellow
    
    # Check if it's running
    $RunningContainer = docker ps --format 'table {{.Names}}' | Where-Object { $_ -eq $ContainerName }
    
    if ($RunningContainer) {
        Write-Host "✅ Container is already running on localhost:$Port" -ForegroundColor Green
    } else {
        Write-Host "🔄 Starting existing container..." -ForegroundColor Yellow
        docker start $ContainerName
        Write-Host "✅ Container started on localhost:$Port" -ForegroundColor Green
    }
    exit 0
}

# Create and start new container
Write-Host "🚀 Creating new Postgres container..." -ForegroundColor Blue
docker run -d `
  --name $ContainerName `
  -p "$Port`:5432" `
  -e POSTGRES_PASSWORD=$Password `
  -e POSTGRES_DB=$DbName `
  postgres:15

Write-Host "⏳ Waiting for Postgres to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Wait for Postgres to accept connections
for ($i = 1; $i -le 30; $i++) {
    $isReady = docker exec $ContainerName pg_isready -q
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Postgres is ready on localhost:$Port" -ForegroundColor Green
        Write-Host "📋 Connection details:" -ForegroundColor Cyan
        Write-Host "   Host: localhost:$Port" -ForegroundColor Gray
        Write-Host "   Database: $DbName" -ForegroundColor Gray
        Write-Host "   User: postgres" -ForegroundColor Gray
        Write-Host "   Password: $Password" -ForegroundColor Gray
        exit 0
    }
    Write-Host "   Attempt $i/30..." -ForegroundColor Gray
    Start-Sleep -Seconds 1
}

Write-Host "❌ Postgres failed to start within 30 seconds" -ForegroundColor Red
exit 1
