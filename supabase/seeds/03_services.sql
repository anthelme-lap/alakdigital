-- Seed data for the "services" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
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
