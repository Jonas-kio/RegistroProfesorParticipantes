@echo off
echo 🚀 Configurando PostgreSQL y completando el proyecto...

echo 📋 Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está disponible. Instala Docker Desktop desde https://www.docker.com/products/docker-desktop
    echo Luego ejecuta este script nuevamente.
    pause
    exit /b 1
)

echo ✅ Docker encontrado

echo 📦 Verificando si PostgreSQL está corriendo...
docker ps | findstr postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Iniciando PostgreSQL con Docker...
    docker run -d --name postgres ^
        -p 5432:5432 ^
        -e POSTGRES_DB=GenSoftware ^
        -e POSTGRES_USER=user ^
        -e POSTGRES_PASSWORD=password ^
        postgres:13

    echo ⏳ Esperando que PostgreSQL esté listo...
    timeout /t 15 /nobreak >nul
) else (
    echo ✅ PostgreSQL ya está corriendo
)

echo 🗄️ Ejecutando migraciones...
cd backend
npm run migrate

if %errorlevel% equ 0 (
    echo ✅ Migraciones ejecutadas exitosamente!
    echo.
    echo 🎉 ¡Proyecto completado!
    echo.
    echo Para iniciar los servicios:
    echo 1. Backend: npm run dev
    echo 2. Frontend: cd ../frontend && npm start
    echo.
    echo O usar Docker completo: cd .. && docker compose up --build
) else (
    echo ❌ Error ejecutando migraciones
    echo Verifica que PostgreSQL esté corriendo correctamente
)

pause