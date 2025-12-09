# 🚀 SARDIN-AI - Guía de Despliegue con Dokploy

## Descripción General

Esta guía explica cómo desplegar SARDIN-AI en un VPS usando Dokploy, una plataforma de despliegue self-hosted similar a Vercel/Heroku.

## Requisitos Previos

### VPS Mínimo

- **OS:** Ubuntu 22.04 LTS o Debian 12
- **RAM:** 1GB (recomendado 2GB)
- **CPU:** 1 vCPU (recomendado 2 vCPU)
- **Disco:** 20GB SSD
- **Proveedor sugerido:** Hetzner, DigitalOcean, Vultr, Contabo

### Dominio

- Un dominio apuntando a la IP del VPS
- Subdominio para API (ej: `api.sardin-ai.com`)

---

## Paso 1: Instalar Dokploy en el VPS

### Conectar al VPS

```bash
ssh root@tu-ip-del-vps
```

### Instalar Dokploy (un solo comando)

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

### Acceder al Panel

1. Abrir en navegador: `http://tu-ip:3000`
2. Crear cuenta de administrador
3. Guardar credenciales de forma segura

---

## Paso 2: Configurar Proyecto en Dokploy

### Opción A: Desde GitHub (Recomendado)

1. En Dokploy, ir a **Projects** > **Create Project**
2. Nombre: `sardin-ai`
3. Conectar repositorio de GitHub
4. Seleccionar branch: `main`

### Opción B: Despliegue Manual

Si no usas GitHub, puedes subir el código directamente:

```bash
# En tu máquina local
zip -r sardin-ai.zip . -x "node_modules/*" -x ".git/*"
# Subir via SCP o el panel de Dokploy
```

---

## Paso 3: Configurar Servicios

### 3.1 Servicio PocketBase (Backend)

1. En el proyecto, click **Add Service** > **Docker**
2. Configurar:
   - **Name:** `pocketbase`
   - **Dockerfile Path:** `pocketbase/Dockerfile`
   - **Port:** `8090`
   - **Domain:** `api.tu-dominio.com`
   - **Enable HTTPS:** ✅

3. Configurar volumen persistente:

   ```
   Source: pocketbase_data
   Target: /pb/pb_data
   ```

4. Click **Deploy**

### 3.2 Servicio Frontend (React)

1. Click **Add Service** > **Docker**
2. Configurar:
   - **Name:** `frontend`
   - **Dockerfile Path:** `Dockerfile`
   - **Port:** `80`
   - **Domain:** `tu-dominio.com`
   - **Enable HTTPS:** ✅

3. Variables de entorno:

   ```
   VITE_POCKETBASE_URL=https://api.tu-dominio.com
   VITE_APP_ENV=production
   VITE_APP_VERSION=1.0.0
   VITE_MARITIME_SYSTEM_NAME=SARDIN-AI
   ```

4. Click **Deploy**

---

## Paso 4: Configurar PocketBase

### Acceder al Admin Panel

1. Abrir `https://api.tu-dominio.com/_/`
2. Crear cuenta de administrador
3. Guardar credenciales de forma segura

### Importar Colecciones

1. Ir a **Settings** > **Import collections**
2. Pegar contenido de `pocketbase/pb_schema.json`
3. Click **Import**

### Insertar Datos de Ejemplo (Opcional)

```javascript
// En la consola del navegador
const pb = new PocketBase('https://api.tu-dominio.com');

await pb.admins.authWithPassword('tu-email', 'tu-password');

await pb.collection('vessels').create({
  name: 'SARDIN Explorer',
  registration: 'SE-001',
  vessel_type: 'Research Vessel',
  length_meters: 45.5,
  max_speed_knots: 25.0,
  fuel_capacity_liters: 8000.0,
  crew_capacity: 12
});
```

---

## Paso 5: Verificar Despliegue

### Checklist

