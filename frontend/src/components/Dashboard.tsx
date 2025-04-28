// src/components/Dashboard.tsx
import { useSchedule } from "@/context/ScheduleContext";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { schedules, autoScheduleEnabled, toggleAutoSchedule } = useSchedule();

  const departmentData = schedules.reduce((acc, curr) => {
    const department = curr.department;
    const existing = acc.find((item) => item.name === department);
    existing ? existing.count++ : acc.push({ name: department, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]);

  const doctorData = schedules.reduce((acc, curr) => {
    const doctor = curr.doctorName;
    const existing = acc.find((item) => item.name === doctor);
    existing ? existing.count++ : acc.push({ name: doctor, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]);

  const dateData = schedules
    .reduce((acc, curr) => {
      const date = format(parseISO(curr.dateTime), "yyyy-MM-dd");
      const existing = acc.find((item) => item.date === date);
      existing ? existing.count++ : acc.push({ date, count: 1 });
      return acc;
    }, [] as { date: string; count: number }[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleToggle = () => {
    toggleAutoSchedule();
    toast({
      title: autoScheduleEnabled
        ? "Auto-Scheduler Disabled"
        : "Auto-Scheduler Enabled",
      description: autoScheduleEnabled
        ? "Real-time automatic schedule generation is now off."
        : "Auto-scheduling is now running every 10 seconds.",
    });
  };

  return (
    <div className="p-6 space-y-12 bg-white rounded-lg shadow-xl">
      <ConnectionStatus />
      {/* 🔁 Auto-scheduler toggle */}
      <div className="flex justify-center">
        <Button
          onClick={handleToggle}
          variant="outline"
          className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-700"
        >
          {autoScheduleEnabled
            ? "⛔ Disable Auto-Scheduler"
            : "✅ Enable Auto-Scheduler"}
        </Button>
      </div>

      <h2 className="text-2xl font-bold text-center">📊 Schedule Dashboard</h2>

      {/* Department Chart */}
      <div className="h-72">
        <h3 className="text-center font-semibold">
          Appointments by Department
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Doctor Chart */}
      <div className="h-72">
        <h3 className="text-center font-semibold">Appointments by Doctor</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={doctorData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Date Chart */}
      <div className="h-72">
        <h3 className="text-center font-semibold">Appointments by Date</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dateData}
              dataKey="count"
              nameKey="date"
              fill="#ffc658"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
