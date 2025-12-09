# 📋 SARDIN-AI - Lista de Tareas (TODO)

**Última actualización:** 2025-12-09 08:30
**Estado General del Proyecto:** 🔄 EN MIGRACIÓN A POCKETBASE

---

## ✅ COMPLETADO (Migración a PocketBase)

### Infraestructura

- [x] **Decisión arquitectónica documentada** - PocketBase elegido sobre Supabase
- [x] **SDK PocketBase instalado** - `npm install pocketbase`
- [x] **Cliente PocketBase creado** - `src/integrations/pocketbase/client.ts`
- [x] **Tipos TypeScript definidos** - `src/integrations/pocketbase/types.ts`
- [x] **Servicios CRUD creados** - `src/integrations/pocketbase/services.ts`
- [x] **Servicio de autenticación** - `src/integrations/pocketbase/auth.ts`
- [x] **Barrel export** - `src/integrations/pocketbase/index.ts`

### Hooks React

- [x] **useAuth migrado** - `src/hooks/useAuth.ts`
- [x] **useRealTimeData migrado** - `src/hooks/useRealTimeData.ts`
- [x] **useMaritimeDatabase migrado** - `src/hooks/useMaritimeDatabase.ts`
- [x] **useMaritimePresence migrado** - `src/hooks/useMaritimePresence.ts`

### Contextos

- [x] **AuthContext migrado** - `src/contexts/AuthContext.tsx`

### Docker y Despliegue

- [x] **docker-compose.yml creado** - Configuración completa
- [x] **Dockerfile frontend** - Multi-stage build con Nginx
- [x] **Dockerfile PocketBase** - Imagen optimizada
- [x] **Nginx config** - Optimizado para SPA + PWA
- [x] **Esquema PocketBase** - `pocketbase/pb_schema.json`

### Documentación

- [x] **Guía de instalación PocketBase** - `pocketbase/README.md`
- [x] **Guía de despliegue Dokploy** - `docs/DEPLOY_DOKPLOY.md`
- [x] **Decisión de arquitectura** - `docs/DECISION_ARQUITECTURA.md`

### Build

- [x] **Build de producción exitoso** - ✅ Compila sin errores

---

## 🔴 PENDIENTE CRÍTICO

### Limpieza de Código

- [ ] **Eliminar dependencia de Supabase** - `npm uninstall @supabase/supabase-js`
- [ ] **Eliminar archivos de Supabase** - `src/integrations/supabase/`
- [ ] **Limpiar carpeta supabase/** - Ya no se necesita

### Testing

- [ ] **Probar autenticación end-to-end** - Registro, login, logout
- [ ] **Probar CRUD de datos** - Vessels, waypoints, sensor_data
- [ ] **Probar realtime subscriptions** - Actualizaciones en vivo
- [ ] **Probar modo offline/PWA** - Service worker, cache

### Configuración Local

- [ ] **Crear archivo .env** - Copiar de .env.example
- [ ] **Descargar PocketBase** - Ver pocketbase/README.md
- [ ] **Importar colecciones** - Desde pb_schema.json
- [ ] **Crear admin en PocketBase** - <http://localhost:8090/_/>

---

## 🟠 PRIORIDAD ALTA

### Componentes UI

- [ ] **Actualizar página de Auth** - Verificar que usa nuevo contexto
- [ ] **Verificar MaritimeMap** - Conexión a datos reales
- [ ] **Verificar FishingInsights** - Conexión a datos reales
- [ ] **Verificar WeatherWidget** - Conexión a datos reales

### Despliegue

- [ ] **Adquirir VPS** - Hetzner/DigitalOcean/Contabo
- [ ] **Instalar Dokploy** - Un comando
- [ ] **Configurar DNS** - Dominio + subdominios
- [ ] **Desplegar PocketBase** - Servicio backend
- [ ] **Desplegar Frontend** - Servicio web
- [ ] **Configurar SSL** - Traefik automático

---

## 🟡 PRIORIDAD MEDIA

### Funcionalidades

- [ ] **Sistema de notificaciones** - Push notifications
- [ ] **Exportación de datos** - CSV, JSON, PDF
- [ ] **Reportes automatizados** - Generación programada
- [ ] **Dashboard de métricas** - Gráficos en tiempo real

### Mejoras de UX

- [ ] **Onboarding de usuarios** - Tutorial interactivo
- [ ] **Modo oscuro/claro** - Toggle en UI
- [ ] **Localización** - Español/Inglés/Portugués

### Integraciones

- [ ] **API de clima** - OpenWeatherMap o similar
- [ ] **API de tráfico marítimo** - AIS data
- [ ] **API de mareas** - Datos oceanográficos

---

## 🟢 PRIORIDAD BAJA (Futuro)

### IA y Machine Learning

- [ ] **Modelo de predicción de pesca** - TensorFlow.js o API externa
- [ ] **Optimización de rutas** - Algoritmo A* o similar
- [ ] **Mantenimiento predictivo** - Basado en sensores

### Documentación

- [ ] **README.md actualizado** - Reflejar nueva arquitectura
- [ ] **CONTRIBUTING.md** - Guía para contribuidores
- [ ] **API Documentation** - Con Swagger/OpenAPI

### DevOps

- [ ] **CI/CD con GitHub Actions** - Build + Deploy automático
- [ ] **Monitoreo con Grafana** - Métricas y alertas
- [ ] **Backups automáticos** - S3 o similar

---

## 📊 MÉTRICAS DE PROGRESO

| Módulo | Migrado | Testeado | Producción |
|--------|---------|----------|------------|
| Cliente PocketBase | ✅ | ⏳ | ⏳ |
| Autenticación | ✅ | ⏳ | ⏳ |
| Servicios CRUD | ✅ | ⏳ | ⏳ |
| Hooks React | ✅ | ⏳ | ⏳ |
| Contexto Auth | ✅ | ⏳ | ⏳ |
| Docker Config | ✅ | ⏳ | ⏳ |
| Documentación | ✅ | N/A | N/A |
| Build | ✅ | ✅ | ⏳ |

**Leyenda:** ✅ Completo | ⏳ Pendiente | ❌ Bloqueado

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Descargar y ejecutar PocketBase** localmente
2. **Importar esquema** desde pb_schema.json
3. **Crear usuario admin** en PocketBase
4. **Probar aplicación** con `npm run dev`
5. **Verificar autenticación** registro/login
6. **Limpiar código** eliminar referencias a Supabase

---

## 📝 NOTAS DE LA MIGRACIÓN

### Cambios Principales

- Supabase → PocketBase (backend self-hosted)
- PostgreSQL → SQLite (embebido en PocketBase)
- Supabase Auth → PocketBase Auth
- Supabase Realtime → PocketBase Subscriptions

### Archivos Nuevos

```
src/integrations/pocketbase/
├── client.ts      # Cliente principal
├── types.ts       # Definiciones de tipos
├── auth.ts        # Servicio de autenticación
├── services.ts    # Servicios CRUD
└── index.ts       # Barrel export

pocketbase/
├── pb_schema.json # Esquema de colecciones
├── Dockerfile     # Imagen Docker
└── README.md      # Guía de instalación

docker-compose.yml # Orquestación
Dockerfile         # Frontend
nginx.conf         # Servidor web
```

### Archivos a Eliminar (Cuando esté listo)

```
src/integrations/supabase/  # Todo el directorio
supabase/                   # Migraciones antiguas
```

---

**Actualizado por:** Sistema Autónomo SARDIN-AI
**Fecha:** 2025-12-09
