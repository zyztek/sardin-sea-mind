# 📚 SARDIN-AI - Documentación de API

## Referencia técnica de todas las APIs internas y externas

---

## 🔌 APIs EXTERNAS INTEGRADAS

## 1. Open-Meteo API

### Descripción

API gratuita e ilimitada para datos meteorológicos marinos.

### Endpoints Utilizados

#### Marine Weather API

```
GET https://marine-api.open-meteo.com/v1/marine
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `latitude` | float | Latitud (-90 a 90) |
| `longitude` | float | Longitud (-180 a 180) |
| `hourly` | string | Variables por hora separadas por coma |
| `forecast_days` | int | Días de pronóstico (1-16) |

**Variables Hourly Disponibles:**

- `wave_height` - Altura de ola (m)
- `wave_direction` - Dirección de ola (°)
- `wave_period` - Período de ola (s)
- `wind_wave_height` - Altura ola de viento (m)
- `swell_wave_height` - Altura de marejada (m)
- `ocean_current_velocity` - Velocidad corriente (m/s)
- `ocean_current_direction` - Dirección corriente (°)

**Ejemplo:**

```bash
curl "https://marine-api.open-meteo.com/v1/marine?latitude=42.36&longitude=-71.06&hourly=wave_height,wave_direction,wave_period"
```

**Respuesta:**

```json
{
  "latitude": 42.375,
  "longitude": -71.0,
  "hourly": {
    "time": ["2024-12-09T00:00", ...],
    "wave_height": [1.2, 1.3, ...],
    "wave_direction": [180, 185, ...],
    "wave_period": [8.5, 8.2, ...]
  }
}
```

#### Weather Forecast API

```
GET https://api.open-meteo.com/v1/forecast
```

**Variables Útiles:**

- `temperature_2m` - Temperatura (°C)
- `wind_speed_10m` - Velocidad viento (km/h)
- `wind_direction_10m` - Dirección viento (°)
- `pressure_msl` - Presión nivel del mar (hPa)
- `visibility` - Visibilidad (m)
- `precipitation` - Precipitación (mm)

---

## 2. NOAA ERDDAP API

### Descripción

Servidor de datos oceanográficos del gobierno de EE.UU. Gratuito e ilimitado.

### Base URL

```
https://coastwatch.pfeg.noaa.gov/erddap
```

### Datasets Principales

#### Sea Surface Temperature (SST)

```
GET /griddap/jplMURSST41.json
```

**Ejemplo:**

```bash
curl "https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41.json?analysed_sst[(last)][(42.0):1:(42.5)][(-71.5):1:(-71.0)]"
```

**Respuesta:**

```json
{
  "table": {
    "columnNames": ["time", "latitude", "longitude", "analysed_sst"],
    "rows": [
      ["2024-12-09T00:00:00Z", 42.0, -71.0, 285.5]
    ]
  }
}
```

*Nota: SST viene en Kelvin, restar 273.15 para Celsius*

#### Chlorophyll-a (MODIS)

```
GET /griddap/erdMH1chla8day.json
```

**Indicador de actividad biológica** - Más clorofila = más plancton = más peces

---

## 🔧 APIs INTERNAS (SARDIN-AI)

## OpenMeteoService

### Ubicación

`src/services/apis/OpenMeteoService.ts`

### Métodos

#### `getMarineForecast(params)`

Obtiene pronóstico marino para una ubicación.

```typescript
const service = getOpenMeteoService();
const forecast = await service.getMarineForecast({
  latitude: 42.36,
  longitude: -71.06,
  forecastDays: 7,
});
```

#### `getWeatherForecast(params)`

Obtiene pronóstico del tiempo general.

```typescript
const weather = await service.getWeatherForecast({
  latitude: 42.36,
  longitude: -71.06,
  forecastDays: 3,
});
```

#### `getCurrentConditions(location)`

Obtiene condiciones actuales combinadas (clima + marino) con resumen.

```typescript
const { weather, marine, summary } = await service.getCurrentConditions({
  latitude: 42.36,
  longitude: -71.06,
});

console.log(summary.riskLevel); // 'low' | 'medium' | 'high' | 'extreme'
console.log(summary.navigationScore); // 0-100
console.log(summary.recommendations); // string[]
```

---

## NOAAService

### Ubicación

`src/services/apis/NOAAService.ts`

### Métodos

#### `getSeaSurfaceTemperature(params)`

Obtiene temperatura superficial del mar.

```typescript
const noaa = getNOAAService();
const sst = await noaa.getSeaSurfaceTemperature({
  latitude: 42.36,
  longitude: -71.06,
});

