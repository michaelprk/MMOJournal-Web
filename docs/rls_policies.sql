-- MMOJournal – Supabase RLS Policies
-- Purpose: Enable RLS and add per-user policies for app tables.
-- Run in Supabase SQL Editor. Adjust table/column names if your schema differs.

-- =============================
-- SAFETY: Inspect current RLS
-- =============================
-- Harmless: list tables and whether RLS is enabled
select n.nspname as schema,
       c.relname as table,
       c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind = 'r' and n.nspname = 'public'
order by c.relrowsecurity asc, c.relname;

-- Harmless: list existing policies
select schemaname,
       tablename,
       policyname,
       permissive,
       roles,
       cmd,
       qual as using_expr,
       with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- =============================
-- RLS: Enable and enforce by user
-- =============================
-- Note: Replace user_id if your PK/FK column differs.

-- 1) profiles (user-owned profile row)
alter table if exists public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  using (user_id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert
  with check (user_id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own
  on public.profiles for delete
  using (user_id = auth.uid());

-- 2) pokemon_builds (user builds)
alter table if exists public.pokemon_builds enable row level security;

drop policy if exists pokemon_builds_select_own on public.pokemon_builds;
create policy pokemon_builds_select_own
  on public.pokemon_builds for select
  using (user_id = auth.uid());

drop policy if exists pokemon_builds_insert_own on public.pokemon_builds;
create policy pokemon_builds_insert_own
  on public.pokemon_builds for insert
  with check (user_id = auth.uid());

drop policy if exists pokemon_builds_update_own on public.pokemon_builds;
create policy pokemon_builds_update_own
  on public.pokemon_builds for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists pokemon_builds_delete_own on public.pokemon_builds;
create policy pokemon_builds_delete_own
  on public.pokemon_builds for delete
  using (user_id = auth.uid());

-- 3) shiny_hunts (user hunts and phases within same table)
alter table if exists public.shiny_hunts enable row level security;

drop policy if exists shiny_hunts_select_own on public.shiny_hunts;
create policy shiny_hunts_select_own
  on public.shiny_hunts for select
  using (user_id = auth.uid());

drop policy if exists shiny_hunts_insert_own on public.shiny_hunts;
create policy shiny_hunts_insert_own
  on public.shiny_hunts for insert
  with check (user_id = auth.uid());

drop policy if exists shiny_hunts_update_own on public.shiny_hunts;
create policy shiny_hunts_update_own
  on public.shiny_hunts for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists shiny_hunts_delete_own on public.shiny_hunts;
create policy shiny_hunts_delete_own
  on public.shiny_hunts for delete
  using (user_id = auth.uid());

-- =============================
-- OPTIONAL: tighten inserts
-- =============================
-- If you prefer to set user_id server-side via DB trigger, you can further
-- restrict inserts to require auth.uid() IS NOT NULL and set user_id in a trigger.
-- The app currently provides user_id on insert for hunts; adjust as needed.


