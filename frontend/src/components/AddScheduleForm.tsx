import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "@/context/ScheduleContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import NameInput from "./schedule/NameInput";
import { DateTimeSelector } from "./schedule/DateTimeSelector";
import DepartmentSelector from "./schedule/DepartmentSelector";
import { validateScheduleForm, ValidationResult } from "@/utils/formValidation";
import { toast } from "@/components/ui/use-toast";

const AddScheduleForm = () => {
  const navigate = useNavigate();
  const { addSchedule } = useSchedule();

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* local form state ------------------------------------------------ */
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate]         = useState<Date | undefined>(new Date());
  const [time, setTime]         = useState("09:00");
  const [department, setDepartment] = useState("");

  const [errors, setErrors] = useState<ValidationResult>({});

  /* form submit ----------------------------------------------------- */
  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateScheduleForm(
      doctorName,
      patientName,
      date as Date,
      time,
      department
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      /* 💡 build the ISO string expected by the backend */
      const dateTimeIso = new Date(
        `${format(date!, "yyyy-MM-dd")}T${time}`
      ).toISOString();

      await addSchedule({
        doctorName,
        patientName,
        dateTime: dateTimeIso,
        department,
      });

      toast({ title: "Success", 
        description: "Schedule added successfully." });
      navigate("/list-schedule");
    } catch (err) {
      console.error("❌ Failed to add schedule:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add schedule. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Add New Schedule</h1>
        <Button variant="outline" onClick={() => navigate("/list-schedule")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* names ----------------------------------------------------- */}
        <NameInput
          id="doctorName"
          label="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          error={errors.doctorName}
        />

        <NameInput
          id="patientName"
          label="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          error={errors.patientName}
        />

        {/* date & time ---------------------------------------------- */}
        <DateTimeSelector
          selectedDate={date}
          selectedTime={time}
          onDateChange={setDate}
          onTimeChange={setTime}
          dateError={errors.date}
          timeError={errors.time}
        />

        {/* department ------------------------------------------------ */}
        <DepartmentSelector
          department={department}
          setDepartment={setDepartment}
          error={errors.department}
        />

        {/* actions --------------------------------------------------- */}
        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </>
            ) : (
              "Save Schedule"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddScheduleForm;
