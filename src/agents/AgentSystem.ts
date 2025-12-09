/**
 * SARDIN-AI - Sistema Multi-Agente
 * 
 * Arquitectura de agentes especializados que operan de forma autónoma
 * y colaboran para optimizar operaciones marítimas.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

// ============================================
// TIPOS BASE
// ============================================

export interface AgentCapability {
   name: string;
   description: string;
   inputTypes: string[];
   outputTypes: string[];
}

export interface AgentConfig {
   name: string;
   domain: string;
   description: string;
   capabilities: AgentCapability[];
   dataAPIs: DataAPIConfig[];
   updateInterval: number; // ms
   priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataAPIConfig {
   name: string;
   baseUrl: string;
   freeLimit: string;
   apiKey?: string;
}

export interface AgentInsight {
   agentId: string;
   agentName: string;
   timestamp: string;
   type: string;
   title: string;
   description: string;
   confidence: number;
   priority: 'low' | 'medium' | 'high' | 'critical';
   data?: Record<string, any>;
   recommendations?: string[];
}

export interface AgentStatus {
   agentId: string;
   name: string;
   status: 'idle' | 'processing' | 'error' | 'offline';
   lastUpdate: string;
   insightsGenerated: number;
   errorCount: number;
}

// ============================================
// CLASE BASE DE AGENTE
// ============================================

export abstract class BaseAgent {
   protected config: AgentConfig;
   protected status: AgentStatus;
   protected isRunning: boolean = false;
   protected intervalId: NodeJS.Timeout | null = null;

   constructor(config: AgentConfig) {
      this.config = config;
      this.status = {
         agentId: this.generateId(),
         name: config.name,
         status: 'idle',
         lastUpdate: new Date().toISOString(),
         insightsGenerated: 0,
         errorCount: 0,
      };
   }

   private generateId(): string {
      return `agent_${this.config.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`;
   }

   /**
    * Iniciar el agente
    */
   public start(): void {
      if (this.isRunning) return;

      this.isRunning = true;
      this.status.status = 'idle';
      console.log(`[${this.config.name}] Agente iniciado`);

      // Ejecutar inmediatamente
      this.tick();

      // Configurar intervalo
      this.intervalId = setInterval(() => {
         this.tick();
      }, this.config.updateInterval);
   }

   /**
    * Detener el agente
    */
   public stop(): void {
      if (!this.isRunning) return;

      this.isRunning = false;
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      this.status.status = 'offline';
      console.log(`[${this.config.name}] Agente detenido`);
   }

   /**
    * Ciclo de ejecución
    */
   private async tick(): Promise<void> {
      try {
         this.status.status = 'processing';
         this.status.lastUpdate = new Date().toISOString();

         // Ejecutar lógica del agente
         const insights = await this.process();

         // Registrar insights generados
         this.status.insightsGenerated += insights.length;
         this.status.status = 'idle';

         // Emitir insights
         insights.forEach(insight => this.emit(insight));

      } catch (error) {
         this.status.status = 'error';
         this.status.errorCount++;
         console.error(`[${this.config.name}] Error:`, error);
      }
   }

   /**
    * Emitir insight (puede ser sobrescrito para integrar con sistema de eventos)
    */
   protected emit(insight: AgentInsight): void {
      console.log(`[${this.config.name}] Insight:`, insight.title);
      // TODO: Integrar con sistema de eventos o base de datos
   }

   /**
    * Obtener estado del agente
    */
   public getStatus(): AgentStatus {
      return { ...this.status };
   }

   /**
    * Obtener configuración
    */
   public getConfig(): AgentConfig {
      return { ...this.config };
   }

   /**
    * Método abstracto que cada agente debe implementar
    */
   protected abstract process(): Promise<AgentInsight[]>;
}

// ============================================
// AGENTE: FishingAI
// ============================================

export class FishingAgent extends BaseAgent {
   constructor() {
      super({
         name: 'FishingAI',
         domain: 'Predicción de zonas de pesca',
         description: 'Analiza patrones oceanográficos y predice zonas óptimas para pesca',
         capabilities: [
            {
               name: 'Predicción de cardúmenes',
               description: 'Predice ubicación de bancos de peces',
               inputTypes: ['sensor_data', 'weather_data'],
               outputTypes: ['hotspot_map', 'probability'],
            },
            {
               name: 'Análisis histórico',
               description: 'Analiza capturas históricas para patrones',
               inputTypes: ['catch_logs'],
               outputTypes: ['patterns', 'seasonality'],
            },
         ],
         dataAPIs: [
            {
               name: 'NOAA ERDDAP',
               baseUrl: 'https://coastwatch.pfeg.noaa.gov/erddap',
               freeLimit: 'Ilimitado',
            },
            {
               name: 'Open-Meteo Marine',
               baseUrl: 'https://marine-api.open-meteo.com/v1/marine',
               freeLimit: 'Ilimitado',
            },
         ],
         updateInterval: 300000, // 5 minutos
         priority: 'high',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      // Simulación de análisis (en producción, llamar a APIs reales)
      const insights: AgentInsight[] = [];

      // Simular predicción de zona de pesca
      const fishingZone = this.predictFishingZone();

      if (fishingZone.probability > 0.7) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'fishing_prediction',
            title: 'Zona de Alta Probabilidad Detectada',
            description: `Se ha identificado una zona con ${Math.round(fishingZone.probability * 100)}% de probabilidad de cardúmenes en las coordenadas ${fishingZone.lat.toFixed(4)}°N, ${fishingZone.lng.toFixed(4)}°W`,
            confidence: fishingZone.probability,
            priority: fishingZone.probability > 0.85 ? 'high' : 'medium',
            data: fishingZone,
            recommendations: [
               'Considerar redirigir hacia esta zona',
               'Preparar equipos de pesca',
               'Monitorear condiciones climáticas',
            ],
         });
      }

