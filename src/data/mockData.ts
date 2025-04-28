import { Schedule } from "../types/schedule";

// Initial mock data for schedules
export const initialSchedules: Schedule[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    patientName: "James Wilson",
    dateTime: "2024-05-15T10:30:00",
    department: "Cardiology"
  },
  {
    id: "2",
    doctorName: "Dr. David Miller",
    patientName: "Emily Parker",
    dateTime: "2024-05-16T14:00:00",
    department: "Neurology"
  },
  {
    id: "3",
    doctorName: "Dr. Jessica Jamil",
    patientName: "Martha John",
    dateTime: "2024-05-17T09:15:00",
    department: "Surgery"
  },
  {
    id: "4",
    doctorName: "Dr. Michael Chang",
    patientName: "Robert Davis",
    dateTime: "2024-05-18T11:00:00",
    department: "Orthopedics"
  }
];

// List of departments for dropdown selection
export const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Oncology",
  "Emergency",
  "Surgery",
  "Internal Medicine",
  "Dermatology",
  "Psychiatry"
];
