import { MarineWeather } from './OpenMeteoService';

export interface FishingPrediction {
   score: number; // 0 to 100
   label: 'Excelente' | 'Buena' | 'Regular' | 'Mala' | 'Peligrosa';
   summary: string;
   recommendation: string;
   species: string[];
   safetyAlert?: string;
}

export const FishingPredictionService = {
   analyze(weather: MarineWeather): FishingPrediction {
      let score = 70; // Base score
      const { wave_height, wind_speed, temperature } = weather;
      const species = [];
      let safetyAlert = undefined;

      // 1. Análisis de Olas (Wave Height in meters)
      if (wave_height < 0.5) {
         score += 20; // Mar calmo
      } else if (wave_height > 2.5) {
         score -= 50; // Mar muy agitado
         safetyAlert = "Olas peligrosas. Se recomienda regresar a puerto.";
      } else if (wave_height > 1.5) {
         score -= 20;
      }

      // 2. Análisis de Viento (Wind Speed in knots)
      if (wind_speed < 10) {
         score += 10;
      } else if (wind_speed > 25) {
         score -= 40;
         if (!safetyAlert) safetyAlert = "Viento fuerte. Precaución en maniobras.";
      } else if (wind_speed > 15) {
         score -= 10;
      }

      // 3. Análisis de Temperatura (Water Temp in C)
      // Rango ideal para muchas especies comerciales: 18-24
      if (temperature >= 18 && temperature <= 24) {
         score += 10;
         species.push("Atún", "Sardina", "Jurel");
      } else if (temperature < 15) {
         species.push("Merluza", "Bacalao");
      } else if (temperature > 25) {
         species.push("Dorado", "Marlin");
      }

      // Clamp score
      score = Math.max(0, Math.min(100, score));

      // Determinar etiqueta
      let label: FishingPrediction['label'] = 'Regular';
      if (score >= 90) label = 'Excelente';
      else if (score >= 70) label = 'Buena';
      else if (score >= 40) label = 'Regular';
      else if (score >= 20) label = 'Mala';
      else label = 'Peligrosa';

      // Generar resumen
      const summary = `Condiciones ${label.toLowerCase()}s para la pesca.`;
      let recommendation = "";

      switch (label) {
         case 'Excelente':
         case 'Buena':
            recommendation = "Momento ideal para salir. Alta actividad de peces en superficie.";
            break;
         case 'Regular':
            recommendation = "Pesca posible pero requiere paciencia. Buscar zonas protegidas.";
            break;
         case 'Mala':
            recommendation = "Baja actividad prevista. Considera mantenimiento de equipos.";
            break;
         case 'Peligrosa':
            recommendation = "EVITAR SALIDA. Condiciones de riesgo para la tripulación.";
            break;
      }

      return {
         score,
         label,
         summary,
         recommendation,
         species,
         safetyAlert
      };
   }
};
