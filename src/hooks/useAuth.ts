/**
 * SARDIN-AI - Hook de Autenticación PocketBase
 * 
 * Hook React para manejar el estado de autenticación.
 * Reemplaza la funcionalidad de Supabase Auth.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { useState, useEffect, useCallback } from 'react';
import { pb, onAuthChange, getCurrentUser, isAuthenticated } from '@/integrations/pocketbase/client';
import {
   signIn as pbSignIn,
   signUp as pbSignUp,
   signOut as pbSignOut,
   signInWithOAuth as pbSignInWithOAuth,
   getCurrentProfile,
   type SignInData,
   type SignUpData,
   type AuthResult,
} from '@/integrations/pocketbase/auth';
import type { Profile, PocketBaseUser } from '@/integrations/pocketbase/types';

export interface UseAuthReturn {
   // Estado
   user: PocketBaseUser | null;
   profile: Profile | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   error: string | null;

   // Acciones
   signIn: (data: SignInData) => Promise<AuthResult>;
   signUp: (data: SignUpData) => Promise<AuthResult>;
   signOut: () => void;
   signInWithGoogle: () => Promise<AuthResult>;
   signInWithGitHub: () => Promise<AuthResult>;
   refreshProfile: () => Promise<void>;
   clearError: () => void;
}

export function useAuth(): UseAuthReturn {
   const [user, setUser] = useState<PocketBaseUser | null>(getCurrentUser() as PocketBaseUser | null);
   const [profile, setProfile] = useState<Profile | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Cargar perfil del usuario
   const fetchProfile = useCallback(async () => {
      if (!isAuthenticated()) {
         setProfile(null);
         return;
      }

      try {
         const userProfile = await getCurrentProfile();
         setProfile(userProfile);
      } catch (err) {
         console.error('Error fetching profile:', err);
         setProfile(null);
      }
   }, []);

   // Efecto inicial y suscripción a cambios de auth
   useEffect(() => {
      const initAuth = async () => {
         setIsLoading(true);
         try {
            if (isAuthenticated()) {
               setUser(getCurrentUser() as PocketBaseUser);
               await fetchProfile();
            }
         } finally {
            setIsLoading(false);
         }
      };

      initAuth();

      // Suscribirse a cambios de autenticación
      const unsubscribe = onAuthChange(() => {
         const currentUser = getCurrentUser();
         setUser(currentUser as PocketBaseUser | null);

         if (currentUser) {
            fetchProfile();
         } else {
            setProfile(null);
         }
      });

      return () => {
         unsubscribe();
      };
   }, [fetchProfile]);

   // Iniciar sesión
   const signIn = useCallback(async (data: SignInData): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
         const result = await pbSignIn(data);

         if (!result.success) {
            setError(result.error || 'Error al iniciar sesión');
         } else {
            await fetchProfile();
         }

         return result;
      } finally {
         setIsLoading(false);
      }
   }, [fetchProfile]);

   // Registrarse
   const signUp = useCallback(async (data: SignUpData): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
         const result = await pbSignUp(data);

         if (!result.success) {
            setError(result.error || 'Error al registrarse');
         } else {
            await fetchProfile();
         }

         return result;
      } finally {
         setIsLoading(false);
      }
   }, [fetchProfile]);

   // Cerrar sesión
   const signOut = useCallback(() => {
      pbSignOut();
      setUser(null);
      setProfile(null);
      setError(null);
   }, []);

   // OAuth con Google
   const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
         const result = await pbSignInWithOAuth('google');

         if (!result.success) {
            setError(result.error || 'Error con Google');
         } else {
            await fetchProfile();
         }

         return result;
      } finally {
         setIsLoading(false);
      }
   }, [fetchProfile]);

   // OAuth con GitHub
   const signInWithGitHub = useCallback(async (): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
         const result = await pbSignInWithOAuth('github');

         if (!result.success) {
            setError(result.error || 'Error con GitHub');
         } else {
            await fetchProfile();
         }

         return result;
      } finally {
         setIsLoading(false);
      }
   }, [fetchProfile]);

   // Refrescar perfil manualmente
   const refreshProfile = useCallback(async () => {
      await fetchProfile();
   }, [fetchProfile]);

   // Limpiar error
   const clearError = useCallback(() => {
      setError(null);
   }, []);

   return {
      user,
      profile,
      isLoading,
      isAuthenticated: isAuthenticated(),
      error,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      signInWithGitHub,
      refreshProfile,
      clearError,
   };
}

export default useAuth;
