import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw, Database } from "lucide-react";
import { useSyncManager } from '@/hooks/useSyncManager';

interface ConnectionStatusProps {
  isOnline?: boolean; // Deprecated prop kept for compat
  className?: string; // Allow positioning overrides
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = "" }) => {
  const { isOnline, pendingItems, isSyncing, syncNow } = useSyncManager();

  if (isSyncing) {
    return (
      <Badge variant="outline" className={`bg-amber-100/50 text-amber-700 border-amber-300 animate-pulse ${className}`}>
        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        Sincronizando ({pendingItems})...
      </Badge>
    );
  }

  if (!isOnline) {
    return (
      <Badge variant="destructive" className={`${className}`}>
        <WifiOff className="w-3 h-3 mr-1" />
        Offline
        {pendingItems > 0 && (
          <span className="ml-2 pl-2 border-l border-white/20 flex items-center">
            <Database className="w-3 h-3 mr-1" />
            {pendingItems}
          </span>
        )}
      </Badge>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
        {pendingItems > 0 && (
            <Badge 
                variant="outline" 
                className="bg-blue-100/50 text-blue-700 border-blue-300 cursor-pointer hover:bg-blue-200/50"
                onClick={syncNow}
                title="Click para forzar sincronización"
            >
                <Database className="w-3 h-3 mr-1" />
                {pendingItems} Pendientes
            </Badge>
        )}
        <Badge variant="outline" className="bg-emerald-100/10 text-emerald-600 border-emerald-500/20 backdrop-blur-md">
            <Wifi className="w-3 h-3 mr-1" />
            Online
        </Badge>
    </div>
  );
};