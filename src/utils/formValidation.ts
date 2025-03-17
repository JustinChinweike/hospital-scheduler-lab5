
interface ScheduleFormErrors {
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  department: string;
}

export const validateScheduleForm = (
  doctorName: string,
  patientName: string,
  date: Date | undefined,
  time: string,
  department: string
): { isValid: boolean; errors: ScheduleFormErrors } => {
  let isValid = true;
  const errors = {
    doctorName: "",
    patientName: "",
    date: "",
    time: "",
    department: "",
  };

  if (!doctorName.trim()) {
    errors.doctorName = "Doctor name is required";
    isValid = false;
  }

  if (!patientName.trim()) {
    errors.patientName = "Patient name is required";
    isValid = false;
  }

  if (!date) {
    errors.date = "Date is required";
    isValid = false;
  }

  if (!time) {
    errors.time = "Time is required";
    isValid = false;
  }

  if (!department) {
    errors.department = "Department is required";
    isValid = false;
  }

  return { isValid, errors };
};
