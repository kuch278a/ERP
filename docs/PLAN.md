# ASHARA Atelier ERP — Bottom-Up Engineering Plan

**Status:** Draft / for review
**Last updated:** 2026-11-02
**Scope:** `C:\Users\X\Documents\ERP` (React SPA) + `C:\Users\X\Documents\Ashara-ERP` (Laravel + AureusERP/Filament backend)
**Approach:** build from the bottom layer up — data → backend → API → frontend → verification → operations. Each layer may only depend on the layers below it.

---

## 0. Current state (baseline, verified)

| Layer | Present | Missing / broken |
|---|---|---|
| Repo/governance | `.gitignore`, `.oxlintrc.json` | **not a git repo**, no `AGENTS.md`, no `.kilo`, no CI, stale template `README.md`, no docs spine |
| Data model | `src/data/mockData.js`, `src/data/erpnextSchemas.js` (24 datasets, `ERPNEXT_DOCTYPES`) | no canonical schema, no migrations/seeders for atelier entities, secrets in client (`INITIAL_API_CONFIG.api_key`) |
| Database | `config/database.php`, 13 app migrations, ~430 `webkul` plugin migrations | **no `.env`/`.env.example`** (SQLite fallback, unconfigured), no atelier tables, `UserFactory` only, no ledger integrity rules |
| Backend | Laravel app, `webkul` AureusERP plugins, 13 migrations, Sanctum/permissions tables | `app/Models` = `User.php` only; no domain controllers/resources; `routes/api.php` returns hardcoded JSON closures |
| API | `routes/api.php` v1 with ~20 endpoints | no controllers, no validation, no contract, no auth enforcement, no pagination/envelope, mock data |
| Frontend | 16 views, 13 modals, nice UI, localStorage persistence | no API client, no routing, no state architecture, no error boundaries, no memoization, `alert()` validation, no a11y |
| Verification | backend Pest + Playwright (`tests/e2e-pw`) | SPA has **zero tests**, no typecheck, no coverage gate, SPA not in CI |
| Ops | backend `docker/`, health endpoint | no SPA env config, no secret management, no observability plan |

**Topology decisions (locked 2026-11-02)**
- **Canonical SPA:** `ERP/src` (this repo) is the single source of truth. `Ashara-ERP/atelier-app` receives built `dist` output only; retire `scratch/sync_frontend.cjs` and stop hand-mirroring `src`.
- **Canonical backend:** the Laravel/AureusERP app in `C:\Users\X\Documents\Ashara-ERP` (`plugins/webkul/*`). The Frappe/ERPNext reference in `erpnextSchemas.js` (`INITIAL_API_CONFIG` → `http://localhost:8000` + api_key/secret) is **deprecated branding** — no Frappe code exists in either repo, and the mock schemas are already an ERPNext→Laravel port. Remove the client-side api_key/secret.
- **Repair required first:** the backend tree is incomplete (no root `composer.json`/`package.json`; `.git/` contains only `objects/`+`refs/`, so git reports "not a repository"). Restore manifests and re-init git before L2.
- **Build strategy:** plugin-first on AureusERP; bespoke only for atelier-specific entities (see L1).

---

## L0 — Foundations & governance (repo bottom)

**Goal:** a reproducible, reviewable project before any feature work.

Deliverables
1. `git init` in `ERP/`; initial commit; branch protection; conventional-commit convention (`feat:`, `fix:`, `docs:`, `test:`).
2. `AGENTS.md` at repo root + `.kilo/` config declaring the canonical commands: `dev`, `build`, `lint`, `typecheck`, `test`, `e2e`.
3. TypeScript migration: add `tsconfig.json`, rename `.jsx`→`.tsx` incrementally, strict mode on new files.
4. Lint/format: keep Oxlint, expand `.oxlintrc.json` rules; add Prettier with a shared config.
5. Docs spine under `docs/`: `MAP.md`, `STATUS.md`, `LOG.md`, `CONTEXT.md`, `PRODUCT.md` (capability contract), `adr/` (ADRs).
6. Replace the Vite-template `README.md` with a real project README (architecture diagram, run instructions, layer map).
7. Decide the SPA canonical source; convert `atelier-app` mirror into a build artifact (published `dist`) instead of a file-copy script. Retire `scratch/*.cjs` or move them under a documented `scripts/`.

