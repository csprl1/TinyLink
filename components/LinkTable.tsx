// components/LinkTable.tsx
"use client";

import Link from "next/link";
import type { Link as LinkType } from "./DashboardClient";

export default function LinkTable({
  links,
  onDeleted
}: {
  links: LinkType[];
  onDeleted: (code: string) => void;
}) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? "";

  const handleDelete = async (code: string) => {
    const confirm = window.confirm(
      `Delete link '${code}'? It will stop redirecting.`
    );
    if (!confirm) return;

    const res = await fetch(`/api/links/${code}`, {
      method: "DELETE"
    });

    if (res.ok) {
      onDeleted(code);
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs text-slate-400">
            <th className="text-left py-2 pr-4">Code</th>
            <th className="text-left py-2 pr-4">Target URL</th>
            <th className="text-right py-2 pr-4">Clicks</th>
            <th className="text-left py-2 pr-4">Last clicked</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l) => (
            <tr
              key={l.id}
              className="border-b border-slate-900 hover:bg-slate-900/40"
            >
              <td className="py-2 pr-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/code/${l.code}`}
                    className="text-sky-400 hover:underline"
                  >
                    {l.code}
                  </Link>
                  <button
                    className="text-[10px] border border-slate-600 rounded px-1.5 py-0.5"
                    onClick={() =>
                      navigator.clipboard.writeText(`${baseUrl}/${l.code}`)
                    }
                  >
                    Copy
                  </button>
                </div>
              </td>
              <td className="py-2 pr-4">
                <div className="max-w-xs truncate text-slate-200">
                  <a
                    href={l.url}
                    target="_blank"
                    className="hover:text-sky-300"
                  >
                    {l.url}
                  </a>
                </div>
              </td>
              <td className="py-2 pr-4 text-right font-mono">
                {l.clicks}
              </td>
              <td className="py-2 pr-4 text-xs text-slate-400">
                {l.lastClicked
                  ? new Date(l.lastClicked).toLocaleString()
                  : "Never"}
              </td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(l.code)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
