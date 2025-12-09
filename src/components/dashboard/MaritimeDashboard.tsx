```javascript
import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ErrorLogger } from "@/components/common/ErrorLogger";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SEO } from "@/components/common/SEO";
import { ConnectionStatus } from "@/components/common/ConnectionStatus";
import { MaritimeHeader } from "@/components/layout/MaritimeHeader";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { SystemMonitor } from "@/components/dashboard/SystemMonitor";
import { FishingInsights } from "@/components/dashboard/FishingInsights";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { AdvancedMetrics } from "@/components/dashboard/AdvancedMetrics";
import { RealTimeData } from "@/components/dashboard/RealTimeData";
import { MaritimeSettings } from "@/components/dashboard/MaritimeSettings";
import { ReportsSystem } from "@/components/dashboard/ReportsSystem";
import { PerformanceMonitor } from "@/components/dashboard/PerformanceMonitor";
import { SystemTests } from "@/components/testing/SystemTests";
import { DataExporter } from "@/components/dashboard/DataExporter";
import { MaritimeMap } from "@/components/navigation/MaritimeMap";
import { NavigationControls } from "@/components/navigation/NavigationControls";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useMaritimeDatabase } from "@/hooks/useMaritimeDatabase";
import { DataSeeder } from "@/components/common/DataSeeder";
import {
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Activity,
  Settings,
  Map,
  FileText,
  TestTube
} from "lucide-react";

export function MaritimeDashboard() {
  const { sensorData, aiInsights, alerts } = useRealTimeData();
  const { useWaypoints } = useMaritimeDatabase();
  const { data: waypoints } = useWaypoints();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Get latest sensor data or default to empty
  const currentMetrics = sensorData[0] || {
    speed: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    depth: 0,
    water_temp: 0,
    wind_speed: 0,
    wind_direction: 0,
    fuel_level: 0,
    battery_level: 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Iniciando Sistema SARDIN-AI..." />
      </div>
    );
  }

  return (
    <ErrorLogger>
      <SEO />
      <DataSeeder isActive={isSimulationActive} />
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <MaritimeHeader
          isConnected={true}
          systemStatus="operational"
          aiStatus="active"
        />

        <main className="container mx-auto px-6 py-8">
          {/* Connection Status */}
          <div className="mb-6">
            <ConnectionStatus />
          </div>
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Panel de Control SARDIN-AI
                </h1>
                <p className="text-muted-foreground">
                  Sistema Autónomo de Navegación Marítima con Inteligencia Artificial
                </p>
              </div>
              {isSimulationActive && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-700">Modo Simulación Activo</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <ErrorBoundary fallback={<div className="text-center p-4">Error cargando métricas</div>}>
            <MetricsGrid className="mb-8" />
          </ErrorBoundary>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Vista General</span>
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex items-center space-x-2">
                <Map className="h-4 w-4" />
                <span>Navegación</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Análisis</span>
              </TabsTrigger>
              <TabsTrigger value="realtime" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Tiempo Real</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Reportes</span>
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center space-x-2">
                <TestTube className="h-4 w-4" />
                <span>Pruebas</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - AI Insights */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-ai-neural" />
                      Insights de IA
                    </h2>
                    <ErrorBoundary>
                      <div className="space-y-4">
                        {aiInsights.length > 0 ? aiInsights.map((insight) => (
                          <AIInsightCard
                            key={insight.id}
                            insight={insight}
                            onAction={(insight) => console.log('Action on:', insight)}
                          />
                        )) : (
                          <div className="text-center p-4 text-muted-foreground bg-muted/20 rounded-lg">
                            Esperando insights de IA...
                          </div>
                        )}
                      </div>
                    </ErrorBoundary>
                  </div>

                  {/* Quick Actions */}
                  <div className="maritime-panel p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Acciones Rápidas
                    </h3>
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full text-left justify-start">
                        📡 Verificar Comunicaciones
                      </Button>
                      <Button variant="ghost" className="w-full text-left justify-start">
                        🎯 Optimizar Ruta Actual
                      </Button>
                      <Button variant="ghost" className="w-full text-left justify-start">
                        🐟 Analizar Zona de Pesca
                      </Button>
                      <Button variant="ghost" className="w-full text-left justify-start">
                        ⚡ Estado de Sistemas
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Main Widgets */}
                <div className="lg:col-span-2 space-y-6">
                  <ErrorBoundary>
                    <AlertsPanel />
                  </ErrorBoundary>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ErrorBoundary>
                      <SystemMonitor />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <FishingInsights insights={aiInsights} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <WeatherWidget data={currentMetrics} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Navigation Tab */}
            <TabsContent value="navigation" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ErrorBoundary>
                    <MaritimeMap
                      waypoints={waypoints || []}
                      currentPosition={{ lat: currentMetrics.latitude || 0, lng: currentMetrics.longitude || 0 }}
                      onWaypointSelect={(waypoint) => console.log('Selected:', waypoint)}
                      onLayerToggle={(layerId) => console.log('Toggled layer:', layerId)}
                    />
                  </ErrorBoundary>
                </div>
                <div>
                  <ErrorBoundary>
                    <NavigationControls />
                  </ErrorBoundary>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ErrorBoundary>
                  <AdvancedMetrics />
                </ErrorBoundary>
                <ErrorBoundary>
                  <FishingInsights insights={aiInsights} />
                </ErrorBoundary>
              </div>
            </TabsContent>

            {/* Real Time Tab */}
            <TabsContent value="realtime" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ErrorBoundary>
                  <RealTimeData />
                </ErrorBoundary>
                <ErrorBoundary>
                  <SystemMonitor />
                </ErrorBoundary>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-8">
              <ErrorBoundary fallback={<div className="text-center p-4">Error cargando reportes</div>}>
                <ReportsSystem />
              </ErrorBoundary>
              <ErrorBoundary fallback={<div className="text-center p-4">Error cargando exportador</div>}>
                <DataExporter />
              </ErrorBoundary>
            </TabsContent>

            {/* Testing Tab */}
            <TabsContent value="testing" className="space-y-8">
              <ErrorBoundary fallback={<div className="text-center p-4">Error cargando pruebas</div>}>
                <SystemTests />
              </ErrorBoundary>
              <ErrorBoundary fallback={<div className="text-center p-4">Error cargando monitor</div>}>
                <PerformanceMonitor />
              </ErrorBoundary>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              <ErrorBoundary>
                <MaritimeSettings
                  isSimulationActive={isSimulationActive}
                  onSimulationChange={setIsSimulationActive}
                />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorLogger>
  );
}
```