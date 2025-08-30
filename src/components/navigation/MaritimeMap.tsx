import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Target, 
  AlertTriangle, 
  Waves,
  Fish,
  Anchor
} from "lucide-react";

interface MapLayer {
  id: string;
  name: string;
  active: boolean;
  color: string;
}

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'destination' | 'waypoint' | 'hazard' | 'fishing_zone';
  status: 'pending' | 'active' | 'completed';
}

interface MaritimeMapProps {
  waypoints?: Waypoint[];
  currentPosition?: { lat: number; lng: number };
  layers?: MapLayer[];
  onLayerToggle?: (layerId: string) => void;
  onWaypointSelect?: (waypoint: Waypoint) => void;
  className?: string;
}

export function MaritimeMap({
  waypoints = [],
  currentPosition = { lat: 42.3601, lng: -71.0589 },
  layers = [
    { id: 'bathymetry', name: 'Batimetría', active: true, color: 'blue' },
    { id: 'currents', name: 'Corrientes', active: true, color: 'cyan' },
    { id: 'fishing', name: 'Zonas de Pesca', active: false, color: 'green' },
    { id: 'weather', name: 'Clima', active: true, color: 'orange' },
  ],
  onLayerToggle,
  onWaypointSelect,
  className = ""
}: MaritimeMapProps) {
  
  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'destination':
        return Target;
      case 'waypoint':
        return Navigation;
      case 'hazard':
        return AlertTriangle;
      case 'fishing_zone':
        return Fish;
      default:
        return MapPin;
    }
  };

  const getWaypointColor = (type: string, status: string) => {
    if (status === 'completed') return 'text-gray-400';
    switch (type) {
      case 'destination':
        return 'text-emerald-500';
      case 'waypoint':
        return 'text-blue-500';
      case 'hazard':
        return 'text-red-500';
      case 'fishing_zone':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-primary" />
            <span>Mapa de Navegación</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
              GPS Activo
            </Badge>
            <Button size="sm" variant="outline">
              Pantalla Completa
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Map Canvas */}
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-200 overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-ocean-gradient opacity-20" />
          
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full border-t border-blue-200/50"
                style={{ top: `${(i + 1) * 12.5}%` }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full border-l border-blue-200/50"
                style={{ left: `${(i + 1) * 12.5}%` }}
              />
            ))}
          </div>
          
          {/* Current Position */}
          <div 
            className="absolute w-4 h-4 -ml-2 -mt-2 z-10"
            style={{ 
              left: '50%', 
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <Anchor className="h-4 w-4 text-red-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Waypoints */}
          {waypoints.map((waypoint, index) => {
            const Icon = getWaypointIcon(waypoint.type);
            return (
              <div
                key={waypoint.id}
                className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer hover:scale-110 transition-transform z-10"
                style={{ 
                  left: `${30 + (index * 15)}%`, 
                  top: `${25 + (index * 10)}%` 
                }}
                onClick={() => onWaypointSelect?.(waypoint)}
              >
                <Icon className={`h-4 w-4 ${getWaypointColor(waypoint.type, waypoint.status)}`} />
              </div>
            );
          })}
          
          {/* Route Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="2">
                <rect width="4" height="2" fill="rgba(59, 130, 246, 0.5)" />
              </pattern>
            </defs>
            <path
              d="M 50% 50% L 45% 35% L 60% 45% L 75% 55%"
              stroke="url(#dashed)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        
        {/* Map Controls */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {layers.map((layer) => (
              <Button
                key={layer.id}
                size="sm"
                variant={layer.active ? "default" : "outline"}
                onClick={() => onLayerToggle?.(layer.id)}
                className="h-7 text-xs"
              >
                <div 
                  className={`w-2 h-2 rounded-full mr-2 bg-${layer.color}-500`}
                />
                {layer.name}
              </Button>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Lat: {currentPosition.lat.toFixed(4)}, Lng: {currentPosition.lng.toFixed(4)}
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Anchor className="h-3 w-3 text-red-500" />
            <span>Posición Actual</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-3 w-3 text-emerald-500" />
            <span>Destino</span>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="h-3 w-3 text-blue-500" />
            <span>Waypoint</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            <span>Peligro</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}