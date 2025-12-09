/**
 * SARDIN-AI - Servicio Open-Meteo API
 * 
 * Integración con la API gratuita e ilimitada Open-Meteo
 * para datos meteorológicos marinos.
 * 
 * @see https://open-meteo.com/en/docs/marine-weather-api
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

// ============================================
// TIPOS
// ============================================

export interface MarineLocation {
   latitude: number;
   longitude: number;
}

export interface MarineForecastParams extends MarineLocation {
   hourly?: string[];
   daily?: string[];
   pastDays?: number;
   forecastDays?: number;
   timezone?: string;
}

export interface MarineHourlyData {
   time: string[];
   wave_height?: number[];
   wave_direction?: number[];
   wave_period?: number[];
   wind_wave_height?: number[];
   wind_wave_direction?: number[];
   wind_wave_period?: number[];
   swell_wave_height?: number[];
   swell_wave_direction?: number[];
   swell_wave_period?: number[];
   ocean_current_velocity?: number[];
   ocean_current_direction?: number[];
}

export interface MarineDailyData {
   time: string[];
   wave_height_max?: number[];
   wave_direction_dominant?: number[];
   wave_period_max?: number[];
   wind_wave_height_max?: number[];
   swell_wave_height_max?: number[];
}

export interface MarineForecastResponse {
   latitude: number;
   longitude: number;
   generationtime_ms: number;
   utc_offset_seconds: number;
   timezone: string;
   timezone_abbreviation: string;
   hourly?: MarineHourlyData;
   hourly_units?: Record<string, string>;
   daily?: MarineDailyData;
   daily_units?: Record<string, string>;
}

export interface WeatherForecastParams extends MarineLocation {
   hourly?: string[];
   daily?: string[];
   current?: string[];
   pastDays?: number;
   forecastDays?: number;
   timezone?: string;
}

export interface CurrentWeatherData {
   time: string;
   temperature_2m?: number;
   relative_humidity_2m?: number;
   apparent_temperature?: number;
   precipitation?: number;
   rain?: number;
   weather_code?: number;
   cloud_cover?: number;
   pressure_msl?: number;
   wind_speed_10m?: number;
   wind_direction_10m?: number;
   wind_gusts_10m?: number;
}

export interface HourlyWeatherData {
   time: string[];
   temperature_2m?: number[];
   relative_humidity_2m?: number[];
   precipitation?: number[];
   weather_code?: number[];
   cloud_cover?: number[];
   wind_speed_10m?: number[];
   wind_direction_10m?: number[];
   pressure_msl?: number[];
   visibility?: number[];
}

export interface WeatherForecastResponse {
   latitude: number;
   longitude: number;
   generationtime_ms: number;
   utc_offset_seconds: number;
   timezone: string;
   current?: CurrentWeatherData;
   current_units?: Record<string, string>;
   hourly?: HourlyWeatherData;
   hourly_units?: Record<string, string>;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const MARINE_API_BASE = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';

const DEFAULT_MARINE_HOURLY = [
   'wave_height',
   'wave_direction',
   'wave_period',
   'wind_wave_height',
   'swell_wave_height',
   'ocean_current_velocity',
   'ocean_current_direction',
];

const DEFAULT_WEATHER_HOURLY = [
   'temperature_2m',
   'relative_humidity_2m',
   'precipitation',
   'weather_code',
   'wind_speed_10m',
   'wind_direction_10m',
   'pressure_msl',
   'visibility',
];

const DEFAULT_WEATHER_CURRENT = [
   'temperature_2m',
   'relative_humidity_2m',
   'wind_speed_10m',
   'wind_direction_10m',
   'weather_code',
   'pressure_msl',
];

// ============================================
// SERVICIO PRINCIPAL
// ============================================

export class OpenMeteoService {
   private cache = new Map<string, { data: any; timestamp: number }>();
   private cacheTTL = 600000; // 10 minutos

   /**
    * Obtener pronóstico marino
    */
   async getMarineForecast(params: MarineForecastParams): Promise<MarineForecastResponse> {
      const cacheKey = `marine_${params.latitude}_${params.longitude}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const queryParams = new URLSearchParams({
         latitude: params.latitude.toString(),
         longitude: params.longitude.toString(),
         hourly: (params.hourly || DEFAULT_MARINE_HOURLY).join(','),
         forecast_days: (params.forecastDays || 7).toString(),
         timezone: params.timezone || 'auto',
      });

      const response = await fetch(`${MARINE_API_BASE}?${queryParams}`);

      if (!response.ok) {
         throw new Error(`Open-Meteo Marine API error: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
   }

   /**
    * Obtener pronóstico del tiempo
    */
   async getWeatherForecast(params: WeatherForecastParams): Promise<WeatherForecastResponse> {
      const cacheKey = `weather_${params.latitude}_${params.longitude}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const queryParams = new URLSearchParams({
         latitude: params.latitude.toString(),
         longitude: params.longitude.toString(),
         hourly: (params.hourly || DEFAULT_WEATHER_HOURLY).join(','),
         current: (params.current || DEFAULT_WEATHER_CURRENT).join(','),
         forecast_days: (params.forecastDays || 7).toString(),
         timezone: params.timezone || 'auto',
      });

      const response = await fetch(`${WEATHER_API_BASE}?${queryParams}`);

      if (!response.ok) {
         throw new Error(`Open-Meteo Weather API error: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
   }

   /**
    * Obtener condiciones actuales combinadas (clima + marino)
    */
   async getCurrentConditions(location: MarineLocation): Promise<{
      weather: WeatherForecastResponse;
      marine: MarineForecastResponse;
      summary: MaritimeSummary;
   }> {
      const [weather, marine] = await Promise.all([
         this.getWeatherForecast({ ...location, forecastDays: 1 }),
         this.getMarineForecast({ ...location, forecastDays: 1 }),
      ]);

      const summary = this.generateSummary(weather, marine);

      return { weather, marine, summary };
   }

   /**
    * Generar resumen de condiciones marítimas
    */
   private generateSummary(weather: WeatherForecastResponse, marine: MarineForecastResponse): MaritimeSummary {
      const currentTemp = weather.current?.temperature_2m ?? 0;
      const currentWind = weather.current?.wind_speed_10m ?? 0;
      const currentWaveHeight = marine.hourly?.wave_height?.[0] ?? 0;
      const currentPressure = weather.current?.pressure_msl ?? 1013;

      // Calcular nivel de riesgo
      let riskLevel: 'low' | 'medium' | 'high' | 'extreme' = 'low';
      if (currentWind > 45 || currentWaveHeight > 4) riskLevel = 'extreme';
      else if (currentWind > 30 || currentWaveHeight > 2.5) riskLevel = 'high';
      else if (currentWind > 20 || currentWaveHeight > 1.5) riskLevel = 'medium';

      // Calcular navegabilidad
      const navigationScore = Math.max(0, 100 - (currentWind * 1.5) - (currentWaveHeight * 15));

      return {
         timestamp: new Date().toISOString(),
         location: { latitude: weather.latitude, longitude: weather.longitude },
         temperature: currentTemp,
         windSpeed: currentWind,
         windDirection: weather.current?.wind_direction_10m ?? 0,
         waveHeight: currentWaveHeight,
         pressure: currentPressure,
         riskLevel,
         navigationScore: Math.round(navigationScore),
         recommendations: this.generateRecommendations(riskLevel, currentWind, currentWaveHeight),
      };
   }

   /**
    * Generar recomendaciones basadas en condiciones
    */
   private generateRecommendations(
      riskLevel: string,
      windSpeed: number,
      waveHeight: number
   ): string[] {
      const recommendations: string[] = [];

      if (riskLevel === 'extreme') {
         recommendations.push('⚠️ NO se recomienda navegación');
         recommendations.push('Buscar refugio en puerto más cercano');
         recommendations.push('Asegurar todos los equipos');
      } else if (riskLevel === 'high') {
         recommendations.push('Navegación con precaución extrema');
         recommendations.push('Mantener comunicación constante');
         recommendations.push('Preparar planes de contingencia');
      } else if (riskLevel === 'medium') {
         recommendations.push('Navegación con precaución');
         recommendations.push('Monitorear cambios en condiciones');
      } else {
         recommendations.push('Condiciones favorables para navegación');
         recommendations.push('Condiciones óptimas para pesca');
      }

      if (windSpeed > 25) {
         recommendations.push(`Viento fuerte (${windSpeed.toFixed(1)} km/h) - ajustar velocidad`);
      }

      if (waveHeight > 2) {
         recommendations.push(`Oleaje significativo (${waveHeight.toFixed(1)}m) - precaución`);
      }

      return recommendations;
   }

   // ============================================
   // CACHE
   // ============================================

   private getFromCache(key: string): any | null {
      const cached = this.cache.get(key);
      if (!cached) return null;

      if (Date.now() - cached.timestamp > this.cacheTTL) {
         this.cache.delete(key);
         return null;
      }

      return cached.data;
   }

   private setCache(key: string, data: any): void {
      this.cache.set(key, { data, timestamp: Date.now() });
   }

   public clearCache(): void {
      this.cache.clear();
   }
}

// ============================================
// TIPOS ADICIONALES
// ============================================

export interface MaritimeSummary {
   timestamp: string;
   location: MarineLocation;
   temperature: number;
   windSpeed: number;
   windDirection: number;
   waveHeight: number;
   pressure: number;
   riskLevel: 'low' | 'medium' | 'high' | 'extreme';
   navigationScore: number;
   recommendations: string[];
}

// ============================================
// SINGLETON
// ============================================

let serviceInstance: OpenMeteoService | null = null;

export function getOpenMeteoService(): OpenMeteoService {
   if (!serviceInstance) {
      serviceInstance = new OpenMeteoService();
   }
   return serviceInstance;
}

export default OpenMeteoService;
