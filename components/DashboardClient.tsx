// components/DashboardClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import CreateLinkForm from "./CreateLinkForm";
import LinkTable from "./LinkTable";

export interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function DashboardClient() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/links");
      if (!res.ok) {
        throw new Error("Failed to load links");
      }
      const data = await res.json();
      setLinks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Error loading links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return links;
    const q = search.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
    );
  }, [links, search]);

  const handleCreated = (link: Link) => {
    setLinks((prev) => [link, ...prev]);
  };

  const handleDeleted = (code: string) => {
    setLinks((prev) => prev.filter((l) => l.code !== code));
  };

  return (
    <main className="space-y-6">
      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Create short link</h2>
        <CreateLinkForm onCreated={handleCreated} />
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold">Links</h2>
          <input
            type="text"
            placeholder="Search by code or URL"
            className="w-full md:w-72 text-sm bg-slate-900 border border-slate-700 rounded px-3 py-2 placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 px-3 py-2 rounded">
            {error}
          </p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-slate-500">
            No links yet. Create your first short link above.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <LinkTable links={filtered} onDeleted={handleDeleted} />
        )}
      </section>
    </main>
  );
}
