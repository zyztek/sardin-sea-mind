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
import { useState, useEffect } from "react";

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  temperature: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  humidity: number;
  pressure: number;
  waveHeight: number;
  forecast: Array<{
    time: string;
    condition: string;
    temp: number;
    wind: number;
  }>;
}

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className = "" }: WeatherWidgetProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    condition: 'cloudy',
    temperature: 18.2,
    windSpeed: 15,
    windDirection: 225,
    visibility: 12,
    humidity: 68,
    pressure: 1015,
    waveHeight: 1.2,
    forecast: [
      { time: '15:00', condition: '☁️', temp: 19, wind: 12 },
      { time: '18:00', condition: '🌤️', temp: 17, wind: 18 },
      { time: '21:00', condition: '🌧️', temp: 16, wind: 22 },
      { time: '00:00', condition: '⛈️', temp: 15, wind: 28 }
    ]
  });

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 2),
        windDirection: (prev.windDirection + (Math.random() - 0.5) * 5) % 360,
        visibility: Math.max(1, Math.min(20, prev.visibility + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(30, Math.min(95, prev.humidity + (Math.random() - 0.5) * 2)),
        pressure: Math.max(990, Math.min(1030, prev.pressure + (Math.random() - 0.5) * 1)),
        waveHeight: Math.max(0.1, prev.waveHeight + (Math.random() - 0.5) * 0.1)
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return Sun;
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      case 'stormy':
        return CloudRain;
      default:
        return Cloud;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'text-yellow-500';
      case 'cloudy':
        return 'text-gray-500';
      case 'rainy':
        return 'text-blue-500';
      case 'stormy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getWindDirectionLabel = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getSeaCondition = (waveHeight: number) => {
    if (waveHeight < 0.5) return { label: 'Calma', color: 'text-emerald-600' };
    if (waveHeight < 1.0) return { label: 'Ligera', color: 'text-blue-600' };
    if (waveHeight < 2.0) return { label: 'Moderada', color: 'text-amber-600' };
    return { label: 'Agitada', color: 'text-red-600' };
  };

  const WeatherIcon = getConditionIcon(weather.condition);
  const seaCondition = getSeaCondition(weather.waveHeight);

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <WeatherIcon className={`h-5 w-5 ${getConditionColor(weather.condition)}`} />
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
              {weather.temperature.toFixed(1)}°C
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Viento</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(weather.windSpeed)} km/h
            </div>
            <div className="text-xs text-muted-foreground">
              {getWindDirectionLabel(weather.windDirection)} ({Math.round(weather.windDirection)}°)
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
            <span className="font-medium">{weather.visibility.toFixed(1)} km</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Cloud className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Humedad</span>
            </div>
            <span className="font-medium">{Math.round(weather.humidity)}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Compass className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Presión</span>
            </div>
            <span className="font-medium">{Math.round(weather.pressure)} hPa</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Waves className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Oleaje</span>
            </div>
            <span className={`font-medium ${seaCondition.color}`}>
              {weather.waveHeight.toFixed(1)} m
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
            {weather.forecast.map((item, index) => (
              <div key={index} className="text-center p-2 rounded bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">
                  {item.time}
                </div>
                <div className="text-lg mb-1">
                  {item.condition}
                </div>
                <div className="text-xs font-medium">
                  {item.temp}°C
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.wind} km/h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-2 border-t text-xs text-muted-foreground text-center">
          Actualizado: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}