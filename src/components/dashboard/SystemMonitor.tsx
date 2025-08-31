import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  Cpu,
  Database,
  Wifi,
  Server,
  Shield,
  Zap
} from "lucide-react";

interface SystemStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  performance: number;
  icon: any;
}

interface SystemMonitorProps {
  className?: string;
}

export function SystemMonitor({ className = "" }: SystemMonitorProps) {
  const systems: SystemStatus[] = [
    {
      name: "Navegación IA",
      status: "online",
      uptime: "99.8%",
      performance: 96,
      icon: Cpu
    },
    {
      name: "Base de Datos",
      status: "online", 
      uptime: "99.9%",
      performance: 94,
      icon: Database
    },
    {
      name: "Comunicaciones",
      status: "warning",
      uptime: "97.2%", 
      performance: 78,
      icon: Wifi
    },
    {
      name: "Sensores",
      status: "online",
      uptime: "99.5%",
      performance: 92,
      icon: Activity
    },
    {
      name: "Servidor Principal",
      status: "online",
      uptime: "99.7%",
      performance: 89,
      icon: Server
    },
    {
      name: "Sistema de Seguridad",
      status: "online",
      uptime: "100%",
      performance: 98,
      icon: Shield
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-emerald-600';
    if (performance >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  const overallPerformance = Math.round(
    systems.reduce((acc, system) => acc + system.performance, 0) / systems.length
  );

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Monitor de Sistemas</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
              Rendimiento: {overallPerformance}%
            </Badge>
            <Button size="sm" variant="outline">
              Diagnóstico
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.map((system, index) => {
            const Icon = system.icon;
            return (
              <div
                key={index}
                className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{system.name}</span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(system.status)}>
                    {system.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Rendimiento</span>
                    <span className={`font-medium ${getPerformanceColor(system.performance)}`}>
                      {system.performance}%
                    </span>
                  </div>
                  <Progress value={system.performance} className="h-1.5" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uptime: {system.uptime}</span>
                    <span>Activo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Overall System Health */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Estado General del Sistema</span>
            <span className={`text-sm font-bold ${getPerformanceColor(overallPerformance)}`}>
              {overallPerformance}%
            </span>
          </div>
          <Progress value={overallPerformance} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Todos los sistemas operando dentro de parámetros normales
          </p>
        </div>
      </CardContent>
    </Card>
  );
}