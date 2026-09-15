/*
# Add cover image to projects

## Summary
Adds an `image` column to the `projects` table so each project can display
a cover photo on the public portfolio (cards + detail page), matching the
existing `cover_image` pattern already used on `articles`.
*/

ALTER TABLE projects ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '';
