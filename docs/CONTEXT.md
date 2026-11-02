# CONTEXT — durable context for agents

- **System:** ASHARA atelier ERP. Frontend React 19 SPA (this repo) + Laravel/AureusERP backend.
- **Canonical:** this repo's `src/` is the SPA source of truth; `Ashara-ERP/atelier-app` consumes built `dist`.
- **Current data:** `src/data/mockData.js` + `src/data/erpnextSchemas.js` drive the UI via `App.jsx` `useState` + `localStorage`. This is temporary; the target is the v1 REST API.
- **Do not:** ship secrets to the client; mutate state directly; add comments that explain *what*.
- **Do:** work bottom-up per `docs/PLAN.md`; record decisions in `docs/adr/`; keep `docs/STATUS.md` current.
- **Backend:** `C:\Users\X\Documents\Ashara-ERP` (`plugins/webkul/*`). Needs repair (manifests, `.env`).
