import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SensorData, AIInsight, SystemAlert } from '@/types/maritime';

export const useRealTimeData = () => {
  const [realTimeData, setRealTimeData] = useState<{
    sensorData: SensorData[];
    aiInsights: AIInsight[];
    alerts: SystemAlert[];
  }>({
    sensorData: [],
    aiInsights: [],
    alerts: []
  });
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time sensor data updates
    const sensorChannel = supabase
      .channel('sensor-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data'
        },
        (payload) => {
          const newData = payload.new as SensorData;
          setRealTimeData(prev => ({
            ...prev,
            sensorData: [newData, ...prev.sensorData.slice(0, 49)]
          }));
          
          toast({
            title: "Sensor Data Updated",
            description: `New reading from vessel sensors`,
          });
        }
      )
      .subscribe();

    // Subscribe to AI insights
    const aiChannel = supabase
      .channel('ai-insights')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_insights'
        },
        (payload) => {
          const newInsight = payload.new as AIInsight;
          setRealTimeData(prev => ({
            ...prev,
            aiInsights: [newInsight, ...prev.aiInsights.slice(0, 19)]
          }));
          
          toast({
            title: "New AI Insight",
            description: newInsight.title,
          });
        }
      )
      .subscribe();

    // Subscribe to system alerts
    const alertsChannel = supabase
      .channel('system-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_alerts'
        },
        (payload) => {
          const newAlert = payload.new as SystemAlert;
          setRealTimeData(prev => ({
            ...prev,
            alerts: [newAlert, ...prev.alerts.slice(0, 19)]
          }));
          
          if (newAlert.severity === 'critical' || newAlert.severity === 'warning') {
            toast({
              title: "System Alert",
              description: newAlert.message,
              variant: newAlert.severity === 'critical' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sensorChannel);
      supabase.removeChannel(aiChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [toast]);

  return realTimeData;
};