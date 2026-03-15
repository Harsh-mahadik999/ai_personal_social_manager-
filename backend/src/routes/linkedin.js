import express from "express";
import axios from "axios";
import { fetchLinkedInProfile, postToLinkedIn } from "../services/linkedinService.js";

const router = express.Router();
const LINKEDIN_SCOPES = ["r_liteprofile", "r_emailaddress", "w_member_social"].join(" ");
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:3001/api/linkedin/oauth/callback";

let linkedInSession = {
  accessToken: "",
  connectedAt: 0
};

router.get("/linkedin/oauth/start", (req, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    return res.status(500).send("LinkedIn client ID is not configured on backend");
  }

  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", LINKEDIN_REDIRECT_URI);
  authUrl.searchParams.set("scope", LINKEDIN_SCOPES);
  authUrl.searchParams.set("state", String(Date.now()));

  return res.redirect(authUrl.toString());
});

router.get("/linkedin/oauth/callback", async (req, res) => {
  try {
    const { code, error, error_description: errorDescription } = req.query;

    if (error) {
      return res.status(400).send(`<h3>LinkedIn OAuth failed: ${errorDescription || error}</h3>`);
    }

    if (!code) {
      return res.status(400).send("<h3>LinkedIn OAuth failed: missing code</h3>");
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).send("<h3>LinkedIn credentials missing on backend</h3>");
    }

    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code: String(code),
      redirect_uri: LINKEDIN_REDIRECT_URI,
      client_id: clientId,
      client_secret: clientSecret
    });

    const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", tokenBody.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const accessToken = tokenResponse.data?.access_token || "";
    if (!accessToken) {
      return res.status(500).send("<h3>LinkedIn OAuth failed: token missing</h3>");
    }

    linkedInSession = {
      accessToken,
      connectedAt: Date.now()
    };

    return res.send("<h3>LinkedIn connected successfully. You can close this tab and return to ProPost.</h3>");
  } catch (error) {
    return res.status(500).send(`<h3>LinkedIn OAuth callback error: ${error.message}</h3>`);
  }
});

router.get("/linkedin/oauth/status", async (_, res) => {
  try {
    if (!linkedInSession.accessToken) {
      return res.json({ connected: false });
    }

    const profile = await fetchLinkedInProfile(linkedInSession.accessToken);
    return res.json({
      connected: true,
      accessToken: linkedInSession.accessToken,
      profile,
      connectedAt: linkedInSession.connectedAt
    });
  } catch {
    linkedInSession = { accessToken: "", connectedAt: 0 };
    return res.json({ connected: false });
  }
});

router.post("/linkedin/oauth/disconnect", (_, res) => {
  linkedInSession = { accessToken: "", connectedAt: 0 };
  return res.json({ connected: false });
});

router.post("/linkedin/post", async (req, res) => {
  try {
    const { accessToken, postText } = req.body;
    if (!postText) {
      return res.status(400).json({ error: "postText is required" });
    }

    const token = accessToken || linkedInSession.accessToken || "";
    const result = await postToLinkedIn({ accessToken: token, postText });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to post on LinkedIn",
      details: error.message
    });
  }
});

router.post("/linkedin/profile", async (req, res) => {
  try {
    const { accessToken } = req.body;
    const token = accessToken || linkedInSession.accessToken;
    if (!token) {
      return res.status(400).json({ error: "accessToken is required" });
    }

    const profile = await fetchLinkedInProfile(token);
    return res.json({ profile });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch LinkedIn profile",
      details: error.message
    });
  }
});

export default router;
