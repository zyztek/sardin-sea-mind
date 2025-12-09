/**
 * SARDIN-AI - Index de Agentes
 * 
 * Exporta todos los agentes y el orquestador.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

// Sistema base
export {
   BaseAgent,
   AgentOrchestrator,
   getOrchestrator,
   FishingAgent,
   NavigationAgent,
   WeatherAgent,
   MaintenanceAgent,
} from './AgentSystem';

// Agentes adicionales
export {
   MarketAgent,
   SecurityAgent,
   FleetAgent,
} from './AdditionalAgents';

// Tipos
export type {
   AgentCapability,
   AgentConfig,
   DataAPIConfig,
   AgentInsight,
   AgentStatus,
} from './AgentSystem';

// Registro de todos los agentes disponibles
export const AVAILABLE_AGENTS = [
   { id: 'fishing', name: 'FishingAI', domain: 'Predicción de pesca' },
   { id: 'navigation', name: 'NavigationAI', domain: 'Optimización de rutas' },
   { id: 'weather', name: 'WeatherAI', domain: 'Pronóstico climático' },
   { id: 'maintenance', name: 'MaintenanceAI', domain: 'Mantenimiento predictivo' },
   { id: 'market', name: 'MarketAI', domain: 'Análisis de mercado' },
   { id: 'security', name: 'SecurityAI', domain: 'Seguridad marítima' },
   { id: 'fleet', name: 'FleetAI', domain: 'Coordinación de flota' },
] as const;

export type AgentId = typeof AVAILABLE_AGENTS[number]['id'];
