const tones = [
  { key: "formal", label: "Formal" },
  { key: "humbleBrag", label: "Humble Brag" },
  { key: "storytelling", label: "Storytelling" }
];

export default function ToneSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {tones.map((tone) => (
        <button
          key={tone.key}
          type="button"
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            value === tone.key
              ? "bg-primary text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
          onClick={() => onChange(tone.key)}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}
