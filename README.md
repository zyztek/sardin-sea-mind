<div align="center">

![SARDIN-AI Header](https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=300&section=header&text=SARDIN-AI&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Autonomous%20Maritime%20Intelligence%20System&descAlignY=51&descAlign=50)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-B8DBE4?style=for-the-badge&logo=pocketbase&logoColor=000)](https://pocketbase.io/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vite](https://img.shields.io/badge/Vite-B33030?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[**Explorar Docs**](./docs) · [**Ver Demo**](https://sardin-ai.demo) · [**Reportar Bug**](../../issues/new) · [**Solicitar Feature**](../../issues/new)

</div>

---

## 🌊 Visión General

**SARDIN-AI** es una plataforma de inteligencia marítima de próxima generación, diseñada para empoderar a cooperativas pesqueras con tecnología de punta. Combina **Inteligencia Artificial**, **Análisis de Datos en Tiempo Real** y **IoT** para optimizar la pesca sostenible.

> **Estado Actual:** 🟢 **V 1.0.0 - STABLE (PocketBase Migration Complete)**

### 🤖 Sistema Multi-Agente Autónomo

El corazón de SARDIN-AI late gracias a 7 agentes especializados:

```mermaid
graph TD
    User[👤 Usuario] --> TheBridge[🌉 The Bridge Dashboard]
    TheBridge --> Orchestrator[🧠 Orquestador Central]
    
    subgraph "Core Agents Cycle"
    Orchestrator --> FishingAI[🐟 Fishing AI]
    Orchestrator --> NavAI[🧭 Navigation AI]
    Orchestrator --> WeatherAI[⛈️ Weather AI]
    Orchestrator --> MaintAI[🔧 Maintenance AI]
    end
    
    subgraph "Strategic Agents"
    Orchestrator --> MarketAI[💰 Market AI]
    Orchestrator --> SecurityAI[🛡️ Security AI]
    Orchestrator --> FleetAI[⚓ Fleet AI]
    end

    FishingAI -- "Predicción de Zonas" --> TheBridge
    NavAI -- "Rutas Óptimas" --> TheBridge
    WeatherAI -- "Alertas Riesgo" --> TheBridge
```

---

## 🚀 Características Principales

| Módulo | Descripción | Estado |
|:---|:---|:---:|
| **🗺️ Maritime Map** | Visualización geoespacial con capas de datos oceanográficos (Temp, Clorofila). | ✅ |
| **🎣 Fishing Insights** | Predicción de zonas de pesca basadas en ML y datos históricos. | ✅ |
| **📊 Analytics Dashboard** | Métricas en tiempo real de consumo, capturas y rendimiento. | ✅ |
| **🔐 Auth & Security** | Sistema robusto de roles y permisos gestionado por PocketBase. | ✅ |
| **📱 PWA Ready** | Funciona offline y se instala en dispositivos móviles. | ✅ |
| **🎮 Gamification** | (WIP) Sistema de logros y niveles para incentivar buenas prácticas. | 🚧 |

---

## 🛠️ Stack Tecnológico

SARDIN-AI está construido sobre hombros de gigantes, utilizando un stack moderno, performante y totalmente Open Source.

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion.
- **Backend:** PocketBase (SQLite + Realtime + Auth).
- **Mapas:** Leaflet, React-Leaflet, OpenSeaMap.
- **Data Science:** TensorFlow.js (Futuro), Simple-Statistics.
- **DevOps:** Docker, Github Actions, Dokploy.

---

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Docker (Opcional, recomendado para backend)

### 1. Clonar el repositorio

```bash
git clone https://github.com/zyztek/sardin-sea-mind.git
cd sardin-sea-mind
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar Backend (PocketBase)

Si tienes Docker:

```bash
docker-compose up -d pocketbase
```

*O descarga el ejecutable en `./pocketbase` y ejecuta `./pocketbase serve`*

### 4. Iniciar Frontend

```bash
npm run dev
```

Visita `http://localhost:5173` y sumérgete en el océano de datos.

---

## 📂 Estructura del Proyecto

```bash
sardin-sea-mind/
├── 📂 .github/         # CI/CD y Templates de Comunidad
├── 📂 .devcontainer/   # Configuración de Codespaces
├── 📂 docs/            # Documentación Técnica y Brainstorms
├── 📂 pocketbase/      # Configuración del Backend y Schema
├── 📂 src/
│   ├── 📂 agents/      # Lógica del Sistema Multi-Agente
│   ├── 📂 components/  # Biblioteca de Componentes UI
│   ├── 📂 hooks/       # Lógica React Reutilizable
│   ├── 📂 services/    # Integración con APIs Externas
│   └── 📂 pages/       # Vistas de la Aplicación
└── 📄 docker-compose.yml
```

---

## 🤝 Contribución

¡Queremos tu ayuda para limpiar los océanos y optimizar la pesca!
Por favor lee nuestro [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles de nuestro código de conducta y el proceso para enviar Pull Requests.

1. Haz un **Fork** del proyecto.
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`).
3. Haz **Commit** de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz **Push** a la rama (`git push origin feature/AmazingFeature`).
5. Abre un **Pull Request**.

---

## 📜 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

<div align="center">

**Hecho con ❤️ y 🐟 por el equipo SARDIN-AI**

[Reportar Bug](../../issues) • [Solicitar Feature](../../issues) • [Roadmap](./docs/ROADMAP.md)

</div>
