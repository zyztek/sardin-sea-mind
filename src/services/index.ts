/**
 * SARDIN-AI - Index de Servicios
 * 
 * Exporta todos los servicios de APIs y utilidades.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

// APIs
export { OpenMeteoService, getOpenMeteoService } from './apis/OpenMeteoService';
export { NOAAService, getNOAAService } from './apis/NOAAService';

// Base de recursos
export {
   resourceDatabase,
   findByCategory,
   findByTag,
   findEssential,
   findByMinQuality,
   findForVideoProduction,
   getResourceSummary,
} from './ResourceDatabase';

// Tipos de OpenMeteo
export type {
   MarineLocation,
   MarineForecastParams,
   MarineForecastResponse,
   WeatherForecastParams,
   WeatherForecastResponse,
   MaritimeSummary,
} from './apis/OpenMeteoService';

// Tipos de NOAA
export type {
   OceanDataParams,
   SeaSurfaceTemperature,
   ChlorophyllData,
   OceanCurrents,
   FishingPrediction,
} from './apis/NOAAService';

// Tipos de recursos
export type {
   FreeResource,
   ResourceCategory,
   ResourceDatabase,
} from './ResourceDatabase';
