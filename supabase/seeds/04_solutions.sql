-- Seed data for the "solutions" table. Idempotent (ON CONFLICT DO NOTHING) -- safe to re-run.
INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('Garage Manager', 'garage-manager', 'SaaS de gestion de garage automobile', 'Les garages automobiles gèrent leurs opérations manuellement, avec des pertes de temps et des erreurs de facturation.', 'Garages automobiles, ateliers de réparation', 'Garage Manager est un logiciel SaaS permettant aux garagistes de gérer leurs réparations, stock de pièces, facturation et relation client depuis une interface unique.', ARRAY['Gestion des ordres de réparation', 'Suivi de stock de pièces détachées', 'Facturation automatique', 'Base de données clients', 'Tableau de bord de performance'], ARRAY['React', 'Laravel', 'MySQL'], 'SaaS Automotive', 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('Lavex', 'lavex', 'Solution de gestion de pressing et blanchisserie', 'Les pressings locaux ne disposent d''aucun outil de suivi, entraînant des pertes de vêtements et une insatisfaction client.', 'Pressings, blanchisseries, laveries', 'Lavex digitalise la gestion des pressings: prise en charge, suivi des commandes, notifications client et facturation.', ARRAY['Prise en charge et étiquetage QR', 'Suivi des commandes en temps réel', 'Notifications SMS automatiques', 'Application mobile client', 'Facturation et statistiques'], ARRAY['React', 'FastAPI', 'PostgreSQL', 'Flutter'], 'SaaS Services', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('ModaStock', 'modastock', 'Gestion de stock et d''inventaire cloud', 'Les PME gèrent leurs stocks sur Excel, avec des écarts d''inventaire réguliers et aucune visibilité en temps réel.', 'PME, commerces, entrepôts', 'ModaStock est une solution cloud de gestion de stock permettant de suivre les inventaires en temps réel, gérer les fournisseurs et automatiser les commandes.', ARRAY['Gestion multi-entrepôts', 'Scan de codes-barres via mobile', 'Alertes de rupture de stock', 'Gestion des fournisseurs', 'Rapports analytiques avancés'], ARRAY['React', 'Laravel', 'MySQL', 'Flutter'], 'Logistique', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('VoucherConnect', 'voucherconnect', 'Solution voucher et gestion de distribution', 'Les organisations distribuant des vouchers manquent d''un système sécurisé et traçable pour gérer l''émission et l''utilisation.', 'ONG, institutions, programmes d''assistance', 'VoucherConnect permet l''émission, la distribution et le suivi de vouchers numériques pour les programmes d''assistance sociale et commerciale.', ARRAY['Émission de vouchers uniques', 'Validation par QR code', 'Tableau de bord de distribution', 'Suivi en temps réel', 'Intégration paiement mobile'], ARRAY['React', 'FastAPI', 'PostgreSQL', 'Redis'], 'Fintech', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO solutions (name, slug, tagline, problem, target, description, features, technologies, category, sort_order) VALUES
('EventFlow', 'eventflow', 'Plateforme événementielle et billetterie', 'Les organisateurs d''événements manquent d''une solution locale pour gérer la billetterie et le check-in.', 'Organisateurs d''événements, agences évènementielles', 'EventFlow est une plateforme complète de gestion d''événements avec billetterie, check-in QR code et analyse en temps réel.', ARRAY['Billetterie en ligne avec paiement mobile', 'Check-in QR code via app mobile', 'Tableau de bord analytique en temps réel', 'Gestion multi-organisateurs', 'Notifications push automatiques'], ARRAY['React', 'FastAPI', 'PostgreSQL', 'Flutter'], 'Événementiel', 4)
ON CONFLICT (slug) DO NOTHING;
