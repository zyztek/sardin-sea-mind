import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Navigation, 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Clock,
  Target,
  Route,
  AlertTriangle,
  Settings,
  Compass
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationState {
  status: 'manual' | 'autopilot' | 'waypoint_navigation' | 'emergency';
  currentSpeed: number;
  targetSpeed: number;
  heading: number;
  targetHeading: number;
  eta: string;
  distanceToDestination: number;
  routeProgress: number;
  nextWaypoint: string;
}

interface NavigationControlsProps {
  className?: string;
}

export function NavigationControls({ className = "" }: NavigationControlsProps) {
  const [navState, setNavState] = useState<NavigationState>({
    status: 'autopilot',
    currentSpeed: 12.4,
    targetSpeed: 14.0,
    heading: 45,
    targetHeading: 48,
    eta: '14:30',
    distanceToDestination: 142.3,
    routeProgress: 67,
    nextWaypoint: 'Zona Pesca A'
  });

  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  // Simulate navigation updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (autopilotEnabled) {
        setNavState(prev => ({
          ...prev,
          currentSpeed: Math.min(prev.targetSpeed, prev.currentSpeed + 0.1),
          heading: prev.heading + (prev.targetHeading - prev.heading) * 0.1,
          distanceToDestination: Math.max(0, prev.distanceToDestination - 0.2),
          routeProgress: Math.min(100, prev.routeProgress + 0.1)
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autopilotEnabled]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'manual':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'autopilot':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'waypoint_navigation':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'emergency':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'manual':
        return 'Manual';
      case 'autopilot':
        return 'Piloto Automático';
      case 'waypoint_navigation':
        return 'Navegación por Puntos';
      case 'emergency':
        return 'Emergencia';
      default:
        return 'Desconocido';
    }
  };

  const toggleAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled);
    setNavState(prev => ({
      ...prev,
      status: !autopilotEnabled ? 'autopilot' : 'manual'
    }));
  };

  const emergencyStop = () => {
    setNavState(prev => ({
      ...prev,
      status: 'emergency',
      targetSpeed: 0,
      currentSpeed: 0
    }));
    setAutopilotEnabled(false);
  };

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-primary" />
            <span>Controles de Navegación</span>
          </CardTitle>
          <Badge variant="outline" className={getStatusColor(navState.status)}>
            {getStatusLabel(navState.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Speed and Heading Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Velocidad</span>
              <span className="text-sm text-muted-foreground">
                {navState.currentSpeed.toFixed(1)} / {navState.targetSpeed.toFixed(1)} nudos
              </span>
            </div>
            <Progress value={(navState.currentSpeed / navState.targetSpeed) * 100} />
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">-</Button>
              <Button size="sm" variant="outline" className="flex-1">+</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rumbo</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(navState.heading)}° / {navState.targetHeading}°
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(navState.heading / 360) * 100}%` }}
                />
              </div>
              <Compass className="absolute -top-1 right-0 h-4 w-4 text-primary" />
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Target className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Status */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ETA:</span>
              <span className="font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {navState.eta}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Distancia:</span>
              <span className="font-medium">{navState.distanceToDestination.toFixed(1)} nm</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progreso de Ruta</span>
              <span className="text-sm text-muted-foreground">{navState.routeProgress.toFixed(1)}%</span>
            </div>
            <Progress value={navState.routeProgress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Próximo Punto:</span>
            </div>
            <span className="text-sm text-muted-foreground">{navState.nextWaypoint}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={autopilotEnabled ? "default" : "outline"}
            onClick={toggleAutopilot}
            className="flex items-center justify-center space-x-2"
          >
            {autopilotEnabled ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{autopilotEnabled ? 'Desactivar' : 'Activar'} Piloto</span>
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Route className="h-4 w-4" />
            <span>Nueva Ruta</span>
          </Button>
        </div>

        {/* Emergency and Settings */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="destructive" 
            onClick={emergencyStop}
            className="flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Parada Emergencia</span>
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurar</span>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Acciones Rápidas</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="ghost" className="justify-start text-xs">
              🎯 Punto de Interés
            </Button>
            <Button size="sm" variant="ghost" className="justify-start text-xs">
              ⚓ Zona de Fondeo
            </Button>
            <Button size="sm" variant="ghost" className="justify-start text-xs">
              🏠 Retorno a Base
            </Button>
            <Button size="sm" variant="ghost" className="justify-start text-xs">
              📍 Marcar Posición
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}