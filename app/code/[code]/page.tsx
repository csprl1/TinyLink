// app/code/[code]/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function CodeStatsPage({
  params
}: {
  params: { code: string };
}) {
  const { code } = params;
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? "";

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch(`/api/links/${code}`);
        if (!res.ok) {
          setError("Link not found");
          setLink(null);
        } else {
          const data = await res.json();
          setLink(data);
          setError(null);
        }
      } catch {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [code]);

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this link?");
    if (!confirm) return;
    const res = await fetch(`/api/links/${code}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Deleted. Redirect will now return 404.");
      setLink(null);
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <main>
      <h2 className="text-xl font-semibold mb-4">Stats for: {code}</h2>
      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && (
        <p className="text-sm text-red-400 bg-red-950/30 px-3 py-2 rounded">
          {error}
        </p>
      )}
      {!loading && !error && !link && (
        <p className="text-sm text-slate-400">Link not found.</p>
      )}
      {link && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-2">
            <div>
              <span className="text-xs text-slate-400">Short URL</span>
              <div className="flex items-center gap-2">
                <code className="text-sm">
                  {baseUrl}/{link.code}
                </code>
                <button
                  className="text-xs border border-slate-600 rounded px-2 py-1 hover:bg-slate-800"
                  onClick={() =>
                    navigator.clipboard.writeText(`${baseUrl}/${link.code}`)
                  }
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400">Target URL</span>
              <p className="text-sm break-all text-sky-300">
                <a href={link.url} target="_blank">
                  {link.url}
                </a>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400">Total Clicks</span>
                <p className="text-lg font-semibold">{link.clicks}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Last Clicked</span>
                <p>
                  {link.lastClicked
                    ? new Date(link.lastClicked).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Created At</span>
                <p>{new Date(link.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <button
            className="text-xs bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
            onClick={handleDelete}
          >
            Delete Link
          </button>
        </div>
      )}
    </main>
  );
}
