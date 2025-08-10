-- Link phases to their parent hunt and flag them for UI grouping
alter table if exists public.shiny_hunts
  add column if not exists parent_hunt_id uuid references public.shiny_hunts(id) on delete set null,
  add column if not exists is_phase boolean not null default false;

-- Indexes
create index if not exists idx_shiny_hunts_parent on public.shiny_hunts(parent_hunt_id);
create index if not exists idx_shiny_hunts_is_phase on public.shiny_hunts(is_phase);


