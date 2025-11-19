// app/layout.tsx
import "../styles/globals.css"; // <-- relative import (most robust)
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TinyLink",
  description: "Minimal URL shortener"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">TinyLink</h1>
            <span className="text-xs text-slate-400">v1.0</span>
          </header>
          {children}
          <footer className="mt-10 text-center text-xs text-slate-500">
            TinyLink • Demo URL Shortener
          </footer>
        </div>
      </body>
    </html>
  );
}
