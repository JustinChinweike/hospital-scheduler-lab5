export interface ValidationResult {
  doctorName?: string;
  patientName?: string;
  date?: string;
  time?: string;
  department?: string;
}

export const validateScheduleForm = (
  doctorName: string,
  patientName: string,
  date: Date,
  time: string,
  department: string
): ValidationResult => {
  const errors: ValidationResult = {};

  if (!doctorName.trim()) {
    errors.doctorName = "Doctor name is required";
  }

  if (!patientName.trim()) {
    errors.patientName = "Patient name is required";
  }

  if (!date) {
    errors.date = "Date is required";
  }

  if (!time) {
    errors.time = "Time is required";
  }

  if (!department) {
    errors.department = "Department is required";
  }

  return errors;
};
