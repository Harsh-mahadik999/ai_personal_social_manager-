import express from "express";
import { generateLinkedInPost } from "../services/claudeService.js";
import { calculatePostScore } from "../services/scoreService.js";

const router = express.Router();

router.post("/generate-post", async (req, res) => {
  try {
    const { emailContent, domain, tone, userBio } = req.body;

    if (!emailContent || !domain || !tone) {
      return res.status(400).json({ error: "emailContent, domain, and tone are required" });
    }

    const { post, hashtags } = await generateLinkedInPost({
      emailContent,
      domain,
      tone,
      userBio
    });

    const { score } = calculatePostScore(post);

    return res.json({ post, hashtags, score });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to generate post",
      details: error.message
    });
  }
});

export default router;
