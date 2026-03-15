export default function TimelineTab({ achievements, onDraft }) {
  if (!achievements.length) {
    return (
      <div className="mt-3 rounded-lg bg-white p-3 text-xs text-slate-500">
        No achievements yet - click Compose to scan Gmail.
      </div>
    );
  }

  return (
    <section className="mt-3 space-y-2">
      {achievements.map((item) => (
        <article key={item.emailId} className="card-shadow rounded-lg bg-white p-3 text-xs">
          <p className="font-semibold text-slate-800">{item.subject}</p>
          <p className="text-slate-500">{item.date || "Unknown date"}</p>
          <button
            type="button"
            className="mt-2 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white"
            onClick={() => onDraft(item)}
          >
            Draft Post
          </button>
        </article>
      ))}
    </section>
  );
}
