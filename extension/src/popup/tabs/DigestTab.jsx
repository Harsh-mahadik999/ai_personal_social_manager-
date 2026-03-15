import { useEffect, useState } from "react";
import { fetchDigest } from "../../utils/ai";
import DomainSelector from "../components/DomainSelector";
import TrendCard from "../components/TrendCard";

export default function DigestTab() {
  const [domains, setDomains] = useState(["IT"]);
  const [activeDomain, setActiveDomain] = useState("IT");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDigest(activeDomain);
        setItems(data.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeDomain]);

  function toggleDomain(domain) {
    setDomains((prev) => {
      if (prev.includes(domain)) {
        const next = prev.filter((d) => d !== domain);
        if (next.length) setActiveDomain(next[0]);
        return next.length ? next : [domain];
      }
      return [...prev, domain];
    });
    setActiveDomain(domain);
  }

  return (
    <section className="mt-3">
      <DomainSelector selected={domains} onToggle={toggleDomain} />
      <div className="mt-3 space-y-2">
        {loading && <p className="text-xs text-slate-500">Loading digest...</p>}
        {!loading && !items.length && (
          <p className="rounded-lg bg-white p-3 text-xs text-slate-500">No trends available right now.</p>
        )}
        {items.map((item) => (
          <TrendCard key={item.url} item={item} />
        ))}
      </div>
    </section>
  );
}
