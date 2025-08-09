alter table public.shiny_hunts
  add column if not exists found_at timestamptz,
  add column if not exists completed_month int,
  add column if not exists completed_year int;

create or replace function public.shiny_hunts_set_completed_cache()
returns trigger language plpgsql as $$
begin
  if new.is_completed = true and new.found_at is null then
    new.found_at := now();
  end if;
  if new.found_at is not null then
    new.completed_month := extract(month from new.found_at)::int;
    new.completed_year  := extract(year  from new.found_at)::int;
  end if;
  return new;
end $$;

drop trigger if exists trg_shiny_hunts_cache on public.shiny_hunts;
create trigger trg_shiny_hunts_cache
before insert or update on public.shiny_hunts
for each row execute function public.shiny_hunts_set_completed_cache();


