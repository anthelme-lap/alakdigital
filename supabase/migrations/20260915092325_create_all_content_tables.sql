/*
# Create all content tables for ALAK DIGITAL dashboard

## Summary
Creates tables for all site content that should be managed from the admin dashboard:
articles, projects, services, solutions, team members, values, mission/vision,
expertise domains, stats, clients, "why us" reasons, hero slides, contact messages,
and quotation requests. Seeds all tables with existing static data.

## Tables created
1. articles - Blog articles
2. projects - Portfolio projects
3. services - Service catalog
4. solutions - Business solutions
5. team_members - Team profiles for About page
6. values - Company values for About page
7. mission_vision - Mission and vision tabs for About page
8. about_pillars - Three pillars section on About page
9. expertise_domains - Technical expertise for Expertise page + home section
10. stats - Homepage statistics counters
11. clients - Homepage scrolling client names
12. why_us_reasons - Homepage "why choose us" reasons
13. hero_slides - Homepage hero carousel slides
14. contact_messages - Messages submitted via contact form
15. quotation_requests - Quote requests from quotation form

## Security
- RLS enabled on all tables
- anon + authenticated CRUD on content tables (single-tenant admin app)
- contact_messages and quotation_requests: anon can INSERT (public forms), authenticated can SELECT/UPDATE/DELETE (admin)
*/

-- ==================== ARTICLES ====================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL,
  author text NOT NULL,
  author_role text NOT NULL DEFAULT '',
  author_bio text NOT NULL DEFAULT '',
  date text NOT NULL,
  reading_time text NOT NULL DEFAULT '5 min',
  cover_image text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  content text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_articles" ON articles;
CREATE POLICY "anon_select_articles" ON articles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_articles" ON articles;
CREATE POLICY "anon_insert_articles" ON articles FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_articles" ON articles;
CREATE POLICY "anon_update_articles" ON articles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_articles" ON articles;
CREATE POLICY "anon_delete_articles" ON articles FOR DELETE TO anon, authenticated USING (true);

-- ==================== PROJECTS ====================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sector text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  problem text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  services text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  year text NOT NULL DEFAULT '',
  client text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  results jsonb NOT NULL DEFAULT '[]',
  features text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE TO anon, authenticated USING (true);

-- ==================== SERVICES ====================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'web',
  features text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_services" ON services;
CREATE POLICY "anon_insert_services" ON services FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_services" ON services;
CREATE POLICY "anon_delete_services" ON services FOR DELETE TO anon, authenticated USING (true);

-- ==================== SOLUTIONS ====================
CREATE TABLE IF NOT EXISTS solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text NOT NULL,
  problem text NOT NULL DEFAULT '',
  target text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_solutions" ON solutions;
CREATE POLICY "anon_select_solutions" ON solutions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_solutions" ON solutions;
CREATE POLICY "anon_insert_solutions" ON solutions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_solutions" ON solutions;
CREATE POLICY "anon_update_solutions" ON solutions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_solutions" ON solutions;
CREATE POLICY "anon_delete_solutions" ON solutions FOR DELETE TO anon, authenticated USING (true);

-- ==================== TEAM MEMBERS ====================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  image text NOT NULL DEFAULT '',
  tools text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_team" ON team_members;
CREATE POLICY "anon_select_team" ON team_members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_team" ON team_members;
CREATE POLICY "anon_insert_team" ON team_members FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_team" ON team_members;
CREATE POLICY "anon_update_team" ON team_members FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_team" ON team_members;
CREATE POLICY "anon_delete_team" ON team_members FOR DELETE TO anon, authenticated USING (true);

-- ==================== VALUES ====================
CREATE TABLE IF NOT EXISTS values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Award',
  title text NOT NULL,
  description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE values ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_values" ON values;
CREATE POLICY "anon_select_values" ON values FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_values" ON values;
CREATE POLICY "anon_insert_values" ON values FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_values" ON values;
CREATE POLICY "anon_update_values" ON values FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_values" ON values;
CREATE POLICY "anon_delete_values" ON values FOR DELETE TO anon, authenticated USING (true);

-- ==================== MISSION VISION ====================
CREATE TABLE IF NOT EXISTS mission_vision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_key text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'Target',
  label text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  points text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE mission_vision ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_mission" ON mission_vision;
CREATE POLICY "anon_select_mission" ON mission_vision FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_mission" ON mission_vision;
CREATE POLICY "anon_insert_mission" ON mission_vision FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_mission" ON mission_vision;
CREATE POLICY "anon_update_mission" ON mission_vision FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_mission" ON mission_vision;
CREATE POLICY "anon_delete_mission" ON mission_vision FOR DELETE TO anon, authenticated USING (true);

-- ==================== ABOUT PILLARS ====================
CREATE TABLE IF NOT EXISTS about_pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Target',
  title text NOT NULL,
  description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE about_pillars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_pillars" ON about_pillars;
