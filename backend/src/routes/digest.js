import express from "express";
import { getTrendDigest } from "../services/trendService.js";

const router = express.Router();

router.get("/digest", async (req, res) => {
  try {
    const domain = req.query.domain || "IT";
    const limit = Number(req.query.limit || 5);
    const items = await getTrendDigest(domain, limit);
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch digest",
      details: error.message
    });
  }
});

export default router;
