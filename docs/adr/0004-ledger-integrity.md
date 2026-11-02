# ADR 0004 — Ledger integrity

- **Status:** Accepted (2026-11-02)

## Context

The ERP posts double-entry GL entries, journal entries, and a FIFO stock ledger.
These are the financial source of truth and must be tamper-evident.

## Decision

- `gl_entries`, `journal_entries`, `stock_ledger_entries` are **append-only and immutable**.
  Corrections are contra/reversal entries — never UPDATE/DELETE.
- `docstatus` (Draft / Submitted / Cancelled) on submittable doctypes; posting only
  when balanced.
- Enforce Σdebit = Σcredit in `AccountingService` **and** by a reconciliation test
  that fails the build on any unbalanced voucher.
- IDs are server-assigned, prefixed, monotonic series (`SINV-.YYYY.-.#####`) — no
  `Math.random()` IDs.

## Consequences

- Reversal workflow required for every financial document.
- Reconciliation test is a hard gate in CI (L5).
