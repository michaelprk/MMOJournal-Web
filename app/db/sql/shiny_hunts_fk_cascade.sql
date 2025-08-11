-- app/db/sql/shiny_hunts_fk_cascade.sql
-- Make parent hunt deletions cascade to phases

-- 1) Drop existing FK if present
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'shiny_hunts_parent_hunt_id_fkey'
      and table_name = 'shiny_hunts'
      and constraint_type = 'FOREIGN KEY'
  ) then
    alter table public.shiny_hunts
      drop constraint shiny_hunts_parent_hunt_id_fkey;
  end if;
end$$;

-- 2) Recreate with CASCADE
alter table public.shiny_hunts
  add constraint shiny_hunts_parent_hunt_id_fkey
  foreign key (parent_hunt_id)
  references public.shiny_hunts(id)
  on delete cascade;



