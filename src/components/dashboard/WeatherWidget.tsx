import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Eye,
  Compass,
  Waves,
  RefreshCw
} from "lucide-react";
import { SensorData } from "@/types/maritime";

interface WeatherWidgetProps {
  className?: string;
  data?: SensorData;
}

export function WeatherWidget({ className = "", data }: WeatherWidgetProps) {
  // Use real data or defaults
  const temperature = data?.water_temperature_c || 0; // Using water temp as proxy if air temp missing, or 0
  const windSpeed = data?.wind_speed_knots || 0;
  const windDirection = data?.wind_direction_degrees || 0;

  // Simulated derived values for now (since SensorData might not have all weather fields)
  const visibility = 10;
  const humidity = 75;
  const pressure = 1013;
  const waveHeight = 1.2;

  const getConditionIcon = (temp: number) => {
    if (temp > 20) return Sun;
    if (temp > 10) return Cloud;
    return CloudRain;
  };

  const getConditionColor = (temp: number) => {
    if (temp > 20) return 'text-yellow-500';
    if (temp > 10) return 'text-gray-500';
    return 'text-blue-500';
  };

  const getWindDirectionLabel = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getSeaCondition = (height: number) => {
    if (height < 0.5) return { label: 'Calma', color: 'text-emerald-600' };
    if (height < 1.0) return { label: 'Ligera', color: 'text-blue-600' };
    if (height < 2.0) return { label: 'Moderada', color: 'text-amber-600' };
    return { label: 'Agitada', color: 'text-red-600' };
  };

  const WeatherIcon = getConditionIcon(temperature);
  const seaCondition = getSeaCondition(waveHeight);

  // Mock forecast for UI completeness
  const forecast = [
    { time: '+3h', condition: '☁️', temp: temperature - 1, wind: windSpeed + 2 },
    { time: '+6h', condition: '🌤️', temp: temperature - 2, wind: windSpeed + 5 },
    { time: '+9h', condition: '🌧️', temp: temperature - 3, wind: windSpeed + 8 },
    { time: '+12h', condition: '⛈️', temp: temperature - 4, wind: windSpeed + 10 }
  ];

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <WeatherIcon className={`h-5 w-5 ${getConditionColor(temperature)}`} />
            <span>Condiciones Meteorológicas</span>
          </CardTitle>
          <Badge variant="outline" className={seaCondition.color}>
            Mar {seaCondition.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Temperatura</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {temperature.toFixed(1)}°C
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Viento</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(windSpeed)} kn
            </div>
            <div className="text-xs text-muted-foreground">
              {getWindDirectionLabel(windDirection)} ({Math.round(windDirection)}°)
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Visibilidad</span>
            </div>
            <span className="font-medium">{visibility.toFixed(1)} km</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Cloud className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Humedad</span>
            </div>
            <span className="font-medium">{Math.round(humidity)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Compass className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Presión</span>
            </div>
            <span className="font-medium">{Math.round(pressure)} hPa</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Waves className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Oleaje</span>
            </div>
            <span className={`font-medium ${seaCondition.color}`}>
              {waveHeight.toFixed(1)} m
            </span>
          </div>
        </div>

        {/* 4-Hour Forecast */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Previsión 12h</h4>
            <RefreshCw className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {forecast.map((item, index) => (
              <div key={index} className="text-center p-2 rounded bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">
                  {item.time}
                </div>
                <div className="text-lg mb-1">
                  {item.condition}
                </div>
                <div className="text-xs font-medium">
                  {item.temp.toFixed(0)}°C
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.wind.toFixed(0)} kn
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-2 border-t text-xs text-muted-foreground text-center">
          Actualizado: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'Esperando datos...'}
        </div>
      </CardContent>
    </Card>
  );
}