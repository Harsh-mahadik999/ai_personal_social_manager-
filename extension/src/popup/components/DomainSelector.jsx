const domains = ["IT", "Government", "Business"];

export default function DomainSelector({ selected = [], onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {domains.map((domain) => {
        const active = selected.includes(domain);
        return (
          <button
            key={domain}
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              active
                ? "bg-primary text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
            onClick={() => onToggle(domain)}
          >
            {domain}
          </button>
        );
      })}
    </div>
  );
}
