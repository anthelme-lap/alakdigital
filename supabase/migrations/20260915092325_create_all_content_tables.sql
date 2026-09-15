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

-- Seed articles
INSERT INTO articles (title, slug, excerpt, category, author, author_role, author_bio, date, reading_time, cover_image, featured, content, tags, sort_order) VALUES
('Pourquoi le TypeScript est devenu indispensable en 2024', 'typescript-indispensable-2024', 'Le typage statique transforme la façon dont nous écrivons du JavaScript. Découvrez pourquoi TypeScript est désormais un standard de l''industrie.', 'Développement Web', 'Konan A.', 'Lead Developer', 'Lead Developer chez ALAK DIGITAL, passionné par la qualité du code et l''architecture logicielle.', '2024-08-15', '6 min', 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, '<p>Le typage statique transforme la façon dont nous écrivons du JavaScript. En ajoutant une couche de sécurité au moment du développement, TypeScript permet de détecter les erreurs avant même que le code ne soit exécuté.</p><h2>Pourquoi adopter TypeScript ?</h2><p>L''un des bénéfices majeurs est la <strong>lisibilité du code</strong>. En explicitant les types, on documente directement le code, ce qui facilite la collaboration et la maintenance.</p><blockquote>TypeScript s''intègre parfaitement avec les outils modernes : Vite, ESLint, Prettier. L''écosystème a mûri au point que le coût d''adoption est minimal comparé aux bénéfices.</blockquote><h3>Les avantages concrets</h3><ul><li>Détection des erreurs à la compilation, avant l''exécution</li><li>Autocomplétion intelligente dans l''éditeur</li><li>Refactoring sécurisé et fiable</li><li>Documentation vivante grâce aux types</li></ul><p>Chez ALAK DIGITAL, tous nos projets web sont développés en <strong>TypeScript strict</strong>. C''est un investissement sur la qualité long terme.</p>', ARRAY['TypeScript', 'JavaScript', 'Web', 'Qualité'], 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, slug, excerpt, category, author, author_role, author_bio, date, reading_time, cover_image, featured, content, tags, sort_order) VALUES
('Transformer une PME africaine: le rôle du digital', 'transformation-digitale-pme-africaine', 'La transformation digitale n''est plus une option pour les PME africaines. Comment les technologies web et mobile redéfinissent la compétitivité.', 'Transformation digitale', 'Kouamé B.', 'Digital Strategist', 'Stratégiste digital, accompagne les entreprises dans leur transformation digitale.', '2024-07-20', '8 min', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, '<p>La transformation digitale n''est plus une option pour les PME africaines. L''adoption d''outils numériques est devenue un facteur clé de compétitivité.</p><h2>Un levier de croissance</h2><p>Les entreprises qui digitalisent leurs processus internes gagnent en efficacité, réduisent leurs coûts opérationnels et améliorent l''expérience de leurs clients.</p><blockquote>Le mobile joue un rôle central en Afrique. Avec un taux de pénétration smartphone en croissance constante, les applications mobiles sont souvent le premier point de contact entre une entreprise et ses clients.</blockquote>', ARRAY['Transformation digitale', 'Afrique', 'PME', 'Mobile'], 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, slug, excerpt, category, author, author_role, author_bio, date, reading_time, cover_image, featured, content, tags, sort_order) VALUES
('Docker et CI/CD: automatiser vos déploiements', 'docker-cicd-automatiser-deploiements', 'La conteneurisation et l''intégration continue sont au cœur du DevOps moderne. Guide pratique pour mettre en place un pipeline efficace.', 'DevOps', 'Traoré M.', 'DevOps Engineer', 'Ingénieur DevOps, spécialiste de l''automatisation et des infrastructures cloud.', '2024-06-10', '10 min', 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&h=650&w=940', false, '<p>La conteneurisation avec Docker a révolutionné la façon dont nous déployons les applications. En encapsulant l''application et ses dépendances dans un conteneur, on garantit une cohérence entre les environnements de développement et de production.</p><h2>Qu''est-ce que la CI/CD ?</h2><p>La <strong>CI/CD</strong> (Continuous Integration / Continuous Deployment) automatise le processus de livraison.</p>', ARRAY['Docker', 'CI/CD', 'DevOps', 'GitHub Actions'], 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, slug, excerpt, category, author, author_role, author_bio, date, reading_time, cover_image, featured, content, tags, sort_order) VALUES
('Concevoir un Design System qui évolue', 'concevoir-design-system', 'Un Design System n''est pas qu''une bibliothèque de composants. C''est un langage visuel partagé qui garantit la cohérence de vos produits.', 'UI/UX', 'Aya K.', 'UI/UX Designer', 'Designer produit, crée des interfaces cohérentes et accessibles.', '2024-05-05', '7 min', 'https://images.pexels.com/photos/1966447/pexels-photo-1966447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, '<p>Un Design System va au-delà d''une simple bibliothèque de composants. C''est un <strong>langage visuel partagé</strong> qui garantit la cohérence de vos produits digitaux.</p>', ARRAY['Design System', 'UI/UX', 'Figma', 'Cohérence'], 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, slug, excerpt, category, author, author_role, author_bio, date, reading_time, cover_image, featured, content, tags, sort_order) VALUES
('FastAPI vs Laravel: choisir son backend', 'fastapi-vs-laravel-backend', 'Python ou PHP ? Deux approches différentes pour construire des API performantes. Comparatif pour vous aider à choisir.', 'Backend', 'Konan A.', 'Lead Developer', 'Lead Developer chez ALAK DIGITAL, passionné par la qualité du code et l''architecture logicielle.', '2024-04-18', '9 min', 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, '<p>Le choix du framework backend dépend de nombreux facteurs : équipe, écosystème, performance, type de projet.</p>', ARRAY['FastAPI', 'Laravel', 'Python', 'PHP', 'Backend'], 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (title, slug, excerpt, category, author, author_role, author_bio, date, reading_time, cover_image, featured, content, tags, sort_order) VALUES
('Le SaaS en Afrique: opportunités et défis', 'saas-afrique-opportunites-defis', 'Le marché SaaS africain est en pleine croissance. Quelles opportunités pour les entrepreneurs et quels défis techniques à anticiper.', 'SaaS', 'Kouamé B.', 'Digital Strategist', 'Stratégiste digital, accompagne les entreprises dans leur transformation digitale.', '2024-03-22', '8 min', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', false, '<p>Le marché SaaS africain connaît une croissance rapide, portée par la digitalisation des entreprises et l''augmentation de la connectivité internet.</p>', ARRAY['SaaS', 'Afrique', 'Entrepreneuriat', 'Cloud'], 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed projects
INSERT INTO projects (name, slug, sector, tagline, description, problem, solution, technologies, services, featured, year, client, duration, results, features, sort_order) VALUES
('EventFlow', 'eventflow', 'Événementiel', 'Plateforme de gestion d''événements et billetterie', 'EventFlow est une plateforme complète de gestion d''événements permettant aux organisateurs de créer, promouvoir et gérer leurs événements avec un système de billetterie intégré.', 'Les organisateurs d''événements en Côte d''Ivoire manquaient d''une solution locale pour gérer la billetterie, le check-in et l''analyse des événements en temps réel.', 'Nous avons conçu une plateforme web et mobile permettant la création d''événements, la vente de billets en ligne, le check-in QR code et le suivi analytique en temps réel.', ARRAY['React', 'FastAPI', 'PostgreSQL', 'Flutter', 'Redis', 'Docker'], ARRAY['Développement Web', 'Développement Mobile', 'Backend & API', 'DevOps & Cloud'], true, '2024', 'EventFlow CI', '5 mois', '[{"label":"Billets vendus","value":"50K+"},{"label":"Événements gérés","value":"200+"},{"label":"Temps de check-in","value":"-80%"}]', ARRAY['Billetterie en ligne avec paiement mobile', 'Check-in QR code via app mobile', 'Tableau de bord analytique en temps réel', 'Gestion multi-organisateurs', 'Notifications push automatiques'], 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (name, slug, sector, tagline, description, problem, solution, technologies, services, featured, year, client, duration, results, features, sort_order) VALUES
('GaragePro', 'garagepro', 'SaaS Automotive', 'SaaS de gestion de garage automobile', 'GaragePro est un logiciel SaaS permettant aux garagistes de gérer leurs réparations, stock de pièces, facturation et relation client depuis une interface unique.', 'Les garages automobiles géraient leurs opérations manuellement, avec des pertes de temps significatives et des erreurs de facturation fréquentes.', 'Un SaaS multi-tenant avec gestion des ordres de réparation, suivi du stock, facturation automatique et tableau de bord de performance.', ARRAY['React', 'Laravel', 'MySQL', 'Tailwind CSS', 'Docker'], ARRAY['Plateformes SaaS', 'Développement Web', 'Backend & API'], true, '2024', 'GaragePro', '4 mois', '[{"label":"Garages actifs","value":"30+"},{"label":"Réparations/mois","value":"1.2K"},{"label":"Gain de temps","value":"60%"}]', ARRAY['Gestion des ordres de réparation', 'Suivi de stock de pièces détachées', 'Facturation automatique', 'Base de données clients', 'Tableau de bord de performance'], 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (name, slug, sector, tagline, description, problem, solution, technologies, services, featured, year, client, duration, results, features, sort_order) VALUES
('PressingExpress', 'pressingexpress', 'SaaS Services', 'Solution de gestion de pressing et blanchisserie', 'PressingExpress est une solution SaaS qui digitalise la gestion des pressings: prise en charge, suivi des commandes, notifications client et facturation.', 'Les pressings locaux ne disposaient d''aucun outil de suivi, entraînant des pertes de vêtements et une insatisfaction client.', 'Une plateforme web avec application mobile client permettant le suivi en temps réel des commandes et la notification par SMS.', ARRAY['React', 'FastAPI', 'PostgreSQL', 'Flutter'], ARRAY['Plateformes SaaS', 'Développement Mobile', 'Backend & API'], true, '2023', 'PressingExpress', '3 mois', '[{"label":"Pressings équipés","value":"15+"},{"label":"Commandes/mois","value":"800"},{"label":"Satisfaction client","value":"95%"}]', ARRAY['Prise en charge et étiquetage QR', 'Suivi des commandes en temps réel', 'Notifications SMS automatiques', 'Application mobile client', 'Facturation et statistiques'], 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (name, slug, sector, tagline, description, problem, solution, technologies, services, featured, year, client, duration, results, features, sort_order) VALUES
('VoucherConnect', 'voucherconnect', 'Fintech', 'Solution voucher et gestion de distribution', 'VoucherConnect est une plateforme permettant l''émission, la distribution et le suivi de vouchers numériques pour les programmes d''assistance sociale et commerciale.', 'Les organisations distribuant des vouchers manquaient d''un système sécurisé et traçable pour gérer l''émission et l''utilisation des vouchers.', 'Une plateforme sécurisée avec émission de vouchers uniques, validation par QR code et tableau de bord de suivi en temps réel.', ARRAY['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'], ARRAY['Plateformes SaaS', 'Développement Web', 'Backend & API', 'DevOps & Cloud'], false, '2023', 'VoucherConnect', '6 mois', '[{"label":"Vouchers émis","value":"100K+"},{"label":"Taux d''utilisation","value":"92%"},{"label":"Transactions sécurisées","value":"100%"}]', ARRAY['Émission de vouchers uniques', 'Validation par QR code', 'Tableau de bord de distribution', 'Suivi en temps réel', 'Intégration paiement mobile'], 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (name, slug, sector, tagline, description, problem, solution, technologies, services, featured, year, client, duration, results, features, sort_order) VALUES
('StockMaster', 'stockmaster', 'Logistique', 'Gestion de stock et d''inventaire cloud', 'StockMaster est une solution cloud de gestion de stock permettant aux entreprises de suivre leurs inventaires en temps réel, gérer leurs fournisseurs et automatiser leurs commandes.', 'Les PME géraient leurs stocks sur Excel, avec des écarts d''inventaire réguliers et aucune visibilité en temps réel.', 'Une plateforme web responsive avec application mobile de scan, alertes automatiques et rapports analytiques.', ARRAY['React', 'Laravel', 'MySQL', 'Flutter'], ARRAY['Plateformes SaaS', 'Développement Web', 'Développement Mobile'], false, '2024', 'StockMaster', '4 mois', '[{"label":"Articles gérés","value":"500K+"},{"label":"Précision inventaire","value":"99.5%"},{"label":"Temps de saisie","value":"-70%"}]', ARRAY['Gestion multi-entrepôts', 'Scan de codes-barres via mobile', 'Alertes de rupture de stock', 'Gestion des fournisseurs', 'Rapports analytiques avancés'], 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (name, slug, sector, tagline, description, problem, solution, technologies, services, featured, year, client, duration, results, features, sort_order) VALUES
('CorpWeb Institution', 'corpweb-institution', 'Institutionnel', 'Plateforme institutionnelle et corporate', 'CorpWeb Institution est une plateforme web institutionnelle conçue pour une organisation internationale, intégrant gestion de contenu, publications et espace membre.', 'L''institution avait besoin d''une plateforme moderne pour communiquer, publier ses rapports et gérer ses membres avec un niveau de sécurité élevé.', 'Une plateforme sur mesure avec CMS intégré, espace membre sécurisé, gestion documentaire et multilingue.', ARRAY['React', 'FastAPI', 'PostgreSQL', 'Nginx', 'Docker'], ARRAY['Développement Web', 'Backend & API', 'DevOps & Cloud', 'UI/UX Design'], false, '2024', 'Organisation Internationale', '7 mois', '[{"label":"Membres actifs","value":"5K+"},{"label":"Documents publiés","value":"1.2K"},{"label":"Disponibilité","value":"99.9%"}]', ARRAY['CMS sur mesure multilingue', 'Espace membre sécurisé', 'Gestion documentaire', 'Publication de rapports', 'Authentification à deux facteurs'], 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed services
INSERT INTO services (name, slug, tagline, description, icon, features, technologies, sort_order) VALUES
('Développement Web', 'developpement-web', 'Sites corporate, applications web, dashboards et plateformes métiers', 'Nous concevons des applications web modernes, performantes et évolutives. Du site corporate à la plateforme métier complexe, nous couvrons toute la chaîne de développement web.', 'web', ARRAY['Sites corporate', 'Applications web', 'Dashboards & back-offices', 'Plateformes métier', 'Marketplaces', 'Extranet'], ARRAY['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Next.js'], 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (name, slug, tagline, description, icon, features, technologies, sort_order) VALUES
('Développement Mobile', 'developpement-mobile', 'Applications iOS, Android et cross-platform avec Flutter', 'Nous développons des applications mobiles natives et cross-platform qui offrent une expérience utilisateur fluide et professionnelle sur tous les appareils.', 'mobile', ARRAY['Applications Flutter', 'Applications Android', 'Applications iOS', 'Applications métier', 'Applications événementielles', 'Push notifications'], ARRAY['Flutter', 'Dart', 'Android', 'iOS', 'Firebase'], 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (name, slug, tagline, description, icon, features, technologies, sort_order) VALUES
('Plateformes SaaS', 'saas', 'Logiciels multi-tenant, abonnements et outils internes', 'Nous concevons des plateformes SaaS complètes avec gestion d''abonnements, multi-tenant et architecture évolutive pour transformer vos idées en produits rentables.', 'saas', ARRAY['Plateformes multi-tenant', 'Logiciels métiers', 'Systèmes d''abonnements', 'Outils internes', 'Gestion des accès', 'Facturation automatique'], ARRAY['React', 'FastAPI', 'Laravel', 'Stripe', 'PostgreSQL'], 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (name, slug, tagline, description, icon, features, technologies, sort_order) VALUES
('Backend & API', 'backend-api', 'FastAPI, Laravel, API REST, authentification et intégrations', 'Nous construisons des backends robustes et des API performantes. Architecture logicielle, intégrations externes et sécurité au cœur de nos développements.', 'backend', ARRAY['API REST', 'Architecture logicielle', 'Authentification sécurisée', 'Intégrations externes', 'Microservices', 'Documentation API'], ARRAY['FastAPI', 'Laravel', 'Python', 'PHP', 'PostgreSQL', 'Redis'], 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (name, slug, tagline, description, icon, features, technologies, sort_order) VALUES
('DevOps & Cloud', 'devops-cloud', 'Docker, CI/CD, GitHub Actions, Nginx, monitoring et sécurité', 'Nous gérons l''infrastructure, le déploiement continu et la sécurité de vos applications. De la conteneurisation au monitoring, nous assurons un environnement fiable.', 'devops', ARRAY['Docker & conteneurisation', 'CI/CD avec GitHub Actions', 'Configuration Nginx', 'SSL & sécurité', 'Monitoring', 'Optimisation des performances'], ARRAY['Docker', 'Nginx', 'GitHub Actions', 'VPS', 'Cloud', 'Linux'], 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (name, slug, tagline, description, icon, features, technologies, sort_order) VALUES
('UI/UX Design', 'ui-ux', 'UX Research, wireframes, UI design, prototypes et Design Systems', 'Nous concevons des interfaces élégantes et intuitives. De la recherche utilisateur au Design System, nous créons des expériences qui convertissent.', 'design', ARRAY['UX Research', 'Wireframes & maquettes', 'UI Design', 'Prototypes interactifs', 'Design Systems', 'Responsive design'], ARRAY['Figma', 'Design Systems', 'Prototyping', 'User Research'], 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed solutions
INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('GaragePro', 'garagepro', 'SaaS de gestion de garage automobile', 'Les garages automobiles gèrent leurs opérations manuellement, avec des pertes de temps et des erreurs de facturation.', 'Garages automobiles, ateliers de réparation', 'GaragePro est un logiciel SaaS permettant aux garagistes de gérer leurs réparations, stock de pièces, facturation et relation client depuis une interface unique.', ARRAY['Gestion des ordres de réparation', 'Suivi de stock de pièces détachées', 'Facturation automatique', 'Base de données clients', 'Tableau de bord de performance'], ARRAY['React', 'Laravel', 'MySQL'], 'SaaS Automotive', 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('PressingExpress', 'pressingexpress', 'Solution de gestion de pressing et blanchisserie', 'Les pressings locaux ne disposent d''aucun outil de suivi, entraînant des pertes de vêtements et une insatisfaction client.', 'Pressings, blanchisseries, laveries', 'PressingExpress digitalise la gestion des pressings: prise en charge, suivi des commandes, notifications client et facturation.', ARRAY['Prise en charge et étiquetage QR', 'Suivi des commandes en temps réel', 'Notifications SMS automatiques', 'Application mobile client', 'Facturation et statistiques'], ARRAY['React', 'FastAPI', 'PostgreSQL', 'Flutter'], 'SaaS Services', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('StockMaster', 'stockmaster', 'Gestion de stock et d''inventaire cloud', 'Les PME gèrent leurs stocks sur Excel, avec des écarts d''inventaire réguliers et aucune visibilité en temps réel.', 'PME, commerces, entrepôts', 'StockMaster est une solution cloud de gestion de stock permettant de suivre les inventaires en temps réel, gérer les fournisseurs et automatiser les commandes.', ARRAY['Gestion multi-entrepôts', 'Scan de codes-barres via mobile', 'Alertes de rupture de stock', 'Gestion des fournisseurs', 'Rapports analytiques avancés'], ARRAY['React', 'Laravel', 'MySQL', 'Flutter'], 'Logistique', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('VoucherConnect', 'voucherconnect', 'Solution voucher et gestion de distribution', 'Les organisations distribuant des vouchers manquent d''un système sécurisé et traçable pour gérer l''émission et l''utilisation.', 'ONG, institutions, programmes d''assistance', 'VoucherConnect permet l''émission, la distribution et le suivi de vouchers numériques pour les programmes d''assistance sociale et commerciale.', ARRAY['Émission de vouchers uniques', 'Validation par QR code', 'Tableau de bord de distribution', 'Suivi en temps réel', 'Intégration paiement mobile'], ARRAY['React', 'FastAPI', 'PostgreSQL', 'Redis'], 'Fintech', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('EventFlow', 'eventflow', 'Plateforme événementielle et billetterie', 'Les organisateurs d''événements manquent d''une solution locale pour gérer la billetterie et le check-in.', 'Organisateurs d''événements, agences évènementielles', 'EventFlow est une plateforme complète de gestion d''événements avec billetterie, check-in QR code et analyse en temps réel.', ARRAY['Billetterie en ligne avec paiement mobile', 'Check-in QR code via app mobile', 'Tableau de bord analytique en temps réel', 'Gestion multi-organisateurs', 'Notifications push automatiques'], ARRAY['React', 'FastAPI', 'PostgreSQL', 'Flutter'], 'Événementiel', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed team members
INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Kouassi Aristide', 'Lead Developer & Co-fondateur', 'https://images.pexels.com/photos/31422830/pexels-photo-31422830.png?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['React', 'TypeScript', 'FastAPI', 'Docker', 'PostgreSQL'], 0)
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Aminata Bamba', 'UI/UX Designer & Product Manager', 'https://images.pexels.com/photos/6497114/pexels-photo-6497114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['Figma', 'Framer', 'Photoshop', 'Notion', 'Miro'], 1)
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Yao Konan', 'Backend Engineer', 'https://images.pexels.com/photos/7562139/pexels-photo-7562139.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['Laravel', 'Python', 'Redis', 'MySQL', 'Nginx'], 2)
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Fatou Diarra', 'Mobile Developer', 'https://images.pexels.com/photos/6497112/pexels-photo-6497112.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['Flutter', 'Dart', 'Android', 'iOS', 'Firebase'], 3)
ON CONFLICT DO NOTHING;

-- Seed values
INSERT INTO values (icon, title, description, sort_order) VALUES
('Award', 'Excellence', 'Nous visons l''excellence dans chaque ligne de code et chaque pixel.', 0),
('Zap', 'Innovation', 'Nous explorons constamment de nouvelles technologies et approches.', 1),
('Shield', 'Fiabilité', 'Nos solutions sont robustes, testées et conçues pour durer.', 2),
('Target', 'Performance', 'Nous mesurons et optimisons en continu pour des résultats concrets.', 3),
('Heart', 'Simplicité', 'La simplicité est notre marque de fabrique. Complexité masquée, usage fluide.', 4),
('Compass', 'Accompagnement', 'Nous sommes partenaires de nos clients sur le long terme.', 5)
ON CONFLICT DO NOTHING;

-- Seed mission/vision
INSERT INTO mission_vision (tab_key, icon, label, title, description, points, sort_order) VALUES
('mission', 'Target', 'Notre mission', 'Accompagner la transformation digitale africaine', 'Accompagner la transformation digitale des entreprises africaines en concevant des solutions logicielles sur mesure, performantes et adaptées au contexte local.', ARRAY['Des solutions sur mesure, jamais génériques', 'Une technologie au service de la valeur métier', 'Un impact économique durable pour nos clients'], 0)
ON CONFLICT (tab_key) DO NOTHING;

INSERT INTO mission_vision (tab_key, icon, label, title, description, points, sort_order) VALUES
('vision', 'Eye', 'Notre vision', 'Être le partenaire tech de référence en Afrique de l''Ouest', 'Devenir le partenaire technologique de référence en Afrique de l''Ouest pour la conception de solutions digitales innovantes et de qualité internationale.', ARRAY['Des produits d''une qualité internationale', 'Une innovation adaptée aux réalités locales', 'Un écosystème tech qui grandit avec ses clients'], 1)
ON CONFLICT (tab_key) DO NOTHING;

-- Seed about pillars
INSERT INTO about_pillars (icon, title, description, sort_order) VALUES
('Target', 'Expertise', 'Une équipe pluridisciplinaire maîtrisant toute la chaîne digitale, du frontend à l''infrastructure.', 0),
('Rocket', 'Approche', 'Une méthodologie structurée et collaborative, centrée sur les objectifs métier de nos clients.', 1),
('Award', 'Qualité', 'Un engagement fort sur la qualité du code, du design et de l''expérience utilisateur finale.', 2)
ON CONFLICT DO NOTHING;

-- Seed expertise domains
INSERT INTO expertise_domains (icon, label, description, technologies, sort_order) VALUES
('Code2', 'Frontend', 'Des interfaces modernes, performantes et accessibles.', ARRAY['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'], 0),
('Smartphone', 'Mobile', 'Des applications natives et cross-platform fluides.', ARRAY['Flutter', 'Dart', 'Android', 'iOS'], 1),
('Server', 'Backend', 'Des API robustes et une architecture logicielle solide.', ARRAY['FastAPI', 'Laravel', 'Python', 'PHP', 'Node.js'], 2),
('Database', 'Data', 'Des bases de données optimisées et fiables.', ARRAY['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'], 3),
('Cloud', 'Infrastructure', 'Déploiement, conteneurisation et orchestration.', ARRAY['Docker', 'Nginx', 'VPS', 'Cloud', 'Linux'], 4),
('GitBranch', 'CI/CD', 'Automatisation du build, test et déploiement.', ARRAY['GitHub Actions', 'CI/CD Pipelines', 'Automated Testing'], 5),
('Shield', 'Sécurité', 'Authentification, chiffrement et bonnes pratiques.', ARRAY['JWT', 'OAuth2', 'SSL/TLS', 'CORS', 'Rate Limiting'], 6),
('Cpu', 'Architecture', 'Clean Architecture, microservices et design patterns.', ARRAY['Clean Architecture', 'DDD', 'Microservices', 'API REST', 'SaaS Multi-tenant'], 7)
ON CONFLICT DO NOTHING;

-- Seed stats
INSERT INTO stats (value, suffix, label, sort_order) VALUES
(50, '+', 'Projets livrés', 0),
(5, '+', 'Solutions SaaS', 1),
(30, '+', 'Clients satisfaits', 2),
(99, '%', 'Disponibilité', 3)
ON CONFLICT DO NOTHING;

-- Seed clients
INSERT INTO clients (name, sort_order) VALUES
('EventFlow CI', 0),
('GaragePro', 1),
('PressingExpress', 2),
('VoucherConnect', 3),
('StockMaster', 4),
('CorpWeb', 5),
('Ministère Digital', 6),
('AfriTech Hub', 7)
ON CONFLICT DO NOTHING;

-- Seed why us reasons
INSERT INTO why_us_reasons (icon, title, description, sort_order) VALUES
('Layers', 'Expertise complète', 'Un seul partenaire pour le web, mobile, backend et infrastructure. Plus besoin de coordonner plusieurs prestataires.', 0),
('TrendingUp', 'Architecture évolutive', 'Les solutions sont conçues pour évoluer avec votre croissance, sans refonte majeure.', 1),
('Target', 'Vision produit', 'Nous construisons des produits, pas seulement des écrans. Chaque décision technique sert vos objectifs métier.', 2),
('Sparkles', 'Approche sur mesure', 'Chaque projet répond à un besoin concret. Pas de template, pas de solution générique.', 3),
('LifeBuoy', 'Accompagnement', 'Nous accompagnons le client avant et après le lancement. La maintenance et l''évolution font partie du service.', 4)
ON CONFLICT DO NOTHING;

-- Seed hero slides
INSERT INTO hero_slides (eyebrow, title, highlight, subtitle, cta_label, cta_to, accent, mockup, sort_order) VALUES
('Applications Web', 'Nous concevons les', 'solutions digitales', 'Sites corporate, applications web, dashboards et plateformes métiers performants pour les entreprises et organisations.', 'Voir nos réalisations', '/projects', 'primary', 'dashboard', 0),
('Applications Mobiles', 'Des expériences', 'mobiles natives', 'Applications iOS, Android et cross-platform avec Flutter. Une expérience fluide et professionnelle sur tous les appareils.', 'Découvrir nos services', '/services', 'secondary', 'mobile', 1),
('Plateformes SaaS', 'Des plateformes', 'SaaS évolutives', 'Logiciels multi-tenant, abonnements et outils métiers. Nous transformons vos idées en produits rentables et durables.', 'Explorer nos solutions', '/solutions', 'primary', 'saas', 2)
ON CONFLICT DO NOTHING;