# AGENTS.md — ASHARA Atelier ERP

## What this is

React 19 + Vite 8 single-page app for **ASHARA**, an architecture & interior-design
atelier ERP. It is a monorepo: the SPA plus the Laravel + AureusERP backend.

| Part | Path | Role |
|---|---|---|
| Frontend | `ERP/src` | SPA, canonical source |
| Backend | `ERP/backend` | Laravel + `webkul`/AureusERP plugins, Filament admin |

The backend was originally the separate `Ashara-ERP` repo (`C:\Users\X\Documents\Ashara-ERP`)
and is now vendored under `backend/`. This frontend is **canonical**.

## Plan of record

- `docs/PLAN.md` — bottom-up layer detail (L0–L6).
- `docs/PRODUCT.md` — capability contract, scope, non-goals.

Work **bottom-up**: L0 ground → L1 model → L1.5 database → L2 backend → L3 API →
L4 frontend → L5 verification → L6 ops. No layer starts until the layer beneath is green.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # production build
npm run lint      # oxlint
npm run typecheck # tsc --noEmit
npm run test      # vitest run (unit + component)
npm run test:coverage
npm run e2e       # playwright (run e2e:install first)
npm run preview   # preview the build
```

## Conventions

- **Commits:** conventional commits — `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- **Immutability:** never mutate state; use spread updates.
- **Comments:** only to explain *why*, never *what*.
- **No secrets in the client bundle.** API keys/credentials live server-side only.
- Data rules (money/date/IDs/valuation) are recorded in `docs/adr/`.

## Current status

See `docs/STATUS.md`. The SPA is currently mock-data driven (`src/data/*`) with
`localStorage` persistence; it is being migrated to the v1 REST API backed by
Laravel/AureusERP.
