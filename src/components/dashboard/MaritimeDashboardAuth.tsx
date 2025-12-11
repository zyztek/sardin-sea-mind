import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useGeolocation } from '@/hooks/useGeolocation';
import { useRealWeather } from '@/hooks/useRealWeather';
import { FishingPredictionService } from '@/services/FishingPredictionService';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { useToast } from '@/hooks/use-toast';
import {
  Navigation,
  BarChart3,
  Activity,
  FileText,
  TestTube,
  Settings,
  Ship,
  Trophy,
  Brain
} from 'lucide-react';
import { ProfileGamified } from '@/components/gamification/ProfileGamified';

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
  const { coordinates: gpsCoordinates, error: gpsError } = useGeolocation();
  const { weather, loading: weatherLoading } = useRealWeather(gpsCoordinates);
  const { toast } = useToast();

  // Position fallback (Default: Boston Harbor for demo / Puerto Principal for dev)
  const defaultPosition = { lat: -23.5505, lng: -46.6333 };
  const currentPosition = gpsCoordinates || defaultPosition;

  useEffect(() => {
    if (gpsError) {
      toast({
        title: "GPS Signal Lost / Unavailable",
        description: "Using estimated position. Please enable location services.",
        variant: "destructive",
      });
    }
  }, [gpsError, toast]);

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

  // Calculate real-time prediction
  const prediction = weather ? FishingPredictionService.analyze(weather) : null;

  // Transform prediction to AIInsight format
  const realTimeInsight = prediction ? {
    id: 'realtime-1',
    type: (prediction.label === 'Peligrosa' ? 'alert' : 'prediction') as any,
    title: `Pesca: ${prediction.label}`,
    description: prediction.recommendation,
    confidence: prediction.score,
    priority: (prediction.label === 'Peligrosa' ? 'critical' : 'high') as any,
    timestamp: new Date().toLocaleTimeString(),
    data: {
      "Especies": prediction.species.join(", ") || "General",
      "Seguridad": prediction.safetyAlert || "Seguro",
      "Score": `${prediction.score}/100`
    }
  } : null;

  // Convert database insights to component format & MERGE with real-time
  const dbInsights = aiInsights?.map(insight => ({
    id: insight.id,
    type: insight.insight_type as 'prediction' | 'recommendation' | 'alert' | 'optimization',
    title: insight.title,
    description: insight.description,
    confidence: Math.round((insight.confidence || 0.8) * 100),
    priority: insight.priority || 'medium',
    timestamp: new Date(insight.created_at).toLocaleString(),
  })) || [];

  const displayInsights = realTimeInsight ? [realTimeInsight, ...dbInsights] : dbInsights;

  // Fallback if no real insights and no DB insights
  const fallbackInsight = {
    id: '1',
    type: 'prediction' as const,
    title: 'Esperando datos de clima...',
    description: 'Calculando predicción de pesca basada en condiciones reales.',
    confidence: 0,
    priority: 'low' as const,
    timestamp: new Date().toLocaleString()
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
            <TabsList className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-8 h-auto gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="navigation">
                <Navigation className="w-4 h-4 mr-2 hidden md:block" />
                Nav
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2 hidden md:block" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="realtime">
                <Activity className="w-4 h-4 mr-2 hidden md:block" />
                Real Time
              </TabsTrigger>
              <TabsTrigger value="reports">
                <FileText className="w-4 h-4 mr-2 hidden md:block" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="testing">
                <TestTube className="w-4 h-4 mr-2 hidden md:block" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2 hidden md:block" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Trophy className="w-4 h-4 mr-2 hidden md:block" />
                GameSea
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ErrorBoundary>
                      <AIInsightCard
                        insight={displayInsights[0] || fallbackInsight}
                      />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <AlertsPanel />
                    </ErrorBoundary>
                  </div>
                  <div className="mt-6">
                    <ErrorBoundary>
                      <WeatherWidget data={weather} loading={weatherLoading} />
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
                      currentPosition={currentPosition}
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

            <TabsContent value="profile" className="space-y-6">
              <ErrorBoundary>
                <ProfileGamified />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorLogger>
  );
};