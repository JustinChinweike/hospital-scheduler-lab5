import { Router } from "express";
import path from "path";

const router = Router();

router.get("/:filename", (req, res) => {
  const file = path.resolve(__dirname, "../../uploads", req.params.filename);
  res.sendFile(file);
});

export default router;



