/*
# Admin users table + superadmin RLS

## Summary
Creates admin_users, linking auth.users to an application role ('admin' or
'superadmin'). Adds a SECURITY DEFINER helper (is_superadmin) so RLS
policies can check the caller's role without self-recursion, and 4
auth.uid()-scoped policies, one per CRUD verb.

## Security
- RLS enabled, one policy per CRUD verb, all scoped by auth.uid() (never
  current_user, never FOR ALL) per project convention.
- INSERT/UPDATE/DELETE restricted to superadmins via is_superadmin().
- SELECT is open to any authenticated admin (needed to render the
  "Utilisateurs" list) — every row in this table is itself an admin
  account, so this is not exposing anything to end users.
- Actual user creation/deletion happens via a service-role Edge Function
  (supabase/functions/admin-users), which bypasses RLS entirely; these
  policies exist as the correct baseline per CLAUDE.md and as defense in
  depth against any direct client call.
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$;

DROP POLICY IF EXISTS "select_admin_users" ON admin_users;
CREATE POLICY "select_admin_users" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "insert_admin_users" ON admin_users;
CREATE POLICY "insert_admin_users" ON admin_users
  FOR INSERT TO authenticated
  WITH CHECK (is_superadmin());

DROP POLICY IF EXISTS "update_admin_users" ON admin_users;
CREATE POLICY "update_admin_users" ON admin_users
  FOR UPDATE TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

DROP POLICY IF EXISTS "delete_admin_users" ON admin_users;
CREATE POLICY "delete_admin_users" ON admin_users
  FOR DELETE TO authenticated
  USING (is_superadmin() AND id <> auth.uid());

/*
## Bootstrap (manual, one-time)

1. Create the first account via Supabase Dashboard > Authentication >
   Users > Add User (set email + password, confirm email).
2. Copy the generated user's UUID, then run:

   INSERT INTO admin_users (id, email, full_name, role)
   VALUES ('4a18877c-70d6-4948-bf02-b763967e0327', 'anthelmekoffi77@gmail.com', 'anthelme koffi', 'superadmin');
*/
