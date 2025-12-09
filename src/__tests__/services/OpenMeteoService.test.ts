/**
 * Tests for OpenMeteoService
 * 
 * @author SARDIN-AI Testing Suite
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenMeteoService, getOpenMeteoService } from '@/services/apis/OpenMeteoService';

describe('OpenMeteoService', () => {
   let service: OpenMeteoService;

   beforeEach(() => {
      service = new OpenMeteoService();
      vi.clearAllMocks();
   });

   afterEach(() => {
      service.clearCache();
   });

   describe('getMarineForecast', () => {
      it('should make correct API request', async () => {
         const mockResponse = {
            latitude: 42.375,
            longitude: -71.0,
            hourly: {
               time: ['2024-12-09T00:00'],
               wave_height: [1.2],
            },
         };

         vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
         } as Response);

         const result = await service.getMarineForecast({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(global.fetch).toHaveBeenCalledTimes(1);
         expect(result.latitude).toBe(42.375);
      });

      it('should throw on API error', async () => {
         vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
            status: 500,
         } as Response);

         await expect(
            service.getMarineForecast({ latitude: 42.36, longitude: -71.06 })
         ).rejects.toThrow('Open-Meteo Marine API error: 500');
      });

      it('should cache results', async () => {
         const mockResponse = {
            latitude: 42.375,
            longitude: -71.0,
            hourly: { time: [], wave_height: [] },
         };

         vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
         } as Response);

         // First call
         await service.getMarineForecast({ latitude: 42.36, longitude: -71.06 });

         // Second call with same params
         await service.getMarineForecast({ latitude: 42.36, longitude: -71.06 });

         // Should only have called fetch once due to caching
         expect(global.fetch).toHaveBeenCalledTimes(1);
      });
   });

   describe('getWeatherForecast', () => {
      it('should make correct API request', async () => {
         const mockResponse = {
            latitude: 42.375,
            longitude: -71.0,
            current: {
               temperature_2m: 15.5,
               wind_speed_10m: 20,
            },
         };

         vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
         } as Response);

         const result = await service.getWeatherForecast({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(result.current?.temperature_2m).toBe(15.5);
      });
   });

   describe('getCurrentConditions', () => {
      it('should combine weather and marine data', async () => {
         const mockWeather = {
            latitude: 42.375,
            longitude: -71.0,
            current: {
               temperature_2m: 15,
               wind_speed_10m: 20,
               wind_direction_10m: 180,
               pressure_msl: 1013,
            },
         };

         const mockMarine = {
            latitude: 42.375,
            longitude: -71.0,
            hourly: {
               time: ['2024-12-09T00:00'],
               wave_height: [1.5],
            },
         };

         vi.mocked(global.fetch)
            .mockResolvedValueOnce({
               ok: true,
               json: () => Promise.resolve(mockWeather),
            } as Response)
            .mockResolvedValueOnce({
               ok: true,
               json: () => Promise.resolve(mockMarine),
            } as Response);

         const result = await service.getCurrentConditions({
            latitude: 42.36,
            longitude: -71.06,
         });

         expect(result.summary).toBeDefined();
         expect(result.summary.temperature).toBe(15);
         expect(result.summary.windSpeed).toBe(20);
         expect(result.summary.waveHeight).toBe(1.5);
         expect(result.summary.riskLevel).toBeDefined();
         expect(result.summary.navigationScore).toBeDefined();
         expect(result.summary.recommendations).toBeInstanceOf(Array);
      });
   });

   describe('getOpenMeteoService singleton', () => {
      it('should return the same instance', () => {
         const instance1 = getOpenMeteoService();
         const instance2 = getOpenMeteoService();

         expect(instance1).toBe(instance2);
      });
   });
});
