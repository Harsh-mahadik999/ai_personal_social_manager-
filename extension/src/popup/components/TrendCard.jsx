import { useState } from "react";

function levelClass(level) {
  if (level === "high") return "text-emerald-700";
  if (level === "low") return "text-rose-700";
  return "text-amber-700";
}

export default function TrendCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="card-shadow rounded-xl bg-white p-3">
      <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
        <span>{item.source}</span>
        <a href={item.url} target="_blank" rel="noreferrer" className="text-primary underline">
          Open
        </a>
      </div>
      <h3 className="font-display text-sm font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-700">{item.summary}</p>

      <button
        type="button"
        className="mt-2 text-xs font-semibold text-primary"
        onClick={() => setOpen((v) => !v)}
      >
        Should you follow this trend?
      </button>

      {open && (
        <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-700">
          <p>
            <span className="font-semibold">Follow: </span>
            {item.decisionGuide.shouldFollow ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Benefit: </span>
            <span className={levelClass(item.decisionGuide.benefit)}>{item.decisionGuide.benefit}</span>
          </p>
          <p>
            <span className="font-semibold">Effort: </span>
            <span className={levelClass(item.decisionGuide.effort)}>{item.decisionGuide.effort}</span>
          </p>
          <p className="mt-1">{item.decisionGuide.reason}</p>
          <p className="mt-1 text-slate-500">Alt: {item.decisionGuide.alternativePath}</p>
        </div>
      )}
    </article>
  );
}
