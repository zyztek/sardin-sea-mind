import { useGamification } from '@/contexts/GamificationContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Lock, Award, TrendingUp } from 'lucide-react';
import { LevelBadge } from './LevelBadge';

export function ProfileGamified() {
   const { stats, achievements, allAchievements } = useGamification();

   if (!stats) return <div>Cargando perfil...</div>;

   return (
      <div className="grid gap-6 md:grid-cols-2">
         {/* Stats Card */}
         <Card className="col-span-1 border-primary/20 bg-primary/5">
            <CardHeader>
               <CardTitle className="flex items-center justify-between">
                  Capitán Digital
                  <LevelBadge size="lg" showProgress={false} />
               </CardTitle>
               <CardDescription>Estadísticas de carrera</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nivel Actual</span>
                  <span className="text-2xl font-bold">{stats.level}</span>
               </div>

               <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                     <span>Progreso al Nivel {stats.level + 1}</span>
                     <span>{stats.current_xp} XP</span>
                  </div>
                  <Progress value={(stats.current_xp % 200) / 2} className="h-2" />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                     <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                     <span className="text-xl font-bold">{stats.total_trips || 0}</span>
                     <span className="text-xs text-muted-foreground">Viajes</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                     <Award className="h-5 w-5 text-blue-500 mb-1" />
                     <span className="text-xl font-bold">{stats.login_streak}</span>
                     <span className="text-xs text-muted-foreground">Días Racha</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Achievements Card */}
         <Card className="col-span-1 md:row-span-2">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Salón de la Fama
               </CardTitle>
               <CardDescription>
                  {achievements.length} de {allAchievements.length} logros desbloqueados
               </CardDescription>
            </CardHeader>
            <CardContent>
               <ScrollArea className="h-[300px] w-full pr-4">
                  <div className="space-y-4">
                     {allAchievements.map((achievement) => {
                        const isUnlocked = achievements.some(ua => ua.achievement_id === achievement.id);
                        return (
                           <div
                              key={achievement.code}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${isUnlocked
                                    ? 'bg-yellow-500/10 border-yellow-500/50'
                                    : 'bg-muted/50 border-muted opacity-60 grayscale'
                                 }`}
                           >
                              <div className="text-2xl">{achievement.icon}</div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                                    {isUnlocked ? (
                                       <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-[10px]">
                                          {new Date().toLocaleDateString()}
                                       </Badge>
                                    ) : (
                                       <Lock className="h-3 w-3 text-muted-foreground" />
                                    )}
                                 </div>
                                 <p className="text-xs text-muted-foreground mt-1">
                                    {achievement.description}
                                 </p>
                                 <span className="text-[10px] font-mono text-primary mt-2 block">
                                    +{achievement.xp_reward} XP
                                 </span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </ScrollArea>
            </CardContent>
         </Card>
      </div>
   );
}
