# ADR 0001 — Canonical repos and backend

- **Status:** Accepted (2026-11-02)

## Context

The system spans two repos. The SPA also exists as a hand-copied mirror at
`Ashara-ERP/atelier-app/src` (synced by `scratch/sync_frontend.cjs`). Two backends
are referenced in code: a Laravel/AureusERP REST kernel (`routes/api.php`) and a
Frappe/ERPNext instance (`INITIAL_API_CONFIG`, `localhost:8000`).

## Decision

- **Canonical SPA:** `C:\Users\X\Documents\ERP\src`. `atelier-app` receives built
  `dist` output only; the `src` mirror is retired.
- **Canonical backend:** the Laravel + AureusERP app (`plugins/webkul/*`).
  Frappe/ERPNext is deprecated branding; no Frappe code exists. The client-side
  `api_key`/`secret` in `INITIAL_API_CONFIG` must be removed.
- **Build strategy:** plugin-first on AureusERP; bespoke only for
  FF&E / Moodboard / Material Palette / Team Capacity.

## Consequences

- One source of truth per artifact; no drift.
- Backend must be repaired before L2 (missing root manifests, broken `.git`).
