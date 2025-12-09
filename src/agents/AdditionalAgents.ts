/**
 * SARDIN-AI - Agente de Mercado
 * 
 * Analiza precios de mercado y oportunidades comerciales.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

import { BaseAgent, AgentConfig, AgentInsight } from './AgentSystem';

export class MarketAgent extends BaseAgent {
   constructor() {
      super({
         name: 'MarketAI',
         domain: 'Análisis de mercado pesquero',
         description: 'Monitorea precios de pescado, demanda y oportunidades comerciales',
         capabilities: [
            {
               name: 'Análisis de precios',
               description: 'Rastrea precios en diferentes mercados',
               inputTypes: ['market_data', 'species'],
               outputTypes: ['price_trends', 'forecasts'],
            },
            {
               name: 'Detección de oportunidades',
               description: 'Identifica mejores momentos para vender',
               inputTypes: ['inventory', 'prices', 'demand'],
               outputTypes: ['recommendations', 'alerts'],
            },
         ],
         dataAPIs: [
            {
               name: 'FAO FishStatJ',
               baseUrl: 'https://www.fao.org/fishery/statistics',
               freeLimit: 'Ilimitado',
            },
         ],
         updateInterval: 1800000, // 30 minutos
         priority: 'medium',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      const insights: AgentInsight[] = [];

      // Simular análisis de mercado
      const marketAnalysis = this.analyzeMarket();

      if (marketAnalysis.priceChange > 5) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'market_opportunity',
            title: `Precio de ${marketAnalysis.species} en Alza`,
            description: `El precio de ${marketAnalysis.species} ha subido ${marketAnalysis.priceChange}% en las últimas 24 horas. Considerar venta inmediata.`,
            confidence: 0.82,
            priority: 'high',
            data: marketAnalysis,
            recommendations: [
               `Vender ${marketAnalysis.species} lo antes posible`,
               'Contactar compradores habituales',
               'Revisar inventario disponible',
            ],
         });
      }

      if (marketAnalysis.demandIncrease) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'demand_alert',
            title: 'Aumento de Demanda Detectado',
            description: `La demanda de ${marketAnalysis.highDemandSpecies} ha aumentado ${marketAnalysis.demandPercent}% esta semana.`,
            confidence: 0.75,
            priority: 'medium',
            data: marketAnalysis,
            recommendations: [
               `Priorizar captura de ${marketAnalysis.highDemandSpecies}`,
               'Ajustar zonas de pesca',
            ],
         });
      }

      return insights;
   }

   private analyzeMarket(): {
      species: string;
      priceChange: number;
      currentPrice: number;
      demandIncrease: boolean;
      highDemandSpecies: string;
      demandPercent: number;
   } {
      const species = ['Sardina', 'Atún', 'Merluza', 'Camarón', 'Pulpo'];
      const randomSpecies = species[Math.floor(Math.random() * species.length)];

      return {
         species: randomSpecies,
         priceChange: Math.round((Math.random() - 0.3) * 20),
         currentPrice: Math.round(Math.random() * 50 + 10),
         demandIncrease: Math.random() > 0.6,
         highDemandSpecies: species[Math.floor(Math.random() * species.length)],
         demandPercent: Math.round(Math.random() * 30 + 5),
      };
   }
}

/**
 * SARDIN-AI - Agente de Seguridad
 * 
 * Monitorea seguridad y detecta anomalías.
 */
export class SecurityAgent extends BaseAgent {
   constructor() {
      super({
         name: 'SecurityAI',
         domain: 'Seguridad marítima',
         description: 'Monitorea seguridad de la embarcación y detecta situaciones de riesgo',
         capabilities: [
            {
               name: 'Detección de anomalías',
               description: 'Identifica patrones inusuales en sensores',
               inputTypes: ['sensor_data', 'gps', 'ais'],
               outputTypes: ['anomalies', 'alerts'],
            },
            {
               name: 'Monitoreo de perímetro',
               description: 'Detecta embarcaciones cercanas sospechosas',
               inputTypes: ['ais_data', 'radar'],
               outputTypes: ['vessel_alerts', 'recommendations'],
            },
         ],
         dataAPIs: [],
         updateInterval: 60000, // 1 minuto (alta frecuencia por seguridad)
         priority: 'critical',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      const insights: AgentInsight[] = [];

      // Simular análisis de seguridad
      const securityCheck = this.performSecurityCheck();

      if (securityCheck.anomalyDetected) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'security_alert',
            title: `Anomalía Detectada: ${securityCheck.anomalyType}`,
            description: securityCheck.description,
            confidence: securityCheck.confidence,
            priority: securityCheck.severity,
            data: securityCheck,
            recommendations: securityCheck.recommendations,
         });
      }

