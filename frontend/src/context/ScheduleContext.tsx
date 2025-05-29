import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { Schedule } from "../types/schedule";
import { useOffline } from "./OfflineContext";
import { toast } from "../hooks/use-toast";
import { io, Socket } from "socket.io-client";

interface ScheduleCtx {
  schedules: Schedule[];
  filteredSchedules: Schedule[];
  setFilterCriteria: React.Dispatch<React.SetStateAction<{
    doctorName: string;
    patientName: string;
    department: string;
  }>>;
  addSchedule: (body: Omit<Schedule, "id">) => Promise<void>;
  updateSchedule: (schedule: Schedule) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  fetchSchedules: () => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
  loadNextPage: () => void;
  autoScheduleEnabled: boolean;
  toggleAutoSchedule: () => void;
}

const Ctx = createContext<ScheduleCtx | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({
    doctorName: "",
    patientName: "",
    department: "",
  });
  const [page, setPage] = useState(1);
  const limit = 20;
  const { isOnline, isServerUp, queueOperation } = useOffline();

  // Real-time websocket
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token') || '';

  // Fetch paginated schedules
  const fetchSchedules = async () => {
    try {
      const r = await fetch(
        `${API_URL}/schedules?page=${page}&limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const j = await r.json();
      setSchedules((prev) => (page === 1 ? j.data : [...prev, ...j.data]));
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot load schedules",
      });
    }
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line
  }, [page]);

  const loadNextPage = () => setPage((p) => p + 1);

  // Filtering logic
  const filteredSchedules = schedules.filter((s) => {
    const d =
      !filterCriteria.doctorName ||
      s.doctorName.toLowerCase().includes(filterCriteria.doctorName.toLowerCase());
    const p =
      !filterCriteria.patientName ||
      s.patientName.toLowerCase().includes(filterCriteria.patientName.toLowerCase());
    const dept =
      !filterCriteria.department ||
      filterCriteria.department === "all" ||
      s.department === filterCriteria.department;
    return d && p && dept;
  });

  // CRUD operations
  const addSchedule = async (body: Omit<Schedule, "id">) => {
    if (!isOnline || !isServerUp) {
      const tempId = "pending-" + Date.now();
      queueOperation({
        id: crypto.randomUUID(),
        type: "CREATE",
        data: { ...body, id: tempId },
        timestamp: Date.now(),
      });
      setSchedules((prev) => [
        { ...body, id: tempId },
        ...prev,
      ]);
      toast({
        title: "Offline",
        description: "Schedule queued and will sync when online.",
      });
      return;
    }
    await fetch(`${API_URL}/schedules`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
    // Do NOT update local state; websocket will handle it.
  };

  const updateSchedule = async (schedule: Schedule) => {
    if (!isOnline || !isServerUp) {
      queueOperation({
        id: crypto.randomUUID(),
        type: "UPDATE",
        data: schedule,
        timestamp: Date.now(),
      });
      setSchedules((prev) =>
        prev.map((s) => (s.id === schedule.id ? schedule : s))
      );
      toast({
        title: "Offline",
        description: "Update queued and will sync when online.",
      });
      return;
    }
    await fetch(`${API_URL}/schedules/${schedule.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(schedule),
    });
    // Do NOT update local state; websocket will handle it.
  };

  const deleteSchedule = async (id: string) => {
    if (!isOnline || !isServerUp) {
      queueOperation({
        id: crypto.randomUUID(),
        type: "DELETE",
        data: { id } as Schedule,
        timestamp: Date.now(),
      });
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Offline",
        description: "Delete queued and will sync when online.",
      });
      return;
    }
    await fetch(`${API_URL}/schedules/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    // Do NOT update local state; websocket will handle it.
  };

  const getScheduleById = (id: string) => schedules.find((s) => s.id === id);

  // Real-time WebSocket updates
  useEffect(() => {
    if (!autoScheduleEnabled) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    // Connect to backend websocket
    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      // Connected
    });

    socket.on("new_schedule", (schedule: Schedule) => {
      setSchedules((prev) => {
        if (prev.some((s) => s.id === schedule.id)) return prev;
        return [schedule, ...prev];
      });
    });

    socket.on("updated_schedule", (schedule: Schedule) => {
      setSchedules((prev) =>
        prev.map((s) => (s.id === schedule.id ? schedule : s))
      );
    });

    socket.on("deleted_schedule", (id: string) => {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, [autoScheduleEnabled, API_URL]);

  const toggleAutoSchedule = () => {
    setAutoScheduleEnabled((prev) => !prev);
    toast({
      title: !autoScheduleEnabled
        ? "Auto-Scheduler Enabled"
        : "Auto-Scheduler Disabled",
      description: !autoScheduleEnabled
        ? "Real-time automatic schedule generation is now on."
        : "Real-time automatic schedule generation is now off.",
    });
  };

  return (
    <Ctx.Provider
      value={{
        schedules,
        filteredSchedules,
        setFilterCriteria,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        fetchSchedules,
        getScheduleById,
        loadNextPage,
        autoScheduleEnabled,
        toggleAutoSchedule,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(Ctx);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
