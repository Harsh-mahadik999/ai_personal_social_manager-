const API_BASE = "http://localhost:3001";

export async function fetchAchievementEmails(accessToken) {
  const res = await fetch(`${API_BASE}/api/gmail/achievements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accessToken })
  });

  if (!res.ok) {
    throw new Error("Failed to fetch achievements");
  }

  return res.json();
}

export async function fetchGmailProfile(accessToken) {
  const res = await fetch(`${API_BASE}/api/gmail/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accessToken })
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Gmail profile");
  }

  return res.json();
}
