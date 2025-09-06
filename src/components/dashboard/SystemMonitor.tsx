import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Cpu, 
  HardDrive, 
  Thermometer, 
  Zap, 
  Network,
  Activity,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  max?: number;
  unit: string;
  status: 'optimal' | 'normal' | 'warning' | 'critical';
  icon: any;
}

interface SystemMonitorProps {
  className?: string;
}

export function SystemMonitor({ className = "" }: SystemMonitorProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Principal',
      value: 34,
      max: 100,
      unit: '%',
      status: 'optimal',
      icon: Cpu
    },
    {
      id: 'memory',
      name: 'Memoria RAM',
      value: 67,
      max: 100,
      unit: '%',
      status: 'normal',
      icon: HardDrive
    },
    {
      id: 'temperature',
      name: 'Temperatura CPU',
      value: 42,
      max: 85,
      unit: '°C',
      status: 'optimal',
      icon: Thermometer
    },
    {
      id: 'power',
      name: 'Consumo Energético',
      value: 145,
      max: 300,
      unit: 'W',
      status: 'normal',
      icon: Zap
    },
    {
      id: 'network',
      name: 'Ancho de Banda',
      value: 234,
      unit: 'KB/s',
      status: 'optimal',
      icon: Network
    },
    {
      id: 'uptime',
      name: 'Tiempo Activo',
      value: 72.5,
      unit: 'hrs',
      status: 'optimal',
      icon: Activity
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        let newValue = metric.value;
        const variation = (Math.random() - 0.5) * 2;
        
        switch (metric.id) {
          case 'cpu':
            newValue = Math.max(5, Math.min(95, metric.value + variation));
            break;
          case 'memory':
            newValue = Math.max(20, Math.min(90, metric.value + variation * 0.5));
            break;
          case 'temperature':
            newValue = Math.max(25, Math.min(80, metric.value + variation * 0.3));
            break;
          case 'power':
            newValue = Math.max(80, Math.min(280, metric.value + variation * 2));
            break;
          case 'network':
            newValue = Math.max(50, Math.min(500, metric.value + variation * 10));
            break;
          case 'uptime':
            newValue = metric.value + 0.01; // Continuous increment
            break;
        }
        
        // Update status based on new value
        let status = metric.status;
        if (metric.max) {
          const percentage = (newValue / metric.max) * 100;
          if (percentage >= 90) status = 'critical';
          else if (percentage >= 75) status = 'warning';
          else if (percentage >= 50) status = 'normal';
          else status = 'optimal';
        }
        
        return {
          ...metric,
          value: newValue,
          status
        };
      }));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'normal':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500';
      case 'normal':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const criticalCount = metrics.filter(m => m.status === 'critical').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Monitor del Sistema</span>
            {(criticalCount > 0 || warningCount > 0) && (
              <div className="flex items-center space-x-1">
                {criticalCount > 0 && (
                  <Badge variant="destructive">
                    {criticalCount} Críticos
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700">
                    {warningCount} Alertas
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const displayValue = metric.id === 'uptime' 
              ? metric.value.toFixed(1)
              : Math.round(metric.value);
            
            return (
              <div
                key={metric.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-card/30 to-card/60"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground">
                      {metric.name}
                    </span>
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-foreground">
                      {displayValue}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {metric.unit}
                    </span>
                  </div>
                  
                  {metric.max && (
                    <div className="w-20">
                      <Progress 
                        value={(metric.value / metric.max) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* System Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Estado General</span>
            </div>
            <div className="flex items-center space-x-2">
              {criticalCount === 0 && warningCount === 0 ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
                  🟢 Todos los Sistemas Operativos
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requiere Atención
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}