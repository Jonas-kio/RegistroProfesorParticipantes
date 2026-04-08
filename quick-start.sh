#!/bin/bash

# Script de inicio rápido para el proyecto
# Copia archivos de configuración y verifica setup

echo "🚀 Iniciando setup del proyecto Registro de Profesores..."

# Copiar archivos de configuración
echo "📋 Copiando archivos de configuración..."

if [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    echo "✅ backend/.env creado"
fi

if [ -f "frontend/.env.example" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ frontend/.env creado"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."

echo "Instalando backend..."
cd backend
npm install

echo "Instalando frontend..."
cd ../frontend
npm install

cd ..

echo ""
echo "🎯 Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Asegúrate de que PostgreSQL esté corriendo (ver README.md)"
echo "2. Ejecuta las migraciones: cd backend && npm run migrate"
echo "3. Inicia el backend: cd backend && npm run dev"
echo "4. Inicia el frontend: cd frontend && npm start"
echo ""
echo "O usa Docker: docker compose up --build"