import { create } from 'zustand';

export interface Alert {
  id: string;
  type: 'client-status' | 'license-usage' | 'lead-progress' | 'churn-risk';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
}

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
  unreadCount: () => number;
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [],
  
  addAlert: (alert) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      alerts: [newAlert, ...state.alerts].slice(0, 50), // Keep last 50 alerts
    }));
  },
  
  markAsRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      ),
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      alerts: state.alerts.map((alert) => ({ ...alert, read: true })),
    }));
  },
  
  clearAlerts: () => {
    set({ alerts: [] });
  },
  
  unreadCount: () => {
    return get().alerts.filter((alert) => !alert.read).length;
  },
}));
