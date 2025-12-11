import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ship, Brain, Wifi, WifiOff, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LevelBadge } from '@/components/gamification/LevelBadge';

interface MaritimeHeaderProps {
  isConnected: boolean;
  systemStatus: string;
  aiStatus: string;
}

export const MaritimeHeader: React.FC<MaritimeHeaderProps> = ({
  isConnected,
  systemStatus,
  aiStatus,
}) => {
  const { profile, signOut } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'active':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      case 'critical':
      case 'error':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-700 border-slate-500/30';
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className="maritime-panel mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-maritime-primary to-maritime-accent rounded-lg">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-maritime-primary">SARDIN-AI</h1>
                <p className="text-sm text-muted-foreground">Maritime Intelligence Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-2 px-3 py-2 bg-card/50 rounded-lg border">
                <User className="w-4 h-4 text-maritime-primary" />
                <div className="text-sm">
                  <div className="font-medium text-foreground">{profile.full_name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{profile.maritime_role}</div>
                </div>
                <div className="pl-2 border-l ml-2">
                  <LevelBadge size="sm" showProgress={false} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-emerald-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <Badge variant="outline" className={getStatusColor(isConnected ? 'operational' : 'offline')}>
                {isConnected ? 'Connected' : 'Offline'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-maritime-accent" />
              <Badge variant="outline" className={getStatusColor(systemStatus)}>
                System: {systemStatus}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-ai-neural" />
              <Badge variant="outline" className={getStatusColor(aiStatus)}>
                AI: {aiStatus}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="ml-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};