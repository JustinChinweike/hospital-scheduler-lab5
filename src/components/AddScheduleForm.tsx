
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "@/context/ScheduleContext";
import { departments } from "@/data/mockData";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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

const AddScheduleForm = () => {
  const navigate = useNavigate();
  const { addSchedule } = useSchedule();
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [department, setDepartment] = useState("");
  const [errors, setErrors] = useState({
    doctorName: "",
    patientName: "",
    date: "",
    time: "",
    department: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      doctorName: "",
      patientName: "",
      date: "",
      time: "",
      department: "",
    };

    if (!doctorName.trim()) {
      newErrors.doctorName = "Doctor name is required";
      isValid = false;
    }

    if (!patientName.trim()) {
      newErrors.patientName = "Patient name is required";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    if (!time) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    if (!department) {
      newErrors.department = "Department is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format date and time for storage
      const dateTime = date 
        ? `${format(date, "yyyy-MM-dd")}T${time}:00`
        : "";
      
      addSchedule({
        doctorName,
        patientName,
        dateTime,
        department,
      });
      
      navigate("/");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-blue-50 rounded-lg">
      <h1 className="text-xl font-bold text-center mb-8">ADD NEW SCHEDULE</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="doctorName">DOCTOR NAME:</Label>
          <Input
            id="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="bg-teal-100 border-teal-200"
          />
          {errors.doctorName && (
            <p className="text-destructive text-sm">{errors.doctorName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientName">PATIENT NAME:</Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="bg-teal-100 border-teal-200"
          />
          {errors.patientName && (
            <p className="text-destructive text-sm">{errors.patientName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">DATE & TIME:</Label>
          <div className="flex gap-4">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-teal-100 border-teal-200 justify-start text-left font-normal"
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

            <div className="flex-1">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-teal-100 border-teal-200 h-10"
              />
              {errors.time && (
                <p className="text-destructive text-sm">{errors.time}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">DEPARTMENT:</Label>
          <Select
            value={department}
            onValueChange={setDepartment}
          >
            <SelectTrigger className="bg-teal-100 border-teal-200">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
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
        
        <div className="flex justify-end mt-8">
          <Button 
            type="submit" 
            className="bg-teal-400 hover:bg-teal-500 text-white px-8 py-6"
          >
            Save Schedule
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddScheduleForm;
