interface StorageData {
  orders: any[];
  history: any[];
  stats: any;
  profile: any;
  pendingActions: PendingAction[];
  lastSync: number;
}

interface PendingAction {
  id: string;
  type: 'accept' | 'start_delivery' | 'complete' | 'scan_qr';
  orderId: string;
  timestamp: number;
  data?: any;
}

const STORAGE_KEY = 'courier_app_data';
const SYNC_QUEUE_KEY = 'courier_sync_queue';

export class OfflineStorage {
  private static instance: OfflineStorage;

  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  saveData(data: Partial<StorageData>): void {
    try {
      const existing = this.getData();
      const updated = { ...existing, ...data, lastSync: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  getData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    return {
      orders: [],
      history: [],
      stats: { today: 0, week: 0, month: 0, earnings: 0 },
      profile: null,
      pendingActions: [],
      lastSync: 0,
    };
  }

  addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): void {
    const data = this.getData();
    const newAction: PendingAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };
    data.pendingActions.push(newAction);
    this.saveData(data);
  }

  getPendingActions(): PendingAction[] {
    return this.getData().pendingActions;
  }

  clearPendingActions(): void {
    const data = this.getData();
    data.pendingActions = [];
    this.saveData(data);
  }

  getLastSyncTime(): number {
    return this.getData().lastSync;
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const storage = OfflineStorage.getInstance();
