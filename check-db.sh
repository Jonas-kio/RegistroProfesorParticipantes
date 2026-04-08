#!/bin/bash

# Script para verificar la conexión a PostgreSQL y ejecutar migraciones

echo "🔍 Verificando configuración de PostgreSQL..."

# Verificar si Docker está disponible
if command -v docker &> /dev/null; then
    echo "✅ Docker está disponible"

    # Verificar si PostgreSQL está corriendo
    if docker ps | grep -q postgres; then
        echo "✅ PostgreSQL está corriendo en Docker"
    else
        echo "❌ PostgreSQL no está corriendo"
        echo "💡 Ejecuta: docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=GenSoftware -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password postgres:13"
        exit 1
    fi
else
    echo "⚠️ Docker no está disponible. Verificando PostgreSQL local..."

    # Verificar si psql está disponible
    if command -v psql &> /dev/null; then
        echo "✅ PostgreSQL cliente está disponible"
    else
        echo "❌ PostgreSQL no está instalado localmente"
        echo "💡 Instala PostgreSQL o usa Docker"
        exit 1
    fi
fi

# Verificar conexión a la base de datos
echo "🔌 Probando conexión a la base de datos..."
cd backend

# Intentar ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
npm run migrate

if [ $? -eq 0 ]; then
    echo "✅ Migraciones ejecutadas exitosamente!"
    echo ""
    echo "🎉 Base de datos configurada correctamente."
    echo "Ahora puedes ejecutar:"
    echo "  Backend: npm run dev"
    echo "  Frontend: cd ../frontend && npm start"
else
    echo "❌ Error ejecutando migraciones"
    echo ""
    echo "Posibles soluciones:"
    echo "1. Asegúrate de que PostgreSQL esté corriendo"
    echo "2. Verifica las credenciales en backend/.env"
    echo "3. Espera unos segundos si acabas de iniciar PostgreSQL"
    exit 1
fi