console.log(sst.sst); // Temperatura en Celsius
```

#### `getChlorophyll(params)`

Obtiene concentración de clorofila-a.

```typescript
const chlor = await noaa.getChlorophyll({
  latitude: 42.36,
  longitude: -71.06,
});

console.log(chlor.chlorophyll); // mg/m³
```

#### `getFishingPrediction(params)`

Genera predicción de zona de pesca basada en datos oceanográficos.

```typescript
const prediction = await noaa.getFishingPrediction({
  latitude: 42.36,
  longitude: -71.06,
});

console.log(prediction.probability); // 0-1
console.log(prediction.recommendation); // Texto descriptivo
```

#### `getTopFishingHotspots(lat, lon)`

Escanea área y devuelve mejores 5 zonas para pesca.

```typescript
const hotspots = await noaa.getTopFishingHotspots(42.36, -71.06);

hotspots.forEach(spot => {
  console.log(`${spot.latitude}, ${spot.longitude}: ${spot.probability * 100}%`);
});
```

---

## 🤖 API DE AGENTES

## AgentOrchestrator

### Ubicación

`src/agents/AgentSystem.ts`

### Uso

```typescript
import { getOrchestrator } from '@/agents';

const orchestrator = getOrchestrator();

// Iniciar todos los agentes
orchestrator.startAll();

// Obtener estado
const statuses = orchestrator.getAllStatus();

// Detener
orchestrator.stopAll();
```

### Agentes Disponibles

| Agente | Dominio | Intervalo |
|--------|---------|-----------|
| `FishingAI` | Predicción pesca | 5 min |
| `NavigationAI` | Rutas | 1 min |
| `WeatherAI` | Clima marino | 10 min |
| `MaintenanceAI` | Mantenimiento | 15 min |
| `MarketAI` | Mercado | 30 min |
| `SecurityAI` | Seguridad | 1 min |
| `FleetAI` | Coordinación | 5 min |

---

## 🪝 HOOKS DISPONIBLES

## useWeatherData

```typescript
import { useCurrentWeather } from '@/hooks/useWeatherData';

function MyComponent() {
  const { summary, isLoading, refetch } = useCurrentWeather();
  
  if (summary) {
    return <div>Temperatura: {summary.temperature}°C</div>;
  }
}
```

## useOceanData

```typescript
import { useFishingPrediction } from '@/hooks/useOceanData';

function MyComponent() {
  const location = { latitude: 42.36, longitude: -71.06 };
  const { data, isLoading } = useFishingPrediction(location);
  
  if (data) {
    return <div>Probabilidad: {data.probability * 100}%</div>;
  }
}
```

## useAgents

```typescript
import { useAgents } from '@/hooks/useAgents';

function MyComponent() {
  const { 
    isRunning, 
    agentStatuses, 
    startAgents, 
    stopAgents 
  } = useAgents();
  
  return (
    <button onClick={isRunning ? stopAgents : startAgents}>
      {isRunning ? 'Detener' : 'Iniciar'} Agentes
    </button>
  );
}
```

---

## 📡 POCKETBASE API

## Autenticación

```typescript
import { authService } from '@/integrations/pocketbase';

// Registro
await authService.register({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'Juan Capitán',
  role: 'captain',
});

// Login
await authService.login('user@example.com', 'password123');

// Logout
await authService.logout();
```

## Colecciones CRUD

```typescript
import { vesselService, waypointService } from '@/integrations/pocketbase';

// Obtener embarcaciones
const vessels = await vesselService.getAll();

// Crear waypoint
const waypoint = await waypointService.create({
  vessel_id: 'abc123',
  latitude: 42.36,
  longitude: -71.06,
  name: 'Puerto destino',
});

// Suscribirse a cambios en tiempo real
vesselService.subscribe((event) => {
  console.log('Cambio:', event.action, event.record);
});
```

---

## 🔐 LÍMITES Y RATE LIMITING

| API | Límite | Caché |
|-----|--------|-------|
| Open-Meteo | Ilimitado | 10 min |
| NOAA ERDDAP | Ilimitado | 1 hora |
| PocketBase | Tu servidor | - |

**Recomendaciones:**

- Usar caché cuando sea posible
- Agrupar requests relacionados
- Implementar retry con backoff exponencial

---

*Documentación de API SARDIN-AI*
*Versión: 1.0*
*Actualizado: 2024-12-09*
