import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  lastSync: string;
  cachedData: any[];
  isOffline: boolean;
}

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    lastSync: new Date().toISOString(),
    cachedData: [],
    isOffline: false
  });
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineData(prev => ({ ...prev, isOffline: false }));
      toast({
        title: "Connection Restored",
        description: "Maritime systems back online. Syncing data...",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineData(prev => ({ ...prev, isOffline: true }));
      toast({
        title: "Connection Lost",
        description: "Operating in offline mode. Data will sync when connection is restored.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const syncOfflineData = async () => {
    if (isOnline && offlineData.cachedData.length > 0) {
      // Sync logic would go here
      setOfflineData(prev => ({
        ...prev,
        cachedData: [],
        lastSync: new Date().toISOString()
      }));
    }
  };

  const cacheData = (data: any) => {
    if (!isOnline) {
      setOfflineData(prev => ({
        ...prev,
        cachedData: [...prev.cachedData, { ...data, timestamp: new Date().toISOString() }]
      }));
    }
  };

  return {
    isOnline,
    offlineData,
    syncOfflineData,
    cacheData
  };
};