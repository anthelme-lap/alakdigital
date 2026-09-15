-- Seed data for the "values" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO values (icon, title, description, sort_order) VALUES
('Award', 'Excellence', 'Nous visons l''excellence dans chaque ligne de code et chaque pixel.', 0),
('Zap', 'Innovation', 'Nous explorons constamment de nouvelles technologies et approches.', 1),
('Shield', 'Fiabilité', 'Nos solutions sont robustes, testées et conçues pour durer.', 2),
('Target', 'Performance', 'Nous mesurons et optimisons en continu pour des résultats concrets.', 3),
('Heart', 'Simplicité', 'La simplicité est notre marque de fabrique. Complexité masquée, usage fluide.', 4),
('Compass', 'Accompagnement', 'Nous sommes partenaires de nos clients sur le long terme.', 5)
ON CONFLICT DO NOTHING;
