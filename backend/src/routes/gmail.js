import express from "express";
import { fetchAchievements, fetchGmailProfile } from "../services/gmailService.js";

const router = express.Router();

router.post("/gmail/achievements", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "accessToken is required" });
    }

    const achievements = await fetchAchievements(accessToken);
    return res.json({ achievements });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch Gmail achievements",
      details: error.message
    });
  }
});

router.post("/gmail/profile", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "accessToken is required" });
    }

    const profile = await fetchGmailProfile(accessToken);
    return res.json({ profile });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch Gmail profile",
      details: error.message
    });
  }
});

export default router;
