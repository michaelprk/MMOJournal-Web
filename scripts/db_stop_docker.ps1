# MMOJournal - Stop and remove local Postgres container

param()

$ContainerName = "mmoj-db"

Write-Host "🐳 Stopping local Postgres container..." -ForegroundColor Blue

# Check if container exists
$ExistingContainer = docker ps -a --format 'table {{.Names}}' | Where-Object { $_ -eq $ContainerName }

if (-not $ExistingContainer) {
    Write-Host "ℹ️  Container '$ContainerName' does not exist." -ForegroundColor Yellow
    exit 0
}

# Stop if running
$RunningContainer = docker ps --format 'table {{.Names}}' | Where-Object { $_ -eq $ContainerName }
if ($RunningContainer) {
    Write-Host "🛑 Stopping container..." -ForegroundColor Yellow
    docker stop $ContainerName
}

# Remove container
Write-Host "🗑️  Removing container..." -ForegroundColor Yellow
docker rm $ContainerName

Write-Host "✅ Container '$ContainerName' stopped and removed" -ForegroundColor Green