- [ ] Frontend accesible en `https://tu-dominio.com`
- [ ] API accesible en `https://api.tu-dominio.com/api/health`
- [ ] Admin panel en `https://api.tu-dominio.com/_/`
- [ ] Certificado SSL válido (candado verde)
- [ ] PWA instalable

### Test de Conectividad

```bash
# Verificar API
curl https://api.tu-dominio.com/api/health

# Verificar colecciones
curl https://api.tu-dominio.com/api/collections
```

---

## Paso 6: Configurar Backups

### En PocketBase Admin

1. Ir a **Settings** > **Backups**
2. Habilitar backups automáticos
3. Configurar frecuencia (diaria recomendado)

### Backup Manual S3 (Opcional)

```yaml
# En docker-compose, agregar al servicio pocketbase:
environment:
  - S3_ENABLED=true
  - S3_ENDPOINT=s3.amazonaws.com
  - S3_BUCKET=sardin-backups
  - S3_ACCESS_KEY=tu-access-key
  - S3_SECRET_KEY=tu-secret-key
```

---

## Paso 7: Monitoreo

### Dokploy Dashboard

- Ver logs en tiempo real
- Métricas de CPU/RAM
- Estado de servicios

### Alertas (Recomendado)

1. En Dokploy, ir a **Settings** > **Notifications**
2. Configurar:
   - Discord Webhook
   - Telegram Bot
   - Email

---

## Troubleshooting

### Error: "Connection refused"

```bash
# Verificar que PocketBase está corriendo
docker logs sardin-pocketbase

# Reiniciar servicio
docker restart sardin-pocketbase
```

### Error: "502 Bad Gateway"

```bash
# Verificar Traefik
docker logs dokploy-traefik

# Verificar que el puerto está expuesto
docker port sardin-frontend
```

### Error: CORS

En PocketBase Admin:

1. Ir a **Settings** > **Application**
2. Agregar origen permitido: `https://tu-dominio.com`

### Regenerar Certificado SSL

```bash
# Dokploy lo maneja automáticamente, pero si falla:
docker exec dokploy-traefik rm /letsencrypt/acme.json
docker restart dokploy-traefik
```

---

## Arquitectura Final

```
┌─────────────────────────────────────────────────────────────┐
│                     VPS con Dokploy                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Internet                                                   │
│     │                                                       │
│     ▼                                                       │
│  ┌──────────────┐                                           │
│  │   Traefik    │ ◄── SSL/HTTPS + Routing                   │
│  │   (Dokploy)  │                                           │
│  └──────┬───────┘                                           │
│         │                                                   │
│    ┌────┴────┐                                              │
│    │         │                                              │
│    ▼         ▼                                              │
│  ┌─────┐  ┌──────────┐                                      │
│  │ 80  │  │   8090   │                                      │
│  │     │  │          │                                      │
│  │React│  │PocketBase│                                      │
│  │SPA  │  │ + SQLite │                                      │
│  └─────┘  └──────────┘                                      │
│                │                                            │
│                ▼                                            │
│         ┌───────────┐                                       │
│         │ Volume    │ ◄── Datos persistentes                │
│         │ pb_data   │                                       │
│         └───────────┘                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Costos Estimados

| Recurso | Proveedor | Costo/Mes |
|---------|-----------|-----------|
| VPS 2GB RAM | Hetzner CAX11 | €3.79 |
| VPS 2GB RAM | Contabo | $4.50 |
| VPS 2GB RAM | DigitalOcean | $12.00 |
| Dominio | Cloudflare | ~$10/año |
| **Total** | - | **~$5-15/mes** |

---

## Mantenimiento

### Actualizaciones

```bash
# En Dokploy, click "Redeploy" en cada servicio
# O desde terminal:
docker pull ghcr.io/tu-usuario/sardin-ai:latest
docker-compose up -d
```

### Logs

```bash
# Ver logs de frontend
docker logs -f sardin-frontend

# Ver logs de PocketBase
docker logs -f sardin-pocketbase
```

---

**SARDIN-AI** - Sistema de Inteligencia Marítima
*Desplegado con Dokploy + PocketBase*
