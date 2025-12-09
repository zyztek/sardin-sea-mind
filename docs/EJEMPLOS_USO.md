# 📋 SARDIN-AI - Ejemplos de Uso

## Casos prácticos y código de ejemplo

---

# 🎣 Ejemplo 1: Obtener Predicción de Pesca

```typescript
import { useFishingPrediction } from '@/hooks/useOceanData';

function FishingScreen() {
  // Ubicación actual
  const location = { latitude: 42.36, longitude: -71.06 };
  
  // Hook de predicción
  const { data: prediction, isLoading } = useFishingPrediction(location);
  
  if (isLoading) return <p>Analizando zona...</p>;
  
  return (
    <div>
      <h2>Predicción de Pesca</h2>
      <p>Probabilidad: {(prediction.probability * 100).toFixed(0)}%</p>
      <p>Temperatura del mar: {prediction.temperature}°C</p>
      <p>Recomendación: {prediction.recommendation}</p>
    </div>
  );
}
```

---

# 🌤️ Ejemplo 2: Monitorear Clima en Tiempo Real

```typescript
import { useCurrentWeather } from '@/hooks/useWeatherData';

function WeatherMonitor() {
  const { summary, isLoading, refetch } = useCurrentWeather();
  
  if (isLoading || !summary) return <p>Cargando clima...</p>;
  
  // Determinar si es seguro navegar
  const isSafe = summary.navigationScore > 70;
  
  return (
    <div>
      <h2>Condiciones Actuales</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>🌡️ Temperatura: {summary.temperature}°C</p>
          <p>💨 Viento: {summary.windSpeed} km/h</p>
          <p>🌊 Oleaje: {summary.waveHeight}m</p>
        </div>
        
        <div>
          <p>Nivel de riesgo: {summary.riskLevel}</p>
          <p>Score navegación: {summary.navigationScore}%</p>
        </div>
      </div>
      
      {!isSafe && (
        <div className="alert alert-warning">
          ⚠️ Condiciones no óptimas para navegación
        </div>
      )}
      
      <h3>Recomendaciones:</h3>
      <ul>
        {summary.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
      
      <button onClick={() => refetch()}>
        🔄 Actualizar
      </button>
    </div>
  );
}
```

---

# 🤖 Ejemplo 3: Usar el Sistema de Agentes

```typescript
import { useAgents } from '@/hooks/useAgents';

function AgentControlPanel() {
  const {
    isRunning,
    agentStatuses,
    totalInsights,
    startAgents,
    stopAgents,
  } = useAgents();
  
  return (
    <div>
      <h2>Centro de Control IA</h2>
      
      <button onClick={isRunning ? stopAgents : startAgents}>
        {isRunning ? '⏹️ Detener' : '▶️ Iniciar'} Agentes
      </button>
      
      <p>Insights generados: {totalInsights}</p>
      
      <h3>Estado de Agentes:</h3>
      <table>
        <thead>
          <tr>
            <th>Agente</th>
            <th>Estado</th>
            <th>Insights</th>
          </tr>
        </thead>
        <tbody>
          {agentStatuses.map(status => (
            <tr key={status.agentId}>
              <td>{status.name}</td>
              <td>{status.status}</td>
              <td>{status.insightsGenerated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

# 📍 Ejemplo 4: Crear y Gestionar Waypoints

```typescript
import { useMaritimeDatabase } from '@/hooks/useMaritimeDatabase';

function WaypointManager() {
  const { waypoints, createWaypoint, deleteWaypoint } = useMaritimeDatabase();
  
  const handleCreateWaypoint = async () => {
    await createWaypoint.mutateAsync({
      name: 'Puerto Destino',
      latitude: 42.3601,
      longitude: -71.0589,
      vessel_id: 'vessel-123',
      order_index: waypoints.data?.length || 0,
      is_active: true,
    });
  };
  
  return (
    <div>
      <h2>Waypoints</h2>
      
      <button onClick={handleCreateWaypoint}>
        ➕ Agregar Waypoint
      </button>
      
      <ul>
        {waypoints.data?.map(wp => (
          <li key={wp.id}>
            📍 {wp.name} ({wp.latitude}, {wp.longitude})
            <button onClick={() => deleteWaypoint.mutate(wp.id)}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

# 🔐 Ejemplo 5: Autenticación

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login, isLoading, error, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  if (user) {
    return <p>Bienvenido, {user.email}!</p>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Iniciar Sesión'}
      </button>
      
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

---

# 📊 Ejemplo 6: Gráficos con Recharts

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useWaveData } from '@/hooks/useOceanData';

function WaveChart() {
  const location = { latitude: 42.36, longitude: -71.06 };
  const { data } = useWaveData(location);
  
  if (!data) return null;
  
  return (
    <div>
      <h2>Pronóstico de Oleaje (72h)</h2>
      
      <LineChart width={600} height={300} data={data.chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="waveHeight" 
          stroke="#0066cc" 
          name="Oleaje (m)"
        />
        <Line 
          type="monotone" 
          dataKey="swellHeight" 
          stroke="#00cc66" 
          name="Marejada (m)"
        />
      </LineChart>
      
      <p>Máxima ola esperada: {data.maxWaveHeight.toFixed(1)}m</p>
      <p>Promedio: {data.avgWaveHeight.toFixed(1)}m</p>
    </div>
  );
}
```

---

# 🔔 Ejemplo 7: Notificaciones con Sonner

```typescript
import { toast } from 'sonner';

function AlertSystem() {
  const checkWeatherAlert = async () => {
    const weather = await getWeather();
    
    if (weather.windSpeed > 40) {
      toast.error('⚠️ Alerta de Viento Fuerte', {
        description: `Viento de ${weather.windSpeed} km/h detectado`,
        duration: 10000,
        action: {
          label: 'Ver detalles',
          onClick: () => navigate('/weather'),
        },
      });
    }
    
    if (weather.riskLevel === 'low') {
      toast.success('✅ Condiciones Favorables', {
        description: 'Buen momento para navegar',
      });
    }
  };
  
  return (
    <button onClick={checkWeatherAlert}>
      Verificar Condiciones
    </button>
  );
}
```

---

# 💾 Ejemplo 8: Modo Offline con Service Worker

```typescript
// El modo offline está configurado automáticamente con vite-plugin-pwa

// Para verificar estado de conexión:
function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div className={isOnline ? 'online' : 'offline'}>
      {isOnline ? '🟢 Conectado' : '🔴 Sin conexión'}
      {!isOnline && (
        <p>Usando datos en caché. Se sincronizará al reconectar.</p>
      )}
    </div>
  );
}
```

---

*Ejemplos de Uso - SARDIN-AI*
