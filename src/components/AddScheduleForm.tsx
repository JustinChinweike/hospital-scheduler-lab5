
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "@/context/ScheduleContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import NameInput from "./schedule/NameInput";
import DateTimeSelector from "./schedule/DateTimeSelector";
import DepartmentSelector from "./schedule/DepartmentSelector";
import { validateScheduleForm } from "@/utils/formValidation";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateScheduleForm(
      doctorName,
      patientName,
      date,
      time,
      department
    );
    
    setErrors(validation.errors);
    
    if (validation.isValid) {
      console.log("Form validated, submitting...");
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
      
      // Navigate to list schedule page
      setTimeout(() => {
        console.log("Navigating to list schedule page");
        navigate("/list-schedule");
      }, 100);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-blue-50 rounded-lg">
      <h1 className="text-xl font-bold text-center mb-8">ADD NEW SCHEDULE</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <NameInput
          id="doctorName"
          label="DOCTOR NAME"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          error={errors.doctorName}
        />
        
        <NameInput
          id="patientName"
          label="PATIENT NAME"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          error={errors.patientName}
        />
        
        <DateTimeSelector
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          dateError={errors.date}
          timeError={errors.time}
        />
        
        <DepartmentSelector
          department={department}
          setDepartment={setDepartment}
          error={errors.department}
        />
        
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
