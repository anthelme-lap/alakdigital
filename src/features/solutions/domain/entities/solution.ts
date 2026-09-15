export interface Solution {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  problem: string;
  target: string;
  description: string;
  features: string[];
  technologies: string[];
  category: string;
  link: string;
}

export const solutions: Solution[] = [
  {
    id: '1',
    name: 'Garage Manager',
    slug: 'garage-manager',
    tagline: 'SaaS de gestion de garage automobile',
    problem: 'Les garages automobiles gèrent leurs opérations manuellement, avec des pertes de temps et des erreurs de facturation.',
    target: 'Garages automobiles, ateliers de réparation',
    description:
      'Garage Manager est un logiciel SaaS permettant aux garagistes de gérer leurs réparations, stock de pièces, facturation et relation client depuis une interface unique.',
    features: [
      'Gestion des ordres de réparation',
      'Suivi de stock de pièces détachées',
      'Facturation automatique',
      'Base de données clients',
      'Tableau de bord de performance',
    ],
    technologies: ['React', 'Laravel', 'MySQL'],
    category: 'SaaS Automotive',
    link: '',
  },
  {
    id: '2',
    name: 'Lavex',
    slug: 'lavex',
    tagline: 'Solution de gestion de pressing et blanchisserie',
    problem: 'Les pressings locaux ne disposent d\'aucun outil de suivi, entraînant des pertes de vêtements et une insatisfaction client.',
    target: 'Pressings, blanchisseries, laveries',
    description:
      'Lavex digitalise la gestion des pressings: prise en charge, suivi des commandes, notifications client et facturation.',
    features: [
      'Prise en charge et étiquetage QR',
      'Suivi des commandes en temps réel',
      'Notifications SMS automatiques',
      'Application mobile client',
      'Facturation et statistiques',
    ],
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Flutter'],
    category: 'SaaS Services',
    link: '',
  },
  {
    id: '3',
    name: 'ModaStock',
    slug: 'modastock',
    tagline: 'Gestion de stock et d\'inventaire cloud',
    problem: 'Les PME gèrent leurs stocks sur Excel, avec des écarts d\'inventaire réguliers et aucune visibilité en temps réel.',
    target: 'PME, commerces, entrepôts',
    description:
      'ModaStock est une solution cloud de gestion de stock permettant de suivre les inventaires en temps réel, gérer les fournisseurs et automatiser les commandes.',
    features: [
      'Gestion multi-entrepôts',
      'Scan de codes-barres via mobile',
      'Alertes de rupture de stock',
      'Gestion des fournisseurs',
      'Rapports analytiques avancés',
    ],
    technologies: ['React', 'Laravel', 'MySQL', 'Flutter'],
    category: 'Logistique',
    link: '',
  },
  {
    id: '4',
    name: 'VoucherConnect',
    slug: 'voucherconnect',
    tagline: 'Solution voucher et gestion de distribution',
    problem: 'Les organisations distribuant des vouchers manquent d\'un système sécurisé et traçable pour gérer l\'émission et l\'utilisation.',
    target: 'ONG, institutions, programmes d\'assistance',
    description:
      'VoucherConnect permet l\'émission, la distribution et le suivi de vouchers numériques pour les programmes d\'assistance sociale et commerciale.',
    features: [
      'Émission de vouchers uniques',
      'Validation par QR code',
      'Tableau de bord de distribution',
      'Suivi en temps réel',
      'Intégration paiement mobile',
    ],
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Redis'],
    category: 'Fintech',
    link: '',
  },
  {
    id: '5',
    name: 'EventFlow',
    slug: 'eventflow',
    tagline: 'Plateforme événementielle et billetterie',
    problem: 'Les organisateurs d\'événements manquent d\'une solution locale pour gérer la billetterie et le check-in.',
    target: 'Organisateurs d\'événements, agences évènementielles',
    description:
      'EventFlow est une plateforme complète de gestion d\'événements avec billetterie, check-in QR code et analyse en temps réel.',
    features: [
      'Billetterie en ligne avec paiement mobile',
      'Check-in QR code via app mobile',
      'Tableau de bord analytique en temps réel',
      'Gestion multi-organisateurs',
      'Notifications push automatiques',
    ],
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Flutter'],
    category: 'Événementiel',
    link: '',
  },
];
