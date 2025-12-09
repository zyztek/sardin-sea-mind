/**
 * SARDIN-AI PocketBase Auth Service
 * 
 * Servicios de autenticación usando PocketBase.
 * Reemplaza la autenticación de Supabase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { pb, isAuthenticated, getCurrentUser, logout as pbLogout } from './client';
import { Profile, MaritimeRole, Collections } from './types';
import { ClientResponseError } from 'pocketbase';

// ============================================
// TIPOS
// ============================================

export interface SignUpData {
   email: string;
   password: string;
   passwordConfirm: string;
   name: string;
   maritimeRole?: MaritimeRole;
}

export interface SignInData {
   email: string;
   password: string;
}

export interface AuthResult {
   success: boolean;
   error?: string;
   user?: any;
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

/**
 * Registrar nuevo usuario
 */
export async function signUp(data: SignUpData): Promise<AuthResult> {
   try {
      // 1. Crear usuario en la colección users
      const user = await pb.collection('users').create({
         email: data.email,
         password: data.password,
         passwordConfirm: data.passwordConfirm,
         name: data.name,
         emailVisibility: true,
      });

      // 2. Crear perfil marítimo
      await pb.collection(Collections.PROFILES).create({
         user: user.id,
         full_name: data.name,
         maritime_role: data.maritimeRole || 'observer',
      });

      // 3. Autenticar automáticamente
      await pb.collection('users').authWithPassword(data.email, data.password);

      return {
         success: true,
         user: pb.authStore.model,
      };
   } catch (error) {
      if (error instanceof ClientResponseError) {
         return {
            success: false,
            error: error.message || 'Error al registrar usuario',
         };
      }
      return {
         success: false,
         error: 'Error desconocido al registrar',
      };
   }
}

/**
 * Iniciar sesión
 */
export async function signIn(data: SignInData): Promise<AuthResult> {
   try {
      const authData = await pb.collection('users').authWithPassword(
         data.email,
         data.password
      );

      return {
         success: true,
         user: authData.record,
      };
   } catch (error) {
      if (error instanceof ClientResponseError) {
         return {
            success: false,
            error: error.message || 'Credenciales inválidas',
         };
      }
      return {
         success: false,
         error: 'Error al iniciar sesión',
      };
   }
}

/**
 * Cerrar sesión
 */
export function signOut(): void {
   pbLogout();
}

/**
 * Iniciar sesión con OAuth (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord'): Promise<AuthResult> {
   try {
      const authData = await pb.collection('users').authWithOAuth2({ provider });

      // Verificar si necesita crear perfil
      const existingProfile = await pb.collection(Collections.PROFILES)
         .getFirstListItem(`user="${authData.record.id}"`)
         .catch(() => null);

      if (!existingProfile) {
         await pb.collection(Collections.PROFILES).create({
            user: authData.record.id,
            full_name: authData.record.name || authData.record.email,
            maritime_role: 'observer',
         });
      }

      return {
         success: true,
         user: authData.record,
      };
   } catch (error) {
      if (error instanceof ClientResponseError) {
         return {
            success: false,
            error: error.message || 'Error con OAuth',
         };
      }
      return {
         success: false,
         error: 'Error al autenticar con proveedor externo',
      };
   }
}

/**
 * Solicitar restablecimiento de contraseña
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
   try {
      await pb.collection('users').requestPasswordReset(email);
      return {
         success: true,
      };
   } catch (error) {
      return {
         success: false,
         error: 'Error al enviar email de recuperación',
      };
   }
}

/**
 * Obtener perfil del usuario actual
 */
export async function getCurrentProfile(): Promise<Profile | null> {
   if (!isAuthenticated()) return null;

   const user = getCurrentUser();
   if (!user) return null;

   try {
      const profile = await pb.collection(Collections.PROFILES)
         .getFirstListItem(`user="${user.id}"`);
      return profile as Profile;
   } catch {
      return null;
   }
}

/**
 * Actualizar perfil del usuario
 */
export async function updateProfile(profileId: string, data: Partial<Profile>): Promise<AuthResult> {
   try {
      await pb.collection(Collections.PROFILES).update(profileId, data);
      return { success: true };
   } catch (error) {
      return {
         success: false,
         error: 'Error al actualizar perfil',
      };
   }
}

/**
 * Verificar si el usuario tiene un rol específico
 */
export async function hasRole(role: MaritimeRole): Promise<boolean> {
   const profile = await getCurrentProfile();
   return profile?.maritime_role === role;
}

/**
 * Verificar si es capitán (máximo acceso)
 */
export async function isCaptain(): Promise<boolean> {
   return hasRole('captain');
}

// Re-exportar funciones útiles del cliente
export { isAuthenticated, getCurrentUser, logout } from './client';
