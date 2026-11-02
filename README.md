# ASHARA — Architecture & Interior Atelier ERP

Single-page frontend for **ASHARA**, an integrated ERP for an architecture and
interior-design studio: projects & BIM stages, FF&E specification, site snagging,
financials, procurement, stock, manufacturing, fixed assets, CRM, and support
(ported from ERPNext v16 module concepts).

This repo is the **canonical SPA**; the backend is a Laravel + AureusERP app
(`C:\Users\X\Documents\Ashara-ERP`).

## Stack

- React 19 · Vite 8 · `lucide-react`
- Oxlint · Prettier
- (planned) TypeScript · Vitest + Playwright

## Getting started

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm run lint      # lint
npm run preview   # preview the build
```

## Architecture

```
src/
├── App.jsx          # root: state, routing, modals (being decomposed — see plan)
├── components/      # Sidebar, Topbar, modals, shared UI
├── views/           # 16 module views (Dashboard, Projects, FF&E, …)
├── data/            # mock datasets + ERPNext doctype schemas (to be replaced by API)
├── assets/
└── index.css        # design system (CSS variables, dark/light theme)
```

## Plan & status

- `docs/PLAN.md` — bottom-up implementation plan (L0–L6).
- `docs/PRODUCT.md` — capability contract and scope.
- `docs/STATUS.md` — current state and progress.
- `docs/MAP.md` — where every artifact lives.
- `docs/adr/` — architecture decision records.

## Scope (v1)

Financial, supply chain, manufacturing, CRM, projects/FF&E/snags, RBAC, audit
trail, REST API, dashboards. Single-company, single-tenant hosted. Payroll,
budgeting, BI, customer portal, and non-REST integrations are deferred to v2.
