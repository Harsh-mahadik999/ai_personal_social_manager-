const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.profile"
].join(" ");

const LINKEDIN_SCOPES = ["r_liteprofile", "r_emailaddress", "w_member_social"].join(" ");

const LINKEDIN_CLIENT_ID = "LINKEDIN_CLIENT_ID_PLACEHOLDER";
const hasChromeIdentity = typeof chrome !== "undefined" && chrome.identity;
const REDIRECT_URL = hasChromeIdentity
  ? chrome.identity.getRedirectURL()
  : "http://localhost:5173";
const REDIRECT_URL_ALT = hasChromeIdentity
  ? chrome.identity.getRedirectURL("linkedin")
  : "http://localhost:5173/linkedin";

export function getLinkedInRedirectUri() {
  return REDIRECT_URL;
}

export function getLinkedInRedirectUriAlt() {
  return REDIRECT_URL_ALT;
}

export function getLinkedInRedirectCandidates() {
  const candidates = [
    REDIRECT_URL,
    REDIRECT_URL.replace(/\/$/, ""),
    REDIRECT_URL_ALT,
    REDIRECT_URL_ALT.replace(/\/$/, "")
  ];

  return [...new Set(candidates.filter(Boolean))];
}

export function getExtensionId() {
  if (typeof chrome === "undefined" || !chrome.runtime?.id) return "";
  return chrome.runtime.id;
}

function getLinkedInAuthUrl(redirectUri) {
  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "token");
  authUrl.searchParams.set("client_id", LINKEDIN_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", LINKEDIN_SCOPES);
  return authUrl.toString();
}

async function signInLinkedInWithRedirectUri(redirectUri) {
  const redirect = await launchAuth(getLinkedInAuthUrl(redirectUri));
  const hash = redirect.split("#")[1] || "";
  const params = new URLSearchParams(hash);
  const token = params.get("access_token");

  if (!token) {
    throw new Error("LinkedIn auth failed");
  }

  await saveToken("linkedinAccessToken", token);
  return token;
}

function launchAuth(url) {
  if (!hasChromeIdentity) {
    throw new Error("Chrome identity API is only available in the extension runtime");
  }

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({ url, interactive: true }, (redirectedTo) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!redirectedTo) {
        reject(new Error("Auth flow did not return a redirect URL"));
        return;
      }
      resolve(redirectedTo);
    });
  });
}

function saveToken(key, value) {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    return chrome.storage.local.set({ [key]: value });
  }

  localStorage.setItem(key, value);
  return Promise.resolve();
}

export async function signInGoogle() {
  if (!hasChromeIdentity) {
    throw new Error("Google sign-in requires the Chrome extension runtime");
  }

  const manifestGoogleClientId = chrome.runtime.getManifest()?.oauth2?.client_id || "";
  if (!manifestGoogleClientId || manifestGoogleClientId.includes("PLACEHOLDER")) {
    throw new Error("Google OAuth client ID is not configured. Update public/manifest.json oauth2.client_id.");
  }

  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true, scopes: GOOGLE_SCOPES.split(" ") }, async (token) => {
      const runtimeError = chrome.runtime.lastError?.message || "";
      if (chrome.runtime.lastError || !token) {
        if (runtimeError.toLowerCase().includes("bad client id")) {
          const extensionId = getExtensionId();
          reject(
            new Error(
              `Google OAuth bad client id. Create an OAuth Client ID of type Chrome Extension in Google Cloud and use extension ID ${extensionId}. Then set that client ID in manifest oauth2.client_id.`
            )
          );
          return;
        }

        reject(new Error(runtimeError || "Google auth failed"));
        return;
      }

      await saveToken("googleAccessToken", token);
      resolve(token);
    });
  });
}

export async function signInLinkedIn() {
  if (!LINKEDIN_CLIENT_ID || LINKEDIN_CLIENT_ID.includes("PLACEHOLDER")) {
    throw new Error("LinkedIn client ID is not configured. Update src/utils/auth.js LINKEDIN_CLIENT_ID.");
  }

  const redirectCandidates = getLinkedInRedirectCandidates();
  for (const redirectUri of redirectCandidates) {
    try {
      return await signInLinkedInWithRedirectUri(redirectUri);
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(
    [
      "LinkedIn redirect URI mismatch.",
      "Register one of these exact Redirect URLs in LinkedIn app settings:",
      ...redirectCandidates
    ].join("\n")
  );
}

export async function getStoredTokens() {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    return chrome.storage.local.get(["googleAccessToken", "linkedinAccessToken"]);
  }

  return {
    googleAccessToken: localStorage.getItem("googleAccessToken") || "",
    linkedinAccessToken: localStorage.getItem("linkedinAccessToken") || ""
  };
}
