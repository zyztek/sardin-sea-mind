/**
 * SARDIN-AI PocketBase Services
 * 
 * Servicios CRUD para todas las colecciones de la base de datos.
 * Reemplaza las integraciones de Supabase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { pb } from './client';
import {
   Collections,
   Vessel,
   SensorData,
   AIInsight,
   Waypoint,
   SystemAlert,
   CreateVessel,
   CreateSensorData,
   CreateAIInsight,
   CreateWaypoint,
   CreateSystemAlert,
   UpdateVessel,
   UpdateAIInsight,
   UpdateSystemAlert,
} from './types';
import { ListResult, RecordSubscription } from 'pocketbase';

// ============================================
// VESSELS SERVICE
// ============================================

export const vesselsService = {
   /**
    * Obtener todas las embarcaciones
    */
   async getAll(page = 1, perPage = 50): Promise<ListResult<Vessel>> {
      return pb.collection(Collections.VESSELS).getList<Vessel>(page, perPage, {
         sort: '-created',
      });
   },

   /**
    * Obtener una embarcación por ID
    */
   async getById(id: string): Promise<Vessel> {
      return pb.collection(Collections.VESSELS).getOne<Vessel>(id);
   },

   /**
    * Crear nueva embarcación
    */
   async create(data: CreateVessel): Promise<Vessel> {
      return pb.collection(Collections.VESSELS).create<Vessel>(data);
   },

   /**
    * Actualizar embarcación
    */
   async update(id: string, data: UpdateVessel): Promise<Vessel> {
      return pb.collection(Collections.VESSELS).update<Vessel>(id, data);
   },

   /**
    * Eliminar embarcación
    */
   async delete(id: string): Promise<boolean> {
      return pb.collection(Collections.VESSELS).delete(id);
   },

   /**
    * Suscribirse a cambios en tiempo real
    */
   subscribe(callback: (data: RecordSubscription<Vessel>) => void): () => void {
      pb.collection(Collections.VESSELS).subscribe<Vessel>('*', callback);
      return () => pb.collection(Collections.VESSELS).unsubscribe('*');
   },
};

// ============================================
// SENSOR DATA SERVICE
// ============================================

export const sensorDataService = {
   /**
    * Obtener datos de sensores recientes
    */
   async getRecent(vesselId?: string, limit = 100): Promise<SensorData[]> {
      const filter = vesselId ? `vessel="${vesselId}"` : '';
      const result = await pb.collection(Collections.SENSOR_DATA).getList<SensorData>(1, limit, {
         sort: '-timestamp',
         filter,
      });
      return result.items;
   },

   /**
    * Obtener últimos datos de un sensor específico
    */
   async getLatest(vesselId: string): Promise<SensorData | null> {
      try {
         return await pb.collection(Collections.SENSOR_DATA).getFirstListItem<SensorData>(
            `vessel="${vesselId}"`,
            { sort: '-timestamp' }
         );
      } catch {
         return null;
      }
   },

   /**
    * Registrar nuevos datos de sensores
    */
   async create(data: CreateSensorData): Promise<SensorData> {
      return pb.collection(Collections.SENSOR_DATA).create<SensorData>({
         ...data,
         timestamp: data.timestamp || new Date().toISOString(),
      });
   },

   /**
    * Obtener datos por rango de tiempo
    */
   async getByTimeRange(vesselId: string, startTime: string, endTime: string): Promise<SensorData[]> {
      const result = await pb.collection(Collections.SENSOR_DATA).getFullList<SensorData>({
         filter: `vessel="${vesselId}" && timestamp >= "${startTime}" && timestamp <= "${endTime}"`,
         sort: 'timestamp',
      });
      return result;
   },

   /**
    * Suscribirse a actualizaciones en tiempo real
    */
   subscribe(callback: (data: RecordSubscription<SensorData>) => void): () => void {
      pb.collection(Collections.SENSOR_DATA).subscribe<SensorData>('*', callback);
      return () => pb.collection(Collections.SENSOR_DATA).unsubscribe('*');
   },
};

// ============================================
// AI INSIGHTS SERVICE
// ============================================

