import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MaritimeHeader } from '@/components/layout/MaritimeHeader';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { SystemMonitor } from '@/components/dashboard/SystemMonitor';
import { MaritimeMap } from '@/components/navigation/MaritimeMap';
import { NavigationControls } from '@/components/navigation/NavigationControls';
import { AdvancedMetrics } from '@/components/dashboard/AdvancedMetrics';
import { ReportsSystem } from '@/components/dashboard/ReportsSystem';
import { SystemTests } from '@/components/testing/SystemTests';
import { MaritimeSettings } from '@/components/dashboard/MaritimeSettings';
import { PerformanceMonitor } from '@/components/dashboard/PerformanceMonitor';
import { AnalyticsAndInsights } from '@/components/dashboard/AnalyticsAndInsights';
import { CrewPresence } from '@/components/dashboard/CrewPresence';
import { ConnectionStatus } from '@/components/common/ConnectionStatus';
import { ErrorLogger } from '@/components/common/ErrorLogger';
import { useAuth } from '@/contexts/AuthContext';
import { useMaritimeDatabase } from '@/hooks/useMaritimeDatabase';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { 
  Navigation, 
  BarChart3, 
  Activity, 
  FileText, 
  TestTube, 
  Settings,
  Ship,
  Brain
} from 'lucide-react';

export const MaritimeDashboard: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();
  const {
    useVessels,
    useLatestSensorData,
    useAIInsights,
    useSystemAlerts,
  } = useMaritimeDatabase();

  // Enable real-time updates
  useRealTimeData();
  const { isOnline } = useOfflineMode();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState<string | undefined>();

  // Fetch data
  const { data: vessels } = useVessels();
  const { data: latestSensorData } = useLatestSensorData(selectedVessel);
  const { data: aiInsights } = useAIInsights(selectedVessel);
  const { data: systemAlerts } = useSystemAlerts(selectedVessel);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-select first vessel if none selected
    if (vessels && vessels.length > 0 && !selectedVessel) {
      setSelectedVessel(vessels[0].id);
    }
  }, [vessels, selectedVessel]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-maritime-light/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner className="w-12 h-12" />
          <div>
            <h2 className="text-xl font-semibold text-maritime-primary">Initializing SARDIN-AI</h2>
            <p className="text-muted-foreground">Connecting to maritime systems...</p>
          </div>
        </div>
      </div>
    );
  }

  const mockWaypoints = [
    { id: '1', name: 'Porto Principal', lat: -23.5505, lng: -46.6333, type: 'harbor' as const, status: 'active' as const },
    { id: '2', name: 'Zona de Pesca A', lat: -23.2, lng: -46.8, type: 'fishing_zone' as const, status: 'active' as const },
    { id: '3', name: 'Rota Segura 1', lat: -23.3, lng: -46.7, type: 'waypoint' as const, status: 'active' as const },
  ];

  // Get system status based on real data
  const isConnected = latestSensorData !== null;
  const systemStatus = systemAlerts?.some(alert => alert.severity === 'critical') ? 'critical' : 'operational';
  const aiStatus = aiInsights?.length ? 'active' : 'learning';

  // Convert database insights to component format
  const formattedInsights = aiInsights?.map(insight => ({
    id: insight.id,
    type: insight.insight_type as 'prediction' | 'recommendation' | 'alert' | 'optimization',
    title: insight.title,
    description: insight.description,
    confidence: Math.round((insight.confidence || 0.8) * 100),
    priority: insight.priority || 'medium',
    timestamp: new Date(insight.created_at).toLocaleString(),
  })) || [];

  // Convert sensor data to metrics format
  const currentMetrics = latestSensorData ? {
    speed: latestSensorData.speed_knots || 0,
    heading: latestSensorData.heading_degrees || 0,
    position: {
      lat: latestSensorData.latitude || 0,
      lng: latestSensorData.longitude || 0,
    },
    depth: latestSensorData.depth_meters || 0,
    temperature: latestSensorData.water_temperature_c || 0,
    wind: {
      speed: latestSensorData.wind_speed_knots || 0,
      direction: latestSensorData.wind_direction_degrees || 0,
    },
    fuel: latestSensorData.fuel_level_percent || 0,
    battery: latestSensorData.battery_level_percent || 0,
  } : {
    speed: 12.5,
    heading: 45,
    position: { lat: -23.5505, lng: -46.6333 },
    depth: 45.2,
    temperature: 18.5,
    wind: { speed: 8.3, direction: 220 },
    fuel: 78.5,
    battery: 92.0,
  };

  return (
    <ErrorLogger>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-maritime-light/20">
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <ConnectionStatus />
        </div>
        <div className="container mx-auto p-6 space-y-6">
          <MaritimeHeader 
            isConnected={isConnected && isOnline}
            systemStatus={systemStatus}
            aiStatus={aiStatus}
          />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="maritime-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Ship className="w-5 h-5 text-maritime-primary" />
                Welcome aboard, {profile?.maritime_role || 'Officer'}!
              </CardTitle>
              <CardDescription>
                Maritime AI Intelligence System - Active Vessel: {vessels?.find(v => v.id === selectedVessel)?.name || 'SARDIN Explorer'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? 'default' : 'destructive'}>
                  {isConnected ? 'Systems Online' : 'Systems Offline'}
                </Badge>
                <Badge variant="outline" className="text-ai-neural border-ai-neural/30">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <ErrorBoundary>
              <MetricsGrid />
            </ErrorBoundary>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-7 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="navigation">
              <Navigation className="w-4 h-4 mr-2" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="realtime">
              <Activity className="w-4 h-4 mr-2" />
              Real Time
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="testing">
              <TestTube className="w-4 h-4 mr-2" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ErrorBoundary>
                    <AIInsightCard 
                      insight={formattedInsights[0] || {
                        id: '1',
                        type: 'prediction' as const,
                        title: 'Weather Analysis',
                        description: 'Favorable conditions for next 6 hours',
                        confidence: 90,
                        priority: 'medium' as const,
                        timestamp: new Date().toLocaleString()
                      }}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <AlertsPanel />
                  </ErrorBoundary>
                </div>
                <div className="mt-6">
                  <ErrorBoundary>
                    <SystemMonitor />
                  </ErrorBoundary>
                </div>
              </div>
              <div>
                <ErrorBoundary>
                  <CrewPresence />
                </ErrorBoundary>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ErrorBoundary>
                <MaritimeMap 
                  waypoints={mockWaypoints} 
                  currentPosition={{ lat: -23.5505, lng: -46.6333 }}
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                <AdvancedMetrics />
              </ErrorBoundary>
              <ErrorBoundary>
                <AnalyticsAndInsights />
              </ErrorBoundary>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                <PerformanceMonitor />
              </ErrorBoundary>
              <ErrorBoundary>
                <SystemMonitor />
              </ErrorBoundary>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ErrorBoundary>
              <ReportsSystem />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <ErrorBoundary>
              <SystemTests />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ErrorBoundary>
              <MaritimeSettings />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </ErrorLogger>
  );
};