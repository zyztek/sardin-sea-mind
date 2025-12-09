/**
 * SARDIN-AI - Hook de Datos en Tiempo Real (PocketBase)
 * 
 * Hook React para suscribirse a datos en tiempo real.
 * Reemplaza useRealTimeData de Supabase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { useState, useEffect, useCallback } from 'react';
import { pb } from '@/integrations/pocketbase/client';
import {
  sensorDataService,
  aiInsightsService,
  systemAlertsService,
} from '@/integrations/pocketbase/services';
import type { SensorData, AIInsight, SystemAlert } from '@/integrations/pocketbase/types';
import { RecordSubscription } from 'pocketbase';

export interface UseRealTimeDataReturn {
  sensorData: SensorData[];
  aiInsights: AIInsight[];
  alerts: SystemAlert[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isConnected: boolean;
}

export function useRealTimeData(): UseRealTimeDataReturn {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // Cargar datos iniciales
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sensorResult, insightsResult, alertsResult] = await Promise.all([
        sensorDataService.getRecent(undefined, 50),
        aiInsightsService.getActive(),
        systemAlertsService.getUnacknowledged(),
      ]);

      setSensorData(sensorResult);
      setAiInsights(insightsResult);
      setAlerts(alertsResult);
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError('Error al cargar datos en tiempo real');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Configurar suscripciones en tiempo real
  useEffect(() => {
    fetchData();

    // Suscribirse a sensor_data
    const unsubSensor = sensorDataService.subscribe((e: RecordSubscription<SensorData>) => {
      if (e.action === 'create') {
        setSensorData(prev => [e.record, ...prev].slice(0, 50));
      } else if (e.action === 'update') {
        setSensorData(prev => prev.map(item =>
          item.id === e.record.id ? e.record : item
        ));
      } else if (e.action === 'delete') {
        setSensorData(prev => prev.filter(item => item.id !== e.record.id));
      }
    });

    // Suscribirse a ai_insights
    const unsubInsights = aiInsightsService.subscribe((e: RecordSubscription<AIInsight>) => {
      if (e.action === 'create') {
        setAiInsights(prev => [e.record, ...prev]);
      } else if (e.action === 'update') {
        if (e.record.resolved_at) {
          // Si se resolvió, quitar de la lista activa
          setAiInsights(prev => prev.filter(item => item.id !== e.record.id));
        } else {
          setAiInsights(prev => prev.map(item =>
            item.id === e.record.id ? e.record : item
          ));
        }
      } else if (e.action === 'delete') {
        setAiInsights(prev => prev.filter(item => item.id !== e.record.id));
      }
    });

    // Suscribirse a system_alerts
    const unsubAlerts = systemAlertsService.subscribe((e: RecordSubscription<SystemAlert>) => {
      if (e.action === 'create') {
        setAlerts(prev => [e.record, ...prev]);
      } else if (e.action === 'update') {
        if (e.record.acknowledged) {
          // Si se reconoció, quitar de la lista
          setAlerts(prev => prev.filter(item => item.id !== e.record.id));
        } else {
          setAlerts(prev => prev.map(item =>
            item.id === e.record.id ? e.record : item
          ));
        }
      } else if (e.action === 'delete') {
        setAlerts(prev => prev.filter(item => item.id !== e.record.id));
      }
    });

    // Cleanup
    return () => {
      unsubSensor();
      unsubInsights();
      unsubAlerts();
    };
  }, [fetchData]);

  return {
    sensorData,
    aiInsights,
    alerts,
    isLoading,
    error,
    refetch: fetchData,
    isConnected,
  };
}

/**
 * Hook para suscribirse a una colección específica
 */
export function useRealtimeCollection<T extends { id: string }>(
  collectionName: string,
  initialFetch?: () => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      if (initialFetch) {
        try {
          const result = await initialFetch();
          setData(result);
        } catch (err) {
          setError('Error al cargar datos');
        }
      }
      setIsLoading(false);
    };

    fetchInitial();

    // Suscribirse a cambios
    pb.collection(collectionName).subscribe<T>('*', (e) => {
      if (e.action === 'create') {
        setData(prev => [e.record, ...prev]);
      } else if (e.action === 'update') {
        setData(prev => prev.map(item =>
          item.id === e.record.id ? e.record : item
        ));
      } else if (e.action === 'delete') {
        setData(prev => prev.filter(item => item.id !== e.record.id));
      }
    });

    return () => {
      pb.collection(collectionName).unsubscribe('*');
    };
  }, [collectionName, initialFetch]);

  return { data, isLoading, error, setData };
}

export default useRealTimeData;