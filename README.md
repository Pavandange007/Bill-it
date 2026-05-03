# Bill It — Restaurant POS + Auth API

Restaurant billing POS (React + Vite + Tailwind + Lucide) with a small production-style auth API (`server/`) backed by Prisma + SQLite.

## Repo layout

- **Frontend**: Vite/React app at the repo root (`src/`)
- **Backend**: Express + Prisma API in `server/`

Single-repo (“monorepo”) keeps the UI + API aligned (routes, cookie auth, deployment).

## Requirements

- **Node.js**: 18+ recommended (repo has been validated on Node 22)
- **npm**

## Quick start (recommended)

Install deps:

```bash
npm install
npm install --prefix server
```

Configure the API:

```bash
copy server\\.env.example server\\.env
```

Edit `server/.env` at minimum:

| Variable | What it controls |
|---------|-------------------|
| `DATABASE_URL` | SQLite file path (defaults to `file:./dev2.db` in the example) |
| `JWT_SECRET` | Signing secret (**must be 16+ characters**) |
| `PORT` | API port (defaults to **5175** in this example) |
| `CORS_ORIGIN` | Your Vite URL (often `http://localhost:5173` or another port Vite selects) |

Run both servers:

```bash
npm run dev:all
```

Open the printed Vite URL (example: `http://localhost:5174`).

Routes:

- `/signup` — create account
- `/login` — sign in
- `/` — POS (protected)

## Individual processes

Frontend only:

```bash
npm run dev
```

API only:

```bash
npm run dev:server
```

## How auth works (important for deployment)

- The API stores users in SQLite via Prisma.
- Sessions are JWTs issued as an **HttpOnly cookie** (`session`).
- Frontend calls `/api/auth/*` with `credentials: "include"` (see `src/auth/authClient.ts`).
- In development, `vite.config.ts` proxies `/api` → `http://localhost:<PORT>` so cookies “just work” on the Vite origin.

For production deployments, cookie auth becomes sensitive to domains/paths/CORS placement. Prefer **routing `/api/*` behind the same site** (reverse-proxy) unless you deliberately choose a cross-site strategy.

## Database migrations (backend)

Inside `server/`:

```bash
npm run prisma:migrate
```

Creates/updates SQLite schema from `server/prisma/schema.prisma`.

## Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build --prefix server
```

## Production notes / hosting cheat sheet

- **Frontend**: any static hosting (Cloudflare Pages, Vercel, Netlify).
- **Backend**: any Node host (Railway/Render/Fly.io/VM).
- **Env**: configure `JWT_SECRET`, `DATABASE_URL`, `NODE_ENV`, `PORT`, `CORS_ORIGIN` on the backend host.

### SQLite in production

SQLite is simplest for demos/single-instance setups. True production setups often migrate to Postgres and/or persist storage correctly for your host.

### Cloudflare Pages `_redirects` gotcha

If you see “infinite loop” errors from `_redirects`, it means Pages is applying a SPA rewrite rule that conflicts with routing. Remove/adjust conflicting rules rather than layering multiple rewrite rules.

## Scripts (root)

- `dev`: Vite frontend
- `dev:server`: API (Express)
- `dev:all`: run both with `concurrently`

## Troubleshooting

- **Vite chooses a different port** (5174, 5175, …): update `server/.env` `CORS_ORIGIN` to match the exact origin Vite prints.
- **Signup/login fails instantly**: verify the API is running and `JWT_SECRET` length is valid (`server/src/env.ts` validates env at boot).

## Change log

- Initial README added (project overview, scripts, auth/cookie deployment notes).
