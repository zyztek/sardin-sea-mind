/**
 * SARDIN-AI - Widget de Predicción de Pesca
 * 
 * Componente que muestra predicción de zonas de pesca basada en
 * datos oceanográficos reales de NOAA.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useFishingPrediction, useFishingHotspots } from '@/hooks/useOceanData';
import {
   Fish,
   MapPin,
   Thermometer,
   Droplets,
   Target,
   TrendingUp,
   RefreshCw,
   Compass,
   Zap
} from 'lucide-react';

interface FishingPredictionWidgetProps {
   className?: string;
}

export function FishingPredictionWidget({ className }: FishingPredictionWidgetProps) {
   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

   // Obtener ubicación del usuario
   useEffect(() => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (pos) => {
               setLocation({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
               });
            },
            () => {
               // Fallback: Boston Harbor (zona costera)
               setLocation({ latitude: 42.3601, longitude: -70.9589 });
            }
         );
      } else {
         setLocation({ latitude: 42.3601, longitude: -70.9589 });
      }
   }, []);

   const { data: prediction, isLoading, isError, refetch } = useFishingPrediction(location);
   const { data: hotspots, isLoading: hotspotsLoading } = useFishingHotspots(location);

   if (isLoading || !location) {
      return (
         <Card className={`maritime-panel ${className}`}>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Fish className="h-5 w-5" />
                  Predicción de Pesca
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Skeleton className="h-24 w-full" />
               <Skeleton className="h-16 w-full" />
               <Skeleton className="h-16 w-full" />
            </CardContent>
         </Card>
      );
   }

   if (isError || !prediction) {
      return (
         <Card className={`maritime-panel border-orange-500/50 ${className}`}>
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Fish className="h-5 w-5" />
                  Analizando Zona...
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                  No se pudieron obtener datos oceanográficos. Usando valores estimados.
               </p>
               <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
               </Button>
            </CardContent>
         </Card>
      );
   }

   const probabilityPercent = Math.round(prediction.probability * 100);
   const probabilityColor =
      probabilityPercent >= 70 ? 'text-green-400' :
         probabilityPercent >= 50 ? 'text-yellow-400' :
            probabilityPercent >= 30 ? 'text-orange-400' : 'text-red-400';

   const badgeColor =
      probabilityPercent >= 70 ? 'bg-green-500' :
         probabilityPercent >= 50 ? 'bg-yellow-500' :
            probabilityPercent >= 30 ? 'bg-orange-500' : 'bg-red-500';

   return (
      <Card className={`maritime-panel ${className}`}>
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <CardTitle className="flex items-center gap-2 text-lg">
                  <Fish className="h-5 w-5 text-blue-400" />
                  Predicción de Pesca IA
               </CardTitle>
               <Badge className={`${badgeColor} text-white`}>
                  <Zap className="h-3 w-3 mr-1" />
                  {probabilityPercent >= 70 ? 'Óptimo' : probabilityPercent >= 50 ? 'Bueno' : 'Bajo'}
               </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
               <MapPin className="h-3 w-3" />
               {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°W
            </p>
         </CardHeader>

         <CardContent className="space-y-4">
            {/* Probabilidad Principal */}
            <div className="bg-background/50 rounded-lg p-4 text-center">
               <p className="text-xs text-muted-foreground mb-2">Probabilidad de Captura</p>
               <p className={`text-4xl font-bold ${probabilityColor}`}>
                  {probabilityPercent}%
               </p>
               <Progress
                  value={probabilityPercent}
                  className="mt-2 h-2"
               />
            </div>

            {/* Datos Oceanográficos */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-background/50 rounded-lg p-3 flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <div>
                     <p className="text-xs text-muted-foreground">Temp. Mar</p>
                     <p className="text-sm font-bold">{prediction.temperature.toFixed(1)}°C</p>
                  </div>
               </div>
               <div className="bg-background/50 rounded-lg p-3 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-green-400" />
                  <div>
                     <p className="text-xs text-muted-foreground">Clorofila</p>
                     <p className="text-sm font-bold">{prediction.chlorophyll.toFixed(2)} mg/m³</p>
                  </div>
               </div>
            </div>

            {/* Recomendación */}
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
               <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                     <p className="text-xs font-medium text-primary mb-1">Recomendación IA</p>
                     <p className="text-xs text-foreground/80">{prediction.recommendation}</p>
                  </div>
               </div>
            </div>

            {/* Hotspots */}
            {hotspots && hotspots.length > 0 && (
               <div className="border-t border-border/50 pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                     <TrendingUp className="h-3 w-3" />
                     Mejores Zonas Cercanas
                  </p>
                  <div className="space-y-2">
                     {hotspots.slice(0, 3).map((spot, i) => (
                        <div
                           key={i}
                           className="flex items-center justify-between text-xs bg-background/30 rounded p-2"
                        >
                           <div className="flex items-center gap-2">
                              <span className="text-primary font-bold">#{i + 1}</span>
                              <Compass className="h-3 w-3 text-muted-foreground" />
                              <span>{spot.latitude.toFixed(3)}°, {spot.longitude.toFixed(3)}°</span>
                           </div>
                           <Badge variant="outline" className="text-xs">
                              {Math.round(spot.probability * 100)}%
                           </Badge>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
               <span>Datos: NOAA ERDDAP</span>
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

export default FishingPredictionWidget;
