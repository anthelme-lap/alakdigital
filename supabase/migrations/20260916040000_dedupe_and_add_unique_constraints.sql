/*
# Deduplicate content tables and add missing UNIQUE constraints

## Summary
Several content tables (team_members, values, about_pillars,
expertise_domains, stats, clients, why_us_reasons, hero_slides) had no
UNIQUE constraint beyond their random `id` primary key. The seed files use
`ON CONFLICT DO NOTHING`, which with no real conflict target never actually
detects a duplicate -- every re-run of the seed step (now automated in
CI/CD on every deploy) re-inserted all rows, tripling data in production.

This migration:
1. Removes rows for entities that were renamed (GaragePro -> Garage
   Manager, PressingExpress -> Lavex, StockMaster -> ModaStock) and are
   now superseded by their renamed counterpart, in projects/solutions/clients.
2. Deduplicates the affected tables, keeping one row per natural key.
3. Adds a real UNIQUE constraint on that natural key per table, so future
   `ON CONFLICT (<column>) DO NOTHING` seed runs are genuinely idempotent.

## Safety
Pure DML/DDL cleanup, no data loss for anything except exact duplicate
rows and the explicitly superseded old-named entries listed above.
*/

-- 1. Remove rows superseded by the GaragePro/PressingExpress/StockMaster rename
DELETE FROM projects WHERE slug IN ('garagepro', 'pressingexpress', 'stockmaster');
DELETE FROM solutions WHERE slug IN ('garagepro', 'pressingexpress', 'stockmaster');
DELETE FROM clients WHERE name IN ('GaragePro', 'PressingExpress', 'StockMaster');

-- 2. Deduplicate: keep one row per natural key, drop the rest
DELETE FROM team_members a USING team_members b
  WHERE a.id > b.id AND a.name = b.name;
DELETE FROM values a USING values b
  WHERE a.id > b.id AND a.title = b.title;
DELETE FROM about_pillars a USING about_pillars b
  WHERE a.id > b.id AND a.title = b.title;
DELETE FROM expertise_domains a USING expertise_domains b
  WHERE a.id > b.id AND a.label = b.label;
DELETE FROM stats a USING stats b
  WHERE a.id > b.id AND a.label = b.label;
DELETE FROM clients a USING clients b
  WHERE a.id > b.id AND a.name = b.name;
DELETE FROM why_us_reasons a USING why_us_reasons b
  WHERE a.id > b.id AND a.title = b.title;
DELETE FROM hero_slides a USING hero_slides b
  WHERE a.id > b.id AND a.title = b.title;

-- 3. Add real UNIQUE constraints (idempotent guard via DO block, since
--    ALTER TABLE ... ADD CONSTRAINT has no IF NOT EXISTS in Postgres)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'team_members_name_key') THEN
    ALTER TABLE team_members ADD CONSTRAINT team_members_name_key UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'values_title_key') THEN
    ALTER TABLE values ADD CONSTRAINT values_title_key UNIQUE (title);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'about_pillars_title_key') THEN
    ALTER TABLE about_pillars ADD CONSTRAINT about_pillars_title_key UNIQUE (title);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expertise_domains_label_key') THEN
    ALTER TABLE expertise_domains ADD CONSTRAINT expertise_domains_label_key UNIQUE (label);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stats_label_key') THEN
    ALTER TABLE stats ADD CONSTRAINT stats_label_key UNIQUE (label);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clients_name_key') THEN
    ALTER TABLE clients ADD CONSTRAINT clients_name_key UNIQUE (name);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'why_us_reasons_title_key') THEN
    ALTER TABLE why_us_reasons ADD CONSTRAINT why_us_reasons_title_key UNIQUE (title);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hero_slides_title_key') THEN
    ALTER TABLE hero_slides ADD CONSTRAINT hero_slides_title_key UNIQUE (title);
  END IF;
END $$;