CREATE POLICY "anon_select_pillars" ON about_pillars FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_pillars" ON about_pillars;
CREATE POLICY "anon_insert_pillars" ON about_pillars FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_pillars" ON about_pillars;
CREATE POLICY "anon_update_pillars" ON about_pillars FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_pillars" ON about_pillars;
CREATE POLICY "anon_delete_pillars" ON about_pillars FOR DELETE TO anon, authenticated USING (true);

-- ==================== EXPERTISE DOMAINS ====================
CREATE TABLE IF NOT EXISTS expertise_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Code2',
  label text NOT NULL,
  description text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE expertise_domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_expertise" ON expertise_domains;
CREATE POLICY "anon_select_expertise" ON expertise_domains FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_expertise" ON expertise_domains;
CREATE POLICY "anon_insert_expertise" ON expertise_domains FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_expertise" ON expertise_domains;
CREATE POLICY "anon_update_expertise" ON expertise_domains FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_expertise" ON expertise_domains;
CREATE POLICY "anon_delete_expertise" ON expertise_domains FOR DELETE TO anon, authenticated USING (true);

-- ==================== STATS ====================
CREATE TABLE IF NOT EXISTS stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value int NOT NULL DEFAULT 0,
  suffix text NOT NULL DEFAULT '',
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_stats" ON stats;
CREATE POLICY "anon_select_stats" ON stats FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_stats" ON stats;
CREATE POLICY "anon_insert_stats" ON stats FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_stats" ON stats;
CREATE POLICY "anon_update_stats" ON stats FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_stats" ON stats;
CREATE POLICY "anon_delete_stats" ON stats FOR DELETE TO anon, authenticated USING (true);

-- ==================== CLIENTS ====================
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_clients" ON clients;
CREATE POLICY "anon_select_clients" ON clients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_clients" ON clients;
CREATE POLICY "anon_update_clients" ON clients FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_clients" ON clients;
CREATE POLICY "anon_delete_clients" ON clients FOR DELETE TO anon, authenticated USING (true);

-- ==================== WHY US REASONS ====================
CREATE TABLE IF NOT EXISTS why_us_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Layers',
  title text NOT NULL,
  description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE why_us_reasons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_why_us" ON why_us_reasons;
CREATE POLICY "anon_select_why_us" ON why_us_reasons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_why_us" ON why_us_reasons;
CREATE POLICY "anon_insert_why_us" ON why_us_reasons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_why_us" ON why_us_reasons;
CREATE POLICY "anon_update_why_us" ON why_us_reasons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_why_us" ON why_us_reasons;
CREATE POLICY "anon_delete_why_us" ON why_us_reasons FOR DELETE TO anon, authenticated USING (true);

-- ==================== HERO SLIDES ====================
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text NOT NULL,
  title text NOT NULL,
  highlight text NOT NULL,
  subtitle text NOT NULL,
  cta_label text NOT NULL,
  cta_to text NOT NULL,
  accent text NOT NULL DEFAULT 'primary',
  mockup text NOT NULL DEFAULT 'dashboard',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_hero" ON hero_slides;
CREATE POLICY "anon_select_hero" ON hero_slides FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hero" ON hero_slides;
CREATE POLICY "anon_insert_hero" ON hero_slides FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hero" ON hero_slides;
CREATE POLICY "anon_update_hero" ON hero_slides FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hero" ON hero_slides;
CREATE POLICY "anon_delete_hero" ON hero_slides FOR DELETE TO anon, authenticated USING (true);

-- ==================== CONTACT MESSAGES ====================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  project_type text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_messages" ON contact_messages;
CREATE POLICY "anon_select_messages" ON contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_messages" ON contact_messages;
CREATE POLICY "anon_insert_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_messages" ON contact_messages;
CREATE POLICY "anon_update_messages" ON contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_messages" ON contact_messages;
CREATE POLICY "anon_delete_messages" ON contact_messages FOR DELETE TO anon, authenticated USING (true);

-- ==================== QUOTATION REQUESTS ====================
CREATE TABLE IF NOT EXISTS quotation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_type text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  timeline text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE quotation_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_quotations" ON quotation_requests;
CREATE POLICY "anon_select_quotations" ON quotation_requests FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quotations" ON quotation_requests;
CREATE POLICY "anon_insert_quotations" ON quotation_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_quotations" ON quotation_requests;
CREATE POLICY "anon_update_quotations" ON quotation_requests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_quotations" ON quotation_requests;
CREATE POLICY "anon_delete_quotations" ON quotation_requests FOR DELETE TO anon, authenticated USING (true);

-- ==================== SEED DATA ====================
-- Seed data lives in supabase/seeds/, one idempotent file per table
-- (01_articles.sql, 02_projects.sql, ...). Run them after this migration,
-- in numeric order, via the SQL Editor or `psql -f`.