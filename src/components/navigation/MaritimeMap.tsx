import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map as MapIcon,
  MapPin,
  Navigation,
  Anchor,
  Fish,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Route
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Waypoint } from "@/types/maritime";

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  icon: any;
}

interface MaritimeMapProps {
  waypoints: Waypoint[];
  currentPosition: { lat: number; lng: number };
  onWaypointSelect?: (waypoint: Waypoint) => void;
  onLayerToggle?: (layerId: string) => void;
  className?: string;
}

export function MaritimeMap({
  waypoints,
  currentPosition,
  onWaypointSelect,
  onLayerToggle,
  className = ""
}: MaritimeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(12);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'bathymetry', name: 'Batimetría', enabled: true, icon: Layers },
    { id: 'fishing', name: 'Zonas de Pesca', enabled: true, icon: Fish },
    { id: 'navigation', name: 'Navegación', enabled: true, icon: Navigation },
    { id: 'weather', name: 'Meteorología', enabled: false, icon: MapIcon }
  ]);

  // Convert coordinates to screen position (simple projection)
  const coordToScreen = (lat: number, lng: number) => {
    const centerLat = currentPosition.lat;
    const centerLng = currentPosition.lng;
    const scale = Math.pow(2, zoom - 8);

    const x = ((lng - centerLng) * scale * 100) + 200;
    const y = ((centerLat - lat) * scale * 100) + 150;

    return { x, y };
  };

  const getWaypointIcon = (type: string = 'waypoint') => {
    switch (type) {
      case 'destination':
        return '🏁';
      case 'waypoint':
        return '📍';
      case 'fishing_zone':
        return '🐟';
      case 'harbor':
        return '⚓';
      default:
        return '📍';
    }
  };

  const getWaypointColor = (status: string = 'active') => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-500/20';
      case 'active':
        return 'border-blue-500 bg-blue-500/20 animate-pulse';
      case 'pending':
        return 'border-amber-500 bg-amber-500/20';
      default:
        return 'border-gray-500 bg-gray-500/20';
    }
  };

  const handleWaypointClick = (waypoint: Waypoint) => {
    setSelectedWaypoint(waypoint.id);
    onWaypointSelect?.(waypoint);
  };

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
    onLayerToggle?.(layerId);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => direction === 'in' ? Math.min(18, prev + 1) : Math.max(5, prev - 1));
  };

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapIcon className="h-5 w-5 text-primary" />
            <span>Mapa de Navegación</span>
            <Badge variant="outline">
              Zoom {zoom}x
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => handleZoom('out')}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleZoom('in')}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Crosshair className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="relative w-full h-80 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden"
        >
          {/* Ocean Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0 10 Q10 5 20 10 Q30 15 40 10" stroke="white" strokeWidth="0.5" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>

          {/* Bathymetry Lines (if enabled) */}
          {layers.find(l => l.id === 'bathymetry')?.enabled && (
            <div className="absolute inset-0 opacity-30">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-blue-300 rounded-full"
                  style={{
                    left: `${20 + i * 8}%`,
                    top: `${30 + i * 5}%`,
                    width: `${30 + i * 10}px`,
                    height: `${30 + i * 10}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Current Position */}
          <div
            className="absolute w-4 h-4 -ml-2 -mt-2 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"
            style={{
              left: `${coordToScreen(currentPosition.lat, currentPosition.lng).x}px`,
              top: `${coordToScreen(currentPosition.lat, currentPosition.lng).y}px`,
            }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Mi Posición
            </div>
          </div>

          {/* Waypoints */}
          {waypoints.map((waypoint) => {
            const pos = coordToScreen(waypoint.latitude, waypoint.longitude);
            return (
              <div
                key={waypoint.id}
                className={`absolute w-8 h-8 -ml-4 -mt-4 border-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ${getWaypointColor()}`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                }}
                onClick={() => handleWaypointClick(waypoint)}
              >
                <div className="flex items-center justify-center w-full h-full text-sm">
                  {getWaypointIcon(waypoint.waypoint_type)}
                </div>

                {/* Waypoint Label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card text-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {waypoint.name}
                </div>
              </div>
            );
          })}

          {/* Route Line */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7"
                refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(59, 130, 246, 0.8)" />
              </marker>
            </defs>
            {waypoints.map((waypoint, index) => {
              if (index === 0) return null;
              const prevWaypoint = index === 0 ? { latitude: currentPosition.lat, longitude: currentPosition.lng } : waypoints[index - 1];
              // Handle first segment from current position if needed, but here we just link waypoints
              // Actually, let's link current pos to first waypoint, then waypoint to waypoint

              // Simplified: just link waypoints in order
              const start = index === 1
                ? coordToScreen(currentPosition.lat, currentPosition.lng)
                : coordToScreen(waypoints[index - 1].latitude, waypoints[index - 1].longitude);

              const end = coordToScreen(waypoint.latitude, waypoint.longitude);

              return (
                <line
                  key={`route-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(59, 130, 246, 0.8)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* Fishing Zones (if enabled) */}
          {layers.find(l => l.id === 'fishing')?.enabled && (
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-emerald-500/20 border border-emerald-500 rounded-full w-16 h-16 flex items-center justify-center">
                <Fish className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="bg-amber-500/20 border border-amber-500 rounded-full w-12 h-12 flex items-center justify-center">
                <Fish className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="p-4 border-t">
          {/* Layer Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            {layers.map((layer) => {
              const Icon = layer.icon;
              return (
                <Button
                  key={layer.id}
                  size="sm"
                  variant={layer.enabled ? "default" : "outline"}
                  onClick={() => toggleLayer(layer.id)}
                  className="text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {layer.name}
                </Button>
              );
            })}
          </div>

          {/* Waypoint Info */}
          {selectedWaypoint && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              {(() => {
                const waypoint = waypoints.find(w => w.id === selectedWaypoint);
                if (!waypoint) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{waypoint.name}</h4>
                      <Badge variant="outline" className={getWaypointColor()}>
                        Active
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Coordenadas: {waypoint.latitude.toFixed(4)}, {waypoint.longitude.toFixed(4)}</div>
                      <div>Tipo: {waypoint.waypoint_type}</div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Route className="h-3 w-3 mr-1" />
                        Navegar a
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        Detalles
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}