# ADR 0003 — Authentication model

- **Status:** Accepted (2026-11-02)

## Context

The SPA is an internal studio tool; single-company, single-tenant. The backend
already has Sanctum (`personal_access_tokens`) and Spatie permission tables.

## Decision

- Email/password accounts in the Laravel app + **Sanctum bearer tokens** for the SPA.
- Roles/permissions via the existing `permission` tables; add API Policies per resource.
- SSO (OIDC/SAML) and client-facing scoping are deferred.

## Consequences

- No client portal in v1 → no row-level client scoping required.
- Tokens stored securely; never ship secrets in the bundle (ADR 0005).
