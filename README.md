# Nightline — Streetlight Failure Clustering and Repair Accountability Portal

Nightline connects resident streetlight complaints to poles, ward queues, staff review, repair evidence, and repeat-failure analytics. The interface uses a dark street-grid visual, high-contrast yellow outage markers, and a visible case timeline.

## Implemented

- Responsive landing page and portal shell.
- Supabase Auth email/password sign-up and sign-in, with an HttpOnly SameSite session cookie.
- Ward/pole catalogue with approximate coordinates, report intake, input validation, and duplicate suggestions.
- Staff reviewed merge, ward-scoped report queue, case assignment, guarded status transitions, repair outcomes, and evidence records.
- Repeat-pole and repair-time analytics, filters, audit events, and loading/empty/error/success messages.
- Express REST API, centralized JSON errors, rate limiting, Helmet, Supabase Postgres migration, RLS policies, constraints and indexes.

## Setup

Requirements: Node.js 20+, npm, and a Supabase project.

1. Create a Supabase project and copy `.env.example` to `.env`.
2. Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. The service key is server only. Set `APP_ORIGIN` to the local or deployed origin.
3. Apply `supabase/migrations/202610280001_initial.sql` in the Supabase SQL editor (or linked Supabase CLI).
4. Run `supabase/seed/seed.sql` to add three synthetic wards and ten synthetic poles.
5. Enable email/password in Supabase Auth. Set email confirmation according to your demo needs.
6. Run `npm run seed:demo`. It creates synthetic resident and North Ward operator accounts with random one-time passwords and inserts ten synthetic reports. Save the credentials printed to the terminal; they are not shown again. On rerun, existing reports are left intact.
7. Start with `npm install`, then `npm run dev`. Visit `http://localhost:3000`.

To provision additional staff, create an account in Supabase Auth, then as project owner run:

```sql
update public.profiles
set role='staff', ward_id=(select id from public.wards where code='NTH')
where id=(select id from auth.users where email='staff@example.test');
```

Set role to `admin` for an administrator. Use synthetic addresses and credentials for demonstrations.

## Workflow rules

Reporters can access their own cases. Staff can work only within their assigned ward; administrators can work across wards. Allowed transitions are `submitted → reviewing → assigned → in_repair → closed`, `closed → reopened`, and `reopened → reviewing|assigned`. Assignment is required to enter `assigned`, and a repair outcome is required to close. A merge requires two open reports from the same ward and compatible poles. The duplicate remains in history and links to its surviving report.

Duplicate suggestions match the exact pole when selected, otherwise they show open cases in the chosen ward. Suggestions never auto-merge.

## API and test commands

See [docs/api.md](docs/api.md) for request/response examples. Run `npm test` and `npm run check` after installing dependencies.

## Deployment and security notes

Deploy behind HTTPS and store secrets in the hosting platform's secret manager. Secure cookies are enabled for `NODE_ENV=production`. Restrict Supabase Auth redirect URLs to the deployed origin. Do not publish the service role key. RLS is enabled on every exposed table; direct reads are constrained by policy. Express performs authenticated writes with the service key after role and ward checks. This privilege boundary is security-critical and should be reviewed when adding endpoints.

Staff assignment uses a staff profile UUID entered by the operator; a staff directory picker is not included. Evidence currently stores a description plus optional external URL; direct Supabase Storage upload is not included. Pole coordinates are synthetic and approximate; map-provider integration is not included.

## Verification and limits

Verified here: JavaScript syntax checks for the server, API, auth and browser client; three Node built-in project checks passed. This shell had Node.js 24 but no npm on PATH, no Supabase credentials, and no browser session. Dependencies were not installed; the app was not started; database migration, live API, RLS cross-account/ward denial, and browser/responsive checks were not run. Run them against a Supabase test project before deployment. No live integration is claimed.
