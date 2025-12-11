import { useGamification } from '@/contexts/GamificationContext';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Star } from 'lucide-react';

interface LevelBadgeProps {
   size?: 'sm' | 'md' | 'lg';
   showProgress?: boolean;
   className?: string;
}

export function LevelBadge({ size = 'md', showProgress = true, className }: LevelBadgeProps) {
   const { stats, getLevelProgress, getLevelTitle } = useGamification();

   if (!stats) return null;

   const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
   };

   const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
   };

   return (
      <div className={cn("flex flex-col gap-1", className)}>
         <div className={cn("flex items-center gap-2 font-bold text-primary", sizeClasses[size])}>
            <div className="relative flex items-center justify-center">
               <Medal className={cn("text-yellow-500", iconSizes[size])} />
               <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground border-2 border-background">
                  {stats.level}
               </span>
            </div>
            <span>{getLevelTitle()}</span>
         </div>

         {showProgress && (
            <div className="w-full max-w-[120px]">
               <Progress value={getLevelProgress()} className="h-1.5" />
               <p className="text-[10px] text-muted-foreground mt-0.5 text-right">
                  {Math.floor(getLevelProgress())}% XP
               </p>
            </div>
         )}
      </div>
   );
}
