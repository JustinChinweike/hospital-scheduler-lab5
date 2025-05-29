import React, { createContext, useContext, useEffect, useState } from 'react';
import { Schedule } from '../types/schedule';

export interface PendingOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data?: Schedule;
  timestamp: number;
}

interface OfflineState {
  isOnline: boolean;
  isServerUp: boolean;
  pendingOperations: PendingOperation[];
  syncPendingOperations: () => Promise<void>;
  queueOperation: (op: PendingOperation) => void;
}

const OfflineContext = createContext<OfflineState | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServerUp, setIsServerUp] = useState(true);
  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>(() => {
    const stored = localStorage.getItem('pendingOperations');
    return stored ? JSON.parse(stored) : [];
  });
  
  const queueOperation = (op: PendingOperation) => {
    setPendingOperations(prev => [...prev, op]);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token') || '';

  // Monitor network connectivity
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

  // Check server status periodically
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        setIsServerUp(response.ok);
      } catch {
        setIsServerUp(false);
      }
    };

    const interval = setInterval(checkServer, 30000); // Check every 30 seconds
    checkServer();

    return () => clearInterval(interval);
  }, [API_URL]);

  // Save pending operations to localStorage
  useEffect(() => {
    localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
  }, [pendingOperations]);

  // Sync pending operations when back online
  const syncPendingOperations = async () => {
    if (!isOnline || !isServerUp || pendingOperations.length === 0) return;

    const operations = [...pendingOperations];
    setPendingOperations([]);

    for (const op of operations) {
      try {
        switch (op.type) {
          case 'CREATE':
            await fetch(`${API_URL}/schedules`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(op.data),
            });
            break;

          case 'UPDATE':
            if (op.data?.id) {
              await fetch(`${API_URL}/schedules/${op.data.id}`, {
                method: 'PATCH',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(op.data),
              });
            }
            break;

          case 'DELETE':
            await fetch(`${API_URL}/schedules/${op.data?.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            break;
        }
      } catch (error) {
        // If any operation fails, add it back to pending operations
        setPendingOperations(prev => [...prev, op]);
      }
    }
  };

  // Try to sync whenever we come back online or server comes back up
  useEffect(() => {
    if (isOnline && isServerUp) {
      syncPendingOperations();
    }
  }, [isOnline, isServerUp]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isServerUp,
        pendingOperations,
        syncPendingOperations,
        queueOperation,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
