import express, { RequestHandler } from "express";
import multer from "multer";
import path from "path";

import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController";

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
      /* accept file – first arg null, second true */
      cb(null, true);
    } else {
      /* reject file – pass only the Error */
      cb(new Error("Bad file type"));
    }
  },
});

/* ---------- routes ---------- */
router.post("/", upload.single("file"), createSchedule as RequestHandler);
router.get("/", getSchedules);
router.get("/:id", getScheduleById);
router.put("/:id", upload.single("file"), updateSchedule as RequestHandler);
router.patch("/:id", upload.single("file"), updateSchedule as RequestHandler);
router.delete("/:id", deleteSchedule);

export default router;







