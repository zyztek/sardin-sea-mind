export interface SyncItem {
   id: string;
   type: string;
   payload: any;
   timestamp: number;
   retryCount: number;
}

const STORAGE_KEY = 'sardin_sync_queue';

export const OfflineStorageService = {
   getQueue(): SyncItem[] {
      try {
         const stored = localStorage.getItem(STORAGE_KEY);
         return stored ? JSON.parse(stored) : [];
      } catch (e) {
         console.error('Error constructing sync queue', e);
         return [];
      }
   },

   addToQueue(item: Omit<SyncItem, 'id' | 'timestamp' | 'retryCount'>): void {
      const queue = this.getQueue();
      const newItem: SyncItem = {
         ...item,
         id: crypto.randomUUID(),
         timestamp: Date.now(),
         retryCount: 0
      };
      queue.push(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
   },

   removeFromQueue(itemId: string): void {
      const queue = this.getQueue();
      const newQueue = queue.filter(item => item.id !== itemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQueue));
   },

   clearQueue(): void {
      localStorage.removeItem(STORAGE_KEY);
   },

   getQueueSize(): number {
      return this.getQueue().length;
   }
};
