# MAP — where things live

| Artifact | Path | Purpose |
|---|---|---|
| Agent instructions | `AGENTS.md` | Repo conventions and commands for agents |
| Kilo config | `kilo.json`, `.kilo/` | Config, commands, agents |
| Plans | `docs/PLAN.md` | Bottom-up layer detail (L0–L6) |
| Product contract | `docs/PRODUCT.md` | Capability contract, scope, non-goals |
| Status | `docs/STATUS.md` | Current state and progress |
| Log | `docs/LOG.md` | Chronological engineering log |
| Context | `docs/CONTEXT.md` | Durable context for agents |
| Decisions | `docs/adr/` | Architecture decision records |
| Security | `docs/SECURITY.md` | Secrets, CSP, dependency policy (L6) |
| Source | `src/` | SPA (views, components, data) |
| View routing | `src/components/ViewRouter.jsx` | Lazy view switch (L4 decomposition) |
| Modal routing | `src/components/ModalRouter.jsx` | Lazy modal cluster (L4 decomposition) |
| Canonical schemas | `src/schemas/` | Zod entity contracts (L1), shared by forms/API |
| Tests (planned) | `tests/`, `src/**/*.test.*` | L5 |
| Regression ledger | `REGRESSION.md` | Module → acceptance command map (L5) |
| Backend | `C:\Users\X\Documents\Ashara-ERP` | Laravel + AureusERP |

## Layer ↔ artifact

- L0 ground → `AGENTS.md`, `kilo.json`, `docs/`
- L1 model → `docs/adr/` (data rules), schemas
- L1.5 database → `docs/adr/0002`, `0004`
- L2 backend → backend repo
- L3 API → v1 contract (OpenAPI, planned)
- L4 frontend → `src/`
- L5 verification → `docs/PLAN.md` §L5
- L6 ops → deployment/observability (planned)
