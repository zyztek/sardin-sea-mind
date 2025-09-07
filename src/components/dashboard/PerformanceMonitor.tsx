import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Thermometer,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";

interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  battery: number;
  temperature: number;
  uptime: string;
  responseTime: number;
}

interface PerformanceMonitorProps {
  className?: string;
}

export function PerformanceMonitor({ className = "" }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 23,
    memory: 67,
    storage: 45,
    network: 89,
    battery: 87,
    temperature: 42,
    uptime: "72h 15m",
    responseTime: 125
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        responseTime: Math.max(50, Math.min(300, prev.responseTime + (Math.random() - 0.5) * 50))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getStatusBadge = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return 'bg-red-500/10 text-red-700 border-red-500/20';
    if (value >= thresholds.warning) return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Overview */}
      <Card className="maritime-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Monitor de Rendimiento</span>
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Sistema Saludable
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CPU Usage */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span className="font-medium">CPU</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(metrics.cpu, { warning: 70, danger: 90 })}>
                  {metrics.cpu.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={metrics.cpu} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Uso del procesador</p>
            </div>

            {/* Memory Usage */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="font-medium">Memoria</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(metrics.memory, { warning: 80, danger: 95 })}>
                  {metrics.memory.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={metrics.memory} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">RAM utilizada</p>
            </div>

            {/* Network */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="font-medium">Red</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(100 - metrics.network, { warning: 30, danger: 50 })}>
                  {metrics.network.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={metrics.network} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Calidad de señal</p>
            </div>

            {/* Storage */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="font-medium">Almacenamiento</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(metrics.storage, { warning: 80, danger: 90 })}>
                  {metrics.storage.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={metrics.storage} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Espacio utilizado</p>
            </div>

            {/* Battery */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Battery className="h-4 w-4 text-primary" />
                  <span className="font-medium">Batería</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(100 - metrics.battery, { warning: 30, danger: 20 })}>
                  {metrics.battery.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={metrics.battery} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Carga restante</p>
            </div>

            {/* Temperature */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-card/50 to-card/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="font-medium">Temperatura</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(metrics.temperature, { warning: 60, danger: 80 })}>
                  {metrics.temperature}°C
                </Badge>
              </div>
              <Progress value={(metrics.temperature / 100) * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Temperatura del sistema</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="maritime-panel">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Métricas de Rendimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{metrics.responseTime}ms</div>
                <p className="text-sm text-muted-foreground">Tiempo de Respuesta</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{metrics.uptime}</div>
                <p className="text-sm text-muted-foreground">Tiempo Activo</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Peticiones por segundo</span>
                <span className="font-medium">145 req/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Throughput de datos</span>
                <span className="font-medium">2.3 MB/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Latencia de red</span>
                <span className="font-medium">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Disponibilidad</span>
                <span className="font-medium text-emerald-600">99.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="maritime-panel">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Alertas de Rendimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg border bg-amber-500/5 border-amber-500/20">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Uso de Memoria Elevado</h4>
                  <p className="text-xs text-amber-700">El uso de memoria ha superado el 65% durante los últimos 15 minutos.</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-emerald-800">Rendimiento Óptimo</h4>
                  <p className="text-xs text-emerald-700">Todos los sistemas funcionan dentro de parámetros normales.</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-blue-500/5 border-blue-500/20">
              <div className="flex items-start space-x-3">
                <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Optimización Sugerida</h4>
                  <p className="text-xs text-blue-700">Se recomienda limpiar archivos temporales para mejorar el rendimiento.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}