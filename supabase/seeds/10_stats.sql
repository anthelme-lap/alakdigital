-- Seed data for the "stats" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO stats (value, suffix, label, sort_order) VALUES
(50, '+', 'Projets livrés', 0),
(5, '+', 'Solutions SaaS', 1),
(30, '+', 'Clients satisfaits', 2),
(99, '%', 'Disponibilité', 3)
ON CONFLICT DO NOTHING;
