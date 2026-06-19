# Orbit

AI-powered music discovery companion. Drag the **comfort zone radius** outward and Orbit's DJ host narrates the drift from your familiar core toward more adventurous picks, spiraling through a curated catalog mapped onto a living orbit visualization.

This repo implements the UI from a Claude Design prototype (`packages/shared`, `frontend`, `backend` below) as a full-stack app: React/Vite frontend on Vercel, Express/Postgres backend on Render, Spotify OAuth + Web Playback SDK for real audio.

## Structure

```
packages/shared/   spiral math, persona/mood content, scripted DJ dialogue — shared by frontend + backend
frontend/          Vite + React + TS + Tailwind + Framer Motion + React Router
backend/           Express + TS + Postgres (Drizzle ORM) + Spotify OAuth
```

## Prerequisites

- Node.js 20+
- A local Postgres instance (or a Render/Neon/Supabase Postgres URL)
- A Spotify app (create one at https://developer.spotify.com/dashboard) with:
  - Redirect URI: `http://localhost:4000/api/auth/callback` (dev) / your Render URL in prod
  - A **Premium** Spotify account for testing playback (Web Playback SDK requirement)

## Local setup

```bash
npm install

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in `backend/.env`:
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` — from your Spotify app
- `DATABASE_URL` — your local Postgres connection string
- `SESSION_SECRET` — any long random string
- `TOKEN_ENCRYPTION_KEY` — a 32-byte key, hex or base64. Generate one with:
  ```bash
  openssl rand -hex 32
  ```

Then run migrations and seed the catalog (resolves Spotify track URIs via Search):

```bash
npm run db:generate --prefix backend   # generates SQL from schema.ts (first time / after schema changes)
npm run db:migrate --prefix backend
npm run seed
```

Start both apps:

```bash
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173 — visit this, click **Continue with Spotify**.

## Deployment

### Frontend → Vercel

Import the repo, set the project root to the repo root (it uses the root `vercel.json`). Set env var:
- `VITE_API_BASE_URL` = your Render backend URL

### Backend → Render

Use the included `render.yaml` (Render Blueprint) — it provisions the web service and a Postgres database. After the first deploy, set these env vars in the Render dashboard (marked `sync: false` in the blueprint):
- `FRONTEND_URL` — your Vercel URL
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI` (`https://<your-render-url>/api/auth/callback`)
- `TOKEN_ENCRYPTION_KEY` — 32-byte hex/base64 key (see above)
- `OPENAI_API_KEY` — unused today; placeholder for the future-AI seam in `packages/shared/src/djScript.ts`

Run `npm run db:migrate --prefix backend` and `npm run seed` once against the production `DATABASE_URL` (e.g. via Render's shell) before first use.

Remember to update the Redirect URI in your Spotify app dashboard to match the production callback URL.

## Notes on scope

- **Music data**: a curated catalog (seeded in `packages/shared/src/content.ts`), not Spotify's Recommendations/Audio-Features/Related-Artists APIs — those were deprecated for new Spotify apps in Nov 2024. Spotify OAuth provides identity and playback only.
- **DJ host**: scripted, deterministic dialogue (`packages/shared/src/djScript.ts`), ported from the design. `backend/src/services/djScript.ts` is the single seam where a future LLM call can replace the templates.
- **Playback**: real audio via Spotify's Web Playback SDK (`frontend/src/lib/spotifyPlayer.ts`) — requires the signed-in user to have Spotify Premium.
