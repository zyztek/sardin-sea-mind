-- Create maritime database schema for SARDIN-AI
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE public.maritime_role AS ENUM ('captain', 'engineer', 'navigator', 'observer');

-- User profiles for maritime personnel
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  maritime_role maritime_role NOT NULL DEFAULT 'observer',
  vessel_assignment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vessels table
CREATE TABLE public.vessels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  registration TEXT UNIQUE NOT NULL,
  vessel_type TEXT NOT NULL,
  length_meters DECIMAL(8,2),
  max_speed_knots DECIMAL(5,2),
  fuel_capacity_liters DECIMAL(10,2),
  crew_capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view vessels" ON public.vessels FOR SELECT TO authenticated USING (true);

-- Maritime sensor data
CREATE TABLE public.sensor_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES public.vessels(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  speed_knots DECIMAL(5,2),
  heading_degrees DECIMAL(5,2),
  depth_meters DECIMAL(8,2),
  water_temperature_c DECIMAL(5,2),
  wind_speed_knots DECIMAL(5,2),
  wind_direction_degrees DECIMAL(5,2),
  fuel_level_percent DECIMAL(5,2),
  battery_level_percent DECIMAL(5,2),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view sensor data" ON public.sensor_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sensor data" ON public.sensor_data FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- AI insights table
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES public.vessels(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view AI insights" ON public.ai_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert AI insights" ON public.ai_insights FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can update AI insights" ON public.ai_insights FOR UPDATE TO authenticated USING (true);

-- Navigation waypoints
CREATE TABLE public.waypoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES public.vessels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  waypoint_type TEXT DEFAULT 'navigation',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.waypoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage waypoints" ON public.waypoints FOR ALL TO authenticated USING (true);

-- System alerts table
CREATE TABLE public.system_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES public.vessels(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')) DEFAULT 'info',
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view alerts" ON public.system_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can acknowledge alerts" ON public.system_alerts FOR UPDATE TO authenticated USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, maritime_role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE((new.raw_user_meta_data->>'maritime_role')::maritime_role, 'observer')
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vessels_updated_at BEFORE UPDATE ON public.vessels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vessel data
INSERT INTO public.vessels (name, registration, vessel_type, length_meters, max_speed_knots, fuel_capacity_liters, crew_capacity) VALUES
('SARDIN Explorer', 'SE-001', 'Research Vessel', 45.5, 25.0, 8000.0, 12),
('Ocean Navigator', 'ON-002', 'Fishing Vessel', 32.0, 18.0, 5000.0, 8);

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_alerts;