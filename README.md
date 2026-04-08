# Registro de Profesores y Participantes

Sistema completo para el registro de profesores y carga de listas de participantes con validación de archivos CSV.

## Arquitectura

- **Backend**: Node.js + TypeScript + Express + PostgreSQL
- **Frontend**: React + TypeScript + CSS básico
- **Base de datos**: PostgreSQL con migraciones
- **Testing**: Jest para pruebas unitarias
- **Contenedorización**: Docker + Docker Compose

## Características

### Backend:
- ✅ API REST completa para profesores e instituciones
- ✅ Validación de archivos CSV con reglas específicas
- ✅ Base de datos PostgreSQL con migraciones
- ✅ Servicios de notificación (email)
- ✅ Pruebas unitarias con Jest (100% coverage en servicios principales)

### Frontend:
- ✅ Interfaz para registrar profesores
- ✅ Formulario de carga de archivos CSV
- ✅ Validación en tiempo real de archivos
- ✅ Vista previa de datos validados

## Base de Datos

### Esquema
- **institutions**: Catálogo de instituciones educativas
- **teachers**: Profesores registrados
- **uploads**: Registros de carga de archivos
- **participants**: Participantes extraídos de archivos CSV

### Migraciones
```sql
-- Crear extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de instituciones
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de profesores
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de uploads
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  filename VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_rows INTEGER NOT NULL DEFAULT 0,
  valid_rows INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de participantes
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('Primaria', 'Secundaria')),
  course SMALLINT NOT NULL CHECK (course BETWEEN 1 AND 6),
  birth_date DATE NOT NULL
);

-- Índices
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_uploads_teacher_id ON uploads(teacher_id);
CREATE INDEX idx_participants_upload_id ON participants(upload_id);
```

## Requisitos

- Docker Desktop instalado
- Node.js 20+ (para desarrollo local)
- PostgreSQL (local o en Docker)

## 🚀 Inicio Rápido - Completar el Proyecto

### Si tienes PostgreSQL y Docker instalados:

**Ejecuta uno de estos scripts automáticos:**

**Opción 1: CMD (recomendado)**
```cmd
.\setup-complete.bat
```

**Opción 2: PowerShell**
```powershell
.\setup-complete.ps1
```

**O sigue estos pasos manuales:**

#### 1. Iniciar PostgreSQL con Docker
```bash
docker run -d --name postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=GenSoftware \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  postgres:13
```

#### 2. Ejecutar Migraciones
```bash
cd backend
npm run migrate
```

#### 3. Iniciar Servicios
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd ../frontend
npm start
```

### Verificar que todo funciona:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Pruebas**: `npm test` (deberían pasar todas ahora)
- **Verificación completa**: Ejecuta `.\test-system.bat` para probar todo el sistema

### Solución de Problemas

**Si `npm run migrate` falla:**
1. Verifica que PostgreSQL esté corriendo: `docker ps`
2. Si no está, inicia PostgreSQL con el comando de arriba
3. Espera 10-15 segundos y ejecuta migraciones nuevamente

**Si Docker no funciona:**
- Asegúrate de que Docker Desktop esté abierto y corriendo
- En Windows, ejecuta PowerShell como Administrador

**Si PostgreSQL local no funciona:**
- Usa la opción Docker (recomendada)
- O configura PostgreSQL local con:
  - Base de datos: `GenSoftware`
  - Usuario: `user`
  - Password: `password`

### Instalación Manual

### Opción 1: Docker (Recomendado)

1. **Instala Docker Desktop** desde https://www.docker.com/products/docker-desktop
2. Clona el repositorio
3. Ejecuta:
   ```bash
   cd RegistroProfesorParticipantes
   docker compose up --build
   ```

Los servicios estarán disponibles en:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **pgAdmin**: http://localhost:8080 (usuario: admin@admin.com, password: admin)
- **PostgreSQL**: localhost:5432

### Opción 2: Desarrollo Local

#### 1. PostgreSQL
**Opción A: Con Docker (Recomendado)**
```bash
docker run -d --name postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=GenSoftware \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  postgres:13
```

**Opción B: PostgreSQL Local**
- Instala PostgreSQL 13+ desde https://www.postgresql.org/download/
- Crea una base de datos llamada `GenSoftware`
- Configura usuario `user` con password `password`

#### 2. Backend
```bash
cd backend
npm install
cp .env.example .env  # Copiar configuración de ejemplo
npm run migrate  # ⚠️ IMPORTANTE: Ejecutar migraciones primero
npm run dev      # Iniciar servidor de desarrollo
```

#### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Copiar configuración de ejemplo (opcional)
npm start
```

