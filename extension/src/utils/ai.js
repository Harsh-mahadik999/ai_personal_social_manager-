const API_BASE = "http://localhost:3001";

export async function generatePost(payload) {
  const res = await fetch(`${API_BASE}/api/generate-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Post generation failed");
  }

  return res.json();
}

export async function fetchDigest(domain) {
  const params = new URLSearchParams({ domain, limit: "5" });
  const res = await fetch(`${API_BASE}/api/digest?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Digest fetch failed");
  }

  return res.json();
}

export async function scorePost(postText) {
  const params = new URLSearchParams({ postText });
  const res = await fetch(`${API_BASE}/api/score?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Post scoring failed");
  }

  return res.json();
}
