import { useEffect, useMemo, useState } from "react";
import ComposeTab from "./tabs/ComposeTab";
import DigestTab from "./tabs/DigestTab";
import TimelineTab from "./tabs/TimelineTab";
import LoginPage from "./components/LoginPage";
import {
  signInGoogle,
  signInLinkedIn,
  getStoredTokens,
  getLinkedInRedirectCandidates,
  getExtensionId
} from "../utils/auth";
import { fetchAchievementEmails, fetchGmailProfile } from "../utils/gmail";
import { generatePost, scorePost } from "../utils/ai";
import {
  postLinkedIn,
  fetchLinkedInProfile,
  startLinkedInBackendAuth,
  fetchLinkedInBackendStatus
} from "../utils/linkedin";

const tabs = [
  { key: "compose", label: "Compose", icon: "📝" },
  { key: "digest", label: "Digest", icon: "📰" },
  { key: "timeline", label: "Timeline", icon: "📅" }
];

export default function App() {
  const linkedinRedirectCandidates = getLinkedInRedirectCandidates();
  const extensionId = getExtensionId();
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [achievements, setAchievements] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [tokens, setTokens] = useState({ googleAccessToken: "", linkedinAccessToken: "" });
  const [accounts, setAccounts] = useState({
    gmailId: "",
    linkedinId: "",
    linkedinName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [postState, setPostState] = useState({
    postText: "",
    hashtags: [],
    tone: "formal",
    score: 0,
    emojiEnabled: true
  });

  const selectedAchievement = useMemo(
    () => achievements.find((a) => a.emailId === selectedEmail),
    [achievements, selectedEmail]
  );

  useEffect(() => {
    async function loadStoredTokens() {
      const stored = await getStoredTokens();
      setTokens(stored);

      if (stored.googleAccessToken) {
        try {
          const googleData = await fetchGmailProfile(stored.googleAccessToken);
          setAccounts((prev) => ({ ...prev, gmailId: googleData.profile?.emailAddress || "" }));
        } catch {
          // Ignore stale token profile errors and let the user sign in again.
        }
      }

      if (stored.linkedinAccessToken) {
        try {
          const linkedInData = await fetchLinkedInProfile(stored.linkedinAccessToken);
          setAccounts((prev) => ({
            ...prev,
            linkedinId: linkedInData.profile?.id || "",
            linkedinName: linkedInData.profile?.name || ""
          }));
        } catch {
          // Ignore stale token profile errors and let the user sign in again.
        }
      } else {
        try {
          const backendStatus = await fetchLinkedInBackendStatus();
          if (backendStatus.connected && backendStatus.accessToken) {
            setTokens((prev) => ({ ...prev, linkedinAccessToken: backendStatus.accessToken }));
            setAccounts((prev) => ({
              ...prev,
              linkedinId: backendStatus.profile?.id || "",
              linkedinName: backendStatus.profile?.name || ""
            }));
          }
        } catch {
          // Ignore backend status errors during startup.
        }
      }

      setAuthReady(true);
    }

    loadStoredTokens();
  }, []);

  const hasRequiredLogins = Boolean(tokens.googleAccessToken && tokens.linkedinAccessToken);

  async function ensureGoogleToken() {
    if (tokens.googleAccessToken) return tokens.googleAccessToken;
    const token = await signInGoogle();
    setTokens((prev) => ({ ...prev, googleAccessToken: token }));

    const profileRes = await fetchGmailProfile(token);
    setAccounts((prev) => ({ ...prev, gmailId: profileRes.profile?.emailAddress || "" }));

    return token;
  }

  async function ensureLinkedInToken() {
    if (tokens.linkedinAccessToken) return tokens.linkedinAccessToken;

    try {
      const token = await signInLinkedIn();
      setTokens((prev) => ({ ...prev, linkedinAccessToken: token }));

      const profileRes = await fetchLinkedInProfile(token);
      setAccounts((prev) => ({
        ...prev,
        linkedinId: profileRes.profile?.id || "",
        linkedinName: profileRes.profile?.name || ""
      }));

      return token;
    } catch {
      startLinkedInBackendAuth();

      // Poll backend briefly while user completes OAuth in opened tab.
      for (let i = 0; i < 45; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const backendStatus = await fetchLinkedInBackendStatus();
          if (backendStatus.connected && backendStatus.accessToken) {
            setTokens((prev) => ({ ...prev, linkedinAccessToken: backendStatus.accessToken }));
            setAccounts((prev) => ({
              ...prev,
              linkedinId: backendStatus.profile?.id || "",
              linkedinName: backendStatus.profile?.name || ""
            }));
            return backendStatus.accessToken;
          }
        } catch {
          // Ignore poll errors and keep waiting.
        }
      }

      throw new Error("Complete LinkedIn login in the opened browser tab, then click Connect again.");
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      await ensureGoogleToken();
    } catch (e) {
      setError(e.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLinkedInLogin() {
    setError("");
    setLoading(true);
    try {
      await ensureLinkedInToken();
    } catch (e) {
      setError(e.message || "LinkedIn login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleScanGmail() {
    setError("");
    setLoading(true);
    try {
      const token = await ensureGoogleToken();
      const data = await fetchAchievementEmails(token);
      setAchievements(data.achievements || []);
      if ((data.achievements || []).length) {
        setSelectedEmail(data.achievements[0].emailId);
      }
    } catch (e) {
      setError(e.message || "Could not scan Gmail");
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePost(mail, explicitTone) {
    setError("");
    setLoading(true);
    try {
      const tone = explicitTone || postState.tone;
      const payload = {
        emailContent: `${mail.subject}\n${mail.snippet}`,
        domain: "IT",
        tone,
        userBio: "Curious builder sharing practical learnings and outcomes."
      };

      const data = await generatePost(payload);
      const scoreData = await scorePost(data.post || "");

      setPostState((prev) => ({
        ...prev,
        tone,
        postText: data.post || "",
        hashtags: data.hashtags || [],
        score: scoreData.score || data.score || 0
      }));
    } catch (e) {
      setError(e.message || "Could not generate post");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyPost() {
    if (!postState.postText) return;
    await navigator.clipboard.writeText(postState.postText);
  }

  async function handlePostLinkedIn() {
    setError("");
    setLoading(true);
    try {
      let token = "";
      try {
        token = await ensureLinkedInToken();
      } catch {
        token = "";
      }

      const data = await postLinkedIn({ accessToken: token, postText: postState.postText });
      window.open(data.intentUrl, "_blank");
    } catch (e) {
      setError(e.message || "Could not post to LinkedIn");
    } finally {
      setLoading(false);
    }
  }

  if (!authReady) {
    return (
      <main className="grid min-h-[580px] place-items-center p-4 font-body text-slate-800">
        <div className="w-full rounded-2xl border border-white/70 bg-white/85 p-4 text-center shadow-[0_20px_50px_rgba(15,23,42,0.13)] backdrop-blur">
          <p className="font-display text-sm font-semibold text-primary">Preparing workspace...</p>
          <p className="mt-1 text-xs text-slate-500">Loading saved account connections</p>
        </div>
      </main>
    );
  }

  if (!hasRequiredLogins) {
    return (
      <LoginPage
        loading={loading}
        error={error}
        accounts={accounts}
        tokens={tokens}
        onGoogleLogin={handleGoogleLogin}
        onLinkedInLogin={handleLinkedInLogin}
        linkedinRedirectCandidates={linkedinRedirectCandidates}
        extensionId={extensionId}
      />
    );
  }

  return (
    <main className="flex min-h-[580px] flex-col p-3 font-body text-slate-800">
      <header className="card-shadow rounded-xl bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-base font-bold text-primary">ProPost Assistant</h1>
            <p className="text-[11px] text-slate-500">Professional Post Assistant Maker</p>
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
            U
          </div>
        </div>
      </header>

      <nav className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-white p-1 card-shadow">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
              activeTab === tab.key ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="mt-3 card-shadow rounded-xl bg-white p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-slate-900">Connected Accounts</h2>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            Ready
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">Gmail: {accounts.gmailId || "Connected"}</p>
        <p className="text-[11px] text-slate-500">
          LinkedIn: {accounts.linkedinName || accounts.linkedinId || "Connected"}
        </p>
      </section>

      {error && <p className="mt-2 rounded-md bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}
      {loading && <p className="mt-2 text-xs text-slate-500">Working...</p>}

      <div className="flex-1 overflow-y-auto pb-2">
        {activeTab === "compose" && (
          <ComposeTab
            achievements={achievements}
            onScan={handleScanGmail}
            onGenerate={handleGeneratePost}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            postState={postState}
            setPostState={setPostState}
            onCopy={handleCopyPost}
            onPost={handlePostLinkedIn}
          />
        )}

        {activeTab === "digest" && <DigestTab />}

        {activeTab === "timeline" && (
          <TimelineTab
            achievements={achievements}
            onDraft={(item) => {
              setActiveTab("compose");
              setSelectedEmail(item.emailId);
              handleGeneratePost(item);
            }}
          />
        )}
      </div>

      <footer className="pt-2 text-right text-xs text-slate-500">⚙ Settings</footer>

      {!selectedAchievement && activeTab === "compose" && achievements.length > 0 && (
        <p className="text-xs text-slate-500">Pick an achievement email to generate a post draft.</p>
      )}
    </main>
  );
}
