
import React from "react";
import { useOffline } from "../context/OfflineContext";
import { AlertCircle, CloudOff, Server, ServerOff, Wifi, WifiOff } from "lucide-react";
import { cn } from "../lib/utils";

export function NetworkStatus() {
  const { isOnline, isServerUp, pendingOperations } = useOffline();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {/* Network Status */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300",
          isOnline
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800 animate-pulse"
        )}
      >
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        {isOnline ? "Online" : "Offline"}
      </div>

      {/* Server Status */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300",
          isServerUp
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800 animate-pulse"
        )}
      >
        {isServerUp ? (
          <Server className="h-4 w-4" />
        ) : (
          <ServerOff className="h-4 w-4" />
        )}
        {isServerUp ? "Server Connected" : "Server Down"}
      </div>

      {/* Pending Operations Badge */}
      {pendingOperations.length > 0 && (
        <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 shadow-lg">
          <AlertCircle className="h-4 w-4" />
          {pendingOperations.length} pending {pendingOperations.length === 1 ? "change" : "changes"}
        </div>
      )}
    </div>
  );
} 