-- Enable realtime for maritime tables
ALTER TABLE public.sensor_data REPLICA IDENTITY FULL;
ALTER TABLE public.ai_insights REPLICA IDENTITY FULL;
ALTER TABLE public.system_alerts REPLICA IDENTITY FULL;
ALTER TABLE public.waypoints REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.waypoints;