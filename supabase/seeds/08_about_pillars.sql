-- Seed data for the "about_pillars" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO about_pillars (icon, title, description, sort_order) VALUES
('Target', 'Expertise', 'Une équipe pluridisciplinaire maîtrisant toute la chaîne digitale, du frontend à l''infrastructure.', 0),
('Rocket', 'Approche', 'Une méthodologie structurée et collaborative, centrée sur les objectifs métier de nos clients.', 1),
('Award', 'Qualité', 'Un engagement fort sur la qualité du code, du design et de l''expérience utilisateur finale.', 2)
ON CONFLICT DO NOTHING;
