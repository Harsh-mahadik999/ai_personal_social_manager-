import express from "express";
import { calculatePostScore } from "../services/scoreService.js";

const router = express.Router();

router.get("/score", (req, res) => {
  const postText = req.query.postText || "";
  const result = calculatePostScore(postText);
  return res.json(result);
});

export default router;
