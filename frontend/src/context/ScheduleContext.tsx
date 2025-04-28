import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { Schedule } from "@/types/schedule";
import { toast } from "@/components/ui/use-toast";

/* ---------- context shape ---------- */
interface ScheduleCtx {
  schedules: Schedule[];
  addSchedule: (s: Omit<Schedule, "id">) => Promise<void>;
  updateSchedule: (id: string, s: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
  fetchScheduleById: (id: string) => Promise<Schedule>;
  filteredSchedules: Schedule[];
  setFilterCriteria: React.Dispatch<
    React.SetStateAction<{
      doctorName: string;
      patientName: string;
      department: string;
    }>
  >;
  autoScheduleEnabled: boolean;
  toggleAutoSchedule: () => void;
  loadNextPage: () => void;
}

const Ctx = createContext<ScheduleCtx | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [filterCriteria, setFilterCriteria] = useState({
    doctorName: "",
    patientName: "",
    department: "",
  });

  const [autoScheduleEnabled, setAuto] = useState(true);

  /* ---------- paginated fetch ---------- */
  useEffect(() => {
    const fetchPage = async () => {
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
    fetchPage();
  }, [page]);

  const loadNextPage = () => setPage((p) => p + 1);

  /* ---------- websockets ---------- */
  useEffect(() => {
    /* wrap body in braces so the callback returns VOID, not Socket */
    const socket: Socket = io("http://localhost:5000");

    socket.on("new_schedule", (s: Schedule) => {
      if (autoScheduleEnabled) setSchedules((prev) => [s, ...prev]);
    });

    socket.on("updated_schedule", (s: Schedule) =>
      setSchedules((prev) => prev.map((x) => (x.id === s.id ? s : x)))
    );

    socket.on("deleted_schedule", (id: string) =>
      setSchedules((prev) => prev.filter((x) => x.id !== id))
    );

    /* cleanup */
    return () => {
      socket.disconnect();
    };
  }, [autoScheduleEnabled]);

  /* ---------- CRUD helpers ---------- */
  const addSchedule = async (body: Omit<Schedule, "id">) => {
    const r = await fetch("http://localhost:5000/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    setSchedules((prev) => [data, ...prev]);
  };

  const updateSchedule = async (id: string, body: Partial<Schedule>) => {
    const r = await fetch(`http://localhost:5000/schedules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    setSchedules((prev) => prev.map((x) => (x.id === id ? data : x)));
  };

  const deleteSchedule = async (id: string) => {
    await fetch(`http://localhost:5000/schedules/${id}`, { method: "DELETE" });
    setSchedules((prev) => prev.filter((x) => x.id !== id));
  };

  const getScheduleById = (id: string) =>
    schedules.find((s) => s.id === id);

  const fetchScheduleById = async (id: string) => {
    const r = await fetch(`http://localhost:5000/schedules/${id}`);
    return r.json();
  };

  /* ---------- filtering ---------- */
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

  const toggleAutoSchedule = useCallback(() => setAuto((a) => !a), []);

  return (
    <Ctx.Provider
      value={{
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        getScheduleById,
        fetchScheduleById,
        filteredSchedules,
        setFilterCriteria,
        autoScheduleEnabled,
        toggleAutoSchedule,
        loadNextPage,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useSchedule = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ScheduleProvider missing");
  return ctx;
};










