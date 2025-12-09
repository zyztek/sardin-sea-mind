# ================================================
# SARDIN-AI Frontend - Dockerfile
# Multi-stage build optimizado para producción
# ================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Argumentos de build
ARG VITE_POCKETBASE_URL=http://localhost:8090
ARG VITE_APP_ENV=production
ARG VITE_APP_VERSION=1.0.0
ARG VITE_MARITIME_SYSTEM_NAME=SARDIN-AI

# Variables de entorno para el build
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_MARITIME_SYSTEM_NAME=$VITE_MARITIME_SYSTEM_NAME

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Stage 2: Producción con Nginx
FROM nginx:alpine AS production

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos del build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
   CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
