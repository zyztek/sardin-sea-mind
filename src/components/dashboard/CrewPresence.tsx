import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Circle } from 'lucide-react';
import { useMaritimePresence } from '@/hooks/useMaritimePresence';

export const CrewPresence: React.FC = () => {
  const { onlineUsers } = useMaritimePresence();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-emerald-500';
      case 'away':
        return 'text-amber-500';
      default:
        return 'text-slate-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'captain':
        return 'bg-maritime-primary/20 text-maritime-primary';
      case 'engineer':
        return 'bg-ai-data/20 text-ai-data';
      case 'navigator':
        return 'bg-ai-neural/20 text-ai-neural';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="maritime-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-maritime-primary" />
          Active Crew
          <Badge variant="secondary" className="ml-auto">
            {onlineUsers.length} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {onlineUsers.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No crew members currently online
          </div>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-card/50 border"
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {user.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} fill-current`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.full_name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleColor(user.maritime_role)}`}
                  >
                    {user.maritime_role}
                  </Badge>
                </div>
                {user.vessel_assignment && (
                  <p className="text-xs text-muted-foreground">
                    {user.vessel_assignment}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Online {new Date(user.online_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};