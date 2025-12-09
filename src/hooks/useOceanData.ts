/**
 * SARDIN-AI - Hook para datos oceanográficos NOAA
 * 
 * Hook React para integrar datos de NOAA en componentes.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

import { useQuery } from '@tanstack/react-query';
import {
   getNOAAService,
   SeaSurfaceTemperature,
   ChlorophyllData,
   FishingPrediction
} from '@/services/apis/NOAAService';

interface OceanLocation {
   latitude: number;
   longitude: number;
}

/**
 * Hook para temperatura superficial del mar
 */
export function useSeaSurfaceTemperature(location: OceanLocation | null) {
   const service = getNOAAService();

   return useQuery({
      queryKey: ['noaa', 'sst', location?.latitude, location?.longitude],
      queryFn: async (): Promise<SeaSurfaceTemperature | null> => {
         if (!location) return null;
         return service.getSeaSurfaceTemperature(location);
      },
      enabled: location !== null,
      staleTime: 3600000, // 1 hora
      refetchInterval: 3600000,
   });
}

/**
 * Hook para datos de clorofila
 */
export function useChlorophyll(location: OceanLocation | null) {
   const service = getNOAAService();

   return useQuery({
      queryKey: ['noaa', 'chlorophyll', location?.latitude, location?.longitude],
      queryFn: async (): Promise<ChlorophyllData | null> => {
         if (!location) return null;
         return service.getChlorophyll(location);
      },
      enabled: location !== null,
      staleTime: 3600000,
   });
}

/**
 * Hook para predicción de pesca
 */
export function useFishingPrediction(location: OceanLocation | null) {
   const service = getNOAAService();

   return useQuery({
      queryKey: ['noaa', 'fishing', location?.latitude, location?.longitude],
      queryFn: async (): Promise<FishingPrediction> => {
         if (!location) throw new Error('Location required');
         return service.getFishingPrediction(location);
      },
      enabled: location !== null,
      staleTime: 1800000, // 30 min
   });
}

/**
 * Hook para hotspots de pesca en área
 */
export function useFishingHotspots(location: OceanLocation | null) {
   const service = getNOAAService();

   return useQuery({
      queryKey: ['noaa', 'hotspots', location?.latitude, location?.longitude],
      queryFn: async (): Promise<FishingPrediction[]> => {
         if (!location) throw new Error('Location required');
         return service.getTopFishingHotspots(location.latitude, location.longitude);
      },
      enabled: location !== null,
      staleTime: 3600000,
      refetchOnWindowFocus: false, // Evitar refetch frecuente (operación pesada)
   });
}

/**
 * Hook combinado para todos los datos oceanográficos
 */
export function useOceanData(location: OceanLocation | null) {
   const sst = useSeaSurfaceTemperature(location);
   const chlorophyll = useChlorophyll(location);
   const fishingPrediction = useFishingPrediction(location);

   return {
      seaSurfaceTemperature: sst.data,
      chlorophyll: chlorophyll.data,
      fishingPrediction: fishingPrediction.data,
      isLoading: sst.isLoading || chlorophyll.isLoading || fishingPrediction.isLoading,
      isError: sst.isError || chlorophyll.isError || fishingPrediction.isError,
      refetch: () => {
         sst.refetch();
         chlorophyll.refetch();
         fishingPrediction.refetch();
      },
   };
}

export default useOceanData;
