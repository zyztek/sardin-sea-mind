/**
 * Tests for AgentSystem
 * 
 * @author SARDIN-AI Testing Suite
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
   FishingAgent,
   NavigationAgent,
   WeatherAgent,
   MaintenanceAgent,
   AgentOrchestrator,
   getOrchestrator,
} from '@/agents/AgentSystem';

describe('AgentSystem', () => {
   describe('FishingAgent', () => {
      let agent: FishingAgent;

      beforeEach(() => {
         agent = new FishingAgent();
      });

      afterEach(() => {
         agent.stop();
      });

      it('should have correct configuration', () => {
         const config = agent.getConfig();

         expect(config.name).toBe('FishingAI');
         expect(config.domain).toBe('Predicción de zonas de pesca');
         expect(config.priority).toBe('high');
         expect(config.updateInterval).toBe(300000); // 5 minutes
      });

      it('should start with idle status', () => {
         const status = agent.getStatus();

         expect(status.status).toBe('idle');
         expect(status.insightsGenerated).toBe(0);
         expect(status.errorCount).toBe(0);
      });

      it('should have data APIs configured', () => {
         const config = agent.getConfig();

         expect(config.dataAPIs).toHaveLength(2);
         expect(config.dataAPIs[0].name).toBe('NOAA ERDDAP');
         expect(config.dataAPIs[1].name).toBe('Open-Meteo Marine');
      });
   });

   describe('NavigationAgent', () => {
      let agent: NavigationAgent;

      beforeEach(() => {
         agent = new NavigationAgent();
      });

      afterEach(() => {
         agent.stop();
      });

      it('should have correct configuration', () => {
         const config = agent.getConfig();

         expect(config.name).toBe('NavigationAI');
         expect(config.priority).toBe('critical');
         expect(config.updateInterval).toBe(60000); // 1 minute
      });
   });

   describe('WeatherAgent', () => {
      let agent: WeatherAgent;

      beforeEach(() => {
         agent = new WeatherAgent();
      });

      afterEach(() => {
         agent.stop();
      });

      it('should have correct configuration', () => {
         const config = agent.getConfig();

         expect(config.name).toBe('WeatherAI');
         expect(config.priority).toBe('high');
         expect(config.updateInterval).toBe(600000); // 10 minutes
      });
   });

   describe('MaintenanceAgent', () => {
      let agent: MaintenanceAgent;

      beforeEach(() => {
         agent = new MaintenanceAgent();
      });

      afterEach(() => {
         agent.stop();
      });

      it('should have correct configuration', () => {
         const config = agent.getConfig();

         expect(config.name).toBe('MaintenanceAI');
         expect(config.priority).toBe('medium');
         expect(config.updateInterval).toBe(900000); // 15 minutes
      });
   });

   describe('AgentOrchestrator', () => {
      let orchestrator: AgentOrchestrator;

      beforeEach(() => {
         orchestrator = new AgentOrchestrator();
      });

      afterEach(() => {
         orchestrator.stopAll();
      });

      it('should have 4 default agents', () => {
         expect(orchestrator.getAgentCount()).toBe(4);
      });

      it('should return all agent statuses', () => {
         const statuses = orchestrator.getAllStatus();

         expect(statuses).toHaveLength(4);
         expect(statuses.map(s => s.name)).toContain('FishingAI');
         expect(statuses.map(s => s.name)).toContain('NavigationAI');
         expect(statuses.map(s => s.name)).toContain('WeatherAI');
         expect(statuses.map(s => s.name)).toContain('MaintenanceAI');
      });

      it('should get agent by name', () => {
         const fishingAgent = orchestrator.getAgent('FishingAI');

         expect(fishingAgent).toBeDefined();
         expect(fishingAgent?.getConfig().name).toBe('FishingAI');
      });

      it('should return undefined for unknown agent', () => {
         const unknownAgent = orchestrator.getAgent('UnknownAgent');

         expect(unknownAgent).toBeUndefined();
      });
   });

   describe('getOrchestrator singleton', () => {
      it('should return the same instance', () => {
         const instance1 = getOrchestrator();
         const instance2 = getOrchestrator();

         expect(instance1).toBe(instance2);
      });
   });
});
