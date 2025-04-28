export interface Schedule {
  id: string;
  doctorName: string;
  patientName: string;
  department: string;
  dateTime: string;
  notes?: string;
  fileUrl?: string;
}
