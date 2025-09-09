import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SensorData, AIInsight, Vessel, Waypoint, SystemAlert } from '@/types/maritime';
import { useToast } from '@/hooks/use-toast';

export const useMaritimeDatabase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vessels
  const useVessels = () => {
    return useQuery({
      queryKey: ['vessels'],
      queryFn: async (): Promise<Vessel[]> => {
        const { data, error } = await supabase
          .from('vessels')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return data || [];
      },
    });
  };

  // Fetch latest sensor data
  const useLatestSensorData = (vesselId?: string) => {
    return useQuery({
      queryKey: ['sensor_data', 'latest', vesselId],
      queryFn: async (): Promise<SensorData | null> => {
        let query = supabase
          .from('sensor_data')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1);

        if (vesselId) {
          query = query.eq('vessel_id', vesselId);
        }
        
        const { data, error } = await query.maybeSingle();
        
        if (error) throw error;
        return data;
      },
      refetchInterval: 5000, // Refresh every 5 seconds
    });
  };

  // Fetch AI insights
  const useAIInsights = (vesselId?: string) => {
    return useQuery({
      queryKey: ['ai_insights', vesselId],
      queryFn: async (): Promise<AIInsight[]> => {
        let query = supabase
          .from('ai_insights')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (vesselId) {
          query = query.eq('vessel_id', vesselId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data as AIInsight[] || [];
      },
    });
  };

  // Fetch waypoints
  const useWaypoints = (vesselId?: string) => {
    return useQuery({
      queryKey: ['waypoints', vesselId],
      queryFn: async (): Promise<Waypoint[]> => {
        let query = supabase
          .from('waypoints')
          .select('*')
          .order('created_at', { ascending: false });

        if (vesselId) {
          query = query.eq('vessel_id', vesselId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data || [];
      },
    });
  };

  // Fetch system alerts
  const useSystemAlerts = (vesselId?: string) => {
    return useQuery({
      queryKey: ['system_alerts', vesselId],
      queryFn: async (): Promise<SystemAlert[]> => {
        let query = supabase
          .from('system_alerts')
          .select('*')
          .eq('acknowledged', false)
          .order('created_at', { ascending: false })
          .limit(20);

        if (vesselId) {
          query = query.eq('vessel_id', vesselId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data as SystemAlert[] || [];
      },
    });
  };

  // Add sensor data
  const useAddSensorData = () => {
    return useMutation({
      mutationFn: async (sensorData: Omit<SensorData, 'id' | 'created_by'>) => {
        const { data, error } = await supabase
          .from('sensor_data')
          .insert([{ ...sensorData, created_by: (await supabase.auth.getUser()).data.user?.id }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sensor_data'] });
        toast({
          title: "Sensor Data Updated",
          description: "Maritime sensor data has been recorded.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to add sensor data.",
          variant: "destructive",
        });
      },
    });
  };

  // Add AI insight
  const useAddAIInsight = () => {
    return useMutation({
      mutationFn: async (insight: Omit<AIInsight, 'id' | 'created_by' | 'created_at'>) => {
        const { data, error } = await supabase
          .from('ai_insights')
          .insert([{ ...insight, created_by: (await supabase.auth.getUser()).data.user?.id }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ai_insights'] });
        toast({
          title: "AI Insight Added",
          description: "New maritime intelligence insight has been generated.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to add AI insight.",
          variant: "destructive",
        });
      },
    });
  };

  // Add waypoint
  const useAddWaypoint = () => {
    return useMutation({
      mutationFn: async (waypoint: Omit<Waypoint, 'id' | 'created_by' | 'created_at'>) => {
        const { data, error } = await supabase
          .from('waypoints')
          .insert([{ ...waypoint, created_by: (await supabase.auth.getUser()).data.user?.id }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['waypoints'] });
        toast({
          title: "Waypoint Added",
          description: "New navigation waypoint has been created.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to add waypoint.",
          variant: "destructive",
        });
      },
    });
  };

  // Acknowledge alert
  const useAcknowledgeAlert = () => {
    return useMutation({
      mutationFn: async (alertId: string) => {
        const { data, error } = await supabase
          .from('system_alerts')
          .update({ 
            acknowledged: true, 
            acknowledged_at: new Date().toISOString(),
            acknowledged_by: (await supabase.auth.getUser()).data.user?.id 
          })
          .eq('id', alertId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['system_alerts'] });
        toast({
          title: "Alert Acknowledged",
          description: "System alert has been acknowledged.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to acknowledge alert.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useVessels,
    useLatestSensorData,
    useAIInsights,
    useWaypoints,
    useSystemAlerts,
    useAddSensorData,
    useAddAIInsight,
    useAddWaypoint,
    useAcknowledgeAlert,
  };
};