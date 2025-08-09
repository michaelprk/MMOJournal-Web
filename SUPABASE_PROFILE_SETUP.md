# Supabase Profile Setup (Username + Email Login)

This guide sets up a `profiles` table to support username-or-email sign-in, and adds Row Level Security (RLS) so users can only access their own profile.

## 1) Create the `profiles` table

Run in Supabase SQL Editor:

```sql
-- Profiles table maps auth.users -> username/email
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text unique not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- RLS policies: users can only manage their own profile
create policy if not exists "Users can select own profile" on profiles
  for select using (auth.uid() = user_id);

create policy if not exists "Users can insert own profile" on profiles
  for insert with check (auth.uid() = user_id);

create policy if not exists "Users can update own profile" on profiles
  for update using (auth.uid() = user_id);

create policy if not exists "Users can delete own profile" on profiles
  for delete using (auth.uid() = user_id);
```

Notes:
- `username` and `email` are unique. Choose a uniqueness rule that fits your product (e.g., case-insensitive usernames via a normalized column if needed).
- The `on delete cascade` ensures profile rows are removed if the auth user is deleted.

## 2) Usage: account creation and sign-in

- On sign-up, create the Supabase auth user with email/password, then insert a profile row with that `user_id`, `username`, and `email`.
- For sign-in, if the user provides a username (no `@`), look up the `email` by `username` in `profiles` first, then call `supabase.auth.signInWithPassword({ email, password })`.

Example (already implemented in the app):
- `signUp(username, email, password)`: `supabase.auth.signUp(...)` then `insert into profiles`.
- `signIn(identifier, password)`: if `identifier` lacks `@`, query `profiles` for `email` by `username`.

## 3) Optional: email confirmation

If email confirmations are enabled in Supabase Auth:
- The `signUp` response `data.user` may be null until the email is confirmed.
- In that case, defer `profiles` insertion until after confirmation (e.g., via a webhook) or handle a retry on first app session.

## 4) Optional: sync helpers

If you want to keep `profiles.email` in sync with changes to `auth.users.email`, add a trigger or periodically reconcile. For most apps, storing the email at creation is sufficient.

## 5) Verify RLS

With a logged-in session:
- `select * from profiles` returns only the current user’s row.
- `insert/update/delete` succeed only when `user_id = auth.uid()`.

That’s it. Your app can now support username-or-email login while keeping profile data protected per user.