      return insights;
   }

   private performSecurityCheck(): {
      anomalyDetected: boolean;
      anomalyType: string;
      description: string;
      confidence: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      recommendations: string[];
   } {
      // Simular detección (90% normal, 10% anomalía)
      const hasAnomaly = Math.random() < 0.1;

      if (!hasAnomaly) {
         return {
            anomalyDetected: false,
            anomalyType: 'none',
            description: 'Sin anomalías detectadas',
            confidence: 1,
            severity: 'low',
            recommendations: [],
         };
      }

      const anomalies = [
         {
            type: 'Embarcación desconocida cercana',
            description: 'Embarcación sin AIS detectada a 2km. Verificar intenciones.',
            severity: 'medium' as const,
            recommendations: ['Mantener distancia', 'Documentar con fotos', 'Informar a capitanía'],
         },
         {
            type: 'Desviación de ruta',
            description: 'La embarcación se ha desviado 5km de la ruta planificada.',
            severity: 'low' as const,
            recommendations: ['Verificar ruta actual', 'Confirmar con capitán'],
         },
         {
            type: 'Sensor fuera de rango',
            description: 'El sensor de temperatura del motor muestra valores anómalos.',
            severity: 'high' as const,
            recommendations: ['Inspeccionar motor inmediatamente', 'Preparar sistema de respaldo'],
         },
      ];

      const randomAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];

      return {
         anomalyDetected: true,
         anomalyType: randomAnomaly.type,
         description: randomAnomaly.description,
         confidence: 0.7 + Math.random() * 0.25,
         severity: randomAnomaly.severity,
         recommendations: randomAnomaly.recommendations,
      };
   }
}

/**
 * SARDIN-AI - Agente de Flota
 * 
 * Coordina operaciones entre múltiples embarcaciones.
 */
export class FleetAgent extends BaseAgent {
   constructor() {
      super({
         name: 'FleetAI',
         domain: 'Coordinación de flota',
         description: 'Optimiza operaciones coordinadas entre múltiples embarcaciones',
         capabilities: [
            {
               name: 'Asignación de zonas',
               description: 'Distribuye zonas de pesca entre embarcaciones',
               inputTypes: ['fleet_positions', 'fishing_zones', 'quotas'],
               outputTypes: ['zone_assignments', 'schedules'],
            },
            {
               name: 'Comunicación de flota',
               description: 'Sincroniza información entre embarcaciones',
               inputTypes: ['vessel_data', 'insights'],
               outputTypes: ['broadcasts', 'alerts'],
            },
         ],
         dataAPIs: [],
         updateInterval: 300000, // 5 minutos
         priority: 'medium',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      const insights: AgentInsight[] = [];

      // Simular coordinación de flota
      const fleetStatus = this.analyzeFleet();

      if (fleetStatus.optimizationAvailable) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'fleet_optimization',
            title: 'Redistribución de Flota Sugerida',
            description: `${fleetStatus.vesselsToMove} embarcaciones podrían reubicarse para mejorar captura total en ${fleetStatus.expectedImprovement}%`,
            confidence: 0.78,
            priority: 'medium',
            data: fleetStatus,
            recommendations: [
               `Mover ${fleetStatus.vesselNames.join(', ')} a zona ${fleetStatus.targetZone}`,
               'Coordinar tiempos de llegada',
               'Actualizar cuotas asignadas',
            ],
         });
      }

      return insights;
   }

   private analyzeFleet(): {
      totalVessels: number;
      activeVessels: number;
      optimizationAvailable: boolean;
      vesselsToMove: number;
      expectedImprovement: number;
      vesselNames: string[];
      targetZone: string;
   } {
      return {
         totalVessels: 5,
         activeVessels: 4,
         optimizationAvailable: Math.random() > 0.7,
         vesselsToMove: Math.floor(Math.random() * 3) + 1,
         expectedImprovement: Math.round(Math.random() * 20 + 5),
         vesselNames: ['Estrella del Mar', 'Pescador Valiente'],
         targetZone: `Zona ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      };
   }
}

export { MarketAgent, SecurityAgent, FleetAgent };
