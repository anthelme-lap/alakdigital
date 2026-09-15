-- Seed data for the "team_members" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Kouassi Aristide', 'Lead Developer & Co-fondateur', 'https://images.pexels.com/photos/31422830/pexels-photo-31422830.png?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['React', 'TypeScript', 'FastAPI', 'Docker', 'PostgreSQL'], 0)
ON CONFLICT (name) DO NOTHING;

INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Aminata Bamba', 'UI/UX Designer & Product Manager', 'https://images.pexels.com/photos/6497114/pexels-photo-6497114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['Figma', 'Framer', 'Photoshop', 'Notion', 'Miro'], 1)
ON CONFLICT (name) DO NOTHING;

INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Yao Konan', 'Backend Engineer', 'https://images.pexels.com/photos/7562139/pexels-photo-7562139.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['Laravel', 'Python', 'Redis', 'MySQL', 'Nginx'], 2)
ON CONFLICT (name) DO NOTHING;

INSERT INTO team_members (name, role, image, tools, sort_order) VALUES
('Fatou Diarra', 'Mobile Developer', 'https://images.pexels.com/photos/6497112/pexels-photo-6497112.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', ARRAY['Flutter', 'Dart', 'Android', 'iOS', 'Firebase'], 3)
ON CONFLICT (name) DO NOTHING;
