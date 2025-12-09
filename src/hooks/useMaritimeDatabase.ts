/**
 * SARDIN-AI - Hook de Base de Datos Marítima (PocketBase)
 * 
 * Hook React para operaciones CRUD con React Query.
 * Migrado de Supabase a PocketBase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pb, getCurrentUser } from '@/integrations/pocketbase/client';
import {
  vesselsService,
  sensorDataService,
  aiInsightsService,
  waypointsService,
  systemAlertsService,
} from '@/integrations/pocketbase/services';
import type {
  Vessel,
  SensorData,
  AIInsight,
  Waypoint,
  SystemAlert,
  CreateSensorData,
  CreateAIInsight,
  CreateWaypoint,
} from '@/integrations/pocketbase/types';
import { useToast } from '@/hooks/use-toast';

export const useMaritimeDatabase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ========================================
  // QUERIES (Lectura)
  // ========================================

  /**
   * Obtener todas las embarcaciones
   */
  const useVessels = () => {
    return useQuery({
      queryKey: ['vessels'],
      queryFn: async (): Promise<Vessel[]> => {
        const result = await vesselsService.getAll();
        return result.items;
      },
    });
  };

  /**
   * Obtener datos de sensores más recientes
   */
  const useLatestSensorData = (vesselId?: string) => {
    return useQuery({
      queryKey: ['sensor_data', 'latest', vesselId],
      queryFn: async (): Promise<SensorData | null> => {
        if (vesselId) {
          return sensorDataService.getLatest(vesselId);
        }
        const result = await sensorDataService.getRecent(undefined, 1);
        return result[0] || null;
      },
      refetchInterval: 5000, // Refrescar cada 5 segundos
    });
  };

  /**
   * Obtener historial de datos de sensores
   */
  const useSensorDataHistory = (vesselId?: string, limit = 50) => {
    return useQuery({
      queryKey: ['sensor_data', 'history', vesselId, limit],
      queryFn: async (): Promise<SensorData[]> => {
        return sensorDataService.getRecent(vesselId, limit);
      },
    });
  };

  /**
   * Obtener insights de IA
   */
  const useAIInsights = (vesselId?: string) => {
    return useQuery({
      queryKey: ['ai_insights', vesselId],
      queryFn: async (): Promise<AIInsight[]> => {
        const insights = await aiInsightsService.getActive();
        if (vesselId) {
          return insights.filter(i => i.vessel === vesselId);
        }
        return insights;
      },
    });
  };

  /**
   * Obtener waypoints
   */
  const useWaypoints = (vesselId?: string) => {
    return useQuery({
      queryKey: ['waypoints', vesselId],
      queryFn: async (): Promise<Waypoint[]> => {
        if (vesselId) {
          return waypointsService.getByVessel(vesselId);
        }
        return waypointsService.getAll();
      },
    });
  };

  /**
   * Obtener alertas del sistema
   */
  const useSystemAlerts = (vesselId?: string) => {
    return useQuery({
      queryKey: ['system_alerts', vesselId],
      queryFn: async (): Promise<SystemAlert[]> => {
        const alerts = await systemAlertsService.getUnacknowledged();
        if (vesselId) {
          return alerts.filter(a => a.vessel === vesselId);
        }
        return alerts;
      },
    });
  };

  // ========================================
  // MUTATIONS (Escritura)
  // ========================================

  /**
   * Agregar datos de sensores
   */
  const useAddSensorData = () => {
    return useMutation({
      mutationFn: async (data: Omit<CreateSensorData, 'created_by'>) => {
        const user = getCurrentUser();
        return sensorDataService.create({
          ...data,
          created_by: user?.id,
        } as CreateSensorData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sensor_data'] });
        toast({
          title: "Datos de Sensor Actualizados",
          description: "Los datos del sensor marítimo han sido registrados.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al agregar datos del sensor.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Agregar insight de IA
   */
  const useAddAIInsight = () => {
    return useMutation({
      mutationFn: async (data: Omit<CreateAIInsight, 'created_by'>) => {
        const user = getCurrentUser();
        return aiInsightsService.create({
          ...data,
          created_by: user?.id,
        } as CreateAIInsight);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_insights'] });
        toast({
          title: "Insight IA Agregado",
          description: "Nuevo insight de inteligencia marítima generado.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al agregar insight de IA.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Resolver insight de IA
   */
  const useResolveAIInsight = () => {
    return useMutation({
      mutationFn: async (insightId: string) => {
        return aiInsightsService.resolve(insightId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_insights'] });
        toast({
          title: "Insight Resuelto",
          description: "El insight ha sido marcado como resuelto.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al resolver insight.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Agregar waypoint
   */
  const useAddWaypoint = () => {
    return useMutation({
      mutationFn: async (data: Omit<CreateWaypoint, 'created_by'>) => {
        const user = getCurrentUser();
        return waypointsService.create({
          ...data,
          created_by: user?.id,
        } as CreateWaypoint);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['waypoints'] });
        toast({
          title: "Waypoint Agregado",
          description: "Nuevo punto de navegación creado.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al agregar waypoint.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Eliminar waypoint
   */
  const useDeleteWaypoint = () => {
    return useMutation({
      mutationFn: async (waypointId: string) => {
        return waypointsService.delete(waypointId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['waypoints'] });
        toast({
          title: "Waypoint Eliminado",
          description: "Punto de navegación eliminado.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al eliminar waypoint.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Reconocer alerta
   */
  const useAcknowledgeAlert = () => {
    return useMutation({
      mutationFn: async (alertId: string) => {
        const user = getCurrentUser();
        return systemAlertsService.acknowledge(alertId, user?.id || '');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['system_alerts'] });
        toast({
          title: "Alerta Reconocida",
          description: "La alerta del sistema ha sido reconocida.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al reconocer alerta.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Agregar embarcación
   */
  const useAddVessel = () => {
    return useMutation({
      mutationFn: async (data: Omit<Vessel, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>) => {
        return vesselsService.create(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vessels'] });
        toast({
          title: "Embarcación Agregada",
          description: "Nueva embarcación registrada en el sistema.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Error al agregar embarcación.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    // Queries
    useVessels,
    useLatestSensorData,
    useSensorDataHistory,
    useAIInsights,
    useWaypoints,
    useSystemAlerts,
    // Mutations
    useAddSensorData,
    useAddAIInsight,
    useResolveAIInsight,
    useAddWaypoint,
    useDeleteWaypoint,
    useAcknowledgeAlert,
    useAddVessel,
  };
};

export default useMaritimeDatabase;