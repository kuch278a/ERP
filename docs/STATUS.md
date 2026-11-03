# STATUS

**Updated:** 2026-11-03

## Where we are

- **Phase:** L0–L5 Full-Stack Monorepo Complete & Verified Green.
- **Frontend SPA:** Feature-complete atelier ERP with React Query v1 API hydration, TypeScript 7 strict mode, code-split Vite 8 bundles, modular view architecture (`financials/`, `stock/`), 58 passing unit & component tests meeting coverage floors, and Playwright E2E smoke tests passing.
- **Backend:** Laravel 13.31 + AureusERP running on PostgreSQL 16; Sanctum auth; Atelier Eloquent migrations & seeders; 12 Pest API feature tests passing (37 assertions).

## Done

- [x] Full monorepo configuration: `.env`, `backend/.env` (app key, pgsql, Sanctum domains).
- [x] Vite 8 configuration with path aliases (`@/`), API dev proxy, and chunking strategy.
- [x] TypeScript paths (`tsconfig.json`) configured for TS 7.
- [x] Scoped `oxlint src` + `.oxlintignore`.
- [x] Tailwind CSS v4 Vite integration for backend Filament asset pipeline (`backend/vite.config.js`).
- [x] Backend Composer dependencies (220 packages) installed and optimized autoloader generated.
- [x] PostgreSQL 16 cluster online (`127.0.0.1:5432`); migrations verified.
- [x] Unified root scripts for monorepo testing and development (`backend:dev`, `backend:build`, `backend:test`, `backend:serve`, `test:all`).
- [x] Atelier database migrations (`atelier_projects`, `atelier_ffe_items`, `atelier_snags`, `atelier_invoices`, `atelier_clients`) and seeders (`AtelierSeeder.php`).
- [x] Atelier Eloquent models (`Project`, `FfeItem`, `Snag`, `Invoice`, `Client`) and API v1 controllers with Sanctum token auth.
- [x] Missing client modal (`NewClientModal.jsx`) built with `react-hook-form` + `zod` and unit tested.
- [x] Decomposed `FinancialsView.jsx` into 7 sub-tab components under `src/views/financials/`.
- [x] Decomposed `StockView.jsx` into 4 sub-tab components under `src/views/stock/`.
- [x] Playwright E2E smoke tests verified green (`npm run e2e`: 3 passed).
- [x] Frontend Vitest suite green: 58 passed across 20 test files, 100% of coverage floors exceeded.
- [x] Backend Pest suite green: 12 passed (37 assertions).

- [x] `docs/PLAN.md` written (bottom-up L0–L6).
- [x] Topology decisions locked (backend = AureusERP; SPA canonical = `ERP/src`; plugin-first).
- [x] v1 scope, deployment/tenancy, and auth decisions locked.
- [x] `git init`; `AGENTS.md`, `kilo.json`, `README.md`, Prettier/EditorConfig.
- [x] docs spine (`MAP`/`STATUS`/`LOG`/`CONTEXT`/`PRODUCT`), ADRs 0001–0005, `.kilo/` commands.
- [x] Removed client-side ERP API secret; added `.env.example`.
- [x] Added `src/lib/format.js`, `src/lib/apiClient.js`, `ErrorBoundary`; lint + build green.
- [x] Added CI workflow (`.github/workflows/ci.yml`: lint + build).
- [x] P5 start: Vitest installed, `npm run test` wired, `src/lib/format.test.js` (4 passing), test in CI.
- [x] P1: canonical Zod schemas (`src/schemas/atelier.js`, `erpnext.js`) + contract tests (23 passing).
- [x] P4 start: `App.jsx` views/modals code-split via `React.lazy` + `Suspense` (main chunk 570 kB → 304 kB).
- [x] P4: removed all `alert()` calls (inline `role="alert"` errors in journal/stock modals; non-blocking notification for the client stub).
- [x] P4: extracted `useLocalStorageState` hook (replaces 14 useState+useEffect persist blocks); Escape closes the top-most modal.
- [x] P4: `react-router` routing — views are URL-addressable (`/projects`, `/stock`, …), with back/forward support.
- [x] P4/L5: shared accessible `Modal` + `useFocusTrap`; migrated all 11 form modals to `react-hook-form`/Zod (Asset, Opportunity, Work Order, Support Issue, Snag, Invoice, Project, FF&E, Journal Entry, Stock Entry, Purchase Order) with component tests.
- [x] P5: `REGRESSION.md` module acceptance ledger added (backend rows blocked).
- [x] P5: coverage gate (`@vitest/coverage-v8`) wired in `vitest.config.js` with a floor (58/32/48/60) and `npm run test:coverage` in CI. Tests for hook, API client, ErrorBoundary added.
- [x] P4 a11y: all modals (incl. read-only `ProjectDetailModal`, `DocTypeInspectorModal`, `PrintableInvoiceModal`) now expose `role="dialog"`/`aria-modal` + focus trap.
- [x] P6/L6: `docs/SECURITY.md` (secrets, CSP, dependency policy) + `npm audit --audit-level=high` in CI (0 vulnerabilities).
- [x] P4 decompose: extracted `ViewRouter.jsx` (lazy view switch); `App.jsx` 732 → 600 lines.
- [x] P4 decompose: extracted `ModalRouter.jsx` (lazy modal cluster); `App.jsx` 600 → 490 lines.
- [x] P4 decompose: extracted `useEstate` hook (domain state + handlers); `App.jsx` 490 → 226 lines.
- [x] P4 decompose: extracted `useUiState` + `useOverlayState`; `App.jsx` 226 → 154 lines (~150 target).
- [x] P5: Playwright E2E harness (`playwright.config.js`, `tests/e2e/smoke.spec.js`, `npm run e2e`) + CI `e2e` job.
- [x] P0 TS: TypeScript enabled (`tsconfig.json`, strict, allowJs), `format`/`apiClient` migrated to `.ts`, `npm run typecheck` in CI.
- [x] P4/L4 data layer: React Query (`QueryClientProvider`) + `src/lib/estateApi.js` hydration from the v1 API (seed fallback); coverage floor raised to 70/50/62/72.
- [x] L2/L3 hardening: atelier API routes now behind Sanctum auth (health public); SPA hydration ignores empty responses.

## In progress

- [ ] P1/P4: canonical schemas, routing, forms, a11y still to come.

## Next

- [ ] P1.5 DB engine + ledger integrity (backend repo, blocked on repair).
- [ ] P4: decompose `App.jsx`, router + lazy loading, replace `alert()`, a11y.
- [ ] P5 test harness + CI.

## Blockers

- Backend **repaired, running, and committed**: `composer.json`/autoload/`artisan`/`.env`/`.gitignore`/`package.json`/`phpunit.xml` restored; Postgres 16 cluster up; `php artisan migrate` OK; atelier API refactored to `Api\V1` controllers with passing feature tests. See `Ashara-ERP/REPAIR.md`.
- Remaining optional hardening: back the L3 atelier controllers with the plugin Eloquent models + seed reference data (current endpoints return static reference data).

## Database

- Engine: **PostgreSQL 16** (ADR 0002). Backend `config/database.php` defaults to `pgsql`;
  backend `.env.example` and `docker-compose.yml` (Postgres 16) added.
- AureusERP supports `mysql` / `mariadb` / `pgsql` via its dialect layer.
