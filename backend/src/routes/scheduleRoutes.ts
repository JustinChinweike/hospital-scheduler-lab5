import express from "express";
import multer from "multer";
import path from "path";

import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

/* ---------- Multer setup ---------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.resolve(__dirname, "../../uploads")),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "video/mp4",
      "video/quicktime",
      "video/x-matroska",
    ].includes(file.mimetype);

    if (allowed) {
      cb(null, true);
    } else {
      cb(new Error("Bad file type"));
    }
  },
});

/* ---------- routes ---------- */
router.post("/", authenticateToken, upload.single("file"), createSchedule);
router.get("/", authenticateToken, getSchedules);
router.get("/:id", authenticateToken, getScheduleById);
router.put("/:id", authenticateToken, upload.single("file"), updateSchedule);
router.patch("/:id", authenticateToken, upload.single("file"), updateSchedule);
router.delete("/:id", authenticateToken, deleteSchedule);

export default router;
