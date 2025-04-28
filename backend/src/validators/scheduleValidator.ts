// src/validators/scheduleValidator.ts
import { z } from "zod";

export const scheduleSchema = z.object({
  doctorName: z.string().min(3),
  patientName: z.string().min(3),
  dateTime: z.string().datetime(),
  department: z.string().min(3),
});
