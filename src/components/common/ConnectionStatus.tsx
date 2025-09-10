import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Database, Satellite } from 'lucide-react';
import { useOfflineMode } from '@/hooks/useOfflineMode';

export const ConnectionStatus: React.FC = () => {
  const { isOnline, offlineData } = useOfflineMode();

  return (
    <Card className="maritime-panel">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-maritime-primary" />
              <span className="text-sm text-muted-foreground">
                DB: Connected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Satellite className="w-4 h-4 text-ai-neural" />
              <span className="text-sm text-muted-foreground">
                GPS: Active
              </span>
            </div>
          </div>
          
          {!isOnline && offlineData.cachedData.length > 0 && (
            <Badge variant="secondary">
              {offlineData.cachedData.length} items cached
            </Badge>
          )}
        </div>
        
        {offlineData.lastSync && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last sync: {new Date(offlineData.lastSync).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};