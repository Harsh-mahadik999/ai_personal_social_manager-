import { useMemo } from "react";

export default function LoginPage({
  loading,
  error,
  accounts,
  tokens,
  onGoogleLogin,
  onLinkedInLogin,
  linkedinRedirectCandidates,
  extensionId
}) {
  const connectedCount = useMemo(() => {
    let count = 0;
    if (tokens.googleAccessToken) count += 1;
    if (tokens.linkedinAccessToken) count += 1;
    return count;
  }, [tokens.googleAccessToken, tokens.linkedinAccessToken]);

  const progress = connectedCount === 0 ? 0 : connectedCount === 1 ? 50 : 100;

  return (
    <main className="relative min-h-[580px] overflow-hidden p-4 font-body text-slate-900">
      <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#0A66C2]/20 blur-3xl" />
      <div className="absolute -right-16 bottom-8 h-44 w-44 rounded-full bg-[#00A0DC]/20 blur-3xl" />

      <section className="relative rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.13)] backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A66C2]">ProPost Assistant</p>
        <h1 className="mt-2 font-display text-xl font-semibold leading-tight text-slate-900">
          Connect your accounts and turn achievements into standout posts.
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Link Gmail and LinkedIn once. After that, drafting and posting is one flow.
        </p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">Setup Progress</span>
            <span className="font-semibold text-[#0A66C2]">{connectedCount}/2 Connected</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0A66C2] to-[#00A0DC] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="relative mt-4 space-y-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_25px_rgba(2,6,23,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-slate-900">Google (Gmail)</p>
              <p className="mt-1 text-xs text-slate-500">
                {accounts.gmailId ? `Connected as ${accounts.gmailId}` : "Required to scan achievement emails"}
              </p>
            </div>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                tokens.googleAccessToken
                  ? "bg-emerald-600"
                  : "bg-[#0A66C2] hover:bg-[#084f98]"
              }`}
              onClick={onGoogleLogin}
              disabled={loading}
            >
              {tokens.googleAccessToken ? "Connected" : "Connect"}
            </button>
          </div>
          {!!extensionId && (
            <div className="mt-2 rounded-lg bg-slate-50 p-2">
              <p className="text-[11px] font-semibold text-slate-700">Chrome Extension ID</p>
              <p className="mt-1 break-all text-[11px] text-slate-500">{extensionId}</p>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_25px_rgba(2,6,23,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold text-slate-900">LinkedIn</p>
              <p className="mt-1 text-xs text-slate-500">
                {accounts.linkedinName
                  ? `Connected as ${accounts.linkedinName}`
                  : "Required to publish from drafted posts"}
              </p>
            </div>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                tokens.linkedinAccessToken
                  ? "bg-emerald-600"
                  : "bg-[#0077B5] hover:bg-[#005885]"
              }`}
              onClick={onLinkedInLogin}
              disabled={loading}
            >
              {tokens.linkedinAccessToken ? "Connected" : "Connect"}
            </button>
          </div>
          <div className="mt-2 rounded-lg bg-slate-50 p-2">
            <p className="text-[11px] font-semibold text-slate-700">LinkedIn Redirect URIs</p>
            {(linkedinRedirectCandidates || []).map((uri) => (
              <p key={uri} className="mt-1 break-all text-[11px] text-slate-500">
                {uri}
              </p>
            ))}
          </div>
        </article>
      </section>

      {loading && <p className="relative mt-3 text-xs text-slate-600">Connecting account...</p>}
      {error && <p className="relative mt-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}

      <p className="relative mt-4 text-[11px] text-slate-500">
        You will enter the workspace automatically when both connections are ready.
      </p>
    </main>
  );
}
