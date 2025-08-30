import { MaritimeHeader } from "@/components/layout/MaritimeHeader";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { MaritimeMap } from "@/components/navigation/MaritimeMap";
import { 
  Thermometer, 
  Waves, 
  Fuel, 
  Compass, 
  Battery,
  Fish,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

const Index = () => {
  // Mock data for demonstration
  const mockInsights = [
    {
      id: '1',
      type: 'prediction' as const,
      title: 'Zona de Pesca Óptima Detectada',
      description: 'IA ha identificado una zona con alta densidad de sardinas a 12nm al noreste. Condiciones ideales para pesca.',
      confidence: 94,
      priority: 'high' as const,
      timestamp: '2 min ago',
      data: {
        'Distancia': '12.3 nm',
        'Densidad': 'Alta',
        'Temperatura': '18.5°C'
      }
    },
    {
      id: '2',
      type: 'alert' as const,
      title: 'Cambio de Corriente Detectado',
      description: 'Las corrientes oceánicas han cambiado. Se recomienda ajustar la ruta para optimizar el consumo de combustible.',
      confidence: 87,
      priority: 'medium' as const,
      timestamp: '5 min ago',
      data: {
        'Velocidad': '2.1 kts',
        'Dirección': '045°',
        'Impacto': '+15% tiempo'
      }
    }
  ];

  const mockWaypoints = [
    {
      id: '1',
      name: 'Puerto Base',
      lat: 42.3601,
      lng: -71.0589,
      type: 'destination' as const,
      status: 'completed' as const
    },
    {
      id: '2',
      name: 'Zona Pesca A',
      lat: 42.4601,
      lng: -71.1589,
      type: 'fishing_zone' as const,
      status: 'active' as const
    },
    {
      id: '3',
      name: 'Punto Control',
      lat: 42.5601,
      lng: -71.2589,
      type: 'waypoint' as const,
      status: 'pending' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <MaritimeHeader 
        systemStatus="operational"
        aiStatus="active"
        communicationStatus="connected"
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Panel de Control SARDIN-AI
          </h1>
          <p className="text-muted-foreground">
            Sistema Autónomo de Navegación Marítima con Inteligencia Artificial
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Temperatura del Agua"
            value={18.5}
            unit="°C"
            status="optimal"
            icon={Thermometer}
            trend={{ value: 2.1, label: "vs ayer" }}
          />
          <StatusCard
            title="Estado del Mar"
            value={2.1}
            unit="m"
            status="normal"
            icon={Waves}
            trend={{ value: -0.3, label: "últimas 6h" }}
          />
          <StatusCard
            title="Combustible"
            value={78}
            unit="%"
            status="normal"
            icon={Fuel}
            trend={{ value: -12, label: "desde salida" }}
          />
          <StatusCard
            title="Rumbo"
            value={45}
            unit="°"
            status="normal"
            icon={Compass}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <MaritimeMap
              waypoints={mockWaypoints}
              currentPosition={{ lat: 42.3601, lng: -71.0589 }}
              onWaypointSelect={(waypoint) => console.log('Selected:', waypoint)}
              onLayerToggle={(layerId) => console.log('Toggled layer:', layerId)}
            />
            
            {/* Additional Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <StatusCard
                title="Batería Sistemas"
                value={95}
                unit="%"
                status="optimal"
                icon={Battery}
                trend={{ value: -2, label: "últimas 2h" }}
              />
              <StatusCard
                title="Peces Detectados"
                value={1247}
                unit="individuos"
                status="optimal"
                icon={Fish}
                trend={{ value: 23, label: "vs promedio" }}
              />
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-ai-neural" />
                Insights de IA
              </h2>
              <div className="space-y-4">
                {mockInsights.map((insight) => (
                  <AIInsightCard
                    key={insight.id}
                    insight={insight}
                    onAction={(insight) => console.log('Action on:', insight)}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="maritime-panel p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Acciones Rápidas
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors">
                  📡 Verificar Comunicaciones
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors">
                  🎯 Optimizar Ruta Actual
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors">
                  🐟 Analizar Zona de Pesca
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors">
                  ⚡ Estado de Sistemas
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
