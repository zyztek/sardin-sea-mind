import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map as MapIcon,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Route as RouteIcon,
  Anchor,
  Fish,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";
import { Waypoint } from "@/types/maritime";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  default: createCustomIcon('blue'),
  fishing: createCustomIcon('green'),
  harbor: createCustomIcon('grey'),
  destination: createCustomIcon('red'),
  scouting: createCustomIcon('gold'),
};

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  icon: any;
  url?: string;
}

interface MaritimeMapProps {
  waypoints: Waypoint[];
  currentPosition: { lat: number; lng: number };
  onWaypointSelect?: (waypoint: Waypoint) => void;
  onLayerToggle?: (layerId: string) => void;
  className?: string;
}

// Component to handle map center updates
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MaritimeMap({
  waypoints,
  currentPosition,
  onWaypointSelect,
  onLayerToggle,
  className = ""
}: MaritimeMapProps) {
  const [zoom, setZoom] = useState(12);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'osm', name: 'Estándar', enabled: true, icon: Navigation },
    { id: 'satellite', name: 'Satélite (Esri)', enabled: false, icon: Layers },
    { id: 'sea', name: 'Carta Náutica', enabled: true, icon: Anchor },
  ]);

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id === layerId) return { ...layer, enabled: !layer.enabled };
      // Logic for base layers: only one base layer at a time
      if ((layerId === 'osm' || layerId === 'satellite') && (layer.id === 'osm' || layer.id === 'satellite')) {
        return { ...layer, enabled: layer.id === layerId };
      }
      return layer;
    }));
    onLayerToggle?.(layerId);
  };

  const activeBaseLayer = layers.find(l => (l.id === 'osm' || l.id === 'satellite') && l.enabled)?.id || 'osm';

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'fishing_zone': return icons.fishing;
      case 'harbor': return icons.harbor;
      case 'destination': return icons.destination;
      default: return icons.default;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => direction === 'in' ? Math.min(18, prev + 1) : Math.max(3, prev - 1));
  };

  // Construct route line from current position to waypoints (simple sequence)
  const routePositions = [
    [currentPosition.lat, currentPosition.lng] as [number, number],
    ...waypoints.map(w => [w.latitude, w.longitude] as [number, number])
  ];

  return (
    <Card className={`maritime-panel overflow-hidden flex flex-col h-[600px] ${className}`}>
      <CardHeader className="pb-3 shrink-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapIcon className="h-5 w-5 text-primary" />
            <span>Mapa de Navegación</span>
            <Badge variant="outline" className="ml-2">
              GPS: {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 mr-2 bg-muted p-1 rounded-md">
              <Button
                size="sm"
                variant={activeBaseLayer === 'osm' ? 'secondary' : 'ghost'}
                className="h-7 px-2 text-xs"
                onClick={() => toggleLayer('osm')}
              >
                Mapa
              </Button>
              <Button
                size="sm"
                variant={activeBaseLayer === 'satellite' ? 'secondary' : 'ghost'}
                className="h-7 px-2 text-xs"
                onClick={() => toggleLayer('satellite')}
              >
                Satélite
              </Button>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleZoom('out')}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleZoom('in')}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="default" onClick={() => {
              // Return to current position logic would go here
            }}>
              <Crosshair className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative min-h-0">
        <MapContainer
          center={[currentPosition.lat, currentPosition.lng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapUpdater center={[currentPosition.lat, currentPosition.lng]} zoom={zoom} />

          {/* Base Layers */}
          {activeBaseLayer === 'osm' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          {activeBaseLayer === 'satellite' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {/* Sea Map Layer (OpenSeaMap) */}
          {layers.find(l => l.id === 'sea')?.enabled && (
            <TileLayer
              url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
              attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            />
          )}

          {/* Current Position Marker */}
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={createCustomIcon('violet')}>
            <Popup>
              <strong>Mi Embarcación</strong><br />
              Rumbo: 180°<br />
              Velocidad: 12 nudos
            </Popup>
          </Marker>

          {/* Waypoints */}
          {waypoints.map((wp) => (
            <Marker
              key={wp.id}
              position={[wp.latitude, wp.longitude]}
              icon={getMarkerIcon(wp.waypoint_type)}
              eventHandlers={{
                click: () => {
                  setSelectedWaypoint(wp.id);
                  onWaypointSelect?.(wp);
                },
              }}
            >
              <Popup>
                <strong>{wp.name}</strong><br />
                Tipo: {wp.waypoint_type}<br />
                Lat: {wp.latitude.toFixed(4)}<br />
                Lng: {wp.longitude.toFixed(4)}
              </Popup>
            </Marker>
          ))}

          {/* Route Line */}
          <Polyline positions={routePositions} color="blue" dashArray="10, 10" />

        </MapContainer>

        {/* Leyenda flotante */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 p-2 rounded-md shadow-md text-xs backdrop-blur-sm border border-slate-200">
          <div className="font-bold mb-1">Leyenda</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-500"></div> Mi Barco</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Pesca</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Waypoint</div>
        </div>

      </CardContent>
    </Card>
  );
}
