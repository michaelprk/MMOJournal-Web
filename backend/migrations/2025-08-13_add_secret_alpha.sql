-- MMOJournal: Add Secret Shiny and Alpha flags to shiny_hunts
-- Safe to run multiple times (IF NOT EXISTS guards)

BEGIN;

-- 1) Columns with defaults
ALTER TABLE public.shiny_hunts
  ADD COLUMN IF NOT EXISTS is_secret_shiny boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_alpha boolean NOT NULL DEFAULT false;

-- 2) Backfill Alpha for Alpha Egg Hunts (method text-based)
UPDATE public.shiny_hunts
SET is_alpha = true
WHERE (method ILIKE '%alpha%') AND (method ILIKE '%egg%');

-- 3) Backfill from meta JSON if present
UPDATE public.shiny_hunts
SET is_alpha = true
WHERE is_alpha = false
  AND (meta ? 'alpha')
  AND COALESCE((meta->>'alpha')::boolean, false) = true;

UPDATE public.shiny_hunts
SET is_secret_shiny = true
WHERE is_secret_shiny = false
  AND (meta ? 'secret_shiny')
  AND COALESCE((meta->>'secret_shiny')::boolean, false) = true;

-- 4) Optional guard: Secret Shiny cannot be set on Horde methods
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shiny_hunts_secret_not_horde_chk'
  ) THEN
    ALTER TABLE public.shiny_hunts
      ADD CONSTRAINT shiny_hunts_secret_not_horde_chk
      CHECK (
        is_secret_shiny = false OR method NOT IN ('Hordes 3x','Hordes 5x')
      );
  END IF;
END$$;

COMMIT;


