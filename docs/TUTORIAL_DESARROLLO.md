# 👨‍💻 SARDIN-AI - Tutorial de Desarrollo

## Guía completa para contribuidores y desarrolladores

---

# 🏗️ Arquitectura del Proyecto

```
sardin-sea-mind/
├── src/
│   ├── agents/           # Sistema multi-agente IA
│   │   ├── AgentSystem.ts
│   │   ├── AdditionalAgents.ts
│   │   └── index.ts
│   │
│   ├── components/       # Componentes React
│   │   ├── dashboard/    # Widgets del dashboard
│   │   ├── navigation/   # Controles de navegación
│   │   └── ui/           # Shadcn/UI components
│   │
│   ├── hooks/            # Hooks personalizados
│   │   ├── useAgents.ts
│   │   ├── useWeatherData.ts
│   │   └── useOceanData.ts
│   │
│   ├── services/         # Servicios externos
│   │   └── apis/
│   │       ├── OpenMeteoService.ts
│   │       └── NOAAService.ts
│   │
│   ├── integrations/     # Integraciones (PocketBase)
│   │   └── pocketbase/
│   │
│   ├── pages/            # Páginas de la app
│   ├── contexts/         # React Contexts
│   └── __tests__/        # Tests (Vitest)
│
├── pocketbase/           # Backend config
├── docs/                 # Documentación
└── scripts/              # Scripts de utilidad
```

---

# 🛠️ Setup de Desarrollo

## 1. Fork y Clone

```bash
# Fork en GitHub primero, luego:
git clone https://github.com/TU-USUARIO/sardin-sea-mind.git
cd sardin-sea-mind

# Agregar upstream
git remote add upstream https://github.com/ORIGINAL/sardin-sea-mind.git
```

## 2. Instalar Dependencias

```bash
npm install
```

## 3. Crear Rama de Feature

```bash
git checkout -b feature/mi-nueva-feature
```

## 4. Iniciar Desarrollo

```bash
# Terminal 1: PocketBase
cd pocketbase && ./pocketbase serve

# Terminal 2: Frontend
npm run dev
```

---

# 📝 Guías de Código

## TypeScript

### Usar tipos explícitos

```typescript
// ✅ Correcto
function calculateRoute(origin: Coordinates, destination: Coordinates): Route {
  // ...
}

// ❌ Evitar
function calculateRoute(origin: any, destination: any) {
  // ...
}
```

### Documentar con JSDoc

```typescript
/**
 * Calcula la distancia entre dos puntos geográficos
 * @param point1 Primer punto con lat/lng
 * @param point2 Segundo punto con lat/lng
 * @returns Distancia en kilómetros
 */
export function calculateDistance(point1: LatLng, point2: LatLng): number {
  // Implementación
}
```

## React

### Componentes funcionales

```tsx
// ✅ Correcto: Componente funcional con tipos
interface WeatherCardProps {
  temperature: number;
  windSpeed: number;
  onRefresh: () => void;
}

export function WeatherCard({ temperature, windSpeed, onRefresh }: WeatherCardProps) {
  return (
    <Card>
      <p>Temp: {temperature}°C</p>
      <p>Viento: {windSpeed} km/h</p>
      <Button onClick={onRefresh}>Actualizar</Button>
    </Card>
  );
}
```

### Custom Hooks

```tsx
// Hook para funcionalidad reutilizable
export function useLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
    );
  }, []);
  
  return location;
}
```

---

# 🧪 Testing

## Ejecutar Tests

```bash
# Modo watch (desarrollo)
npm run test

# Una sola vez
npm run test:run

# Con coverage
npm run test:coverage
```

## Escribir Tests

```typescript
// src/__tests__/mi-componente.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MiComponente } from '@/components/MiComponente';

describe('MiComponente', () => {
  it('should render correctly', () => {
    render(<MiComponente />);
    expect(screen.getByText('Título')).toBeInTheDocument();
  });
});
```

---

# 🤖 Crear un Nuevo Agente IA

## 1. Definir el Agente

```typescript
// src/agents/MiNuevoAgent.ts
import { BaseAgent, AgentConfig, AgentInsight } from './AgentSystem';

export class MiNuevoAgent extends BaseAgent {
  constructor() {
    super({
      name: 'MiNuevoAI',
      domain: 'Descripción del dominio',
      description: 'Qué hace este agente',
      capabilities: [
        {
          name: 'Capacidad 1',
          description: 'Descripción',
          inputTypes: ['tipo1', 'tipo2'],
          outputTypes: ['resultado1'],
        },
      ],
      dataAPIs: [],
      updateInterval: 300000, // 5 minutos
      priority: 'medium',
    });
  }

  protected async process(): Promise<AgentInsight[]> {
    const insights: AgentInsight[] = [];
    
    // Tu lógica aquí
    const resultado = await this.analizarAlgo();
    
    if (resultado.importante) {
      insights.push({
        agentId: this.status.agentId,
        agentName: this.config.name,
        timestamp: new Date().toISOString(),
        type: 'mi_tipo',
        title: 'Título del insight',
        description: 'Descripción detallada',
        confidence: 0.85,
        priority: 'medium',
        data: resultado,
        recommendations: ['Recomendación 1', 'Recomendación 2'],
      });
    }
    
    return insights;
  }

  private async analizarAlgo() {
    // Implementación
    return { importante: true };
  }
}
```

## 2. Registrar en el Orquestador

```typescript
// src/agents/index.ts
export { MiNuevoAgent } from './MiNuevoAgent';

// Agregar al orquestrador si se desea auto-registro
```

---

# 🌐 Crear un Nuevo Servicio de API

```typescript
// src/services/apis/MiAPIService.ts

export interface MiAPIResponse {
  data: any;
  timestamp: string;
}

export class MiAPIService {
  private baseUrl = 'https://api.ejemplo.com';
  private cache = new Map<string, { data: any; timestamp: number }>();

  async getData(params: any): Promise<MiAPIResponse> {
    // Verificar caché
    const cacheKey = JSON.stringify(params);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 600000) {
      return cached.data;
    }

    // Llamar API
    const response = await fetch(`${this.baseUrl}/endpoint?${new URLSearchParams(params)}`);
    const data = await response.json();

    // Guardar en caché
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }
}

// Singleton
let instance: MiAPIService | null = null;
export function getMiAPIService(): MiAPIService {
  if (!instance) instance = new MiAPIService();
  return instance;
}
```

---

# 🔄 Proceso de Pull Request

1. **Asegurar que tests pasen:**

   ```bash
   npm run test:run
   ```

2. **Verificar lint:**

   ```bash
   npm run lint
   ```

3. **Verificar build:**

   ```bash
   npm run build
   ```

4. **Commit con mensaje descriptivo:**

   ```bash
   git commit -m "feat: agregar predicción de mareas"
   ```

5. **Push y crear PR:**

   ```bash
   git push origin feature/mi-nueva-feature
   ```

6. **En GitHub:**
   - Llena la plantilla de PR
   - Asigna reviewers
   - Espera aprobación

---

# 📚 Recursos Adicionales

- [React](https://react.dev/)
- [TypeScript](https://typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PocketBase](https://pocketbase.io/docs/)

---

*Tutorial de Desarrollo - SARDIN-AI*
