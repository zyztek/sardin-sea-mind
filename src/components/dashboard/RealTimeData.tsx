import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  Wifi,
  Clock,
  Database,
  Satellite,
  RefreshCw
} from "lucide-react";

interface DataStream {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  status: 'active' | 'delayed' | 'offline';
  lastUpdate: Date;
  frequency: string;
}

interface RealTimeDataProps {
  className?: string;
}

export function RealTimeData({ className = "" }: RealTimeDataProps) {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [dataStreams, setDataStreams] = useState<DataStream[]>([
    {
      id: 'gps',
      name: 'Posición GPS',
      value: '42.3601, -71.0589',
      status: 'active',
      lastUpdate: new Date(),
      frequency: '1s'
    },
    {
      id: 'speed',
      name: 'Velocidad',
      value: 12.4,
      unit: 'nudos',
      status: 'active',
      lastUpdate: new Date(),
      frequency: '100ms'
    },
    {
      id: 'heading',
      name: 'Rumbo',
      value: 45,
      unit: '°',
      status: 'active', 
      lastUpdate: new Date(),
      frequency: '100ms'
    },
    {
      id: 'depth',
      name: 'Profundidad',
      value: 45.2,
      unit: 'm',
      status: 'active',
      lastUpdate: new Date(),
      frequency: '500ms'
    },
    {
      id: 'water_temp',
      name: 'Temp. Agua',
      value: 18.2,
      unit: '°C',
      status: 'delayed',
      lastUpdate: new Date(Date.now() - 5000),
      frequency: '30s'
    },
    {
      id: 'fish_sonar',
      name: 'Sonar de Pesca',
      value: 156,
      unit: 'detectados',
      status: 'active',
      lastUpdate: new Date(),
      frequency: '2s'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDataStreams(prev => prev.map(stream => {
        if (stream.status === 'active') {
          let newValue = stream.value;
          
          // Simulate data changes
          if (typeof stream.value === 'number') {
            const variation = (Math.random() - 0.5) * 0.2;
            newValue = Math.max(0, (stream.value as number) + variation);
            if (stream.id === 'speed') newValue = Math.min(20, newValue);
            if (stream.id === 'heading') newValue = (newValue as number) % 360;
          }
          
          return {
            ...stream,
            value: newValue,
            lastUpdate: new Date()
          };
        }
        return stream;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'delayed':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getTimeSinceUpdate = (lastUpdate: Date) => {
    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would trigger data refresh
  };

  const activeStreams = dataStreams.filter(s => s.status === 'active').length;

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Datos en Tiempo Real</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-600">LIVE</span>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
              {activeStreams}/{dataStreams.length} Activos
            </Badge>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {dataStreams.map((stream) => (
            <div
              key={stream.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-card/30 to-card/60"
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-foreground">
                    {stream.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(stream.status)}>
                      {stream.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stream.frequency}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold text-foreground">
                    {typeof stream.value === 'number' ? stream.value.toFixed(1) : stream.value}
                  </span>
                  {stream.unit && (
                    <span className="text-xs text-muted-foreground">{stream.unit}</span>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeSinceUpdate(stream.lastUpdate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Connection Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Satellite className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Estado de Conexión</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">Excelente</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Última actualización: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}