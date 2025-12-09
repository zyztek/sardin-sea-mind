/**
 * SARDIN-AI PocketBase Integration
 * 
 * Punto de entrada principal para todas las integraciones de PocketBase.
 * 
 * Uso:
 * import { pb, services, signIn, signUp } from '@/integrations/pocketbase';
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

// Cliente principal
export { pb, isAuthenticated, getCurrentUser, getAuthToken, logout, onAuthChange } from './client';
export type { RecordModel, RecordService } from './client';

// Tipos
export * from './types';

// Autenticación
export {
   signUp,
   signIn,
   signOut,
   signInWithOAuth,
   requestPasswordReset,
   getCurrentProfile,
   updateProfile,
   hasRole,
   isCaptain,
} from './auth';
export type { SignUpData, SignInData, AuthResult } from './auth';

// Servicios de datos
export {
   vesselsService,
   sensorDataService,
   aiInsightsService,
   waypointsService,
   systemAlertsService,
   services,
} from './services';
