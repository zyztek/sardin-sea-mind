# 🚢 SARDIN-AI Maritime Intelligence Dashboard

<p align="center">
  <img src="public/pwa-512x512.png" alt="SARDIN-AI Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Sistema Avanzado de Inteligencia Marítima con IA</strong><br>
  Dashboard profesional para navegación, operaciones pesqueras y gestión de flotas.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PocketBase-0.22-green?logo=pocketbase" alt="PocketBase">
  <img src="https://img.shields.io/badge/PWA-Ready-purple" alt="PWA">
</p>

---

## 🌊 Características

### 📍 Inteligencia Marítima

- **Navegación en tiempo real** - GPS, waypoints, optimización de rutas
- **Insights con IA** - Predicciones de zonas de pesca, análisis meteorológico
- **Integración de sensores** - Monitoreo de sistemas, condiciones ambientales
- **Gestión multi-embarcación** - Seguimiento y coordinación de flotas

### 🔧 Capacidades Avanzadas

- **Modo offline** - Operación sin conectividad
- **PWA** - Instalable en desktop y móvil
- **Sincronización en tiempo real** - Datos actualizados instantáneamente
- **Roles de acceso** - Capitán, Ingeniero, Navegante, Observador

### 🔐 Seguridad

- **Self-hosted** - Tus datos en tu servidor
- **Autenticación segura** - Email/Password + OAuth
- **Control de acceso** - Permisos por rol
- **Backups automáticos** - Recuperación de datos

---

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- PocketBase (ver [instalación](#instalar-pocketbase))

### 1. Clonar el repositorio

```bash
git clone <TU_REPO_URL>
cd sardin-sea-mind
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar PocketBase

**Windows (PowerShell):**

```powershell
# Descargar
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_windows_amd64.zip" -OutFile "pb.zip"
Expand-Archive pb.zip -DestinationPath pocketbase-server
cd pocketbase-server

# Ejecutar
.\pocketbase.exe serve
```

**Linux/macOS:**

```bash
# Descargar
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_linux_amd64.zip
unzip pocketbase_*.zip -d pocketbase-server
cd pocketbase-server

# Ejecutar
./pocketbase serve
```

### 4. Configurar PocketBase

1. Abrir <http://localhost:8090/_/>
2. Crear cuenta de administrador
3. Ir a **Settings** > **Import collections**
4. Pegar contenido de `pocketbase/pb_schema.json`
5. Click **Import**

### 5. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env si es necesario
```

### 6. Iniciar desarrollo

```bash
npm run dev
```

Abrir <http://localhost:8080> en el navegador.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│          React + TypeScript + Tailwind           │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Dashboard  │  │  Components │  │   Hooks  │ │
│  └─────────────┘  └─────────────┘  └──────────┘ │
│                         │                        │
│                         ▼                        │
│              ┌───────────────────┐               │
│              │ PocketBase Client │               │
│              └─────────┬─────────┘               │
└────────────────────────┼─────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│                   PocketBase                     │
│              (Self-hosted Backend)               │
│                                                  │
│  ┌─────────┐  ┌───────────┐  ┌───────────────┐  │
│  │  Auth   │  │  Database │  │   Realtime    │  │
│  │ (OAuth) │  │  (SQLite) │  │ (WebSockets)  │  │
│  └─────────┘  └───────────┘  └───────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 📦 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Estilos** | Tailwind CSS, Shadcn/UI |
| **Estado** | React Query, Zustand |
| **Backend** | PocketBase (Go + SQLite) |
| **Autenticación** | PocketBase Auth |
| **Realtime** | PocketBase Subscriptions |
| **PWA** | Vite PWA Plugin |

---

## 🔧 Comandos

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

---

## 🚀 Despliegue en Producción

### Con Dokploy (Recomendado)

Ver guía completa: [docs/DEPLOY_DOKPLOY.md](docs/DEPLOY_DOKPLOY.md)

```bash
# 1. Instalar Dokploy en tu VPS
curl -sSL https://dokploy.com/install.sh | sh

# 2. Acceder al panel y configurar servicios
# 3. Desplegar desde GitHub o Docker
```

### Con Docker Compose

```bash
# Desarrollo
docker-compose up -d

# Producción (con Traefik + SSL)
docker-compose --profile production up -d
```

---

## 👥 Roles de Usuario

| Rol | Acceso |
|-----|--------|
| **Capitán** | Control total del sistema |
| **Ingeniero** | Diagnósticos y monitoreo de equipos |
| **Navegante** | Planificación de rutas |
| **Observador** | Solo lectura (entrenamiento) |

---

## 📱 PWA

La aplicación es una Progressive Web App:

- ✅ Instalable en desktop y móvil
- ✅ Funciona offline
- ✅ Sincronización automática
- ✅ Notificaciones push (configurables)

---

## 📂 Estructura del Proyecto

```
sardin-sea-mind/
├── src/
│   ├── components/        # Componentes React
│   │   ├── dashboard/     # Widgets del dashboard
│   │   ├── navigation/    # Controles de navegación
│   │   └── ui/            # Componentes Shadcn/UI
│   ├── contexts/          # Contextos React
│   ├── hooks/             # Hooks personalizados
│   ├── integrations/
│   │   └── pocketbase/    # Cliente y servicios PocketBase
│   ├── pages/             # Páginas de la app
│   └── types/             # Definiciones TypeScript
├── pocketbase/            # Configuración del backend
│   ├── pb_schema.json     # Esquema de colecciones
│   └── Dockerfile         # Imagen Docker
├── docs/                  # Documentación
├── docker-compose.yml     # Orquestación Docker
├── Dockerfile             # Build del frontend
└── nginx.conf             # Configuración del servidor
```

---

## 📚 Documentación

- [Guía de Despliegue con Dokploy](docs/DEPLOY_DOKPLOY.md)
- [Decisión de Arquitectura](docs/DECISION_ARQUITECTURA.md)
- [Instalación de PocketBase](pocketbase/README.md)
- [Estado del Proyecto](docs/INFORME_ESTADO_PROYECTO.md)

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 📄 Licencia

MIT © SARDIN-AI

---

<p align="center">
  <strong>SARDIN-AI</strong> - Sistema de Inteligencia Marítima<br>
  <em>Navegando con IA hacia aguas más seguras</em>
</p>
