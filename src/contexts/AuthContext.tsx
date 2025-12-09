/**
 * SARDIN-AI - Contexto de Autenticación (PocketBase)
 * 
 * Proveedor de contexto React para manejar la autenticación.
 * Migrado de Supabase a PocketBase.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pb, onAuthChange, getCurrentUser, isAuthenticated as pbIsAuthenticated } from '@/integrations/pocketbase/client';
import {
  signIn as pbSignIn,
  signUp as pbSignUp,
  signOut as pbSignOut,
  getCurrentProfile,
} from '@/integrations/pocketbase/auth';
import type { Profile, MaritimeRole, PocketBaseUser } from '@/integrations/pocketbase/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: PocketBaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role?: MaritimeRole) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PocketBaseUser | null>(getCurrentUser() as PocketBaseUser | null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar perfil del usuario
  const fetchUserProfile = useCallback(async () => {
    if (!pbIsAuthenticated()) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await getCurrentProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, []);

  // Efecto inicial y suscripción a cambios de auth
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (pbIsAuthenticated()) {
          setUser(getCurrentUser() as PocketBaseUser);
          await fetchUserProfile();
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
        fetchUserProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchUserProfile]);

  // Iniciar sesión
  const signIn = async (email: string, password: string) => {
    try {
      const result = await pbSignIn({ email, password });

      if (!result.success) {
        toast({
          title: "Error de Inicio de Sesión",
          description: result.error || "Credenciales inválidas",
          variant: "destructive",
        });
        return { error: result.error };
      }

      await fetchUserProfile();

      toast({
        title: "¡Bienvenido a bordo!",
        description: "Sesión iniciada correctamente en SARDIN-AI",
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Registrarse
  const signUp = async (email: string, password: string, fullName: string, role: MaritimeRole = 'observer') => {
    try {
      const result = await pbSignUp({
        email,
        password,
        passwordConfirm: password,
        name: fullName,
        maritimeRole: role,
      });

      if (!result.success) {
        toast({
          title: "Error de Registro",
          description: result.error || "No se pudo crear la cuenta",
          variant: "destructive",
        });
        return { error: result.error };
      }

      await fetchUserProfile();

      toast({
        title: "¡Registro Exitoso!",
        description: "Tu cuenta ha sido creada. ¡Bienvenido a SARDIN-AI!",
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      pbSignOut();
      setUser(null);
      setProfile(null);

      toast({
        title: "Sesión Cerrada",
        description: "¡Hasta la próxima navegación!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error al Cerrar Sesión",
        description: error.message || "Error desconocido",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Refrescar perfil
  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: pbIsAuthenticated(),
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;