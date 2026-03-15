import "dotenv/config";
import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.js";
import digestRoutes from "./routes/digest.js";
import gmailRoutes from "./routes/gmail.js";
import linkedinRoutes from "./routes/linkedin.js";
import scoreRoutes from "./routes/score.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN, "http://localhost:5173"].filter(Boolean)
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(apiRateLimiter);

app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "propost-assistant-backend" });
});

app.use("/api", aiRoutes);
app.use("/api", digestRoutes);
app.use("/api", gmailRoutes);
app.use("/api", linkedinRoutes);
app.use("/api", scoreRoutes);

app.listen(port, () => {
  console.log(`ProPost backend running on http://localhost:${port}`);
});
