import { useMemo } from "react";
import ToneSelector from "./ToneSelector";
import PostScore from "./PostScore";

export default function PostCard({
  postText,
  setPostText,
  tone,
  onToneChange,
  score,
  hashtags,
  removeHashtag,
  onCopy,
  onPost,
  emojiEnabled,
  setEmojiEnabled
}) {
  const visiblePost = useMemo(() => {
    if (emojiEnabled) return postText;
    return postText.replace(/\p{Emoji}/gu, "").replace(/\s{2,}/g, " ");
  }, [postText, emojiEnabled]);

  return (
    <div className="card-shadow mt-3 rounded-xl bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Generated Post</h3>
        <label className="flex items-center gap-1 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={emojiEnabled}
            onChange={(e) => setEmojiEnabled(e.target.checked)}
          />
          Emoji
        </label>
      </div>

      <ToneSelector value={tone} onChange={onToneChange} />

      <textarea
        className="mt-2 h-48 w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-primary"
        value={visiblePost}
        onChange={(e) => setPostText(e.target.value)}
      />

      <div className="mt-2">
        <PostScore score={score} />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {hashtags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700"
            onClick={() => removeHashtag(tag)}
            title="Remove hashtag"
          >
            {tag} x
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onCopy} className="flex-1 rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white">
          Copy Post
        </button>
        <button type="button" onClick={onPost} className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-white">
          Post to LinkedIn
        </button>
      </div>
    </div>
  );
}
