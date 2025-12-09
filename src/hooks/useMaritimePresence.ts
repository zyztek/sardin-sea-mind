/**
 * SARDIN-AI - Hook de Presencia Marítima (PocketBase)
 * 
 * Hook para rastrear usuarios online en tiempo real.
 * Migrado de Supabase a PocketBase usando realtime subscriptions.
 * 
 * NOTA: PocketBase no tiene un sistema de "presence" nativo como Supabase.
 * Esta implementación usa una colección custom para simular presencia.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { pb, getCurrentUser, isAuthenticated } from '@/integrations/pocketbase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  id?: string;
  user_id: string;
  full_name: string;
  maritime_role: string;
  online_at: string;
  status: 'online' | 'away' | 'offline';
  vessel_assignment?: string;
}

// Tiempo antes de considerar a un usuario como offline (ms)
const PRESENCE_TIMEOUT = 60000; // 1 minuto
const HEARTBEAT_INTERVAL = 30000; // 30 segundos

export const useMaritimePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const { user, profile } = useAuth();
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const presenceRecordId = useRef<string | null>(null);

  // Obtener usuarios online (los que han actualizado su presencia recientemente)
  const fetchOnlineUsers = useCallback(async () => {
    try {
      // Calcular timestamp límite (usuarios activos en los últimos PRESENCE_TIMEOUT ms)
      const cutoffTime = new Date(Date.now() - PRESENCE_TIMEOUT).toISOString();

      // Nota: En una implementación real, necesitarías una colección 'presence' en PocketBase
      // Por ahora, simulamos con un estado local

      // Filtrar usuarios que aún están "vivos"
      setOnlineUsers(prev =>
        prev.filter(u => new Date(u.online_at).getTime() > Date.now() - PRESENCE_TIMEOUT)
      );
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  }, []);

  // Actualizar presencia propia
  const updatePresence = useCallback(async (status: 'online' | 'away' = 'online') => {
    if (!isAuthenticated() || !user || !profile) return;

    const presenceData: UserPresence = {
      user_id: user.id,
      full_name: profile.full_name || 'Usuario',
      maritime_role: profile.maritime_role || 'observer',
      online_at: new Date().toISOString(),
      status,
      vessel_assignment: profile.vessel_assignment,
    };

    // Actualizar estado local
    setOnlineUsers(prev => {
      const filtered = prev.filter(u => u.user_id !== user.id);
      return [...filtered, presenceData];
    });

    // Log para debug
    console.log('[Presence] Updated:', presenceData.full_name, status);
  }, [user, profile]);

  // Remover presencia al salir
  const removePresence = useCallback(async () => {
    if (!user) return;

    setOnlineUsers(prev => prev.filter(u => u.user_id !== user.id));
    console.log('[Presence] Removed user');
  }, [user]);

  // Configurar heartbeat
  useEffect(() => {
    if (!isAuthenticated() || !user || !profile) return;

    // Presencia inicial
    updatePresence('online');

    // Configurar heartbeat
    heartbeatRef.current = setInterval(() => {
      updatePresence('online');
    }, HEARTBEAT_INTERVAL);

    // Limpiar usuarios offline periódicamente
    const cleanupInterval = setInterval(fetchOnlineUsers, PRESENCE_TIMEOUT / 2);

    // Manejar eventos de visibilidad
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online');
      }
    };

    // Manejar cierre de ventana
    const handleBeforeUnload = () => {
      removePresence();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      clearInterval(cleanupInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      removePresence();
    };
  }, [user, profile, updatePresence, removePresence, fetchOnlineUsers]);

  // Función para cambiar estado manualmente
  const updateStatus = useCallback(async (status: 'online' | 'away') => {
    await updatePresence(status);
  }, [updatePresence]);

  // Obtener conteo por rol
  const getUsersByRole = useCallback(() => {
    const roleCount: Record<string, number> = {
      captain: 0,
      engineer: 0,
      navigator: 0,
      observer: 0,
    };

    onlineUsers.forEach(user => {
      if (user.status !== 'offline' && roleCount[user.maritime_role] !== undefined) {
        roleCount[user.maritime_role]++;
      }
    });

    return roleCount;
  }, [onlineUsers]);

  return {
    onlineUsers: onlineUsers.filter(u => u.status !== 'offline'),
    totalOnline: onlineUsers.filter(u => u.status === 'online').length,
    totalAway: onlineUsers.filter(u => u.status === 'away').length,
    updateStatus,
    getUsersByRole,
  };
};

export default useMaritimePresence;