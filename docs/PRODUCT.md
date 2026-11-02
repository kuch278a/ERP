# PRODUCT — capability contract

## Summary

ASHARA atelier ERP gives an architecture & interior-design studio one system for
projects, FF&E, site quality, money, procurement, production, assets, CRM, and support.

## Actors

- Studio leadership (dashboard, approvals)
- Designers / architects (projects, FF&E, moodboards)
- Procurement / finance (buying, invoices, ledger)
- Site / QC (snagging)
- Admin (users, roles, configuration)

## v1 capabilities (in)

Financial (GL/AP/AR/assets/tax/reports), Supply chain (procurement/PO/suppliers/
inventory/warehouse), Manufacturing (BOM/WIP/work orders), CRM, Projects/FF&E/Snags,
RBAC, audit trail, REST API, dashboards.

## Non-goals (v1)

Payroll, benefits, performance review, budgeting, predictive BI, customer portal,
GraphQL/SOAP/EDI, multi-tenancy. Single-company, single-tenant hosted; GDPR + local
(UAE/IFRS) accounting only.

## Surfaces

- SPA (this repo) — desktop-first, responsive, accessible core flows.
- Laravel REST v1 (backend) — contract-first.
- Filament admin (backend) — back-office.
