# ================================================
# SARDIN-AI - Script de Deployment (Windows)
# Automatiza el despliegue en VPS con Docker
# ================================================

param(
    [Parameter(Position=0)]
    [ValidateSet("build", "deploy", "prod", "status", "logs", "stop", "backup", "help")]
    [string]$Command = "help"
)

# Colores
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Blue }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

# Banner
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  SARDIN-AI - Deployment Script (Windows)" -ForegroundColor Cyan
Write-Host "  Sistema de Inteligencia Marítima" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$IMAGE_NAME = "sardin-ai"

function Check-Dependencies {
    Write-Info "Verificando dependencias..."
    
    try {
        docker --version | Out-Null
        Write-Success "Docker instalado"
    }
    catch {
        Write-Error "Docker no está instalado"
        exit 1
    }
}

function Build-Images {
    Write-Info "Construyendo imágenes Docker..."
    
    Write-Info "Building frontend..."
    docker build -t "${IMAGE_NAME}-frontend:latest" .
    
    Write-Info "Building PocketBase..."
    docker build -t "${IMAGE_NAME}-pocketbase:latest" ./pocketbase
    
    Write-Success "Imágenes construidas exitosamente"
}

function Deploy-Local {
    Write-Info "Desplegando en modo local..."
    
    docker compose up -d
    
    Write-Success "Servicios desplegados"
    Write-Info "Frontend: http://localhost:80"
    Write-Info "PocketBase Admin: http://localhost:8090/_/"
}

function Deploy-Production {
    Write-Info "Desplegando en producción..."
    
    docker compose --profile production up -d
    
    Write-Success "Servicios de producción desplegados"
}

function Show-Status {
    Write-Info "Estado de los servicios:"
    docker compose ps
}

function Show-Logs {
    Write-Info "Mostrando logs..."
    docker compose logs -f --tail=100
}

function Stop-Services {
    Write-Info "Deteniendo servicios..."
    docker compose down
    Write-Success "Servicios detenidos"
}

function Backup-Database {
    Write-Info "Creando backup de base de datos..."
    
    $backupDir = "./backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$backupDir/pb_data_$timestamp.tar.gz"
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    docker compose exec pocketbase tar -czf /tmp/backup.tar.gz /pb/pb_data
    docker compose cp pocketbase:/tmp/backup.tar.gz $backupFile
    
    Write-Success "Backup creado: $backupFile"
}

function Show-Help {
    Write-Host ""
    Write-Host "Uso: .\deploy.ps1 <comando>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  build   - Construir imágenes Docker"
    Write-Host "  deploy  - Desplegar localmente"
    Write-Host "  prod    - Desplegar en producción"
    Write-Host "  status  - Ver estado de servicios"
    Write-Host "  logs    - Ver logs en tiempo real"
    Write-Host "  stop    - Detener servicios"
    Write-Host "  backup  - Backup de base de datos"
    Write-Host "  help    - Mostrar esta ayuda"
    Write-Host ""
}

# Main
switch ($Command) {
    "build" {
        Check-Dependencies
        Build-Images
    }
    "deploy" {
        Check-Dependencies
        Deploy-Local
    }
    "prod" {
        Check-Dependencies
        Deploy-Production
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "stop" {
        Stop-Services
    }
    "backup" {
        Backup-Database
    }
    "help" {
        Show-Help
    }
    default {
        Show-Help
    }
}

Write-Host ""
Write-Success "Operación completada"
