# Tooba backend: Supabase + /studio

- **`/`**: the client onboarding ("Start your project"). Each submission becomes a lead in Supabase.
- **`/studio`**: the team's internal app. It covers leads and clients, projects and stages, quotes, payments, creative routes, revision rounds, files, and a full activity log.

## One-time setup
1. **Supabase → SQL Editor:** run `supabase/migrations/001_tooba_schema.sql` (already done), then `002_onboarding_leads.sql`.
2. **Supabase → Project Settings → API:** copy the Project URL and the anon / publishable key.
3. **Vercel → Project → Settings → Environment Variables:** add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production and Preview, then redeploy.
4. **Supabase → Authentication → URL Configuration:** set the Site URL to your Vercel domain.

**Never put the `service_role` / secret key in Vercel or in this repo.**

## Team access
New logins can't see anything until an owner runs:
```sql
update public.profiles set is_active = true, role = 'designer' where email = 'person@example.com';
```
Roles: `owner` (can delete), `designer`, `strategist`, `viewer`.

## Business rules built in
- Quotes are valid for 14 days. A deposit of 50% or more marks the project "OK to start", and a fully paid balance marks it "OK to release files".
- The app warns before moving a project past discovery without a deposit, before logging revision rounds beyond the package, and before sending files while money is owed.
- Every insert, update and delete is written to `activity_log` by database triggers.
