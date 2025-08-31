import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Navigation,
  Play,
  Pause,
  RotateCcw,
  Target,
  Anchor,
  Route,
  AlertCircle,
  Settings
} from "lucide-react";

interface NavigationControlsProps {
  className?: string;
}

export function NavigationControls({ className = "" }: NavigationControlsProps) {
  const navigationState = {
    autopilot: true,
    currentSpeed: 12.4,
    targetSpeed: 15.0,
    heading: 45,
    targetHeading: 48,
    distanceToDestination: 142,
    eta: "14:30"
  };

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-primary" />
            <span>Control de Navegación</span>
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
            Autopiloto Activo
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant={navigationState.autopilot ? "default" : "outline"}
            className="flex items-center space-x-2 h-12"
          >
            <Play className="h-4 w-4" />
            <span>Autopiloto</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2 h-12">
            <Pause className="h-4 w-4" />
            <span>Manual</span>
          </Button>
        </div>
        
        {/* Navigation Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Velocidad Actual</span>
              <span className="font-bold text-foreground">{navigationState.currentSpeed} nudos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Velocidad Objetivo</span>
              <span className="font-bold text-ai-neural">{navigationState.targetSpeed} nudos</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rumbo Actual</span>
              <span className="font-bold text-foreground">{navigationState.heading}°</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rumbo Objetivo</span>
              <span className="font-bold text-ai-neural">{navigationState.targetHeading}°</span>
            </div>
          </div>
        </div>
        
        {/* Destination Info */}
        <div className="bg-gradient-to-r from-card/50 to-card/80 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Destino</span>
            </div>
            <span className="text-xs text-muted-foreground">ETA: {navigationState.eta}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Distancia restante</span>
            <span className="font-bold text-foreground">{navigationState.distanceToDestination} millas</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline" className="flex flex-col items-center space-y-1 h-16">
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs">Retornar</span>
          </Button>
          
          <Button size="sm" variant="outline" className="flex flex-col items-center space-y-1 h-16">
            <Anchor className="h-4 w-4" />
            <span className="text-xs">Anclar</span>
          </Button>
          
          <Button size="sm" variant="outline" className="flex flex-col items-center space-y-1 h-16">
            <Route className="h-4 w-4" />
            <span className="text-xs">Nueva Ruta</span>
          </Button>
        </div>
        
        {/* AI Recommendations */}
        <div className="bg-ai-gradient/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-ai-neural" />
            <span className="text-sm font-medium text-ai-neural">Recomendación IA</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Ajustar rumbo +3° para evitar corriente contraria. Ahorro estimado: 12 minutos.
          </p>
          <div className="flex space-x-2">
            <Button size="sm" variant="default" className="h-6 text-xs bg-ai-gradient">
              Aplicar
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-xs">
              Ignorar
            </Button>
          </div>
        </div>
        
        {/* Settings */}
        <Button variant="outline" className="w-full flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Configuración Avanzada</span>
        </Button>
      </CardContent>
    </Card>
  );
}