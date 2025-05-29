import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { Schedule } from "../types/schedule";
import { useOffline } from "./OfflineContext";
import { toast } from "../hooks/use-toast";
import { io, Socket } from "socket.io-client";

interface ScheduleCtx {
  schedules: Schedule[];
  filteredSchedules: Schedule[];
  setFilterCriteria: React.Dispatch<
    React.SetStateAction<{
      doctorName: string;
      patientName: string;
      department: string;
    }>
  >;
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

  // Gold: Real-time websocket
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  // Fetch paginated schedules
  const fetchSchedules = async () => {
    try {
      const r = await fetch(
        `http://localhost:5000/schedules?page=${page}&limit=${limit}`
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

  // Filtering
  const filteredSchedules = schedules.filter((s) => {
    const d =
      !filterCriteria.doctorName ||
      s.doctorName
        .toLowerCase()
        .includes(filterCriteria.doctorName.toLowerCase());
    const p =
      !filterCriteria.patientName ||
      s.patientName
        .toLowerCase()
        .includes(filterCriteria.patientName.toLowerCase());
    const dept =
      !filterCriteria.department ||
      filterCriteria.department === "all" ||
      s.department === filterCriteria.department;
    return d && p && dept;
  });

  // CRUD
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
    await fetch("http://localhost:5000/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // Do NOT update setSchedules here; let the websocket event handle it!
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
    await fetch(`http://localhost:5000/schedules/${schedule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    });
    // Do NOT update setSchedules here; let the websocket event handle it!
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
    await fetch(`http://localhost:5000/schedules/${id}`, {
      method: "DELETE",
    });
    // Do NOT update setSchedules here; let the websocket event handle it!
  };

  const getScheduleById = (id: string) => schedules.find((s) => s.id === id);

  // Gold: WebSocket real-time updates
  useEffect(() => {
    if (!autoScheduleEnabled) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    // Connect to backend websocket
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.on("connect", () => {
      // Optionally show a toast or log
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
  }, [autoScheduleEnabled]);

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


// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
//   useCallback,
// } from "react";
// import { io, Socket } from "socket.io-client";
// import { Schedule } from "../types/schedule";
// import { toast } from "../components/ui/use-toast";

// /* ---------- context shape ---------- */
// interface ScheduleCtx {
//   schedules: Schedule[];
//   addSchedule: (s: Omit<Schedule, "id">) => Promise<void>;
//   updateSchedule: (id: string, s: Partial<Schedule>) => Promise<void>;
//   deleteSchedule: (id: string) => Promise<void>;
//   getScheduleById: (id: string) => Schedule | undefined;
//   fetchScheduleById: (id: string) => Promise<Schedule>;
//   filteredSchedules: Schedule[];
//   setFilterCriteria: React.Dispatch<
//     React.SetStateAction<{
//       doctorName: string;
//       patientName: string;
//       department: string;
//     }>
//   >;
//   autoScheduleEnabled: boolean;
//   toggleAutoSchedule: () => void;
//   loadNextPage: () => void;
// }

// const Ctx = createContext<ScheduleCtx | undefined>(undefined);

// export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   const [page, setPage] = useState(1);
//   const limit = 20;

//   const [filterCriteria, setFilterCriteria] = useState({
//     doctorName: "",
//     patientName: "",
//     department: "",
//   });

//   const [autoScheduleEnabled, setAuto] = useState(true);

//   /* ---------- paginated fetch ---------- */
//   useEffect(() => {
//     const fetchPage = async () => {
//       try {
//         const r = await fetch(
//           `http://localhost:5000/schedules?page=${page}&limit=${limit}`
//         );
//         const j = await r.json();
//         setSchedules((prev) => (page === 1 ? j.data : [...prev, ...j.data]));
//       } catch {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Cannot load schedules",
//         });
//       }
//     };
//     fetchPage();
//   }, [page]);

//   const loadNextPage = () => setPage((p) => p + 1);

//   /* ---------- websockets ---------- */
//   useEffect(() => {
//     /* wrap body in braces so the callback returns VOID, not Socket */
//     const socket: Socket = io("http://localhost:5000");

//     socket.on("new_schedule", (s: Schedule) => {
//       if (autoScheduleEnabled) setSchedules((prev) => [s, ...prev]);
//     });

//     socket.on("updated_schedule", (s: Schedule) =>
//       setSchedules((prev) => prev.map((x) => (x.id === s.id ? s : x)))
//     );

//     socket.on("deleted_schedule", (id: string) =>
//       setSchedules((prev) => prev.filter((x) => x.id !== id))
//     );

//     /* cleanup */
//     return () => {
//       socket.disconnect();
//     };
//   }, [autoScheduleEnabled]);

//   /* ---------- CRUD helpers ---------- */
//   const addSchedule = async (body: Omit<Schedule, "id">) => {
//     const r = await fetch("http://localhost:5000/schedules", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     const data = await r.json();
//     setSchedules((prev) => [data, ...prev]);
//   };

//   const updateSchedule = async (id: string, body: Partial<Schedule>) => {
//     const r = await fetch(`http://localhost:5000/schedules/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     const data = await r.json();
//     setSchedules((prev) => prev.map((x) => (x.id === id ? data : x)));
//   };

//   const deleteSchedule = async (id: string) => {
//     await fetch(`http://localhost:5000/schedules/${id}`, { method: "DELETE" });
//     setSchedules((prev) => prev.filter((x) => x.id !== id));
//   };

//   const getScheduleById = (id: string) =>
//     schedules.find((s) => s.id === id);

//   const fetchScheduleById = async (id: string) => {
//     const r = await fetch(`http://localhost:5000/schedules/${id}`);
//     return r.json();
//   };

//   /* ---------- filtering ---------- */
//   const filteredSchedules = schedules.filter((s) => {
//     const d =
//       !filterCriteria.doctorName ||
//       s.doctorName
//         .toLowerCase()
//         .includes(filterCriteria.doctorName.toLowerCase());
//     const p =
//       !filterCriteria.patientName ||
//       s.patientName
//         .toLowerCase()
//         .includes(filterCriteria.patientName.toLowerCase());
//     const dept =
//       !filterCriteria.department ||
//       filterCriteria.department === "all" ||
//       s.department === filterCriteria.department;
//     return d && p && dept;
//   });

//   const toggleAutoSchedule = useCallback(() => setAuto((a) => !a), []);

//   return (
//     <Ctx.Provider
//       value={{
//         schedules,
//         addSchedule,
//         updateSchedule,
//         deleteSchedule,
//         getScheduleById,
//         fetchScheduleById,
//         filteredSchedules,
//         setFilterCriteria,
//         autoScheduleEnabled,
//         toggleAutoSchedule,
//         loadNextPage,
//       }}
//     >
//       {children}
//     </Ctx.Provider>
//   );
// };

// export const useSchedule = () => {
//   const ctx = useContext(Ctx);
//   if (!ctx) throw new Error("ScheduleProvider missing");
//   return ctx;
// };










