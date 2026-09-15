/*
# Add external link to projects and solutions

## Summary
Adds a `link` column to `projects` and `solutions` so each entry can point
to its live site / demo URL, displayed as a "Voir le site" button on the
public portfolio pages.
*/

ALTER TABLE projects ADD COLUMN IF NOT EXISTS link text NOT NULL DEFAULT '';
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS link text NOT NULL DEFAULT '';
