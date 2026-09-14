import { Code2, Smartphone, Cloud, Server, Palette, Layers } from 'lucide-react';

export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  features: string[];
  technologies: string[];
}

const iconMap: Record<string, typeof Code2> = {
  web: Code2,
  mobile: Smartphone,
  saas: Layers,
  backend: Server,
  devops: Cloud,
  design: Palette,
};

export function getServiceIcon(name: string) {
  return iconMap[name] ?? Code2;
}

export const services: Service[] = [
  {
    id: '1',
    slug: 'developpement-web',
    name: 'Développement Web',
    tagline: 'Sites corporate, applications web, dashboards et plateformes métiers',
    description:
      'Nous concevons des applications web modernes, performantes et évolutives. Du site corporate à la plateforme métier complexe, nous couvrons toute la chaîne de développement web.',
    icon: 'web',
    features: [
      'Sites corporate',
      'Applications web',
      'Dashboards & back-offices',
      'Plateformes métier',
      'Marketplaces',
      'Extranet',
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Next.js'],
  },
  {
    id: '2',
    slug: 'developpement-mobile',
    name: 'Développement Mobile',
    tagline: 'Applications iOS, Android et cross-platform avec Flutter',
    description:
      'Nous développons des applications mobiles natives et cross-platform qui offrent une expérience utilisateur fluide et professionnelle sur tous les appareils.',
    icon: 'mobile',
    features: [
      'Applications Flutter',
      'Applications Android',
      'Applications iOS',
      'Applications métier',
      'Applications événementielles',
      'Push notifications',
    ],
    technologies: ['Flutter', 'Dart', 'Android', 'iOS', 'Firebase'],
  },
  {
    id: '3',
    slug: 'saas',
    name: 'Plateformes SaaS',
    tagline: 'Logiciels multi-tenant, abonnements et outils internes',
    description:
      'Nous concevons des plateformes SaaS complètes avec gestion d\'abonnements, multi-tenant et architecture évolutive pour transformer vos idées en produits rentables.',
    icon: 'saas',
    features: [
      'Plateformes multi-tenant',
      'Logiciels métiers',
      'Systèmes d\'abonnements',
      'Outils internes',
      'Gestion des accès',
      'Facturation automatique',
    ],
    technologies: ['React', 'FastAPI', 'Laravel', 'Stripe', 'PostgreSQL'],
  },
  {
    id: '4',
    slug: 'backend-api',
    name: 'Backend & API',
    tagline: 'FastAPI, Laravel, API REST, authentification et intégrations',
    description:
      'Nous construisons des backends robustes et des API performantes. Architecture logicielle, intégrations externes et sécurité au cœur de nos développements.',
    icon: 'backend',
    features: [
      'API REST',
      'Architecture logicielle',
      'Authentification sécurisée',
      'Intégrations externes',
      'Microservices',
      'Documentation API',
    ],
    technologies: ['FastAPI', 'Laravel', 'Python', 'PHP', 'PostgreSQL', 'Redis'],
  },
  {
    id: '5',
    slug: 'devops-cloud',
    name: 'DevOps & Cloud',
    tagline: 'Docker, CI/CD, GitHub Actions, Nginx, monitoring et sécurité',
    description:
      'Nous gérons l\'infrastructure, le déploiement continu et la sécurité de vos applications. De la conteneurisation au monitoring, nous assurons un environnement fiable.',
    icon: 'devops',
    features: [
      'Docker & conteneurisation',
      'CI/CD avec GitHub Actions',
      'Configuration Nginx',
      'SSL & sécurité',
      'Monitoring',
      'Optimisation des performances',
    ],
    technologies: ['Docker', 'Nginx', 'GitHub Actions', 'VPS', 'Cloud', 'Linux'],
  },
  {
    id: '6',
    slug: 'ui-ux',
    name: 'UI/UX Design',
    tagline: 'UX Research, wireframes, UI design, prototypes et Design Systems',
    description:
      'Nous concevons des interfaces élégantes et intuitives. De la recherche utilisateur au Design System, nous créons des expériences qui convertissent.',
    icon: 'design',
    features: [
      'UX Research',
      'Wireframes & maquettes',
      'UI Design',
      'Prototypes interactifs',
      'Design Systems',
      'Responsive design',
    ],
    technologies: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
  },
];
