import { google } from "googleapis";

const PRIMARY_KEYWORDS = [
  "certificate",
  "completed",
  "congratulations",
  "achievement",
  "awarded",
  "passed",
  "finished"
];

const SECONDARY_KEYWORDS = [
  "badge",
  "credential",
  "certification",
  "course",
  "milestone",
  "promotion",
  "hackathon"
];

function parseHeader(headers, name) {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";
}

function parseAchievementFromMessage(message) {
  const headers = message.payload?.headers || [];
  const subject = parseHeader(headers, "Subject");
  const from = parseHeader(headers, "From");
  const date = parseHeader(headers, "Date");
  const snippet = message.snippet || "";

  const urls = [...new Set((snippet.match(/https?:\/\/\S+/g) || []).map((u) => u.replace(/[),.]$/, "")))];

  return {
    emailId: message.id,
    subject,
    from,
    date,
    snippet,
    keywordMatches: [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS].filter((k) => (subject + " " + snippet).toLowerCase().includes(k)),
    urls
  };
}

export async function fetchAchievements(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const query = "subject:(certificate OR completed OR congratulations OR achievement OR awarded OR passed OR finished) newer_than:30d";

  const listResponse = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 10
  });

  const messageIds = listResponse.data.messages || [];
  const details = await Promise.all(
    messageIds.map((m) => gmail.users.messages.get({ userId: "me", id: m.id, format: "full" }))
  );

  return details.map((d) => parseAchievementFromMessage(d.data));
}

export async function fetchGmailProfile(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const profileRes = await gmail.users.getProfile({ userId: "me" });

  return {
    emailAddress: profileRes.data.emailAddress || "",
    messagesTotal: profileRes.data.messagesTotal || 0
  };
}
