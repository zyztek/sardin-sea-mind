
export interface MarineWeather {
   wave_height: number;
   wind_speed: number;
   wind_direction: number;
   temperature: number;
   timestamp: string;
}

export const OpenMeteoService = {
   async getMarineForecast(lat: number, lng: number): Promise<MarineWeather> {
      try {
         // Marine API params:
         // wave_height_max (cm -> m check unit), wind_speed_10m (km/h -> knots), wind_direction_10m, temperature_2m
         const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wind_wave_height,swell_wave_height,wind_speed_10m,wind_direction_10m,temperature_2m&wind_speed_unit=kn`;

         const response = await fetch(url);

         if (!response.ok) {
            throw new Error('Weather service unavailable');
         }

         const data = await response.json();
         const current = data.current;

         return {
            wave_height: current.wave_height || 0,
            wind_speed: current.wind_speed_10m || 0,
            wind_direction: current.wind_direction_10m || 0,
            temperature: current.temperature_2m || 0,
            timestamp: current.time,
         };
      } catch (error) {
         console.error('Error fetching marine weather:', error);
         throw error;
      }
   }
};
