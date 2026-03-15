import { useMemo } from "react";
import PostCard from "../components/PostCard";

export default function ComposeTab({
  achievements,
  onScan,
  onGenerate,
  selectedEmail,
  setSelectedEmail,
  postState,
  setPostState,
  onCopy,
  onPost
}) {
  const selectedAchievement = useMemo(
    () => achievements.find((a) => a.emailId === selectedEmail),
    [achievements, selectedEmail]
  );

  return (
    <section className="mt-3">
      <button
        type="button"
        onClick={onScan}
        className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white"
      >
        Scan Gmail
      </button>

      <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">
        {achievements.map((mail) => (
          <button
            key={mail.emailId}
            type="button"
            className={`w-full rounded-lg border p-2 text-left text-xs ${
              selectedEmail === mail.emailId ? "border-primary bg-blue-50" : "border-slate-200 bg-white"
            }`}
            onClick={() => {
              setSelectedEmail(mail.emailId);
              onGenerate(mail);
            }}
          >
            <p className="font-semibold text-slate-800">{mail.subject}</p>
            <p className="text-slate-500">{mail.from}</p>
          </button>
        ))}
      </div>

      {!achievements.length && (
        <p className="mt-3 rounded-lg bg-white p-3 text-xs text-slate-500">
          Click Scan Gmail to load latest achievements.
        </p>
      )}

      {selectedAchievement && postState.postText && (
        <PostCard
          postText={postState.postText}
          setPostText={(value) => setPostState((s) => ({ ...s, postText: value }))}
          tone={postState.tone}
          onToneChange={(tone) => {
            setPostState((s) => ({ ...s, tone }));
            onGenerate(selectedAchievement, tone);
          }}
          score={postState.score}
          hashtags={postState.hashtags}
          removeHashtag={(tag) =>
            setPostState((s) => ({ ...s, hashtags: s.hashtags.filter((h) => h !== tag) }))
          }
          onCopy={onCopy}
          onPost={onPost}
          emojiEnabled={postState.emojiEnabled}
          setEmojiEnabled={(emojiEnabled) => setPostState((s) => ({ ...s, emojiEnabled }))}
        />
      )}
    </section>
  );
}