export const aiInsightsService = {
   /**
    * Obtener insights activos (no resueltos)
    */
   async getActive(): Promise<AIInsight[]> {
      const result = await pb.collection(Collections.AI_INSIGHTS).getFullList<AIInsight>({
         filter: 'resolved_at = null || resolved_at = ""',
         sort: '-created',
      });
      return result;
   },

   /**
    * Obtener todos los insights
    */
   async getAll(page = 1, perPage = 50): Promise<ListResult<AIInsight>> {
      return pb.collection(Collections.AI_INSIGHTS).getList<AIInsight>(page, perPage, {
         sort: '-created',
      });
   },

   /**
    * Crear nuevo insight
    */
   async create(data: CreateAIInsight): Promise<AIInsight> {
      return pb.collection(Collections.AI_INSIGHTS).create<AIInsight>(data);
   },

   /**
    * Marcar insight como resuelto
    */
   async resolve(id: string): Promise<AIInsight> {
      return pb.collection(Collections.AI_INSIGHTS).update<AIInsight>(id, {
         resolved_at: new Date().toISOString(),
      });
   },

   /**
    * Actualizar insight
    */
   async update(id: string, data: UpdateAIInsight): Promise<AIInsight> {
      return pb.collection(Collections.AI_INSIGHTS).update<AIInsight>(id, data);
   },

   /**
    * Suscribirse a nuevos insights
    */
   subscribe(callback: (data: RecordSubscription<AIInsight>) => void): () => void {
      pb.collection(Collections.AI_INSIGHTS).subscribe<AIInsight>('*', callback);
      return () => pb.collection(Collections.AI_INSIGHTS).unsubscribe('*');
   },
};

// ============================================
// WAYPOINTS SERVICE
// ============================================

export const waypointsService = {
   /**
    * Obtener waypoints de una embarcación
    */
   async getByVessel(vesselId: string): Promise<Waypoint[]> {
      const result = await pb.collection(Collections.WAYPOINTS).getFullList<Waypoint>({
         filter: `vessel="${vesselId}"`,
         sort: 'created',
      });
      return result;
   },

   /**
    * Obtener todos los waypoints
    */
   async getAll(): Promise<Waypoint[]> {
      return pb.collection(Collections.WAYPOINTS).getFullList<Waypoint>({
         sort: '-created',
      });
   },

   /**
    * Crear nuevo waypoint
    */
   async create(data: CreateWaypoint): Promise<Waypoint> {
      return pb.collection(Collections.WAYPOINTS).create<Waypoint>(data);
   },

   /**
    * Actualizar waypoint
    */
   async update(id: string, data: Partial<CreateWaypoint>): Promise<Waypoint> {
      return pb.collection(Collections.WAYPOINTS).update<Waypoint>(id, data);
   },

   /**
    * Eliminar waypoint
    */
   async delete(id: string): Promise<boolean> {
      return pb.collection(Collections.WAYPOINTS).delete(id);
   },

   /**
    * Suscribirse a cambios
    */
   subscribe(callback: (data: RecordSubscription<Waypoint>) => void): () => void {
      pb.collection(Collections.WAYPOINTS).subscribe<Waypoint>('*', callback);
      return () => pb.collection(Collections.WAYPOINTS).unsubscribe('*');
   },
};

// ============================================
// SYSTEM ALERTS SERVICE
// ============================================

export const systemAlertsService = {
   /**
    * Obtener alertas no reconocidas
    */
   async getUnacknowledged(): Promise<SystemAlert[]> {
      const result = await pb.collection(Collections.SYSTEM_ALERTS).getFullList<SystemAlert>({
         filter: 'acknowledged = false',
         sort: '-created',
      });
      return result;
   },

   /**
    * Obtener todas las alertas
    */
   async getAll(page = 1, perPage = 50): Promise<ListResult<SystemAlert>> {
      return pb.collection(Collections.SYSTEM_ALERTS).getList<SystemAlert>(page, perPage, {
         sort: '-created',
      });
   },

   /**
    * Crear nueva alerta
    */
   async create(data: CreateSystemAlert): Promise<SystemAlert> {
      return pb.collection(Collections.SYSTEM_ALERTS).create<SystemAlert>(data);
   },

   /**
    * Reconocer alerta
    */
   async acknowledge(id: string, userId: string): Promise<SystemAlert> {
      return pb.collection(Collections.SYSTEM_ALERTS).update<SystemAlert>(id, {
         acknowledged: true,
         acknowledged_at: new Date().toISOString(),
         acknowledged_by: userId,
      });
   },

   /**
    * Actualizar alerta
    */
   async update(id: string, data: UpdateSystemAlert): Promise<SystemAlert> {
      return pb.collection(Collections.SYSTEM_ALERTS).update<SystemAlert>(id, data);
   },

   /**
    * Suscribirse a nuevas alertas
    */
   subscribe(callback: (data: RecordSubscription<SystemAlert>) => void): () => void {
      pb.collection(Collections.SYSTEM_ALERTS).subscribe<SystemAlert>('*', callback);
      return () => pb.collection(Collections.SYSTEM_ALERTS).unsubscribe('*');
   },
};

// ============================================
// EXPORTAR TODO
// ============================================

export const services = {
   vessels: vesselsService,
   sensorData: sensorDataService,
   aiInsights: aiInsightsService,
   waypoints: waypointsService,
   systemAlerts: systemAlertsService,
};

export default services;