Acceptance
- `git status` clean; `npm run lint` and `npm run typecheck` both run and are wired into `.kilo`.
- `AGENTS.md` present; `docs/MAP.md` links every layer artifact.
- `atelier-app` is generated, not hand-mirrored.

---

## L1 — Domain model & data (the true bottom)

**Goal:** one canonical schema per entity, shared by DB and client.

Deliverables
1. Entity inventory (from `mockData.js` + `erpnextSchemas.js`), grouped by module:

| Module | Entities |
|---|---|
| Projects/Atelier | Project, ProjectPhase, FF&E Item, Snag, Moodboard, Material Palette, Team Member |
| Sell | Client, Sales Invoice, Payment Entry |
| Buy | Supplier, Purchase Order, Purchase Invoice |
| Stock | Item, Warehouse, Stock Entry, Stock Ledger Entry |
| Accounts | Chart of Accounts (tree), GL Entry, Journal Entry, Account |
| Manufacturing | BOM, BOM Item/Operation, Work Order |
| Assets | Asset, Depreciation |
| CRM | Opportunity |
| Support | Issue, Subcontract Order |

**Module → AureusERP plugin map (plugin-first):**

| Domain | Owner |
|---|---|
| Sell / invoices | `webkul/invoices`, `webkul/sales` |
| Buy | `webkul/purchases` |
| Stock | `webkul/inventories` |
| Accounting | `webkul/accounts`, `webkul/accounting` |
| Manufacturing | `webkul/manufacturing` |
| Assets | `webkul/accounts` (fixed assets) |
| CRM | `webkul/partners`, `webkul/contacts` |
| Snags | `webkul/support` / `webkul/maintenance` |
| Projects | `webkul/projects` (extend) |
| Payments | `webkul/payments` |
| Team / time | `webkul/employees`, `webkul/timesheets`, `webkul/time-off` |
| Website / blog | `webkul/website`, `webkul/blogs` |
| **Bespoke (no plugin)** | FF&E Item, Moodboard, Material Palette, Team Capacity, ProjectPhase (only if `webkul/projects` can't be extended) |

2. Canonical field contracts per entity, reconciled with `ERPNEXT_DOCTYPES` (field names/types must match) and with the owning `webkul` plugin's model + migration.
3. Policy decisions, written down:
   - Money = integer minor units (cents); no floats in the ledger.
   - Currency USD default; UAE VAT 5%; tax lines explicit.
   - Dates ISO-8601 UTC; posting date vs. transaction date distinguished.
   - ID strategy: replace `Math.random()` IDs with server-assigned, monotonic, prefixed series (`SINV-.YYYY.-.#####`).
   - Valuation: FIFO / Moving Average per item, matching ERPNext semantics.
   - Double-entry invariant: Σdebit = Σcredit per voucher (tolerance ≤ 0.01).
4. Schema source-of-truth artifacts: Zod schemas (client) generated/derived from the API contract (L3); Laravel migrations + FormRequests mirroring the same fields.

Acceptance
- Every entity has a schema; `ERPNEXT_DOCTYPES` and Zod/Laravel definitions agree (contract test in L5).
- Written money/date/ID/valuation policies in `docs/adr/`.

---

## L1.5 — Database & persistence

**Goal:** a real, transactional store whose schema is owned by the correct layer, chosen and configured before backend logic is written.

**Current facts (verified)**
- `config/database.php` default connection falls back to **SQLite** (`env('DB_CONNECTION','sqlite')`); MySQL/MariaDB/PostgreSQL are configured but unset.
- **No `.env` or `.env.example` exists** → the app cannot connect to a configured database today.
- App-root migrations: 13 (framework/auth/settings/notifications/permissions/Sanctum). The real domain schema lives in **`plugins/webkul/*/database/migrations`** (~430 migrations): accounts 71, inventories 57, manufacturing 37, support 34, POS 33, sales 26, employees 22, purchases 19, products 18, recruitments 14, projects 12, security 10, time-off 10, partners 8, blogs 7, maintenance 6, payments 6, chatter 4, website 4, table-views 2, analytics/fields/plugin-manager 1 each.
- `database/seeders`: `CurrencySeeder`, `DatabaseSeeder`, `ShieldSeeder`. `database/factories`: `UserFactory` only.

**Deliverables**
1. **Engine decision (ADR):** use **PostgreSQL 16** (preferred) or MySQL 8 / MariaDB beyond local dev; keep SQLite only for local/dev. Rationale: exact `DECIMAL` money, transactional concurrency (`SELECT ... FOR UPDATE`) for ledger postings, JSONB (notifications are already JSON), partial/covering indexes. SQLite is unsuitable for concurrent financial writes.
2. **Schema ownership rule:** never create tables a `webkul` plugin already owns. Bespoke migrations only for the L1 gap entities — `ffe_items`, `moodboards`, `material_palettes`, `team_capacity`, and `project_phases` only if `webkul/projects` cannot be extended. Every new migration: reversible `up()`/`down()`, one concern each, indexed FKs.
3. **Ledger integrity (critical):**
   - `gl_entries`, `journal_entries`, `stock_ledger_entries` are **append-only and immutable**; correction = contra/reversal entries, never UPDATE/DELETE.
   - Money columns `DECIMAL(18,4)` (never FLOAT/REAL); stock qty `DECIMAL(18,4)`; `valuation_rate` and `stock_value` stored per entry.
   - `docstatus` (Draft / Submitted / Cancelled) on all submittable doctypes; post only when balanced.
   - Enforce Σdebit = Σcredit in `AccountingService` (L2) **and** add a reconciliation query/test that fails the build if any voucher is unbalanced.
4. **Multi-tenancy:** `settings.company_id` already exists → if multi-company is in scope, add `company_id` to every business table with a global scope + policy; otherwise document single-tenant explicitly (see Open Questions).
5. **Environment config:** create `.env.example` (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) and a local `.env`; secrets never committed.
6. **Seeders/factories:** port `mockData.js` + `erpnextSchemas.js` datasets into factories/seeders so `php artisan migrate --seed` reproduces the current demo (projects, FF&E, snags, invoices, POs, stock, work orders, assets, opportunities, issues).
7. **Performance & integrity:** indexes on hot paths (`posting_date`, `(item, warehouse)`, `(voucher_type, voucher_no)`, `project`, `party`), FK constraints on, pagination-friendly ordering; use the `table-views`/`query-builder` plugins rather than ad-hoc queries.
8. **Backup & recovery:** automated backups + point-in-time recovery for the ledger DB, a restore drill, and a migration rollback runbook (ties into L6).

**Acceptance**
- `php artisan migrate:fresh --seed` runs clean on the chosen engine and reproduces demo data.
- A posted journal entry cannot be edited/deleted; reversal is the only correction path.
- Reconciliation query returns zero unbalanced vouchers.
- `.env.example` present; no secrets in VCS.

---

## L2 — Backend (Laravel + AureusERP)

**Goal:** real persistence and domain logic behind the API; no more hardcoded closures.

Deliverables
1. Adopt the `webkul` AureusERP plugins per the L1 map; never re-implement a domain a plugin already owns. Extend a plugin when the atelier needs extra fields; do not fork it.
2. `webkul/projects` already exists — extend it for atelier **Project / ProjectPhase** before writing anything new; map **Snags** onto `webkul/support`/`maintenance` rather than a custom model.
3. Add bespoke models + migrations **only** for the genuine gaps: **FF&E Item, Moodboard, Material Palette, Team Capacity** (today `app/Models` has only `User`).
4. Service layer (the accounting kernel):
   - `AccountingService` — validate & post double-entry vouchers; block unbalanced entries.
   - `StockLedgerService` — FIFO / moving-average valuation, quantity + value reconciliation.
   - `ProcurementService`, `ManufacturingService`, `SalesService` — state machines and GL side-effects.
5. Move `routes/api.php` closures → `Http/Controllers/Api/V1/*` + `FormRequest` validation + `JsonResource`/`ResourceCollection` transformers.
6. Authn/z: Sanctum tokens (`personal_access_tokens` exists), roles/permissions (`permission` tables exist), Policies per resource; company scoping (`settings.company_id`).
7. Events + queues for asynchronous GL posting, notifications (`notifications` table), and sync jobs.
8. Seeders/factories from the existing mock datasets for dev/demo parity.

Acceptance
- Migrations create the atelier tables; seeders reproduce current demo data.
- `AccountingService` rejects unbalanced vouchers (feature test).
- `StockLedgerService` matches golden FIFO samples.
- No business data returned from route closures.

---

## L3 — API layer (v1 contract)

**Goal:** a versioned, validated, documented API that the SPA consumes.

Deliverables
1. **Contract-first:** one OpenAPI spec is the single source of truth for the v1 surface; generate client TS types (`openapi-typescript`) and keep Laravel `Resource`s aligned.
2. Formalize resource endpoints (extend what `routes/api.php` already sketches), grouped:
   - accounts: `/chart-of-accounts`, `/general-ledger`, `/journal-entries` (POST), `/reports/{balance-sheet,profit-and-loss,trial-balance}`
   - buying: `/suppliers`, `/purchase-orders`
   - stock: `/items`, `/warehouses`, `/ledger`, `/stock-entries`
   - manufacturing: `/boms`, `/work-orders`
   - assets, crm/opportunities, support/issues, desk/doctypes
   - atelier: `/projects`, `/ffe-items`, `/snags`, `/invoices`, `/clients`
3. Standards: response envelope `{ success, data, meta, error }`; cursor/offset pagination; filtering; consistent error codes; **idempotency keys** on postings (invoices, journal entries, stock entries).
4. Auth: bearer (Sanctum), rate limiting, CORS allow-list for the SPA origin; server-side validation on every boundary.
5. Versioning + backward-compatibility window; reconciliation endpoints for accounting facts.

Acceptance
- OpenAPI validates; generated TS client compiles; every endpoint has an auth + validation + error path test.
- An idempotent posting endpoint returns the same result when retried.

---

## L4 — Frontend (React SPA)

**Goal:** replace localStorage-first prototype with an API-backed, accessible, resilient SPA.

Deliverables
1. **Data layer:** `lib/api` client (fetch wrapper: auth, envelope unwrap, error normalization, retries) + React Query (or SWR) for server state; local state only for UI.
2. **State architecture:** split the 726-line `App.jsx` into per-domain hooks/store (Context+reducer or Zustand) + per-view containers; remove 14 duplicated `localStorage` effects.
3. **Forms/UI kit:** extract reusable components (table, modal, field, toast, button); replace `alert()` with `react-hook-form` + Zod validation (schemas shared with L3 types).
4. **Routing:** `react-router` with deep links/back button; route-level code splitting (`React.lazy` + `Suspense`) for the 16 views / 13 modals.
5. **Performance:** `useMemo`/`useCallback`/`React.memo` where measured; list virtualization for long tables; module-level chunks.
6. **Resilience:** error boundary per route; loading/error/empty states; optimistic updates only where safe.
7. **Accessibility:** `aria-*`/roles, focus trapping in modals, keyboard navigation, contrast; target WCAG 2.1 AA for core flows.
8. **Security:** remove `INITIAL_API_CONFIG.api_key` from client bundle; secrets only server-side; no PII in logs.
9. Keep dark/light theming (CSS variables already in `index.css`).

Acceptance
- No `localStorage` as source of truth; data loads from the API.
- `App.jsx` under ~150 lines; views lazily loaded; route error boundary catches failures.
- 0 `alert()`; forms show inline validation.
- Core flows keyboard-navigable with visible focus.

---

## L5 — Verification

**Goal:** provable correctness across modules, wired into CI.

Deliverables
1. **Frontend:** Vitest + Testing Library for unit/component; Playwright E2E reusing the backend harness (`Ashara-ERP/tests/e2e-pw`) patterns; add `data-testid` hooks.
2. **Backend:** Pest feature/unit tests; API contract tests; accounting reconciliation (Σdebit=Σcredit); FIFO valuation golden samples.
3. **Module regression ledger** (`REGRESSION.md`): map each frontend module → API endpoint → backend module with an executable acceptance command; propagate downstream runs after changes.
4. **CI:** extend existing `.github/workflows/{pest_tests,playwright_tests}.yml` to also build/lint/typecheck/test the SPA; add coverage gates (target 80%).
5. **Verification loop:** build → typecheck → lint → tests → security scan → diff review, as a documented checklist.

Acceptance
- CI green on the SPA and backend; coverage gates enforced.
- Every important defect leaves a durable test reference (TEST-ID).
- `REGRESSION.md` has an acceptance command per module.

---

## L6 — The rest (operations, security, docs)

Deliverables
1. **Security:** authn/z review, secret management, server-side validation everywhere, rate limits, PII handling for CRM data, CSP, dependency audit.
2. **Observability:** structured logs, error tracking, metrics; the `/health` endpoint already exists — extend with dependency checks.
3. **Deployment:** use backend `docker/`; environment config per stage; migration rollout + rollback; ledger backups.
4. **Docs/governance:** ADRs for key decisions (target backend, API contract, accounting standard, valuation method); STATUS/LOG/CONTEXT kept current; PR/issue templates (backend already has them).

Acceptance
- Secrets never in the client bundle or VCS.
- Rollback runbook for migrations; backups verified.
- ADRs exist for the decisions listed in Open Questions.

---

## Phased roadmap

| Phase | Layers | Exit criteria |
|---|---|---|
| P0 — Ground | L0 | git repo, AGENTS.md, docs spine, canonical SPA source, backend tree repaired |
| P1 — Model + DB | L1, L1.5 | schemas + policies agreed; engine chosen; `migrate:fresh --seed` reproduces demo data |
| P2 — Backend core | L2 | plugin map adopted, atelier gaps modelled, accounting + stock services, seeders |
| P3 — API v1 | L3 | OpenAPI contract, controllers/resources, auth, idempotency |
| P4 — Frontend integration | L4 | API client + query, routing, forms, error boundaries, a11y |
| P5 — Verification | L5 | SPA + backend tests in CI with coverage gates |
| P6 — Harden | L6 | security, observability, deploy/rollback, ADRs complete |

Rule for every phase: **no layer starts until the layer beneath is green** (tests pass, contract stable).

---

## Decisions (locked 2026-11-02)

1. **Canonical backend = Laravel / AureusERP** (`C:\Users\X\Documents\Ashara-ERP`, `plugins/webkul/*`). Frappe/ERPNext is deprecated branding; no Frappe code exists in either repo. *Prerequisite:* repair the incomplete backend tree (restore `composer.json`/`package.json`, re-init `.git`).
2. **Canonical SPA = `ERP/src`** (this repo). `atelier-app` consumes built `dist` output only; the `sync_frontend.cjs` src-mirror is retired.
3. **Build strategy = plugin-first**, bespoke only for FF&E / Moodboard / Material Palette / Team Capacity (and ProjectPhase only if `webkul/projects` can't be extended). See the L1 plugin map.

## Open questions (remaining)

1. **Auth model:** internal staff (SSO/Sanctum) or client-facing (row-level scoping per client/project)?
2. **Multi-company** scope (settings already carry `company_id`) — single-tenant now, multi-tenant later?
3. **Data ownership:** does the SPA own atelier data (projects/FF&E/snags) in the Laravel DB, or is any of it still authoritative in an external ERPNext instance?
