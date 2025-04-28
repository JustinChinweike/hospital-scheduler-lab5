// src/models/scheduleModel.ts
export interface Schedule {
    id: string;
    doctorName: string;
    patientName: string;
    dateTime: string;
    department: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
}

export const schedules: Schedule[] = []; // Temporary in-memory DB
  