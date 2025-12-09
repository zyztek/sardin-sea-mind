/**
 * SARDIN-AI - Hook para Sistema de Agentes
 * 
 * Hook React para integrar el sistema multi-agente en componentes.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { useState, useEffect, useCallback } from 'react';
import {
   getOrchestrator,
   AgentOrchestrator,
   AgentStatus,
   AgentInsight,
   AgentConfig
} from '@/agents/AgentSystem';

interface UseAgentsReturn {
   // Estado
   isRunning: boolean;
   agentStatuses: AgentStatus[];
   insights: AgentInsight[];
   totalAgents: number;
   activeAgents: number;
   totalInsights: number;

   // Acciones
   startAgents: () => void;
   stopAgents: () => void;
   getAgentConfig: (name: string) => AgentConfig | undefined;
   clearInsights: () => void;
}

export function useAgents(): UseAgentsReturn {
   const [orchestrator] = useState<AgentOrchestrator>(() => getOrchestrator());
   const [isRunning, setIsRunning] = useState(false);
   const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
   const [insights, setInsights] = useState<AgentInsight[]>([]);

   // Actualizar estados periódicamente
   useEffect(() => {
      const updateStatuses = () => {
         const statuses = orchestrator.getAllStatus();
         setAgentStatuses(statuses);
      };

      updateStatuses();
      const interval = setInterval(updateStatuses, 5000);

      return () => clearInterval(interval);
   }, [orchestrator]);

   // Iniciar agentes
   const startAgents = useCallback(() => {
      orchestrator.startAll();
      setIsRunning(true);
   }, [orchestrator]);

   // Detener agentes
   const stopAgents = useCallback(() => {
      orchestrator.stopAll();
      setIsRunning(false);
   }, [orchestrator]);

   // Obtener config de un agente
   const getAgentConfig = useCallback((name: string): AgentConfig | undefined => {
      const agent = orchestrator.getAgent(name);
      return agent?.getConfig();
   }, [orchestrator]);

   // Limpiar insights
   const clearInsights = useCallback(() => {
      setInsights([]);
   }, []);

   // Métricas calculadas
   const totalAgents = orchestrator.getAgentCount();
   const activeAgents = agentStatuses.filter(s => s.status !== 'offline').length;
   const totalInsights = agentStatuses.reduce((sum, s) => sum + s.insightsGenerated, 0);

   return {
      isRunning,
      agentStatuses,
      insights,
      totalAgents,
      activeAgents,
      totalInsights,
      startAgents,
      stopAgents,
      getAgentConfig,
      clearInsights,
   };
}

export default useAgents;
