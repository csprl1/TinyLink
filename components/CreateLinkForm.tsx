// components/CreateLinkForm.tsx
"use client";

import { FormEvent, useState } from "react";
import type { Link } from "./DashboardClient";

export default function CreateLinkForm({
  onCreated
}: {
  onCreated: (link: Link) => void;
}) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          code: code.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create link");
        return;
      }

      onCreated(data);
      setSuccess("Link created successfully");
      setUrl("");
      setCode("");
    } catch {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs text-slate-400">Target URL</label>
        <input
          type="url"
          placeholder="https://example.com/very/long/url"
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">
          Custom code (optional, 6–8 alphanumeric)
        </label>
        <input
          type="text"
          maxLength={8}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/30 px-3 py-2 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-400 bg-emerald-950/30 px-3 py-2 rounded">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="text-sm bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 rounded font-medium"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
