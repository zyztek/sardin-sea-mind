import { useState, useEffect } from 'react';
import { OpenMeteoService, MarineWeather } from '@/services/OpenMeteoService';

interface RealWeatherState {
   weather: MarineWeather | null;
   loading: boolean;
   error: string | null;
}

export const useRealWeather = (coordinates: { lat: number; lng: number } | null) => {
   const [state, setState] = useState<RealWeatherState>({
      weather: null,
      loading: false,
      error: null,
   });

   useEffect(() => {
      if (!coordinates) return;

      const fetchWeather = async () => {
         setState(prev => ({ ...prev, loading: true, error: null }));
         try {
            const data = await OpenMeteoService.getMarineForecast(coordinates.lat, coordinates.lng);
            setState({
               weather: data,
               loading: false,
               error: null,
            });
         } catch (err) {
            setState(prev => ({
               ...prev,
               loading: false,
               error: 'Failed to fetch weather data',
            }));
         }
      };

      fetchWeather();

      // Refresh every 15 minutes
      const interval = setInterval(fetchWeather, 15 * 60 * 1000);
      return () => clearInterval(interval);

   }, [coordinates?.lat, coordinates?.lng]);

   return state;
};
