-- Seed data for the "why_us_reasons" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO why_us_reasons (icon, title, description, sort_order) VALUES
('Layers', 'Expertise complète', 'Un seul partenaire pour le web, mobile, backend et infrastructure. Plus besoin de coordonner plusieurs prestataires.', 0),
('TrendingUp', 'Architecture évolutive', 'Les solutions sont conçues pour évoluer avec votre croissance, sans refonte majeure.', 1),
('Target', 'Vision produit', 'Nous construisons des produits, pas seulement des écrans. Chaque décision technique sert vos objectifs métier.', 2),
('Sparkles', 'Approche sur mesure', 'Chaque projet répond à un besoin concret. Pas de template, pas de solution générique.', 3),
('LifeBuoy', 'Accompagnement', 'Nous accompagnons le client avant et après le lancement. La maintenance et l''évolution font partie du service.', 4)
ON CONFLICT DO NOTHING;
