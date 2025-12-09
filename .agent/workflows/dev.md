---
description: how to start development environment
---

# Iniciar Entorno de Desarrollo SARDIN-AI

Este workflow guía los pasos para iniciar el entorno de desarrollo completo.

## Requisitos Previos

- Node.js 18+ instalado
- PocketBase descargado

## Pasos

### 1. Verificar dependencias instaladas

// turbo

```bash
npm install
```

### 2. Iniciar PocketBase (en terminal separada)

```bash
cd pocketbase-server
./pocketbase serve
```

> En Windows: `.\pocketbase.exe serve`

### 3. Configurar PocketBase (primera vez)

1. Abrir <http://localhost:8090/_/>
2. Crear cuenta admin
3. Importar colecciones desde `pocketbase/pb_schema.json`

### 4. Iniciar servidor de desarrollo

// turbo

```bash
npm run dev
```

### 5. Abrir la aplicación

Navegar a <http://localhost:8080>

## Verificación

- [ ] PocketBase corriendo en :8090
- [ ] Frontend corriendo en :8080
- [ ] Colecciones importadas
- [ ] Página de auth visible

## Troubleshooting

### PocketBase no inicia

- Verificar que el puerto 8090 no esté en uso
- Ejecutar con `--http=127.0.0.1:8090`

### Frontend no conecta a PocketBase

- Verificar `.env` tiene `VITE_POCKETBASE_URL=http://localhost:8090`
- Reiniciar servidor de desarrollo

### Error de CORS

- PocketBase permite CORS desde localhost por defecto
- Si persiste, revisar configuración en Admin > Settings
