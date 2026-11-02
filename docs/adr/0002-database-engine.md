# ADR 0002 — Database engine

- **Status:** Accepted (2026-11-02)

## Context

`config/database.php` defaults to SQLite when unset; MySQL/MariaDB/PostgreSQL are
available but unconfigured. The system is double-entry accounting plus FIFO stock
valuation, which need exact decimals and concurrent-safe writes.

## Decision

- **PostgreSQL 16** (preferred) or **MySQL 8 / MariaDB** for all non-local environments.
- **SQLite** for local development only.
- Money as `DECIMAL(18,4)`; stock quantities `DECIMAL(18,4)`. Never `FLOAT`/`REAL`.

## Rationale

- Exact decimal arithmetic; `SELECT … FOR UPDATE` for ledger postings; JSONB
  (notifications are already JSON); partial/covering indexes.

## Confirmation

- AureusERP ships a database-dialect layer (`plugins/webkul/support/src/Database/Dialects`,
  `db_dialect()`) supporting **`mysql`, `mariadb`, and `pgsql`**; migrations use portable DDL
  and `jsonb` on Postgres (e.g. the translatable `blogs` migrations). Postgres is a
  first-class driver, not a workaround.
- Backend `config/database.php` now defaults to `pgsql` and `.env.example` ships Postgres
  settings (`DB_CONNECTION=pgsql`, port `5432`).

## Consequences

- Create `.env.example`; provision a real DB per environment.
- Add ledger reconciliation tests (see ADR 0004).
