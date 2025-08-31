import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Eye,
  Droplets,
  Compass,
  ArrowUp
} from "lucide-react";

interface WeatherData {
  current: {
    condition: string;
    temperature: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    humidity: number;
    pressure: number;
  };
  forecast: Array<{
    time: string;
    condition: string;
    temperature: number;
    windSpeed: number;
    precipitation: number;
  }>;
}

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className = "" }: WeatherWidgetProps) {
  const weatherData: WeatherData = {
    current: {
      condition: "Parcialmente nublado",
      temperature: 18,
      windSpeed: 15,
      windDirection: 225,
      visibility: 12,
      humidity: 68,
      pressure: 1015
    },
    forecast: [
      { time: "12:00", condition: "Soleado", temperature: 19, windSpeed: 12, precipitation: 0 },
      { time: "15:00", condition: "Nuboso", temperature: 20, windSpeed: 18, precipitation: 10 },
      { time: "18:00", condition: "Lluvia", temperature: 17, windSpeed: 22, precipitation: 80 },
      { time: "21:00", condition: "Nuboso", temperature: 16, windSpeed: 16, precipitation: 20 }
    ]
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return Sun;
      case 'nuboso':
      case 'parcialmente nublado':
        return Cloud;
      case 'lluvia':
        return CloudRain;
      default:
        return Cloud;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return 'text-amber-500';
      case 'nuboso':
      case 'parcialmente nublado':
        return 'text-gray-500';
      case 'lluvia':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getWindDirectionText = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const CurrentIcon = getWeatherIcon(weatherData.current.condition);

  return (
    <Card className={`maritime-panel ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <CurrentIcon className={`h-5 w-5 ${getConditionColor(weatherData.current.condition)}`} />
          <span>Condiciones Meteorológicas</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Thermometer className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Temperatura</span>
            </div>
            <div className="text-lg font-bold text-foreground">{weatherData.current.temperature}°C</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Wind className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Viento</span>
            </div>
            <div className="text-lg font-bold text-foreground">{weatherData.current.windSpeed} km/h</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
              <Compass className="h-2 w-2" />
              <span>{getWindDirectionText(weatherData.current.windDirection)}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Visibilidad</span>
            </div>
            <div className="text-lg font-bold text-foreground">{weatherData.current.visibility} km</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Droplets className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Humedad</span>
            </div>
            <div className="text-lg font-bold text-foreground">{weatherData.current.humidity}%</div>
          </div>
        </div>
        
        {/* Current Condition */}
        <div className="bg-gradient-to-r from-card/50 to-card/80 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <CurrentIcon className={`h-8 w-8 ${getConditionColor(weatherData.current.condition)}`} />
            <div>
              <div className="font-medium text-foreground">{weatherData.current.condition}</div>
              <div className="text-sm text-muted-foreground">
                Presión: {weatherData.current.pressure} hPa
              </div>
            </div>
          </div>
        </div>
        
        {/* 12-Hour Forecast */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Pronóstico (12 horas)</h4>
          <div className="grid grid-cols-4 gap-2">
            {weatherData.forecast.map((hour, index) => {
              const HourIcon = getWeatherIcon(hour.condition);
              return (
                <div key={index} className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">{hour.time}</div>
                  <HourIcon className={`h-4 w-4 mx-auto mb-1 ${getConditionColor(hour.condition)}`} />
                  <div className="text-xs font-medium text-foreground">{hour.temperature}°</div>
                  <div className="text-xs text-muted-foreground">{hour.windSpeed} km/h</div>
                  {hour.precipitation > 0 && (
                    <div className="text-xs text-blue-500">{hour.precipitation}%</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Weather Advisory */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CloudRain className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Aviso Meteorológico</span>
          </div>
          <p className="text-xs text-amber-600 mt-1">
            Se esperan lluvias moderadas entre las 18:00-21:00. Considerar ajustar velocidad de navegación.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}