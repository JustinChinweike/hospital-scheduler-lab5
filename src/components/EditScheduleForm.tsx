import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSchedule } from "@/context/ScheduleContext";
import { departments } from "@/data/mockData";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { getScheduleById, updateSchedule } = useSchedule();

  /* ---------- local state ---------- */
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime]   = useState("");
  const [department, setDepartment] = useState("");
  const [errors, setErrors] = useState({
    doctorName: "",
    patientName: "",
    date: "",
    time: "",
    department: "",
  });

  /* ---------- load schedule once ---------- */
  useEffect(() => {
    if (!id) return;

    const schedule = getScheduleById(id);
    if (!schedule) {
      navigate("/list-schedule");                 // nothing to edit
      return;
    }

    setDoctorName(schedule.doctorName);
    setPatientName(schedule.patientName);

    const parsed = parseISO(schedule.dateTime);
    setDate(parsed);
    setTime(format(parsed, "HH:mm"));
    setDepartment(schedule.department);
  }, [id, getScheduleById, navigate]);            // ❗ removed “schedules”

  /* ---------- validation ---------- */
  const validateForm = () => {
    const next = {
      doctorName: doctorName.trim() ? "" : "Doctor name is required",
      patientName: patientName.trim() ? "" : "Patient name is required",
      date:  date ? "" : "Date is required",
      time:  time ? "" : "Time is required",
      department: department ? "" : "Department is required",
    };

    setErrors(next);
    return Object.values(next).every((v) => v === "");
  };

  /* ---------- submit ---------- */
  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    /* 💡 build a proper ISO string for zod’s `.datetime()` */
    const dateTime = date
      ? new Date(`${format(date, "yyyy-MM-dd")}T${time}`).toISOString()
      : "";

    await updateSchedule(id, {                    // ⏳ wait for success
      doctorName,
      patientName,
      dateTime,
      department,
    });

    navigate("/list-schedule");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg">
      <h1 className="text-xl font-bold text-center mb-8">EDIT SCHEDULE</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ------------ doctor ------------- */}
        <div className="space-y-2">
          <Label htmlFor="doctorName">DOCTOR NAME:</Label>
          <Input
            id="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="bg-blue-100 border-blue-200"
          />
          {errors.doctorName && (
            <p className="text-destructive text-sm">{errors.doctorName}</p>
          )}
        </div>

        {/* ------------ patient ------------ */}
        <div className="space-y-2">
          <Label htmlFor="patientName">PATIENT NAME:</Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="bg-blue-100 border-blue-200"
          />
          {errors.patientName && (
            <p className="text-destructive text-sm">{errors.patientName}</p>
          )}
        </div>

        {/* ----------- date & time ---------- */}
        <div className="space-y-2">
          <Label>DATE &amp; TIME:</Label>
          <div className="flex gap-4">
            {/* date picker */}
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-100 border-blue-200 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-destructive text-sm">{errors.date}</p>
              )}
            </div>

            {/* time input */}
            <div className="flex-1">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-blue-100 border-blue-200 h-10"
              />
              {errors.time && (
                <p className="text-destructive text-sm">{errors.time}</p>
              )}
            </div>
          </div>
        </div>

        {/* ----------- department ---------- */}
        <div className="space-y-2">
          <Label>DEPARTMENT:</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="bg-blue-100 border-blue-200">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-destructive text-sm">{errors.department}</p>
          )}
        </div>

        {/* ----------- actions ------------- */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            className="px-8 py-4"
            onClick={() => navigate("/list-schedule")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditScheduleForm;
