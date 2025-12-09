/**
 * SARDIN-AI - Panel de Agentes IA
 * 
 * Componente para visualizar y controlar el sistema multi-agente.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAgents } from '@/hooks/useAgents';
import {
   Bot,
   Play,
   Square,
   Activity,
   Brain,
   Ship,
   Cloud,
   Wrench,
   Zap,
   TrendingUp
} from 'lucide-react';

const agentIcons: Record<string, React.ReactNode> = {
   'FishingAI': <Ship className="h-5 w-5 text-blue-400" />,
   'NavigationAI': <TrendingUp className="h-5 w-5 text-green-400" />,
   'WeatherAI': <Cloud className="h-5 w-5 text-cyan-400" />,
   'MaintenanceAI': <Wrench className="h-5 w-5 text-orange-400" />,
};

const statusColors: Record<string, string> = {
   'idle': 'bg-green-500',
   'processing': 'bg-blue-500 animate-pulse',
   'error': 'bg-red-500',
   'offline': 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
   'idle': 'Activo',
   'processing': 'Procesando',
   'error': 'Error',
   'offline': 'Offline',
};

export function AgentsPanel() {
   const {
      isRunning,
      agentStatuses,
      totalAgents,
      activeAgents,
      totalInsights,
      startAgents,
      stopAgents,
   } = useAgents();

   return (
      <Card className="maritime-panel">
         <CardHeader>
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="p-2 bg-ai-neural/20 rounded-lg">
                     <Brain className="h-6 w-6 text-ai-neural" />
                  </div>
                  <div>
                     <CardTitle className="text-lg">Sistema Multi-Agente</CardTitle>
                     <CardDescription>
                        Agentes IA especializados trabajando en paralelo
                     </CardDescription>
                  </div>
               </div>
               <Button
                  variant={isRunning ? "destructive" : "default"}
                  size="sm"
                  onClick={isRunning ? stopAgents : startAgents}
               >
                  {isRunning ? (
                     <>
                        <Square className="h-4 w-4 mr-2" />
                        Detener
                     </>
                  ) : (
                     <>
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                     </>
                  )}
               </Button>
            </div>
         </CardHeader>

         <CardContent className="space-y-6">
            {/* Métricas Globales */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-background/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary">{totalAgents}</div>
                  <div className="text-xs text-muted-foreground">Agentes Total</div>
               </div>
               <div className="bg-background/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{activeAgents}</div>
                  <div className="text-xs text-muted-foreground">Activos</div>
               </div>
               <div className="bg-background/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-ai-neural">{totalInsights}</div>
                  <div className="text-xs text-muted-foreground">Insights</div>
               </div>
            </div>

            {/* Lista de Agentes */}
            <div className="space-y-3">
               {agentStatuses.map((status) => (
                  <div
                     key={status.agentId}
                     className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50"
                  >
                     <div className="flex items-center space-x-3">
                        {agentIcons[status.name] || <Bot className="h-5 w-5" />}
                        <div>
                           <div className="font-medium text-sm">{status.name}</div>
                           <div className="text-xs text-muted-foreground">
                              Última actualización: {new Date(status.lastUpdate).toLocaleTimeString()}
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center space-x-3">
                        <div className="text-right">
                           <div className="text-sm font-medium">{status.insightsGenerated}</div>
                           <div className="text-xs text-muted-foreground">insights</div>
                        </div>
                        <div className="flex items-center space-x-2">
                           <div className={`w-2 h-2 rounded-full ${statusColors[status.status]}`} />
                           <Badge variant="outline" className="text-xs">
                              {statusLabels[status.status]}
                           </Badge>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Indicador de Actividad */}
            {isRunning && (
               <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 animate-pulse text-green-400" />
                  <span>Sistema de agentes operando...</span>
               </div>
            )}

            {/* Descripción de Capacidades */}
            <div className="pt-4 border-t border-border/50">
               <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  Capacidades del Sistema
               </h4>
               <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                     <Ship className="h-3 w-3 text-blue-400" />
                     <span>Predicción de zonas de pesca</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <TrendingUp className="h-3 w-3 text-green-400" />
                     <span>Optimización de rutas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Cloud className="h-3 w-3 text-cyan-400" />
                     <span>Pronóstico meteorológico</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Wrench className="h-3 w-3 text-orange-400" />
                     <span>Mantenimiento predictivo</span>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

export default AgentsPanel;
