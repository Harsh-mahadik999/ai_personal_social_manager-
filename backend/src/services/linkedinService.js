import axios from "axios";

export async function fetchLinkedInProfile(accessToken) {
  if (!accessToken) {
    throw new Error("accessToken is required");
  }

  const profileRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return {
    id: profileRes.data.sub || "",
    name: profileRes.data.name || "",
    email: profileRes.data.email || ""
  };
}

export async function postToLinkedIn({ accessToken, postText }) {
  const intentUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`;

  if (!accessToken) {
    return { success: false, intentUrl };
  }

  try {
    const profile = await fetchLinkedInProfile(accessToken);

    const authorUrn = `urn:li:person:${profile.id}`;

    await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: postText },
            shareMediaCategory: "NONE"
          }
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json"
        }
      }
    );

    return { success: true, intentUrl };
  } catch {
    return { success: false, intentUrl };
  }
}
