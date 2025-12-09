# ================================================
# SARDIN-AI PocketBase - Dockerfile
# Imagen ligera con PocketBase preinstalado
# ================================================

FROM alpine:latest AS base

# Argumentos de build
ARG PB_VERSION=0.22.20
ARG TARGETARCH=amd64

# Instalar dependencias
RUN apk add --no-cache \
   ca-certificates \
   unzip \
   wget

# Descargar PocketBase
RUN wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip \
   -O /tmp/pocketbase.zip && \
   unzip /tmp/pocketbase.zip -d /pb/ && \
   rm /tmp/pocketbase.zip && \
   chmod +x /pb/pocketbase

# Crear directorios necesarios
RUN mkdir -p /pb/pb_data /pb/pb_migrations /pb/pb_hooks

# ================================================
# Imagen final
# ================================================
FROM alpine:latest

# Instalar solo lo necesario
RUN apk add --no-cache ca-certificates

# Copiar PocketBase
COPY --from=base /pb /pb

# Copiar archivos de configuración
COPY pb_schema.json /pb/pb_schema.json

# Volumen para persistencia
VOLUME /pb/pb_data

# Puerto
EXPOSE 8090

# Directorio de trabajo
WORKDIR /pb

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
   CMD wget --no-verbose --tries=1 --spider http://localhost:8090/api/health || exit 1

# Comando de inicio
# En producción, considera usar --encryptionEnv para seguridad adicional
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
