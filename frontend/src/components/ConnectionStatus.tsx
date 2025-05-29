import * as React from "react";
import { useOffline } from '../context/OfflineContext';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ConnectionStatus = () => {
  const { isOnline, isServerUp } = useOffline();

  if (isOnline && isServerUp) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Status</AlertTitle>
      <AlertDescription>
        {!isOnline && "You're offline. Changes will be saved locally and synced when you're back online."}
        {isOnline && !isServerUp && "Server is unreachable. Changes will be saved locally and synced when the server is available."}
      </AlertDescription>
    </Alert>
  );
}; 