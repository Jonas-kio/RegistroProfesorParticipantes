# Script de PowerShell para completar el proyecto
Write-Host "🚀 Configurando PostgreSQL y completando el proyecto..." -ForegroundColor Green

# Verificar Docker
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está disponible. Instala Docker Desktop desde https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si PostgreSQL está corriendo
Write-Host "📦 Verificando si PostgreSQL está corriendo..." -ForegroundColor Yellow
$postgresRunning = docker ps | Select-String postgres

if (-not $postgresRunning) {
    Write-Host "📦 Iniciando PostgreSQL con Docker..." -ForegroundColor Yellow
    docker run -d --name postgres `
        -p 5432:5432 `
        -e POSTGRES_DB=GenSoftware `
        -e POSTGRES_USER=user `
        -e POSTGRES_PASSWORD=password `
        postgres:13

    Write-Host "⏳ Esperando que PostgreSQL esté listo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
} else {
    Write-Host "✅ PostgreSQL ya está corriendo" -ForegroundColor Green
}

# Ejecutar migraciones
Write-Host "🗄️ Ejecutando migraciones..." -ForegroundColor Yellow
Set-Location backend
try {
    npm run migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migraciones ejecutadas exitosamente!" -ForegroundColor Green
        Write-Host "" -ForegroundColor Green
        Write-Host "🎉 ¡Proyecto completado!" -ForegroundColor Green
        Write-Host "" -ForegroundColor Green
        Write-Host "Para iniciar los servicios:" -ForegroundColor Cyan
        Write-Host "1. Backend: npm run dev" -ForegroundColor White
        Write-Host "2. Frontend: cd ../frontend && npm start" -ForegroundColor White
        Write-Host "" -ForegroundColor Green
        Write-Host "O usar Docker completo: cd .. && docker compose up --build" -ForegroundColor White
    } else {
        Write-Host "❌ Error ejecutando migraciones" -ForegroundColor Red
        Write-Host "Verifica que PostgreSQL esté corriendo correctamente" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error ejecutando migraciones: $_" -ForegroundColor Red
}

Read-Host "Presiona Enter para continuar"