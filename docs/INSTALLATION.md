# Mission Control Office - Installation Guide

Este es el guía de instalación detallada para instalar Mission Control Office localmente. Fue diseñada para que **agentes de IA puedan automatizar la instalación** leyendo paso a paso.

---

## 📋 Prerequisites

Antes de comenzar, asegúrate de tener:

| Requirement | Version | Check |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 8+ | `npm --version` |
| PostgreSQL | 12+ | `psql --version` |
| Git | (any) | `git --version` |

Para instalar PostgreSQL:
- **macOS**: `brew install postgresql` luego `brew services start postgresql`
- **Windows**: Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/)
- **Linux**: `apt-get install postgresql postgresql-contrib` (Ubuntu/Debian)

Después de instalar PostgreSQL, verifica que está corriendo:
```bash
psql --version
psql -U postgres -c "SELECT version();"
```

---

## 🚀 Installation Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/lucybotbarko/mission-control-office.git
cd mission-control-office
```

### Step 2: Install Dependencies

```bash
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo Prisma.

### Step 3: Configure Environment

Copia el archivo template de configuración:
```bash
cp .env.example .env
```

Abre `.env` con un editor de texto y configura:

**Para PostgreSQL LOCAL (recomendado para desarrollo):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mission_control"
NEXT_PUBLIC_MISSION_CONTROL_API_BASE_URL="http://localhost:3001"
```

**Si tu PostgreSQL tiene contraseña diferente:**
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/mission_control"
NEXT_PUBLIC_MISSION_CONTROL_API_BASE_URL="http://localhost:3001"
```

**Si PostgreSQL escucha en un puerto diferente:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:PUERTO_AQUI/mission_control"
```

### Step 4: Automatic Setup

El siguiente comando configura TODO automáticamente:
```bash
npm run setup
```

Este script:
- ✅ Valida que PostgreSQL está corriendo
- ✅ Crea la base de datos `mission_control` si no existe
- ✅ Ejecuta migraciones de Prisma
- ✅ Carga datos iniciales (seed)

**Si falla**, revisa [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Step 5: Start Development Server

```bash
npm run dev
```

Esto iniciará:
- **Frontend**: http://localhost:3001
- **API**: http://localhost:3001/api

---

## ✅ Verification

Después de iniciar, verifica que todo funciona:

### 1. Check Frontend
Abre en navegador: http://localhost:3001

Deberías ver la interfaz de Mission Control Office con:
- Dashboard con agentes y tareas
- Office scene (escena 3D)
- Activity feed

### 2. Check API Endpoints

En otra terminal, prueba los endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# List agents
curl http://localhost:3001/api/agents

# List tasks
curl http://localhost:3001/api/tasks

# Supervisor overview (KPIs)
curl http://localhost:3001/api/supervisor/overview
```

Esperas respuestas JSON con datos.

### 3. Check Real-Time Events

Abre una terminal y conéctate al stream de eventos SSE:

```bash
curl http://localhost:3001/api/events
```

Si ves mensajes `:keep-alive` o eventos JSON, el servidor SSE funciona.

---

## 🔧 Useful Commands

Una vez instalado, estos son los comandos más útiles:

```bash
# Start development server
npm run dev

# Build for production
npm build

# Database - Push schema (replaces migrations)
npm run db:push

# Database - Seed with initial data
npm run db:seed

# Database - Generate Prisma types
npm run db:generate

# Linting
npm run lint

# Production start
npm start
```

---

## 📁 Project Structure

```
mission-control-office/
├── app/                    # Next.js app directory
│   ├── api/               # API routes and server code
│   ├── dashboard-page.tsx # Dashboard view
│   ├── board/             # Board view
│   └── office/            # Office 3D scene
├── components/            # React components
├── lib/                   # Utilities and services
├── prisma/               # Database schema & migrations
├── scripts/              # Automation scripts (setup.js, etc)
├── docs/                 # Documentation
├── .env.example          # Environment template
└── package.json          # Dependencies and scripts
```

---

## 🐛 Troubleshooting

Si algo falla, mira [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para soluciones comunes.

---

## 🔄 Next Steps

1. **Read the procedures**: Abre [PROCEDURES.md](./PROCEDURES.md) para entender qué tareas hace MCO
2. **Explore the API**: Mira [API ENDPOINTS](./ARCHITECTURE.md#-api-endpoints) para todos los endpoints disponibles
3. **Customize agents**: Edita los agentes en la BD o a través de la API

---

**¡Listo! 🎉 MCO está corriendo y listo para usar.**