## Solución de Problemas

### Error: "Can't connect to PostgreSQL"
Si las migraciones fallan con error de conexión:

1. **Verifica que PostgreSQL esté corriendo:**
   ```bash
   docker ps | grep postgres
   ```

2. **Si no está corriendo, inicia PostgreSQL:**
   ```bash
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=GenSoftware -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password postgres:13
   ```

3. **Espera 10-15 segundos** y ejecuta las migraciones:
   ```bash
   cd backend
   npm run migrate
   ```

### Error: "Port 5432 already in use"
Si el puerto 5432 está ocupado:
```bash
# Detener contenedor existente
docker stop postgres
docker rm postgres

# O usar un puerto diferente
docker run -d --name postgres -p 5433:5432 -e POSTGRES_DB=GenSoftware -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password postgres:13
```

Y actualiza las variables de entorno en `backend/.env`:
```env
DB_PORT=5433
```

## Variables de Entorno

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=GenSoftware
DB_USER=user
DB_PASSWORD=password

# Server
PORT=3000
NODE_ENV=development

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:3000/api
```

## API Endpoints

### Profesores
- `GET /api/teachers` - Lista todos los profesores
- `GET /api/teachers/:id` - Obtiene profesor por ID
- `POST /api/teachers` - Registra nuevo profesor
- `GET /api/teachers/institutions` - Lista instituciones

### Archivos
- `POST /api/uploads/validate` - Valida archivo CSV
- `POST /api/uploads` - Sube y procesa archivo CSV
- `GET /api/uploads/:teacherId` - Lista uploads de un profesor
- `GET /api/uploads/:uploadId/participants` - Lista participantes de un upload

## Formato CSV para Participantes

El archivo CSV debe tener las siguientes columnas (case-insensitive):

```
nombre del estudiante,apellidos estudiante,primaria/secundaria,curso,fecha de nacimiento
Juan,Pérez,Primaria,1,2000-01-01
María,García,Secundaria,3,1999-05-15
```

### Validaciones
- Columnas requeridas: nombre, apellidos, nivel, curso, fecha nacimiento
- Nivel: "Primaria" o "Secundaria"
- Curso: 1-6
- Fecha: formato válido YYYY-MM-DD

## Pruebas

### Backend
```bash
cd backend
npm test  # Ejecuta todas las pruebas unitarias
```

### Frontend
```bash
cd frontend
npm test
```

## Desarrollo con TDD

El proyecto sigue principios de TDD:

1. Escribe pruebas que fallen
2. Implementa código mínimo para pasar las pruebas
3. Refactoriza manteniendo las pruebas verdes

Ejemplo de flujo TDD:
```bash
# 1. Escribe prueba
# 2. Corre pruebas (fallan)
npm test
# 3. Implementa funcionalidad
# 4. Corre pruebas (pasan)
npm test
# 5. Refactoriza si es necesario
```

## Estructura del Proyecto

```
RegistroProfesorParticipantes/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Pruebas unitarias
│   │   ├── db/                 # Configuración BD y migraciones
│   │   ├── routes/             # Endpoints API
│   │   ├── services/           # Lógica de negocio
│   │   ├── types.ts            # Definiciones TypeScript
│   │   └── index.ts            # Punto de entrada
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Servicios API
│   │   ├── types.ts            # Tipos compartidos
│   │   └── App.tsx             # App principal
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Migraciones

Para ejecutar migraciones manualmente:
```bash
cd backend
npm run migrate
```

Esto creará todas las tablas necesarias en PostgreSQL.

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Variables de Entorno

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/GenSoftware
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Desarrollo con TDD

El proyecto sigue principios de TDD (Test-Driven Development):

1. Escribe pruebas que fallen
2. Implementa código mínimo para pasar las pruebas
3. Refactoriza manteniendo las pruebas verdes

Ejemplo de flujo TDD:
```bash
# 1. Escribe prueba
# 2. Corre pruebas (fallan)
npm test
# 3. Implementa funcionalidad
# 4. Corre pruebas (pasan)
npm test
# 5. Refactoriza si es necesario
```

## Estructura del Proyecto

```
RegistroProfesorParticipantes/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Pruebas unitarias
│   │   ├── routes/             # Endpoints API
│   │   ├── services/           # Lógica de negocio
│   │   ├── types.ts            # Definiciones TypeScript
│   │   └── index.ts            # Punto de entrada
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── services/           # Servicios API
│   │   ├── types.ts            # Tipos compartidos
│   │   └── App.tsx             # App principal
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```