-- Seed data for the "expertise_domains" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO expertise_domains (icon, label, description, technologies, sort_order) VALUES
('Code2', 'Frontend', 'Des interfaces modernes, performantes et accessibles.', ARRAY['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'], 0),
('Smartphone', 'Mobile', 'Des applications natives et cross-platform fluides.', ARRAY['Flutter', 'Dart', 'Android', 'iOS'], 1),
('Server', 'Backend', 'Des API robustes et une architecture logicielle solide.', ARRAY['FastAPI', 'Laravel', 'Python', 'PHP', 'Node.js'], 2),
('Database', 'Data', 'Des bases de données optimisées et fiables.', ARRAY['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'], 3),
('Cloud', 'Infrastructure', 'Déploiement, conteneurisation et orchestration.', ARRAY['Docker', 'Nginx', 'VPS', 'Cloud', 'Linux'], 4),
('GitBranch', 'CI/CD', 'Automatisation du build, test et déploiement.', ARRAY['GitHub Actions', 'CI/CD Pipelines', 'Automated Testing'], 5),
('Shield', 'Sécurité', 'Authentification, chiffrement et bonnes pratiques.', ARRAY['JWT', 'OAuth2', 'SSL/TLS', 'CORS', 'Rate Limiting'], 6),
('Cpu', 'Architecture', 'Clean Architecture, microservices et design patterns.', ARRAY['Clean Architecture', 'DDD', 'Microservices', 'API REST', 'SaaS Multi-tenant'], 7)
ON CONFLICT (label) DO NOTHING;
