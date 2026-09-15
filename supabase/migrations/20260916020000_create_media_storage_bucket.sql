/*
# Media storage bucket

## Summary
Creates a public "media" bucket in Supabase Storage for images uploaded
from the admin panel (project covers, article covers, team photos).

## Security
- Bucket is public: read access (GET on the public URL) bypasses RLS
  entirely, no SELECT policy needed for that.
- INSERT/UPDATE/DELETE on storage.objects for this bucket are restricted
  to authenticated users (admins) via auth.uid() is not null, one policy
  per verb, matching CLAUDE.md's RLS conventions.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "authenticated_insert_media" ON storage.objects;
CREATE POLICY "authenticated_insert_media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "authenticated_update_media" ON storage.objects;
CREATE POLICY "authenticated_update_media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "authenticated_delete_media" ON storage.objects;
CREATE POLICY "authenticated_delete_media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);
