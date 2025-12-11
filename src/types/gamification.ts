export type AchievementCode =
   | 'FIRST_LOGIN'
   | 'FIRST_CATCH'
   | 'WEATHER_WISE'
   | 'WEEKLY_STREAK'
   | 'MASTER_PREDICTOR'
   | 'FUEL_SAVER';

export interface Achievement {
   id: string;
   code: AchievementCode;
   title: string;
   description: string;
   xp_reward: number;
   icon: string; // Emoji or Lucide icon name
   condition_description?: string;
}

export interface UserStats {
   id: string;
   user_id: string;
   level: number;
   current_xp: number;
   next_level_xp: number;
   total_trips: number;
   total_catches_kg: number;
   login_streak: number;
   last_login: string;
}

export interface UserAchievement {
   id: string;
   user_id: string;
   achievement_id: string;
   unlocked_at: string;
   achievement?: Achievement; // Expanded relation
}

export const LEVELS = [
   { min: 1, max: 5, title: 'Grumete', min_xp: 0 },
   { min: 6, max: 15, title: 'Pescador', min_xp: 1000 },
   { min: 16, max: 30, title: 'Capitán', min_xp: 5000 },
   { min: 31, max: 45, title: 'Lobo de Mar', min_xp: 15000 },
   { min: 46, max: 100, title: 'Poseidón', min_xp: 40000 },
];

export const INITIAL_ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
   {
      code: 'FIRST_LOGIN',
      title: '¡Al Agua!',
      description: 'Inicia sesión por primera vez en SARDIN-AI',
      xp_reward: 100,
      icon: '⚓'
   },
   {
      code: 'FIRST_CATCH',
      title: 'Primer Lance',
      description: 'Registra tu primera captura de pesca',
      xp_reward: 200,
      icon: '🐟'
   },
   {
      code: 'WEATHER_WISE',
      title: 'Navegante Seguro',
      description: 'Consulta el clima antes de iniciar un viaje',
      xp_reward: 150,
      icon: '🌤️'
   },
   {
      code: 'WEEKLY_STREAK',
      title: 'Lobo de Mar',
      description: 'Usa la aplicación durante 7 días seguidos',
      xp_reward: 500,
      icon: '📅'
   }
];
