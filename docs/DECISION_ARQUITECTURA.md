# 🏗️ SARDIN-AI - Decisión de Arquitectura

**Fecha de Decisión:** 2025-12-09
**Decisión tomada por:** Sistema Autónomo (Gemini)
**Estado:** ✅ APROBADA Y EN EJECUCIÓN

---

## 📋 RESUMEN EJECUTIVO

Se ha decidido **migrar de Supabase a PocketBase** como backend del proyecto SARDIN-AI, con despliegue en VPS personal usando **Dokploy**.

---

## 🔍 ANÁLISIS REALIZADO

### Opciones Evaluadas

| Plataforma | Self-Hosted | Recursos | Complejidad | Decisión |
|------------|-------------|----------|-------------|----------|
| **Supabase** | ⚠️ Complejo | Alto | Alta | ❌ Descartado |
| **PocketBase** | ✅ Fácil | Muy Bajo | Baja | ✅ **ELEGIDO** |
| **Appwrite** | ✅ Docker | Medio | Media | ❌ Descartado |
| **Nhost** | ⚠️ Docker | Alto | Alta | ❌ Descartado |

### Razones de la Decisión

#### ✅ Por qué PocketBase

1. **Simplicidad extrema:** Un solo archivo ejecutable (~30MB)
2. **Sin dependencias:** SQLite embebido, no requiere PostgreSQL
3. **Recursos mínimos:** Funciona en VPS de 512MB RAM
4. **Todo incluido:**
   - 🔐 Autenticación (email, OAuth)
   - 📊 Base de datos con API REST automática
   - 📂 File storage integrado
   - ⚡ Subscripciones en tiempo real
   - 🎛️ Admin dashboard incluido
5. **Dokploy compatible:** Template nativo disponible
6. **Extensible:** Hooks en JavaScript/Go
7. **Gratuito:** 100% open source, MIT license

#### ❌ Por qué NO Supabase self-hosted

1. Requiere Docker Compose complejo (10+ contenedores)
2. Necesita mínimo 2-4GB RAM
3. Configuración SSL complicada
4. Versión self-hosted "castrada" vs cloud
5. Mantenimiento intensivo

---

## 🏭 ARQUITECTURA FINAL

```
┌─────────────────────────────────────────────────────────────┐
│                         VPS (Dokploy)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │   Traefik    │────▶│   Frontend   │     │  PocketBase │ │
│  │  (Reverse    │     │   (React)    │────▶│   Backend   │ │
│  │   Proxy)     │────▶│   Static     │     │   + SQLite  │ │
│  │  + SSL/HTTPS │     │   Files      │     │   + Storage │ │
│  └──────────────┘     └──────────────┘     └─────────────┘ │
│                                                             │
│  Dokploy maneja: SSL, Deployments, Backups, Monitoring     │
└─────────────────────────────────────────────────────────────┘
```

### Componentes

| Componente | Tecnología | Puerto | Función |
|------------|------------|--------|---------|
| **Frontend** | React + Vite (static) | 443 | UI/Dashboard |
| **Backend** | PocketBase | 8090 | API + Auth + DB |
| **Proxy** | Traefik (Dokploy) | 80/443 | SSL + Routing |
| **Storage** | PocketBase built-in | - | Archivos |
| **Database** | SQLite (embebido) | - | Datos |

---

## 📦 STACK TECNOLÓGICO FINAL

### Frontend (Sin cambios)

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/UI
- React Query (estado servidor)
- PWA Support

### Backend (NUEVO)

- **PocketBase** (reemplaza Supabase)
- SQLite (reemplaza PostgreSQL)
- API REST automática
- Realtime subscriptions
- OAuth integrado

### Infraestructura

- **VPS:** Cualquier proveedor (Hetzner, DigitalOcean, etc.)
- **Dokploy:** Gestión de deployments
- **Traefik:** Reverse proxy + SSL
- **Docker:** Contenedorización

---

## 📋 PLAN DE MIGRACIÓN

### Fase 1: Preparación (Ahora)

- [x] Decisión de arquitectura documentada
- [ ] Crear estructura de backend PocketBase
- [ ] Definir esquema de colecciones
- [ ] Configurar autenticación

### Fase 2: Backend (Día 1-2)

- [ ] Crear colecciones PocketBase equivalentes
- [ ] Migrar schema de Supabase a PocketBase
- [ ] Configurar reglas de acceso (RLS equivalente)
- [ ] Crear hooks/extensiones necesarias

### Fase 3: Frontend (Día 2-3)

- [ ] Instalar PocketBase JavaScript SDK
- [ ] Crear servicio de conexión a PocketBase
- [ ] Migrar hooks de Supabase a PocketBase
- [ ] Actualizar componentes del dashboard

### Fase 4: Testing (Día 3-4)

- [ ] Probar autenticación
- [ ] Probar CRUD de datos
- [ ] Probar realtime subscriptions
- [ ] Probar modo offline

### Fase 5: Deployment (Día 4-5)

- [ ] Crear configuración Dokploy
- [ ] Documentar proceso de deploy
- [ ] Configurar backups automáticos
- [ ] Monitoreo y alertas

---

## 🔄 MAPEO SUPABASE → POCKETBASE

| Supabase | PocketBase | Notas |
|----------|------------|-------|
| `@supabase/supabase-js` | `pocketbase` | SDK JavaScript |
| PostgreSQL tables | Collections | Schema via Admin UI |
| Row Level Security | Collection Rules | Mismo concepto |
| Auth (email/OAuth) | Auth (email/OAuth) | Integrado |
| Realtime subscriptions | Realtime | API similar |
| Storage buckets | Files field/Storage | Integrado |
| Edge Functions | PocketBase Hooks (JS) | Extensiones |

---

## 📊 ESTIMACIÓN DE RECURSOS VPS

### Mínimo Viable

- **RAM:** 512MB
- **CPU:** 1 vCPU
- **Disco:** 10GB SSD
- **Costo:** ~$4-5/mes

### Recomendado Producción

- **RAM:** 1-2GB
- **CPU:** 2 vCPU
- **Disco:** 20GB SSD
- **Costo:** ~$6-12/mes

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

1. **Crear estructura de carpetas** para PocketBase
2. **Instalar PocketBase SDK** en el proyecto
3. **Crear servicio de cliente** PocketBase
4. **Migrar esquema** de colecciones
5. **Actualizar hooks** del frontend

---

**Estado de ejecución:** 🚀 INICIANDO MIGRACIÓN

*Este documento se actualizará conforme avance la migración.*
