import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, Achievement, UserAchievement, LEVELS, INITIAL_ACHIEVEMENTS, AchievementCode } from '@/types/gamification';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface GamificationContextType {
   stats: UserStats | null;
   achievements: UserAchievement[];
   allAchievements: Achievement[];
   addXP: (amount: number, reason?: string) => void;
   unlockAchievement: (code: AchievementCode) => void;
   getLevelProgress: () => number;
   getLevelTitle: () => string;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Mock data storage for "serverless" simulation if PB schema not present
const LOCAL_STORAGE_KEY = 'sardin_gamification_v1';

export function GamificationProvider({ children }: { children: React.ReactNode }) {
   const { user } = useAuth();
   const [stats, setStats] = useState<UserStats | null>(null);
   const [achievements, setUsersAchievements] = useState<UserAchievement[]>([]);
   // In a real app, these would be fetched from DB
   const [allAchievements] = useState<Achievement[]>(
      INITIAL_ACHIEVEMENTS.map((a, i) => ({ ...a, id: `ach_${i}` }))
   );

   useEffect(() => {
      if (user) {
         loadUserData(user.id);
      }
   }, [user]);

   const loadUserData = (userId: string) => {
      // Try calculate level based on XP
      const savedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
      if (savedData) {
         const parsed = JSON.parse(savedData);
         setStats(parsed.stats);
         setUsersAchievements(parsed.achievements);
      } else {
         // Initialize new user
         const initialStats: UserStats = {
            id: `stats_${userId}`,
            user_id: userId,
            level: 1,
            current_xp: 0,
            next_level_xp: 200,
            total_trips: 0,
            total_catches_kg: 0,
            login_streak: 1,
            last_login: new Date().toISOString()
         };
         setStats(initialStats);
         saveData(userId, initialStats, []);

         // Award first login immediately
         setTimeout(() => unlockAchievement('FIRST_LOGIN'), 1000);
      }
   };

   const saveData = (userId: string, newStats: UserStats, newAchievements: UserAchievement[]) => {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify({
         stats: newStats,
         achievements: newAchievements
      }));
   };

   const getLevelFromXP = (xp: number) => {
      // Simple formula: XP = Level * 200 (scale up later)
      return Math.floor(xp / 200) + 1;
   };

   const addXP = (amount: number, reason?: string) => {
      if (!stats || !user) return;

      const newXP = stats.current_xp + amount;
      const newLevel = getLevelFromXP(newXP);

      const leveledUp = newLevel > stats.level;

      const newStats = {
         ...stats,
         current_xp: newXP,
         level: newLevel,
         next_level_xp: (newLevel * 200)
      };

      setStats(newStats);
      saveData(user.id, newStats, achievements);

      if (leveledUp) {
         toast.success(`¡SUBISTE DE NIVEL!`, {
            description: `Ahora eres nivel ${newLevel}. ¡Sigue así!`,
            duration: 5000,
            icon: '🆙'
         });
         // Play sound effect here if implemented
      } else if (reason) {
         // Optional toast for small XP gains to avoid spam
         // toast.info(`+${amount} XP: ${reason}`); 
      }
   };

   const unlockAchievement = (code: AchievementCode) => {
      if (!stats || !user) return;

      const achievementDef = allAchievements.find(a => a.code === code);
      if (!achievementDef) return;

      const alreadyUnlocked = achievements.some(ua => ua.achievement_id === achievementDef.id);
      if (alreadyUnlocked) return;

      const newUnlock: UserAchievement = {
         id: `ua_${Date.now()}`,
         user_id: user.id,
         achievement_id: achievementDef.id,
         unlocked_at: new Date().toISOString(),
         achievement: achievementDef
      };

      const newAchievements = [...achievements, newUnlock];
      setUsersAchievements(newAchievements);

      // Add rewards
      addXP(achievementDef.xp_reward, `Logro: ${achievementDef.title}`);

      // Persist
      saveData(user.id, stats, newAchievements);

      // Toast Notification
      toast.success(`🏆 LOGRO DESBLOQUEADO: ${achievementDef.title}`, {
         description: achievementDef.description,
         duration: 5000,
         className: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      });
   };

   const getLevelProgress = () => {
      if (!stats) return 0;
      const prevLevelXP = (stats.level - 1) * 200;
      const levelXP = stats.current_xp - prevLevelXP;
      const requiredXP = 200; // Fixed 200 per level for simple MVP
      return Math.min(100, (levelXP / requiredXP) * 100);
   };

   const getLevelTitle = () => {
      if (!stats) return "Grumete";
      const rank = LEVELS.find(r => stats.level >= r.min && stats.level <= r.max);
      return rank ? rank.title : "Leyenda";
   };

   return (
      <GamificationContext.Provider value={{
         stats,
         achievements,
         allAchievements,
         addXP,
         unlockAchievement,
         getLevelProgress,
         getLevelTitle
      }}>
         {children}
      </GamificationContext.Provider>
   );
}

export function useGamification() {
   const context = useContext(GamificationContext);
   if (context === undefined) {
      throw new Error('useGamification must be used within a GamificationProvider');
   }
   return context;
}
