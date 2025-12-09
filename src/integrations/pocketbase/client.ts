/**
 * SARDIN-AI PocketBase Client
 * 
 * Este archivo configura el cliente PocketBase para la aplicación.
 * Reemplaza la integración anterior con Supabase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import PocketBase from 'pocketbase';

// URL del servidor PocketBase
// En desarrollo: http://localhost:8090
// En producción: se configurará vía variable de entorno
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

/**
 * Cliente PocketBase singleton
 * Usar: import { pb } from "@/integrations/pocketbase/client";
 */
export const pb = new PocketBase(POCKETBASE_URL);

// Configurar autorefresco del token
pb.autoCancellation(false);

/**
 * Verificar si hay una sesión activa
 */
export const isAuthenticated = (): boolean => {
   return pb.authStore.isValid;
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = () => {
   return pb.authStore.model;
};

/**
 * Obtener token de autenticación
 */
export const getAuthToken = (): string => {
   return pb.authStore.token;
};

/**
 * Cerrar sesión
 */
export const logout = (): void => {
   pb.authStore.clear();
};

/**
 * Suscribirse a cambios de autenticación
 */
export const onAuthChange = (callback: () => void): (() => void) => {
   return pb.authStore.onChange(callback);
};

// Exportar tipos útiles
export type { RecordModel, RecordService } from 'pocketbase';

export default pb;
