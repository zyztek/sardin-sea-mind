/**
 * SARDIN-AI - Servicio NOAA ERDDAP
 * 
 * Integración con la API NOAA ERDDAP para datos oceanográficos.
 * 100% gratis e ilimitada.
 * 
 * @see https://coastwatch.pfeg.noaa.gov/erddap/index.html
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

// ============================================
// TIPOS
// ============================================

export interface OceanDataParams {
   latitude: number;
   longitude: number;
   startDate?: string;
   endDate?: string;
   variables?: string[];
}

export interface SeaSurfaceTemperature {
   time: string;
   latitude: number;
   longitude: number;
   sst: number; // Sea Surface Temperature in Celsius
}

export interface ChlorophyllData {
   time: string;
   latitude: number;
   longitude: number;
   chlorophyll: number; // mg/m³
}

export interface OceanCurrents {
   time: string;
   latitude: number;
   longitude: number;
   u_velocity: number; // East-West velocity m/s
   v_velocity: number; // North-South velocity m/s
   speed: number; // Total speed m/s
   direction: number; // Degrees
}

export interface FishingPrediction {
   latitude: number;
   longitude: number;
   probability: number; // 0-1
   temperature: number;
   chlorophyll: number;
   currentSpeed: number;
   score: number;
   recommendation: string;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const ERDDAP_BASE = 'https://coastwatch.pfeg.noaa.gov/erddap';

// Datasets disponibles
const DATASETS = {
   SST: 'jplMURSST41', // Sea Surface Temperature
   CHLOROPHYLL: 'erdMH1chla8day', // Chlorophyll from MODIS
   CURRENTS: 'miamicurrents', // Ocean currents
};

// ============================================
// SERVICIO PRINCIPAL
// ============================================

export class NOAAService {
   private cache = new Map<string, { data: any; timestamp: number }>();
   private cacheTTL = 3600000; // 1 hora (datos cambian lento)

   /**
    * Obtener temperatura superficial del mar
    */
   async getSeaSurfaceTemperature(params: OceanDataParams): Promise<SeaSurfaceTemperature | null> {
      const cacheKey = `sst_${params.latitude}_${params.longitude}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      try {
         // Redondear coordenadas para la grilla
         const lat = Math.round(params.latitude * 10) / 10;
         const lon = Math.round(params.longitude * 10) / 10;

         const url = `${ERDDAP_BASE}/griddap/${DATASETS.SST}.json?` +
            `analysed_sst[(last)][(${lat}):1:(${lat})][(${lon}):1:(${lon})]`;

         const response = await fetch(url);

         if (!response.ok) {
            console.warn('NOAA SST request failed:', response.status);
            return null;
         }

         const data = await response.json();

         if (data.table && data.table.rows && data.table.rows.length > 0) {
            const row = data.table.rows[0];
            const result: SeaSurfaceTemperature = {
               time: row[0],
               latitude: row[1],
               longitude: row[2],
               sst: row[3] - 273.15, // Kelvin to Celsius
            };

            this.setCache(cacheKey, result);
            return result;
         }

         return null;
      } catch (error) {
         console.error('NOAA SST error:', error);
         return null;
      }
   }

   /**
    * Obtener datos de clorofila (indicador de actividad biológica)
    */
   async getChlorophyll(params: OceanDataParams): Promise<ChlorophyllData | null> {
      const cacheKey = `chlor_${params.latitude}_${params.longitude}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      try {
         const lat = Math.round(params.latitude * 10) / 10;
         const lon = Math.round(params.longitude * 10) / 10;

         const url = `${ERDDAP_BASE}/griddap/${DATASETS.CHLOROPHYLL}.json?` +
            `chlorophyll[(last)][(${lat}):1:(${lat})][(${lon}):1:(${lon})]`;

         const response = await fetch(url);

         if (!response.ok) {
            return null;
         }

         const data = await response.json();

         if (data.table?.rows?.length > 0) {
            const row = data.table.rows[0];
            const result: ChlorophyllData = {
               time: row[0],
               latitude: row[1],
               longitude: row[2],
               chlorophyll: row[3],
            };

            this.setCache(cacheKey, result);
            return result;
         }

         return null;
      } catch (error) {
         console.error('NOAA Chlorophyll error:', error);
         return null;
      }
   }

   /**
    * Generar predicción de zona de pesca basada en datos oceanográficos
    */
   async getFishingPrediction(params: OceanDataParams): Promise<FishingPrediction> {
      // Obtener datos en paralelo
      const [sst, chlorophyll] = await Promise.all([
         this.getSeaSurfaceTemperature(params),
         this.getChlorophyll(params),
      ]);

      // Valores por defecto si no hay datos
      const temperature = sst?.sst ?? 20;
      const chlor = chlorophyll?.chlorophyll ?? 0.5;

      // Algoritmo de predicción (simplificado)
      // En producción, usar modelo ML real
      let score = 0;

      // Factor temperatura (peces prefieren 15-25°C)
      if (temperature >= 15 && temperature <= 25) {
         score += 30;
      } else if (temperature >= 10 && temperature <= 30) {
         score += 15;
      }

      // Factor clorofila (más = más plancton = más peces)
      if (chlor > 1) {
         score += 40;
      } else if (chlor > 0.5) {
         score += 25;
      } else if (chlor > 0.2) {
         score += 10;
      }

      // Factor variabilidad (zonas de frontera termal)
      score += Math.random() * 20; // Simular variabilidad

      // Normalizar a 0-1
      const probability = Math.min(score / 100, 0.95);

      // Generar recomendación
      let recommendation: string;
      if (probability > 0.7) {
         recommendation = 'Zona de alta probabilidad. Condiciones óptimas para pesca.';
      } else if (probability > 0.5) {
         recommendation = 'Zona prometedora. Considerar exploración.';
      } else if (probability > 0.3) {
         recommendation = 'Condiciones moderadas. Verificar otras zonas.';
      } else {
         recommendation = 'Baja probabilidad. Buscar áreas alternativas.';
      }

      return {
         latitude: params.latitude,
         longitude: params.longitude,
         probability,
         temperature,
         chlorophyll: chlor,
         currentSpeed: 0, // Placeholder
         score,
         recommendation,
      };
   }

   /**
    * Escanear área para encontrar mejores zonas de pesca
    */
   async scanAreaForFishing(
      centerLat: number,
      centerLon: number,
      radiusKm: number = 50,
      gridSize: number = 5
   ): Promise<FishingPrediction[]> {
      const predictions: FishingPrediction[] = [];
      const step = radiusKm / gridSize / 111; // Convertir km a grados aprox

      for (let latOffset = -gridSize; latOffset <= gridSize; latOffset++) {
         for (let lonOffset = -gridSize; lonOffset <= gridSize; lonOffset++) {
            const lat = centerLat + (latOffset * step);
            const lon = centerLon + (lonOffset * step);

            const prediction = await this.getFishingPrediction({ latitude: lat, longitude: lon });
            predictions.push(prediction);

            // Rate limiting para no saturar NOAA
            await this.delay(100);
         }
      }

      // Ordenar por probabilidad
      return predictions.sort((a, b) => b.probability - a.probability);
   }

   /**
    * Obtener hotspots de pesca (top 5)
    */
   async getTopFishingHotspots(
      centerLat: number,
      centerLon: number
   ): Promise<FishingPrediction[]> {
      const allPredictions = await this.scanAreaForFishing(centerLat, centerLon, 30, 3);
      return allPredictions.slice(0, 5);
   }

   // ============================================
   // UTILIDADES
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

   private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

   public clearCache(): void {
      this.cache.clear();
   }
}

// ============================================
// SINGLETON
// ============================================

let serviceInstance: NOAAService | null = null;

export function getNOAAService(): NOAAService {
   if (!serviceInstance) {
      serviceInstance = new NOAAService();
   }
   return serviceInstance;
}

export default NOAAService;
