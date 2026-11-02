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
