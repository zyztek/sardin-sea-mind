import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SEO } from "@/components/common/SEO";
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
import { useMaritimeData } from "@/hooks/useMaritimeData";
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
  const { metrics, insights, isConnected } = useMaritimeData();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Iniciando Sistema SARDIN-AI..." />
      </div>
    );
  }

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
    <ErrorBoundary>
      <SEO />
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <MaritimeHeader 
          isConnected={isConnected}
          systemStatus="operational"
          aiStatus="active"
        />
        
        <main className="container mx-auto px-6 py-8">
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
              {!isConnected && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">Conexión perdida</span>
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
                        {insights.map((insight) => (
                          <AIInsightCard
                            key={insight.id}
                            insight={insight}
                            onAction={(insight) => console.log('Action on:', insight)}
                          />
                        ))}
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
                      <FishingInsights />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <WeatherWidget />
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
                      waypoints={mockWaypoints}
                      currentPosition={metrics.position}
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
                  <FishingInsights />
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
                <MaritimeSettings />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorBoundary>
  );
}