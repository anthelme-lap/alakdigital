-- Seed data for the "hero_slides" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO hero_slides (eyebrow, title, highlight, subtitle, cta_label, cta_to, accent, mockup, sort_order) VALUES
('Applications Web', 'Nous concevons les', 'solutions digitales', 'Sites corporate, applications web, dashboards et plateformes métiers performants pour les entreprises et organisations.', 'Voir nos réalisations', '/projects', 'primary', 'dashboard', 0),
('Applications Mobiles', 'Des expériences', 'mobiles natives', 'Applications iOS, Android et cross-platform avec Flutter. Une expérience fluide et professionnelle sur tous les appareils.', 'Découvrir nos services', '/services', 'secondary', 'mobile', 1),
('Plateformes SaaS', 'Des plateformes', 'SaaS évolutives', 'Logiciels multi-tenant, abonnements et outils métiers. Nous transformons vos idées en produits rentables et durables.', 'Explorer nos solutions', '/solutions', 'primary', 'saas', 2)
ON CONFLICT (title) DO NOTHING;