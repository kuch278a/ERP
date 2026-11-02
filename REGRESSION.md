# REGRESSION — module acceptance ledger

Purpose: after any change that touches a module's externally observable behaviour, run
that module's acceptance command and every downstream command. A red command means the
change is incomplete (docs/PLAN.md §L5).

Verdict = command exit code. Commands marked `NOT RUN` (backend) are blocked until the
`Ashara-ERP` backend is repaired.

| Module | Downstream consumers | Acceptance command | Propagation rule |
|---|---|---|---|
| `src/lib` (format, apiClient) | components, views | `npx vitest run src/lib` | run full SPA suite |
| `src/schemas` | forms, API client, contract tests | `npx vitest run src/schemas` | run full SPA suite |
| `src/hooks` (`useLocalStorageState`, `useFocusTrap`) | App shell, modals | `npx vitest run src/components/ui` | run full SPA suite |
| `src/components/ui` (`Modal`) | all modals | `npx vitest run src/components/ui` | run full SPA suite |
| App shell (`App.jsx`: routing, state) | all views | `npm run build` | build + full suite |
| Full SPA | — | `npm run lint` → `npm run build` → `npm run test` | — |

Last green: `master` tip — lint + build + 53 tests + coverage floor pass.

## Backend (blocked — `NOT RUN`)

| Module | Downstream | Acceptance command | Status |
|---|---|---|---|
| Laravel + AureusERP | REST v1 API, SPA data layer | `php artisan migrate:fresh --seed` + `pest` | NOT RUN — backend tree repair required |
