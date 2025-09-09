export interface MaritimeProfile {
  id: string;
  user_id: string;
  full_name: string;
  maritime_role: 'captain' | 'engineer' | 'navigator' | 'observer';
  vessel_assignment?: string;
  created_at: string;
  updated_at: string;
}

export interface Vessel {
  id: string;
  name: string;
  registration: string;
  vessel_type: string;
  length_meters?: number;
  max_speed_knots?: number;
  fuel_capacity_liters?: number;
  crew_capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface SensorData {
  id: string;
  vessel_id?: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  speed_knots?: number;
  heading_degrees?: number;
  depth_meters?: number;
  water_temperature_c?: number;
  wind_speed_knots?: number;
  wind_direction_degrees?: number;
  fuel_level_percent?: number;
  battery_level_percent?: number;
  created_by?: string;
}

export interface AIInsight {
  id: string;
  vessel_id?: string;
  insight_type: string;
  title: string;
  description: string;
  confidence?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  resolved_at?: string;
  created_by?: string;
}

export interface Waypoint {
  id: string;
  vessel_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  waypoint_type?: string;
  description?: string;
  created_at: string;
  created_by?: string;
}

export interface SystemAlert {
  id: string;
  vessel_id?: string;
  alert_type: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  acknowledged?: boolean;
  created_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
}