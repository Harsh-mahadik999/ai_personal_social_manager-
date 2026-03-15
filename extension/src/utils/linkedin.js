const API_BASE = "http://localhost:3001";

export function startLinkedInBackendAuth() {
  window.open(`${API_BASE}/api/linkedin/oauth/start`, "_blank");
}

export async function fetchLinkedInBackendStatus() {
  const res = await fetch(`${API_BASE}/api/linkedin/oauth/status`);

  if (!res.ok) {
    throw new Error("Could not check LinkedIn backend auth status");
  }

  return res.json();
}

export async function postLinkedIn({ accessToken, postText }) {
  const res = await fetch(`${API_BASE}/api/linkedin/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accessToken, postText })
  });

  if (!res.ok) {
    throw new Error("LinkedIn post failed");
  }

  return res.json();
}

export async function fetchLinkedInProfile(accessToken) {
  const res = await fetch(`${API_BASE}/api/linkedin/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accessToken })
  });

  if (!res.ok) {
    throw new Error("Failed to fetch LinkedIn profile");
  }

  return res.json();
}
