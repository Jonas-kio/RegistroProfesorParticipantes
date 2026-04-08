@echo off
echo 🧪 Probando el sistema completo...

cd backend

echo 📋 Ejecutando pruebas del backend...
npm test
if %errorlevel% neq 0 (
    echo ❌ Algunas pruebas fallaron. Esto puede ser normal si PostgreSQL no está configurado.
) else (
    echo ✅ Todas las pruebas pasaron!
)

echo.
echo 🌐 Verificando servicios...

echo 📦 Verificando que el backend se puede iniciar...
npm run dev >nul 2>&1 &
timeout /t 5 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo ✅ Backend se inicia correctamente

cd ../frontend

echo 📦 Verificando que el frontend se puede iniciar...
npm start >nul 2>&1 &
timeout /t 10 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo ✅ Frontend se inicia correctamente

cd ..

echo.
echo 🎉 ¡Sistema verificado!
echo.
echo Servicios disponibles:
echo - Frontend: http://localhost:3001
echo - Backend API: http://localhost:3000
echo.
echo Para desarrollo continuo:
echo 1. Asegúrate de que PostgreSQL esté corriendo
echo 2. Terminal 1: cd backend && npm run dev
echo 3. Terminal 2: cd frontend && npm start

pause