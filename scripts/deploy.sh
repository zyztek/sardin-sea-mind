#!/bin/bash
# ================================================
# SARDIN-AI - Script de Deployment
# Automatiza el despliegue en VPS con Docker
# ================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "================================================"
echo "  SARDIN-AI - Deployment Script"
echo "  Sistema de Inteligencia Marítima"
echo "================================================"
echo -e "${NC}"

# ================================================
# CONFIGURACIÓN
# ================================================

DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
IMAGE_NAME="${IMAGE_NAME:-sardin-ai}"
ENVIRONMENT="${ENVIRONMENT:-production}"

# ================================================
# FUNCIONES
# ================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Verificando dependencias..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    fi
    
    log_success "Todas las dependencias están instaladas"
}

build_images() {
    log_info "Construyendo imágenes Docker..."
    
    # Build frontend
    log_info "Building frontend..."
    docker build -t ${IMAGE_NAME}-frontend:latest .
    
    # Build PocketBase
    log_info "Building PocketBase..."
    docker build -t ${IMAGE_NAME}-pocketbase:latest ./pocketbase
    
    log_success "Imágenes construidas exitosamente"
}

deploy_local() {
    log_info "Desplegando en modo local..."
    
    docker compose up -d
    
    log_success "Servicios desplegados"
    log_info "Frontend: http://localhost:80"
    log_info "PocketBase Admin: http://localhost:8090/_/"
}

deploy_production() {
    log_info "Desplegando en producción..."
    
    docker compose --profile production up -d
    
    log_success "Servicios de producción desplegados"
}

show_status() {
    log_info "Estado de los servicios:"
    docker compose ps
}

show_logs() {
    log_info "Mostrando logs..."
    docker compose logs -f --tail=100
}

stop_services() {
    log_info "Deteniendo servicios..."
    docker compose down
    log_success "Servicios detenidos"
}

backup_database() {
    log_info "Creando backup de base de datos..."
    
    BACKUP_DIR="./backups"
    BACKUP_FILE="${BACKUP_DIR}/pb_data_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    mkdir -p ${BACKUP_DIR}
    
    docker compose exec pocketbase tar -czf /tmp/backup.tar.gz /pb/pb_data
    docker compose cp pocketbase:/tmp/backup.tar.gz ${BACKUP_FILE}
    
    log_success "Backup creado: ${BACKUP_FILE}"
}

# ================================================
# MENÚ PRINCIPAL
# ================================================

show_menu() {
    echo ""
    echo "Opciones disponibles:"
    echo "  1) build     - Construir imágenes Docker"
    echo "  2) deploy    - Desplegar localmente"
    echo "  3) prod      - Desplegar en producción"
    echo "  4) status    - Ver estado de servicios"
    echo "  5) logs      - Ver logs en tiempo real"
    echo "  6) stop      - Detener servicios"
    echo "  7) backup    - Backup de base de datos"
    echo "  8) help      - Mostrar ayuda"
    echo ""
}

# ================================================
# MAIN
# ================================================

case "$1" in
    build)
        check_dependencies
        build_images
        ;;
    deploy|start)
        check_dependencies
        deploy_local
        ;;
    prod|production)
        check_dependencies
        deploy_production
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    stop)
        stop_services
        ;;
    backup)
        backup_database
        ;;
    help|--help|-h)
        show_menu
        ;;
    *)
        echo -e "${YELLOW}Uso: $0 {build|deploy|prod|status|logs|stop|backup|help}${NC}"
        show_menu
        exit 1
        ;;
esac

echo ""
log_success "Operación completada"
