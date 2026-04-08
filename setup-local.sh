#!/bin/bash

# Script de inicialización para desarrollo local
# Este script configura PostgreSQL y ejecuta las migraciones

echo "🚀 Iniciando configuración del proyecto..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

# Verificar si PostgreSQL está corriendo
if ! docker ps | grep -q postgres; then
    echo "📦 Iniciando PostgreSQL con Docker..."
    docker run -d --name postgres \
        -p 5432:5432 \
        -e POSTGRES_DB=GenSoftware \
        -e POSTGRES_USER=user \
        -e POSTGRES_PASSWORD=password \
        postgres:13

    # Esperar a que PostgreSQL esté listo
    echo "⏳ Esperando que PostgreSQL esté listo..."
    sleep 10
else
    echo "✅ PostgreSQL ya está corriendo"
fi

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
npm run migrate

if [ $? -eq 0 ]; then
    echo "✅ Migraciones ejecutadas exitosamente"
else
    echo "❌ Error ejecutando migraciones"
    exit 1
fi

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install

echo ""
echo "🎉 Configuración completa!"
echo ""
echo "Para iniciar el proyecto:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "O usar Docker: docker compose up --build"