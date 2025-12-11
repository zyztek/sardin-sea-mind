import { useState, useEffect } from 'react';
import { OfflineStorageService } from '@/services/OfflineStorageService';
import { useToast } from '@/hooks/use-toast';

export const useSyncManager = () => {
   const [isOnline, setIsOnline] = useState(navigator.onLine);
   const [pendingItems, setPendingItems] = useState(OfflineStorageService.getQueueSize());
   const [isSyncing, setIsSyncing] = useState(false);
   const { toast } = useToast();

   // Monitor network status
   useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
      };
   }, []);

   // Update pending items counts periodically or when window gets focus
   useEffect(() => {
      const checkQueue = () => setPendingItems(OfflineStorageService.getQueueSize());
      window.addEventListener('focus', checkQueue);
      // Also check periodically
      const interval = setInterval(checkQueue, 2000);

      return () => {
         window.removeEventListener('focus', checkQueue);
         clearInterval(interval);
      }
   }, []);

   // Sync logic
   const syncNow = async () => {
      if (!isOnline || pendingItems === 0) return;

      setIsSyncing(true);
      const queue = OfflineStorageService.getQueue();
      let syncedCount = 0;

      try {
         // Here we would iterate and process, e.g. sending to PocketBase
         // For MVP we simulate processing
         for (const item of queue) {
            console.log(`Processing offline item: ${item.type}`, item.payload);
            // Simulate API call delay
            await new Promise(r => setTimeout(r, 500));

            // Remove from queue if successful
            OfflineStorageService.removeFromQueue(item.id);
            syncedCount++;
         }

         if (syncedCount > 0) {
            toast({
               title: "Sincronización Completada",
               description: `${syncedCount} elementos se han guardado en la nube.`,
               variant: "default",
            });
         }
         setPendingItems(0);

      } catch (error) {
         console.error("Sync failed", error);
         toast({
            title: "Error de Sincronización",
            description: "No se pudieron guardar todos los datos.",
            variant: "destructive",
         });
      } finally {
         setIsSyncing(false);
      }
   };

   // Auto-sync when coming online
   useEffect(() => {
      if (isOnline && pendingItems > 0) {
         syncNow();
      }
   }, [isOnline]);

   return {
      isOnline,
      pendingItems,
      isSyncing,
      syncNow
   };
};
