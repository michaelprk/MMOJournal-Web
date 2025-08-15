### MMOJournal – GDPR & Security Compliance Audit (read-only)

Date: 2025-08-14
Scope: Frontend (React/Vite) + Supabase client usage; Vercel static hosting; optional local backend dev server in `backend/` (SQLite). No code changes made in this step.

### 1) Data inventory

- **Account/auth** (Supabase Auth)
  - Email, user id (`auth.uid()`), username stored in `profiles` table via client insert in `app/contexts/AuthContext.tsx`.
  - Passwords handled by Supabase Auth (not stored by app).
  - Password reset uses `supabase.auth.resetPasswordForEmail` and `updateUser`.
- **Profiles** (`public.profiles`)
  - Fields inserted: `user_id`, `username`, `email`.
- **Pokemon builds** (`public.pokemon_builds`)
  - User-created competitive builds: name/species, stats, items, moves, optional team metadata, timestamps.
- **Shiny hunts** (`public.shiny_hunts`)
  - Hunt metadata: `pokemon_id`, `pokemon_name`, method, location fields, counters, completion timestamps, flags, `meta` JSON (may include user-entered notes/IVs), optional phase relationships.
- **Local backend (dev only)**
  - `backend/` exposes a separate SQLite schema for builds/journal with HTTP-only cookie auth. This is not used by the Vercel-hosted site.

Personal data processed:
- Identifiers: email, username, `auth.uid()`.
- Content entered by users: builds, notes, shiny hunt notes/metadata.

### 2) Storage in browser (localStorage/cookies)

- localStorage
  - `mmojournal:bg:v1` (background/video preference) in `app/contexts/BackgroundContext.tsx`.
  - `damageCalcPlainBg` flag (UI background) in `app/root.tsx`.
  - Public `public/pokemmo-damage-calc/*` pages store `darkTheme` and custom move sets (`customsets`). These are static assets with legacy GA (see below). No PII stored.
- Cookies (frontend)
  - No app-set cookies in the React SPA.
- Cookies (local backend dev server only)
  - `backend/server.js` sets `mmojournal_token` (HTTP-only), for local dev API. Not used in production/Vercel SPA.

### 3) Supabase usage and keys

- Supabase client created in `app/services/supabase.ts` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only.
- No evidence of service role key used client-side.
- A placeholder `SUPABASE_SERVICE_ROLE_KEY` exists in `base.env` (development aid), but not used in client code. Risk if ever exposed publicly; ensure not deployed to Vercel env.
- Tables accessed from client:
  - `profiles` (insert/select)
  - `pokemon_builds` (select/insert/update/delete)
  - `shiny_hunts` (select/insert/update/delete + realtime channels)
  - RPC: `lookup_email_for_username` used at sign-in.

### 4) Tracking/analytics

- No analytics in the main React app.
- Legacy Google Analytics (UA) is embedded in static `public/pokemmo-damage-calc/*.html` assets. That will set GA cookies if those static pages are opened. The main SPA route does not embed GA.

### 5) Legal bases (indicative)

- Account creation/auth: **Contract** (provide the service) and **legitimate interests** (basic security).
- User content (builds, shiny hunts, notes): **Contract** (requested features); optional **consent** if used beyond core functionality (e.g., marketing which we do not do).
- Background/UX preferences in localStorage: **Legitimate interests** (service personalization, strictly necessary, no identifiers).
- Legacy GA on static calc pages: requires **consent** prior to loading GA. Currently no consent gate present on those pages.

### 6) Retention notes

- No explicit automated retention. Supabase tables retain data indefinitely unless deleted by users.
- Add a configurable retention policy placeholder (docs-only), e.g., remove inactive accounts after X months, subject to DSAR and legal requirements.
- See Privacy Policy → Data Retention for current stance; no automated inactive-account deletion yet.

### 7) Sub-processors

- Supabase (Auth, Postgres, Realtime).
- Vercel (static hosting, edge network).
- Optional: GitHub (source hosting), not processing end-user data.

### 8) RLS status and policies (to verify)

- RLS must be enabled for `profiles`, `pokemon_builds`, `shiny_hunts` and any related tables. Client code assumes per-user scoping. Provide SQL separately to enforce `user_id = auth.uid()` policies. See `docs/rls_policies.sql` (to be added).

Tables and expected ownership column:
- `public.profiles` – owner: `user_id` (linked to `auth.uid()`).
- `public.pokemon_builds` – owner: `user_id` (client reads/writes builds per user).
- `public.shiny_hunts` – owner: `user_id` (hunts and phases live in same table; policies must scope by `user_id`).

Believed RLS sufficiency (based on code):
- `profiles`: Needed; insert/update/select scoped to `auth.uid()`. Status unknown in project; apply policies if missing.
- `pokemon_builds`: Needed; CRUD from client; apply policies if missing.
- `shiny_hunts`: Needed; CRUD + realtime; apply policies if missing.

Instructions to apply:
1) Open Supabase Dashboard → SQL Editor.
2) Paste and run `docs/rls_policies.sql` (adjust table/column names if your schema differs).
3) Use the top “Harmless” queries in that file to list current RLS status and policies.
4) Re-test app CRUD to confirm no unauthorized access and that the client continues to work.

### 9) Sensitive config

- Client uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `base.env` contains a `SUPABASE_SERVICE_ROLE_KEY`. Action: ensure not committed for production use and not referenced in client.
- No other secrets found in client code.

### 10) Risks and findings

- Service role key present in repository (`base.env`), albeit not imported by client. Risk of accidental exposure if copied to Vercel env or used in client.
- GA scripts in `public/pokemmo-damage-calc/*` set cookies without consent. If these pages are served publicly under the same domain, a consent gate is required for those pages or disable GA by default.
- Missing explicit security headers on Vercel (`vercel.json` lacks headers). Should add CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` in a minimal, SPA-safe form.
- Export/delete user data flows are not explicit in the UI. There is an `ExportModal` for builds formatting but not a full account export or delete. Provide lightweight flows and DSAR runbook (docs + minimal client-only actions).

### 11) Minimal recommended changes (to be proposed in PR)

- Add security headers in `vercel.json` (CSP tuned to current assets, HSTS, nosniff, referrer, permissions-policy).
- Add either: (a) consent gate for GA on `public/pokemmo-damage-calc/*` pages, or (b) disable GA by default and add a "no tracking" statement in docs. Given acceptance criteria, prefer docs statement and ensure no tracking is loaded by main SPA; optionally gate GA in those static pages without changing overall UI.
- Provide `docs/rls_policies.sql` with RLS enablement and per-user policies for `profiles`, `pokemon_builds`, `shiny_hunts`.
- Provide `docs/DSAR_RUNBOOK.md` with manual steps to export/delete data using Supabase dashboard and the app UI.
- Provide `docs/LAUNCH_CHECKLIST.md` with go/no-go checks.
- Add a retention config placeholder in docs.

No product behavior changes beyond headers/consent messaging and optional GA gating on static calc pages if enabled.


