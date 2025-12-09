/**
 * Tests for NOAAService
 * 
 * @author SARDIN-AI Testing Suite
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NOAAService, getNOAAService } from '@/services/apis/NOAAService';

describe('NOAAService', () => {
   let service: NOAAService;

   beforeEach(() => {
      service = new NOAAService();
      vi.clearAllMocks();
   });

   afterEach(() => {
      service.clearCache();
   });

   describe('getSeaSurfaceTemperature', () => {
      it('should parse NOAA response correctly', async () => {
         const mockResponse = {
            table: {
               columnNames: ['time', 'latitude', 'longitude', 'analysed_sst'],
               rows: [['2024-12-09T00:00:00Z', 42.0, -71.0, 288.15]], // 15°C in Kelvin
            },
         };

         vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
         } as Response);

         const result = await service.getSeaSurfaceTemperature({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(result).toBeDefined();
         expect(result?.sst).toBeCloseTo(15, 0); // Kelvin to Celsius
      });

      it('should return null on API error', async () => {
         vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
            status: 500,
         } as Response);

         const result = await service.getSeaSurfaceTemperature({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(result).toBeNull();
      });

      it('should cache results', async () => {
         const mockResponse = {
            table: {
               columnNames: ['time', 'latitude', 'longitude', 'analysed_sst'],
               rows: [['2024-12-09T00:00:00Z', 42.0, -71.0, 288.15]],
            },
         };

         vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
         } as Response);

         await service.getSeaSurfaceTemperature({ latitude: 42.36, longitude: -71.06 });
         await service.getSeaSurfaceTemperature({ latitude: 42.36, longitude: -71.06 });

         expect(global.fetch).toHaveBeenCalledTimes(1);
      });
   });

   describe('getChlorophyll', () => {
      it('should parse chlorophyll data correctly', async () => {
         const mockResponse = {
            table: {
               columnNames: ['time', 'latitude', 'longitude', 'chlorophyll'],
               rows: [['2024-12-09T00:00:00Z', 42.0, -71.0, 1.5]],
            },
         };

         vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
         } as Response);

         const result = await service.getChlorophyll({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(result).toBeDefined();
         expect(result?.chlorophyll).toBe(1.5);
      });
   });

   describe('getFishingPrediction', () => {
      it('should generate prediction with valid probability', async () => {
         // Mock both SST and Chlorophyll calls
         vi.mocked(global.fetch)
            .mockResolvedValueOnce({
               ok: true,
               json: () => Promise.resolve({
                  table: { rows: [['2024-12-09', 42, -71, 293.15]] }, // 20°C
               }),
            } as Response)
            .mockResolvedValueOnce({
               ok: true,
               json: () => Promise.resolve({
                  table: { rows: [['2024-12-09', 42, -71, 1.2]] },
               }),
            } as Response);

         const result = await service.getFishingPrediction({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(result.probability).toBeGreaterThanOrEqual(0);
         expect(result.probability).toBeLessThanOrEqual(1);
         expect(result.temperature).toBeDefined();
         expect(result.chlorophyll).toBeDefined();
         expect(result.recommendation).toBeDefined();
      });

      it('should provide recommendation based on probability', async () => {
         vi.mocked(global.fetch).mockResolvedValue({
            ok: false,
         } as Response);

         const result = await service.getFishingPrediction({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(typeof result.recommendation).toBe('string');
         expect(result.recommendation.length).toBeGreaterThan(0);
      });
   });

   describe('getNOAAService singleton', () => {
      it('should return the same instance', () => {
         const instance1 = getNOAAService();
         const instance2 = getNOAAService();

         expect(instance1).toBe(instance2);
      });
   });
});
