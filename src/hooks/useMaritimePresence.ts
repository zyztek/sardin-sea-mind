import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  user_id: string;
  full_name: string;
  maritime_role: string;
  online_at: string;
  status: 'online' | 'away' | 'offline';
  vessel_assignment?: string;
}

export const useMaritimePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile) return;

    const maritimeRoom = supabase.channel('maritime_operations');

    maritimeRoom
      .on('presence', { event: 'sync' }, () => {
        const newState = maritimeRoom.presenceState();
        const users = Object.keys(newState).map(key => {
          const presence = newState[key][0] as UserPresence;
          return presence;
        });
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        const userStatus: UserPresence = {
          user_id: user.id,
          full_name: profile.full_name,
          maritime_role: profile.maritime_role,
          online_at: new Date().toISOString(),
          status: 'online',
          vessel_assignment: profile.vessel_assignment,
        };

        await maritimeRoom.track(userStatus);
      });

    // Update status periodically
    const statusInterval = setInterval(async () => {
      if (maritimeRoom.state === 'joined') {
        await maritimeRoom.track({
          user_id: user.id,
          full_name: profile.full_name,
          maritime_role: profile.maritime_role,
          online_at: new Date().toISOString(),
          status: 'online',
          vessel_assignment: profile.vessel_assignment,
        });
      }
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(statusInterval);
      supabase.removeChannel(maritimeRoom);
    };
  }, [user, profile]);

  const updateStatus = async (status: 'online' | 'away') => {
    if (!user || !profile) return;

    const maritimeRoom = supabase.channel('maritime_operations');
    await maritimeRoom.track({
      user_id: user.id,
      full_name: profile.full_name,
      maritime_role: profile.maritime_role,
      online_at: new Date().toISOString(),
      status,
      vessel_assignment: profile.vessel_assignment,
    });
  };

  return {
    onlineUsers,
    updateStatus
  };
};