/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Request, Response, RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { schedules, Schedule } from "../models/scheduleModel";
import { io } from "../socket";

/* ─────────────── types / schema ──────────────── */
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const scheduleSchema = z.object({
  doctorName: z.string().min(1),
  patientName: z.string().min(1),
  dateTime:   z.string().datetime(),
  department: z.string().min(1),
});

/* ─────────────── helpers ──────────────── */
const filter = (list: Schedule[], q: Partial<Record<keyof Schedule, string>>) =>
  list.filter((s) =>
    Object.entries(q).every(([k, v]) =>
      String(s[k as keyof Schedule])
        .toLowerCase()
        .includes((v ?? "").toLowerCase())
    )
  );

const sort = (list: Schedule[], by: keyof Schedule, order: "asc" | "desc") => {
  const dir = order === "asc" ? 1 : -1;
  return [...list].sort((a, b) =>
    by === "dateTime"
      ? dir * (new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      : dir * String(a[by]).localeCompare(String(b[by]))
  );
};

/* ─────────────── CRUD ──────────────── */

/** POST /schedules */
export const createSchedule: RequestHandler = (req, res) => {
  const parsed = scheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.errors });   
    return;
  }

  const file = (req as MulterRequest).file;
  const newSchedule: Schedule = {
    id: uuid(),
    ...parsed.data,
    fileUrl: file ? `/uploads/${file.filename}` : undefined,
    fileName: file?.originalname,
    fileSize: file?.size,
    fileType: file?.mimetype,
  };

  schedules.push(newSchedule);
  io.emit("new_schedule", newSchedule);
  res.status(201).json(newSchedule);
};

/** GET /schedules */
export const getSchedules: RequestHandler = (req, res) => {
  const {
    doctorName = "",
    patientName = "",
    department = "",
    dateTime = "",
    sortBy = "dateTime",
    sortOrder = "desc",
    page = "1",
    limit = "20",
  } = req.query as Record<string, string>;

  let result = filter(schedules, { doctorName, patientName, department, dateTime });
  result = sort(result, sortBy as keyof Schedule, sortOrder === "asc" ? "asc" : "desc");

  const p = Number(page);
  const l = Number(limit);

  res.status(200).json({
    data: result.slice((p - 1) * l, p * l),
    pagination: {
      total: result.length,
      page: p,
      limit: l,
      totalPages: Math.ceil(result.length / l),
    },
  });
};

/** GET /schedules/:id */
export const getScheduleById: RequestHandler = (req, res) => {
  const found = schedules.find((s) => s.id === req.params.id);
  if (!found) {
    res.status(404).send("Not found");       
    return;
  }
  res.status(200).json(found);
};

/** PATCH /schedules/:id */
export const updateSchedule: RequestHandler = (req, res) => {
  const idx = schedules.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).send("Not found");      
    return
  }

  const parsed = scheduleSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.errors });   
    return;
  }

  const file = (req as MulterRequest).file;
  schedules[idx] = {
    ...schedules[idx],
    ...parsed.data,
    fileUrl: file ? `/uploads/${file.filename}` : schedules[idx].fileUrl,
    fileName: file?.originalname ?? schedules[idx].fileName,
    fileSize: file?.size ?? schedules[idx].fileSize,
    fileType: file?.mimetype ?? schedules[idx].fileType,
  };

  io.emit("updated_schedule", schedules[idx]);
  res.status(200).json(schedules[idx]);
};

/** DELETE /schedules/:id */
export const deleteSchedule: RequestHandler = (req, res) => {
  const idx = schedules.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).send("Not found");          //   no return
    return;
  }

  schedules.splice(idx, 1);
  io.emit("deleted_schedule", req.params.id);
  res.sendStatus(204);
};








