# ADR 0005 — Deployment, tenancy, compliance

- **Status:** Accepted (2026-11-02)

## Context

The ERP requirement set lists SaaS/on-prem/hybrid deployment and several
compliance regimes (GDPR, SOC 2, HIPAA).

## Decision

- **Deployment:** single-company, **single-tenant hosted** (cloud/VM).
- **Compliance:** **GDPR + local (UAE/IFRS) accounting only**. SOC 2 and HIPAA are out of scope.
- **Tenancy:** single-tenant; `settings.company_id` retained for future-proofing, not
  enforced isolation.
- **Secrets:** server-side only; never in the client bundle or VCS.

## Consequences

- No per-tenant isolation work in v1.
- Multi-tenant/SaaS would require a new ADR (company_id scoping, isolation, SOC 2).
