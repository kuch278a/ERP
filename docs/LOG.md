# LOG

## 2026-11-02

- Scanned repo; identified gaps (no VCS, tests, types, backend wiring).
- Audited against ECC skills; found missing foundations.
- Wrote `docs/PLAN.md` (bottom-up L0–L6); added L1.5 database layer.
- Locked decisions: backend = Laravel/AureusERP; SPA canonical = `ERP/src`; plugin-first;
  single-company single-tenant hosted; GDPR + local accounting only; Sanctum auth;
  v1 defers payroll/budgeting/BI/portal/non-REST integrations.
- Started P0: `git init`, `AGENTS.md`, `kilo.json`, `README.md`, Prettier/EditorConfig, docs spine.
- Finished P0 docs: `MAP`/`STATUS`/`LOG`/`CONTEXT`/`PRODUCT`, ADRs 0001–0005, `.kilo/command/{verify,test}.md`.
- P1/P4 foundations: removed client-side ERP API secret (env-backed, masked in UI), added `.env.example`,
  `src/lib/format.js` (money/date/id rules), `src/lib/apiClient.js` (v1 envelope client),
  `src/components/ErrorBoundary.jsx` (wired in `main.jsx`). Lint + build green.
- Added CI (`.github/workflows/ci.yml`) and started P5: installed Vitest, added `npm run test`,
  `src/lib/format.test.js` (4 passing). A failing test caught a `makeDocId` signature bug, now fixed.
- P1: added Zod canonical schemas for 19 entities across `src/schemas/atelier.js` and
  `src/schemas/erpnext.js`, with contract tests validating every seed record (23 tests passing).
- P4: code-split `App.jsx` — 16 views and 14 modals now `React.lazy` + `Suspense`.
  Main bundle 570 kB → 304 kB; the >500 kB build warning is resolved.
- P4: replaced all `alert()` validation with inline `role="alert"` errors in the journal and
  stock modals, and a non-blocking notification for the clients stub. No `alert()` remains.
- P4: added `src/hooks/useLocalStorageState.js` and replaced the 14 inline
  `useState` + persistence `useEffect` blocks in `App.jsx`; added global Escape-to-close
  for modals (a11y). Lint + build + 23 tests green.
- Database: confirmed AureusERP's pgsql dialect support; switched backend
  `config/database.php` default to `pgsql` and added backend `.env.example` +
  `docker-compose.yml` (Postgres 16). ADR 0002 updated with the confirmation.
- P4: added `react-router-dom` (`BrowserRouter` in `main.jsx`); `App.jsx` derives `currentView`
  from the URL path with a known-views guard, so all views are deep-linkable with back/forward.
- L4/L5: added `src/components/ui/Modal.jsx` (role/aria dialog + focus trap via
  `src/hooks/useFocusTrap.js`) and migrated `NewAssetModal` to react-hook-form + Zod.
  Added jsdom/Testing Library setup (`vitest.config.js`, `src/test/setup.js`) and component
  tests. 27 tests passing.
- L5: added `REGRESSION.md` (module → acceptance-command ledger; backend rows blocked).
- L4: migrated NewOpportunityModal, NewWorkOrderModal, NewSupportIssueModal to the shared
  accessible `Modal` + react-hook-form + Zod, with component tests. 32 tests passing.
- L4: migrated NewSnagModal and NewInvoiceModal (VAT via `VAT_RATE`). 35 tests passing.
- L4: migrated NewProjectModal and NewFfeModal. 39 tests passing.
- L4: migrated NewJournalEntryModal and NewStockEntryModal to the shared `Modal` with Zod
  validation (line-item state preserved; balance/warehouse rules). 43 tests passing.
- L4: migrated NewPurchaseOrderModal (last form modal) to the shared `Modal` + Zod.
  All source-level lint warnings cleared. 45 tests passing.
- L5: coverage gate — `@vitest/coverage-v8`, scoped to lib/hooks/components/ui (views+App
  covered by E2E), floor 58/32/48/60, `npm run test:coverage` in CI. Added tests for
  useLocalStorageState, apiClient, ErrorBoundary. 53 tests passing.