      return insights;
   }

   private predictFishingZone(): { lat: number; lng: number; probability: number } {
      // Simulación - en producción usar modelo ML real
      return {
         lat: 42.3601 + (Math.random() - 0.5) * 0.1,
         lng: -71.0589 + (Math.random() - 0.5) * 0.1,
         probability: 0.7 + Math.random() * 0.25,
      };
   }
}

// ============================================
// AGENTE: NavigationAI
// ============================================

export class NavigationAgent extends BaseAgent {
   constructor() {
      super({
         name: 'NavigationAI',
         domain: 'Optimización de rutas marítimas',
         description: 'Calcula rutas óptimas considerando clima, tráfico y eficiencia',
         capabilities: [
            {
               name: 'Optimización de rutas',
               description: 'Calcula la ruta más eficiente',
               inputTypes: ['origin', 'destination', 'weather', 'traffic'],
               outputTypes: ['route', 'waypoints', 'eta'],
            },
            {
               name: 'Evitación de peligros',
               description: 'Detecta y evita zonas peligrosas',
               inputTypes: ['route', 'hazard_data'],
               outputTypes: ['safe_route', 'warnings'],
            },
         ],
         dataAPIs: [
            {
               name: 'OpenSeaMap',
               baseUrl: 'https://tiles.openseamap.org',
               freeLimit: 'Ilimitado',
            },
            {
               name: 'OSRM',
               baseUrl: 'https://router.project-osrm.org',
               freeLimit: 'Limitado',
            },
         ],
         updateInterval: 60000, // 1 minuto
         priority: 'critical',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      const insights: AgentInsight[] = [];

      // Simulación de análisis de ruta
      const routeAnalysis = this.analyzeCurrentRoute();

      if (routeAnalysis.canOptimize) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'route_optimization',
            title: 'Optimización de Ruta Disponible',
            description: `Ruta alternativa detectada que ahorra ${routeAnalysis.timeSaved} minutos y ${routeAnalysis.fuelSaved}L de combustible`,
            confidence: 0.88,
            priority: 'medium',
            data: routeAnalysis,
            recommendations: [
               'Revisar nueva ruta sugerida',
               'Confirmar condiciones meteorológicas',
               'Actualizar ETA',
            ],
         });
      }

      return insights;
   }

   private analyzeCurrentRoute(): { canOptimize: boolean; timeSaved: number; fuelSaved: number } {
      // Simulación
      return {
         canOptimize: Math.random() > 0.6,
         timeSaved: Math.round(Math.random() * 30 + 10),
         fuelSaved: Math.round(Math.random() * 50 + 20),
      };
   }
}

// ============================================
// AGENTE: WeatherAI
// ============================================

export class WeatherAgent extends BaseAgent {
   constructor() {
      super({
         name: 'WeatherAI',
         domain: 'Pronóstico meteorológico marino',
         description: 'Monitorea y predice condiciones climáticas marítimas',
         capabilities: [
            {
               name: 'Pronóstico extendido',
               description: 'Pronóstico de 7 días para zona marítima',
               inputTypes: ['location'],
               outputTypes: ['forecast', 'charts'],
            },
            {
               name: 'Alertas de tormenta',
               description: 'Detección temprana de condiciones peligrosas',
               inputTypes: ['weather_data', 'satellite'],
               outputTypes: ['alerts', 'severity'],
            },
         ],
         dataAPIs: [
            {
               name: 'Open-Meteo',
               baseUrl: 'https://api.open-meteo.com/v1/forecast',
               freeLimit: 'Ilimitado',
            },
            {
               name: 'OpenWeatherMap',
               baseUrl: 'https://api.openweathermap.org/data/2.5',
               freeLimit: '1000 calls/día',
            },
         ],
         updateInterval: 600000, // 10 minutos
         priority: 'high',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      const insights: AgentInsight[] = [];

      // Obtener pronóstico (en producción, llamar a API real)
      const forecast = await this.fetchForecast();

      // Verificar condiciones peligrosas
      if (forecast.windSpeed > 25) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'weather_alert',
            title: 'Alerta de Viento Fuerte',
            description: `Se esperan vientos de ${forecast.windSpeed} nudos en las próximas ${forecast.hoursUntil} horas`,
            confidence: 0.92,
            priority: forecast.windSpeed > 35 ? 'critical' : 'high',
            data: forecast,
            recommendations: [
               'Revisar plan de navegación',
               'Asegurar carga y equipo',
               'Considerar refugio en puerto',
            ],
         });
      }

