### MMOJournal – Launch Checklist (Go/No-Go)

Version: 2025-08-14

- [ ] Security headers deployed on Vercel
  - Verify via browser DevTools → Network → any request → Headers:
    - `Content-Security-Policy` equals:
      - `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: wss:; object-src 'none'`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: geolocation=(), camera=(), microphone=()`
  - Also confirm the calculator and all static assets load without CSP violations:
    - Open DevTools → Console → ensure no CSP errors (status code 200 for assets in Network tab)
    - Confirm background videos/images and `public/pokemmo-damage-calc` assets render

- [ ] Environment variables
  - Client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` only
  - Ensure no service-role or secrets are present in Vercel project env

- [ ] Supabase RLS (pre-deploy validation)
  - RLS enabled for `profiles`, `pokemon_builds`, `shiny_hunts`
  - Per-user policies restrict to `auth.uid()`

- [ ] Cookies/consent
  - Main SPA: no analytics/tracking cookies
  - Static calc pages: confirm plan (consent gating or disabled by default)

- [ ] User rights flows
  - Manual export/delete steps documented in `docs/DSAR_RUNBOOK.md`
  - In the app, signed-in bar → Account:
    - Test “Download My Data (JSON)” downloads a file containing profile/builds/hunts
    - Test “Delete Account…” requires typing DELETE and removes the user’s rows; user is signed out

- [ ] Backups & restore (Supabase)
  - Confirm project backups schedule in Supabase (Pro plans) or manual SQL dump procedure
  - Test restore on a non-prod instance (export/import or point-in-time if available)

- [ ] Admin access & MFA
  - GitHub: 2FA/MFA enforced for org/repo maintainers
  - Vercel: 2FA enabled for project owners
  - Supabase: 2FA enabled for project owners; rotate service keys if applicable

- [ ] Run verification script
  - From repo root: `bash scripts/verify.sh`
  - Ensure security headers check shows OK and audit summary is acceptable

- [ ] Retention note
  - Retention statement present in docs; no auto-deletes enabled yet


