# TinyLink

TinyLink — a minimal URL shortener built with Next.js (App Router), Prisma, Neon Postgres, and Tailwind CSS.  
Implements short-code creation, redirects with click-tracking, per-link stats, and a small dashboard UI.

This repository is implemented as a take-home assignment (specification included). See original assignment: :contentReference[oaicite:1]{index=1}

---
##Live Deployment (Vercel)

Live App:
👉 [https://YOUR-VERCEL-URL.vercel.app](https://tiny-link-ebon.vercel.app/)

---


## Features

- Create short links (custom code optional, codes must match `[A-Za-z0-9]{6,8}`)
- Redirect `/:code` → 302 to original URL and increment click count + update `lastClicked`
- Dashboard `/` listing all links
- Stats page `/code/:code`
- Delete a link (makes `/:code` return 404)
- Health endpoint: `GET /healthz` → `200`

---

## Quickstart (local)

### Prerequisites

- Node.js 18+ (LTS) or Node 20+
- npm (or pnpm)
- A Postgres-compatible database (Neon recommended)

### 1. Clone

```bash
git clone <your-repo-url>
cd tinylink