      return insights;
   }

   private async fetchForecast(): Promise<{ windSpeed: number; waveHeight: number; hoursUntil: number }> {
      // Simulación - en producción llamar a Open-Meteo
      return {
         windSpeed: Math.random() * 40 + 5,
         waveHeight: Math.random() * 4 + 0.5,
         hoursUntil: Math.round(Math.random() * 24 + 3),
      };
   }
}

// ============================================
// AGENTE: MaintenanceAI
// ============================================

export class MaintenanceAgent extends BaseAgent {
   constructor() {
      super({
         name: 'MaintenanceAI',
         domain: 'Mantenimiento predictivo',
         description: 'Predice fallos de equipos y programa mantenimiento preventivo',
         capabilities: [
            {
               name: 'Predicción de fallos',
               description: 'Detecta anomalías en sensores que indican fallos próximos',
               inputTypes: ['sensor_data', 'equipment_logs'],
               outputTypes: ['failure_probability', 'component'],
            },
         ],
         dataAPIs: [],
         updateInterval: 900000, // 15 minutos
         priority: 'medium',
      });
   }

   protected async process(): Promise<AgentInsight[]> {
      const insights: AgentInsight[] = [];

      // Analizar sensores (simulación)
      const analysis = this.analyzeSensors();

      if (analysis.failureProbability > 0.6) {
         insights.push({
            agentId: this.status.agentId,
            agentName: this.config.name,
            timestamp: new Date().toISOString(),
            type: 'maintenance_alert',
            title: `Mantenimiento Requerido: ${analysis.component}`,
            description: `${analysis.component} muestra ${Math.round(analysis.failureProbability * 100)}% probabilidad de fallo en los próximos ${analysis.daysUntilFailure} días`,
            confidence: analysis.failureProbability,
            priority: analysis.failureProbability > 0.8 ? 'high' : 'medium',
            data: analysis,
            recommendations: [
               `Inspeccionar ${analysis.component}`,
               'Programar mantenimiento preventivo',
               'Verificar repuestos disponibles',
            ],
         });
      }

      return insights;
   }

   private analyzeSensors(): { component: string; failureProbability: number; daysUntilFailure: number } {
      const components = ['Motor Principal', 'Bomba de Combustible', 'Sistema Hidráulico', 'Generador'];
      return {
         component: components[Math.floor(Math.random() * components.length)],
         failureProbability: Math.random() * 0.5 + 0.3,
         daysUntilFailure: Math.round(Math.random() * 14 + 3),
      };
   }
}

// ============================================
// ORQUESTADOR DE AGENTES
// ============================================

export class AgentOrchestrator {
   private agents: Map<string, BaseAgent> = new Map();
   private isRunning: boolean = false;

   constructor() {
      // Registrar agentes por defecto
      this.registerAgent(new FishingAgent());
      this.registerAgent(new NavigationAgent());
      this.registerAgent(new WeatherAgent());
      this.registerAgent(new MaintenanceAgent());
   }

   /**
    * Registrar un nuevo agente
    */
   public registerAgent(agent: BaseAgent): void {
      const config = agent.getConfig();
      this.agents.set(config.name, agent);
      console.log(`[Orquestador] Agente registrado: ${config.name}`);
   }

   /**
    * Iniciar todos los agentes
    */
   public startAll(): void {
      if (this.isRunning) return;

      this.isRunning = true;
      console.log('[Orquestador] Iniciando todos los agentes...');

      this.agents.forEach((agent, name) => {
         agent.start();
      });

      console.log(`[Orquestador] ${this.agents.size} agentes activos`);
   }

   /**
    * Detener todos los agentes
    */
   public stopAll(): void {
      if (!this.isRunning) return;

      this.isRunning = false;
      console.log('[Orquestador] Deteniendo todos los agentes...');

      this.agents.forEach((agent, name) => {
         agent.stop();
      });
   }

   /**
    * Obtener estado de todos los agentes
    */
   public getAllStatus(): AgentStatus[] {
      return Array.from(this.agents.values()).map(agent => agent.getStatus());
   }

   /**
    * Obtener un agente específico
    */
   public getAgent(name: string): BaseAgent | undefined {
      return this.agents.get(name);
   }

   /**
    * Obtener conteo de agentes
    */
   public getAgentCount(): number {
      return this.agents.size;
   }
}

// ============================================
// SINGLETON PARA USO GLOBAL
// ============================================

let orchestratorInstance: AgentOrchestrator | null = null;

export function getOrchestrator(): AgentOrchestrator {
   if (!orchestratorInstance) {
      orchestratorInstance = new AgentOrchestrator();
   }
   return orchestratorInstance;
}

export default AgentOrchestrator;
