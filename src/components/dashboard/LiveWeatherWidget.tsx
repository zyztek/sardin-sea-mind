/**
 * SARDIN-AI - Widget de Clima Marino Real
 * 
 * Componente que muestra datos meteorológicos marinos en tiempo real
 * conectado a la API Open-Meteo.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentWeather } from '@/hooks/useWeatherData';
import {
   Cloud,
   Wind,
   Waves,
   Thermometer,
   Gauge,
   Navigation,
   AlertTriangle,
   CheckCircle,
   RefreshCw
} from 'lucide-react';

const riskColors = {
   low: 'bg-green-500',
   medium: 'bg-yellow-500',
   high: 'bg-orange-500',
   extreme: 'bg-red-500',
};

const riskLabels = {
   low: 'Bajo',
   medium: 'Moderado',
   high: 'Alto',
   extreme: 'Extremo',
};

const riskIcons = {
   low: CheckCircle,
   medium: AlertTriangle,
   high: AlertTriangle,
   extreme: AlertTriangle,
};

export function LiveWeatherWidget() {
   const {
      summary,
      isLoading,
      isError,
      refetch,
      location,
   } = useCurrentWeather();

   if (isLoading) {
      return (
         <Card className="maritime-panel">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Clima Marino
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Skeleton className="h-20 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
            </CardContent>
         </Card>
      );
   }

   if (isError || !summary) {
      return (
         <Card className="maritime-panel border-red-500/50">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Error de Conexión
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                  No se pudieron cargar los datos meteorológicos.
               </p>
               <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
               >
                  <RefreshCw className="h-4 w-4" />
                  Reintentar
               </button>
            </CardContent>
         </Card>
      );
   }

   const RiskIcon = riskIcons[summary.riskLevel];

   return (
      <Card className="maritime-panel">
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <CardTitle className="flex items-center gap-2 text-lg">
                  <Cloud className="h-5 w-5 text-maritime-accent" />
                  Clima Marino en Vivo
               </CardTitle>
               <Badge
                  className={`${riskColors[summary.riskLevel]} text-white`}
               >
                  <RiskIcon className="h-3 w-3 mr-1" />
                  Riesgo {riskLabels[summary.riskLevel]}
               </Badge>
            </div>
            {location && (
               <p className="text-xs text-muted-foreground">
                  📍 {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°W
               </p>
            )}
         </CardHeader>

         <CardContent className="space-y-4">
            {/* Métricas Principales */}
            <div className="grid grid-cols-2 gap-3">
               {/* Temperatura */}
               <div className="bg-background/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                     <Thermometer className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Temperatura</p>
                     <p className="text-lg font-bold">{summary.temperature.toFixed(1)}°C</p>
                  </div>
               </div>

               {/* Viento */}
               <div className="bg-background/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                     <Wind className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Viento</p>
                     <p className="text-lg font-bold">{summary.windSpeed.toFixed(1)} km/h</p>
                  </div>
               </div>

               {/* Oleaje */}
               <div className="bg-background/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                     <Waves className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Oleaje</p>
                     <p className="text-lg font-bold">{summary.waveHeight.toFixed(1)} m</p>
                  </div>
               </div>

               {/* Presión */}
               <div className="bg-background/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                     <Gauge className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Presión</p>
                     <p className="text-lg font-bold">{summary.pressure.toFixed(0)} hPa</p>
                  </div>
               </div>
            </div>

            {/* Dirección del Viento */}
            <div className="bg-background/50 rounded-lg p-3 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                     <Navigation
                        className="h-5 w-5 text-green-400"
                        style={{ transform: `rotate(${summary.windDirection}deg)` }}
                     />
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Dirección del Viento</p>
                     <p className="text-sm font-medium">{summary.windDirection}° ({getWindDirection(summary.windDirection)})</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-xs text-muted-foreground">Navegabilidad</p>
                  <p className="text-lg font-bold text-primary">{summary.navigationScore}%</p>
               </div>
            </div>

            {/* Recomendaciones */}
            {summary.recommendations.length > 0 && (
               <div className="border-t border-border/50 pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                     📋 Recomendaciones
                  </p>
                  <ul className="space-y-1">
                     {summary.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                           <span className="text-primary">•</span>
                           {rec}
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {/* Última actualización */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
               <span>
                  Actualizado: {new Date(summary.timestamp).toLocaleTimeString()}
               </span>
               <button
                  onClick={() => refetch()}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
               >
                  <RefreshCw className="h-3 w-3" />
                  Actualizar
               </button>
            </div>
         </CardContent>
      </Card>
   );
}

/**
 * Convierte grados a dirección cardinal
 */
function getWindDirection(degrees: number): string {
   const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
   const index = Math.round(degrees / 22.5) % 16;
   return directions[index];
}

export default LiveWeatherWidget;
