/**
 * SARDIN-AI PocketBase Types
 * 
 * Definiciones de tipos TypeScript para las colecciones de PocketBase.
 * Equivalente al types.ts de Supabase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { RecordModel } from 'pocketbase';

// ============================================
// ENUMS
// ============================================

export type MaritimeRole = 'captain' | 'engineer' | 'navigator' | 'observer';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

// ============================================
// COLLECTION TYPES
// ============================================

/**
 * Perfil de usuario marítimo
 * Colección: profiles
 */
export interface Profile extends RecordModel {
   user: string; // Relación con users
   full_name: string;
   maritime_role: MaritimeRole;
   vessel_assignment?: string;
   avatar?: string; // Archivo de imagen
}

/**
 * Embarcación/Navío
 * Colección: vessels
 */
export interface Vessel extends RecordModel {
   name: string;
   registration: string;
   vessel_type: string;
   length_meters?: number;
   max_speed_knots?: number;
   fuel_capacity_liters?: number;
   crew_capacity?: number;
   image?: string; // Archivo de imagen
}

/**
 * Datos de sensores marítimos
 * Colección: sensor_data
 */
export interface SensorData extends RecordModel {
   vessel: string; // Relación con vessels
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
   created_by?: string; // Relación con users
}

/**
 * Insights generados por IA
 * Colección: ai_insights
 */
export interface AIInsight extends RecordModel {
   vessel?: string; // Relación con vessels
   insight_type: string;
   title: string;
   description: string;
   confidence?: number; // 0.0 - 1.0
   priority: InsightPriority;
   resolved_at?: string;
   created_by?: string; // Relación con users
}

/**
 * Waypoints de navegación
 * Colección: waypoints
 */
export interface Waypoint extends RecordModel {
   vessel: string; // Relación con vessels
   name: string;
   latitude: number;
   longitude: number;
   waypoint_type: string;
   description?: string;
   created_by?: string; // Relación con users
}

/**
 * Alertas del sistema
 * Colección: system_alerts
 */
export interface SystemAlert extends RecordModel {
   vessel?: string; // Relación con vessels
   alert_type: string;
   severity: AlertSeverity;
   message: string;
   acknowledged: boolean;
   acknowledged_at?: string;
   acknowledged_by?: string; // Relación con users
}

// ============================================
// COLLECTION NAMES
// ============================================

export const Collections = {
   PROFILES: 'profiles',
   VESSELS: 'vessels',
   SENSOR_DATA: 'sensor_data',
   AI_INSIGHTS: 'ai_insights',
   WAYPOINTS: 'waypoints',
   SYSTEM_ALERTS: 'system_alerts',
} as const;

export type CollectionName = typeof Collections[keyof typeof Collections];

// ============================================
// HELPER TYPES
// ============================================

/**
 * Datos de creación (sin campos auto-generados)
 */
export type CreateProfile = Omit<Profile, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;
export type CreateVessel = Omit<Vessel, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;
export type CreateSensorData = Omit<SensorData, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;
export type CreateAIInsight = Omit<AIInsight, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;
export type CreateWaypoint = Omit<Waypoint, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;
export type CreateSystemAlert = Omit<SystemAlert, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>;

/**
 * Datos de actualización (todos los campos opcionales)
 */
export type UpdateProfile = Partial<CreateProfile>;
export type UpdateVessel = Partial<CreateVessel>;
export type UpdateSensorData = Partial<CreateSensorData>;
export type UpdateAIInsight = Partial<CreateAIInsight>;
export type UpdateWaypoint = Partial<CreateWaypoint>;
export type UpdateSystemAlert = Partial<CreateSystemAlert>;

// ============================================
// USER TYPE (PocketBase built-in)
// ============================================

export interface PocketBaseUser extends RecordModel {
   email: string;
   emailVisibility: boolean;
   verified: boolean;
   name?: string;
   avatar?: string;
}
