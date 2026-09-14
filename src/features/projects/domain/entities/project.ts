export interface Project {
  id: string;
  name: string;
  slug: string;
  sector: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  technologies: string[];
  services: string[];
  featured: boolean;
  year: string;
  client: string;
  duration: string;
  results: { label: string; value: string }[];
  features: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    name: 'EventFlow',
    slug: 'eventflow',
    sector: 'Événementiel',
    tagline: 'Plateforme de gestion d\'événements et billetterie',
    description:
      'EventFlow est une plateforme complète de gestion d\'événements permettant aux organisateurs de créer, promouvoir et gérer leurs événements avec un système de billetterie intégré.',
    problem:
      'Les organisateurs d\'événements en Côte d\'Ivoire manquaient d\'une solution locale pour gérer la billetterie, le check-in et l\'analyse des événements en temps réel.',
    solution:
      'Nous avons conçu une plateforme web et mobile permettant la création d\'événements, la vente de billets en ligne, le check-in QR code et le suivi analytique en temps réel.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Flutter', 'Redis', 'Docker'],
    services: ['Développement Web', 'Développement Mobile', 'Backend & API', 'DevOps & Cloud'],
    featured: true,
    year: '2024',
    client: 'EventFlow CI',
    duration: '5 mois',
    results: [
      { label: 'Billets vendus', value: '50K+' },
      { label: 'Événements gérés', value: '200+' },
      { label: 'Temps de check-in', value: '-80%' },
    ],
    features: [
      'Billetterie en ligne avec paiement mobile',
      'Check-in QR code via app mobile',
      'Tableau de bord analytique en temps réel',
      'Gestion multi-organisateurs',
      'Notifications push automatiques',
    ],
  },
  {
    id: '2',
    name: 'GaragePro',
    slug: 'garagepro',
    sector: 'SaaS Automotive',
    tagline: 'SaaS de gestion de garage automobile',
    description:
      'GaragePro est un logiciel SaaS permettant aux garagistes de gérer leurs réparations, stock de pièces, facturation et relation client depuis une interface unique.',
    problem:
      'Les garages automobiles géraient leurs opérations manuellement, avec des pertes de temps significatives et des erreurs de facturation fréquentes.',
    solution:
      'Un SaaS multi-tenant avec gestion des ordres de réparation, suivi du stock, facturation automatique et tableau de bord de performance.',
    technologies: ['React', 'Laravel', 'MySQL', 'Tailwind CSS', 'Docker'],
    services: ['Plateformes SaaS', 'Développement Web', 'Backend & API'],
    featured: true,
    year: '2024',
    client: 'GaragePro',
    duration: '4 mois',
    results: [
      { label: 'Garages actifs', value: '30+' },
      { label: 'Réparations/mois', value: '1.2K' },
      { label: 'Gain de temps', value: '60%' },
    ],
    features: [
      'Gestion des ordres de réparation',
      'Suivi de stock de pièces détachées',
      'Facturation automatique',
      'Base de données clients',
      'Tableau de bord de performance',
    ],
  },
  {
    id: '3',
    name: 'PressingExpress',
    slug: 'pressingexpress',
    sector: 'SaaS Services',
    tagline: 'Solution de gestion de pressing et blanchisserie',
    description:
      'PressingExpress est une solution SaaS qui digitalise la gestion des pressings: prise en charge, suivi des commandes, notifications client et facturation.',
    problem:
      'Les pressings locaux ne disposaient d\'aucun outil de suivi, entraînant des pertes de vêtements et une insatisfaction client.',
    solution:
      'Une plateforme web avec application mobile client permettant le suivi en temps réel des commandes et la notification par SMS.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Flutter'],
    services: ['Plateformes SaaS', 'Développement Mobile', 'Backend & API'],
    featured: true,
    year: '2023',
    client: 'PressingExpress',
    duration: '3 mois',
    results: [
      { label: 'Pressings équipés', value: '15+' },
      { label: 'Commandes/mois', value: '800' },
      { label: 'Satisfaction client', value: '95%' },
    ],
    features: [
      'Prise en charge et étiquetage QR',
      'Suivi des commandes en temps réel',
      'Notifications SMS automatiques',
      'Application mobile client',
      'Facturation et statistiques',
    ],
  },
  {
    id: '4',
    name: 'VoucherConnect',
    slug: 'voucherconnect',
    sector: 'Fintech',
    tagline: 'Solution voucher et gestion de distribution',
    description:
      'VoucherConnect est une plateforme permettant l\'émission, la distribution et le suivi de vouchers numériques pour les programmes d\'assistance sociale et commerciale.',
    problem:
      'Les organisations distribuant des vouchers manquaient d\'un système sécurisé et traçable pour gérer l\'émission et l\'utilisation des vouchers.',
    solution:
      'Une plateforme sécurisée avec émission de vouchers uniques, validation par QR code et tableau de bord de suivi en temps réel.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    services: ['Plateformes SaaS', 'Développement Web', 'Backend & API', 'DevOps & Cloud'],
    featured: false,
    year: '2023',
    client: 'VoucherConnect',
    duration: '6 mois',
    results: [
      { label: 'Vouchers émis', value: '100K+' },
      { label: 'Taux d\'utilisation', value: '92%' },
      { label: 'Transactions sécurisées', value: '100%' },
    ],
    features: [
      'Émission de vouchers uniques',
      'Validation par QR code',
      'Tableau de bord de distribution',
      'Suivi en temps réel',
      'Intégration paiement mobile',
    ],
  },
  {
    id: '5',
    name: 'StockMaster',
    slug: 'stockmaster',
    sector: 'Logistique',
    tagline: 'Gestion de stock et d\'inventaire cloud',
    description:
      'StockMaster est une solution cloud de gestion de stock permettant aux entreprises de suivre leurs inventaires en temps réel, gérer leurs fournisseurs et automatiser leurs commandes.',
    problem:
      'Les PME géraient leurs stocks sur Excel, avec des écarts d\'inventaire réguliers et aucune visibilité en temps réel.',
    solution:
      'Une plateforme web responsive avec application mobile de scan, alertes automatiques et rapports analytiques.',
    technologies: ['React', 'Laravel', 'MySQL', 'Flutter'],
    services: ['Plateformes SaaS', 'Développement Web', 'Développement Mobile'],
    featured: false,
    year: '2024',
    client: 'StockMaster',
    duration: '4 mois',
    results: [
      { label: 'Articles gérés', value: '500K+' },
      { label: 'Précision inventaire', value: '99.5%' },
      { label: 'Temps de saisie', value: '-70%' },
    ],
    features: [
      'Gestion multi-entrepôts',
      'Scan de codes-barres via mobile',
      'Alertes de rupture de stock',
      'Gestion des fournisseurs',
      'Rapports analytiques avancés',
    ],
  },
  {
    id: '6',
    name: 'CorpWeb Institution',
    slug: 'corpweb-institution',
    sector: 'Institutionnel',
    tagline: 'Plateforme institutionnelle et corporate',
    description:
      'CorpWeb Institution est une plateforme web institutionnelle conçue pour une organisation internationale, intégrant gestion de contenu, publications et espace membre.',
    problem:
      'L\'institution avait besoin d\'une plateforme moderne pour communiquer, publier ses rapports et gérer ses membres avec un niveau de sécurité élevé.',
    solution:
      'Une plateforme sur mesure avec CMS intégré, espace membre sécurisé, gestion documentaire et multilingue.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Nginx', 'Docker'],
    services: ['Développement Web', 'Backend & API', 'DevOps & Cloud', 'UI/UX Design'],
    featured: false,
    year: '2024',
    client: 'Organisation Internationale',
    duration: '7 mois',
    results: [
      { label: 'Membres actifs', value: '5K+' },
      { label: 'Documents publiés', value: '1.2K' },
      { label: 'Disponibilité', value: '99.9%' },
    ],
    features: [
      'CMS sur mesure multilingue',
      'Espace membre sécurisé',
      'Gestion documentaire',
      'Publication de rapports',
      'Authentification à deux facteurs',
    ],
  },
];
