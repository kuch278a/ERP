# SECURITY — frontend notes

Scope: the SPA in this repo. Backend/host controls headers and auth (see `docs/adr/`).

## Secrets

- **No secrets in the client bundle.** Only `VITE_`-prefixed vars reach the browser.
- The deprecated ERP bridge `api_key`/`api_secret` were removed from
  `src/data/erpnextSchemas.js`; the desk view now shows `server-side only`.
- `.env` is git-ignored and `.env.example` is kept. API keys, DB credentials, and Sanctum
  configuration live server-side only.

## Content Security Policy (served by the backend/host, not the SPA)

Recommended starting policy:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' <API_ORIGIN>;
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
```

`'unsafe-inline'` for styles is currently required by inline `style={{}}` usage; migrate to
CSS classes/variables to remove it. `connect-src` must list the v1 API origin.

## Dependencies

- CI runs `npm audit --audit-level=high`.
- Last audit: **2026-11-02 — 0 vulnerabilities** (165 dependencies).

## Practices

- Sanctum bearer tokens: prefer in-memory/secure storage over `localStorage` long-term.
- No PII in console logs; no `dangerouslySetInnerHTML` (none used).
- External links use `rel="noopener noreferrer"`.
