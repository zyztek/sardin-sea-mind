# 🚀 SARDIN-AI - Guía de Configuración PocketBase

## Instalación Rápida

### 1. Descargar PocketBase

**Windows:**

```powershell
# Crear directorio
mkdir pocketbase-server
cd pocketbase-server

# Descargar (reemplaza con la versión más reciente de https://pocketbase.io/docs/)
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_windows_amd64.zip" -OutFile "pocketbase.zip"

# Descomprimir
Expand-Archive -Path "pocketbase.zip" -DestinationPath "."
```

**Linux/macOS:**

```bash
mkdir pocketbase-server && cd pocketbase-server

# Linux AMD64
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_linux_amd64.zip
unzip pocketbase_0.22.20_linux_amd64.zip

# macOS ARM64 (M1/M2)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_darwin_arm64.zip
unzip pocketbase_0.22.20_darwin_arm64.zip
```

### 2. Iniciar el Servidor

```bash
# Windows
.\pocketbase.exe serve

# Linux/macOS
./pocketbase serve
```

**Resultado esperado:**

```
> Server started at: http://127.0.0.1:8090
>   - REST API:  http://127.0.0.1:8090/api/
>   - Admin UI:  http://127.0.0.1:8090/_/
```

### 3. Configurar Admin

1. Abrir `http://localhost:8090/_/` en el navegador
2. Crear cuenta de administrador:
   - Email: `admin@sardin-ai.local`
   - Password: (una contraseña segura)

### 4. Importar Colecciones

1. En el Admin UI, ir a **Settings** > **Import collections**
2. Pegar el contenido de `pocketbase/pb_schema.json`
3. Click **Import**

### 5. Insertar Datos de Ejemplo

Ejecutar en el navegador (DevTools Console) o crear un script:

```javascript
// Conectar a PocketBase
const pb = new PocketBase('http://localhost:8090');

// Autenticarse como admin
await pb.admins.authWithPassword('admin@sardin-ai.local', 'tu_password');

// Crear embarcaciones de ejemplo
await pb.collection('vessels').create({
  name: 'SARDIN Explorer',
  registration: 'SE-001',
  vessel_type: 'Research Vessel',
  length_meters: 45.5,
  max_speed_knots: 25.0,
  fuel_capacity_liters: 8000.0,
  crew_capacity: 12
});

await pb.collection('vessels').create({
  name: 'Ocean Navigator',
  registration: 'ON-002',
  vessel_type: 'Fishing Vessel',
  length_meters: 32.0,
  max_speed_knots: 18.0,
  fuel_capacity_liters: 5000.0,
  crew_capacity: 8
});

console.log('Datos de ejemplo creados!');
```

## Estructura de Archivos PocketBase

Después de iniciar, se crean estos archivos:

```
pocketbase-server/
├── pocketbase.exe          # Ejecutable
├── pb_data/                # Base de datos SQLite
│   ├── data.db            # Datos principales
│   ├── backups/           # Backups automáticos
│   └── storage/           # Archivos subidos
└── pb_migrations/          # Migraciones (opcional)
```

## Configuración Avanzada

### Habilitar CORS (para desarrollo)

Ya habilitado por defecto para `localhost`. Para producción:

```bash
./pocketbase serve --http="0.0.0.0:8090" --origins="https://tu-dominio.com"
```

### Habilitar Realtime

Realtime está habilitado por defecto. Para probarlo:

```javascript
// En el frontend
pb.collection('sensor_data').subscribe('*', (e) => {
  console.log('Cambio detectado:', e.action, e.record);
});
```

### Backups Automáticos

En Admin UI > Settings > Backups:

- Habilitar backups automáticos
- Configurar S3 para almacenamiento externo (opcional)

## Migración a Producción (Dokploy)

### Dockerfile

```dockerfile
FROM alpine:latest

ARG PB_VERSION=0.22.20

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  pocketbase:
    build: .
    restart: unless-stopped
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb/pb_data
      - ./pb_migrations:/pb/pb_migrations
    healthcheck:
      test: wget --no-verbose --tries=1 --spider http://localhost:8090/api/health || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
```

## Notas Importantes

1. **Seguridad:** En producción, cambiar el password del admin
2. **Backups:** Configurar backups regulares de `pb_data/data.db`
3. **SSL:** Usar Traefik/Nginx para HTTPS en producción
4. **Migrations:** Usar `pocketbase migrate` para cambios de esquema

---

**SARDIN-AI** - Sistema de Inteligencia Marítima
*Powered by PocketBase*
