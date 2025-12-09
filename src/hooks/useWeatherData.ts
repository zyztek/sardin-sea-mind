/**
 * SARDIN-AI - Hook para datos meteorológicos
 * 
 * Hook React para integrar Open-Meteo API en componentes.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
   getOpenMeteoService,
   MarineForecastResponse,
   WeatherForecastResponse,
   MaritimeSummary,
   MarineLocation
} from '@/services/apis/OpenMeteoService';

interface UseWeatherDataOptions {
   latitude: number;
   longitude: number;
   enabled?: boolean;
   refetchInterval?: number;
}

interface UseWeatherDataReturn {
   // Datos
   weather: WeatherForecastResponse | null;
   marine: MarineForecastResponse | null;
   summary: MaritimeSummary | null;

   // Estado
   isLoading: boolean;
   isError: boolean;
   error: Error | null;

   // Acciones
   refetch: () => void;

   // Helpers
   currentTemperature: number | null;
   currentWindSpeed: number | null;
   currentWaveHeight: number | null;
   riskLevel: string | null;
   navigationScore: number | null;
}

/**
 * Hook para obtener datos meteorológicos marinos
 */
export function useWeatherData(options: UseWeatherDataOptions): UseWeatherDataReturn {
   const service = getOpenMeteoService();
   const { latitude, longitude, enabled = true, refetchInterval = 600000 } = options;

   const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: ['weather', latitude, longitude],
      queryFn: async () => {
         return service.getCurrentConditions({ latitude, longitude });
      },
      enabled,
      refetchInterval,
      staleTime: 300000, // 5 minutos
   });

   return {
      weather: data?.weather ?? null,
      marine: data?.marine ?? null,
      summary: data?.summary ?? null,
      isLoading,
      isError,
      error: error as Error | null,
      refetch,
      currentTemperature: data?.summary?.temperature ?? null,
      currentWindSpeed: data?.summary?.windSpeed ?? null,
      currentWaveHeight: data?.summary?.waveHeight ?? null,
      riskLevel: data?.summary?.riskLevel ?? null,
      navigationScore: data?.summary?.navigationScore ?? null,
   };
}

/**
 * Hook simplificado para ubicación actual
 */
export function useCurrentWeather(): UseWeatherDataReturn & { location: MarineLocation | null } {
   const [location, setLocation] = useState<MarineLocation | null>(null);

   useEffect(() => {
      // Intentar obtener ubicación del navegador
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
               });
            },
            () => {
               // Fallback a ubicación por defecto (Boston Harbor)
               setLocation({ latitude: 42.3601, longitude: -71.0589 });
            }
         );
      } else {
         setLocation({ latitude: 42.3601, longitude: -71.0589 });
      }
   }, []);

   const weatherData = useWeatherData({
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
      enabled: location !== null,
   });

   return {
      ...weatherData,
      location,
   };
}

/**
 * Hook para pronóstico extendido
 */
export function useExtendedForecast(location: MarineLocation, days: number = 7) {
   const service = getOpenMeteoService();

   return useQuery({
      queryKey: ['forecast', 'extended', location.latitude, location.longitude, days],
      queryFn: async () => {
         const [weather, marine] = await Promise.all([
            service.getWeatherForecast({ ...location, forecastDays: days }),
            service.getMarineForecast({ ...location, forecastDays: days }),
         ]);
         return { weather, marine };
      },
      staleTime: 1800000, // 30 minutos
   });
}

/**
 * Hook para datos de oleaje específicos
 */
export function useWaveData(location: MarineLocation) {
   const service = getOpenMeteoService();

   return useQuery({
      queryKey: ['waves', location.latitude, location.longitude],
      queryFn: async () => {
         const marine = await service.getMarineForecast({
            ...location,
            hourly: [
               'wave_height',
               'wave_direction',
               'wave_period',
               'swell_wave_height',
               'swell_wave_direction',
               'swell_wave_period',
            ],
            forecastDays: 3,
         });

         // Procesar datos para gráficos
         const hours = marine.hourly?.time?.slice(0, 72) ?? [];
         const waveHeights = marine.hourly?.wave_height?.slice(0, 72) ?? [];
         const swellHeights = marine.hourly?.swell_wave_height?.slice(0, 72) ?? [];

         return {
            raw: marine,
            chartData: hours.map((time, i) => ({
               time: new Date(time).toLocaleString(),
               waveHeight: waveHeights[i] ?? 0,
               swellHeight: swellHeights[i] ?? 0,
            })),
            maxWaveHeight: Math.max(...waveHeights.filter(Boolean)),
            avgWaveHeight: waveHeights.reduce((a, b) => a + (b ?? 0), 0) / waveHeights.length,
         };
      },
      staleTime: 600000, // 10 minutos
   });
}

export default useWeatherData;
