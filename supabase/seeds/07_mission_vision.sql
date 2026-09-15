-- Seed data for the "mission_vision" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO mission_vision (tab_key, icon, label, title, description, points, sort_order) VALUES
('mission', 'Target', 'Notre mission', 'Accompagner la transformation digitale africaine', 'Accompagner la transformation digitale des entreprises africaines en concevant des solutions logicielles sur mesure, performantes et adaptées au contexte local.', ARRAY['Des solutions sur mesure, jamais génériques', 'Une technologie au service de la valeur métier', 'Un impact économique durable pour nos clients'], 0)
ON CONFLICT (tab_key) DO NOTHING;

INSERT INTO mission_vision (tab_key, icon, label, title, description, points, sort_order) VALUES
('vision', 'Eye', 'Notre vision', 'Être le partenaire tech de référence en Afrique de l''Ouest', 'Devenir le partenaire technologique de référence en Afrique de l''Ouest pour la conception de solutions digitales innovantes et de qualité internationale.', ARRAY['Des produits d''une qualité internationale', 'Une innovation adaptée aux réalités locales', 'Un écosystème tech qui grandit avec ses clients'], 1)
ON CONFLICT (tab_key) DO NOTHING;
