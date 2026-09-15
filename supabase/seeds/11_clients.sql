-- Seed data for the "clients" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO clients (name, sort_order) VALUES
('EventFlow CI', 0),
('Garage Manager', 1),
('Lavex', 2),
('VoucherConnect', 3),
('ModaStock', 4),
('CorpWeb', 5),
('Ministère Digital', 6),
('AfriTech Hub', 7)
ON CONFLICT DO NOTHING;
