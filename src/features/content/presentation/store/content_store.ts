import { create } from 'zustand';
import { articles as seedArticles } from '@/features/blog/domain/entities/article';
import { projects as seedProjects } from '@/features/projects/domain/entities/project';
import { services as seedServices } from '@/features/services/domain/entities/service';
import { solutions as seedSolutions } from '@/features/solutions/domain/entities/solution';
import type { BlogArticle } from '@/features/blog/domain/entities/article';
import type { Project } from '@/features/projects/domain/entities/project';
import type { Service } from '@/features/services/domain/entities/service';
import type { Solution } from '@/features/solutions/domain/entities/solution';
import type {
  TeamMember,
  Value,
  MissionVision,
  AboutPillar,
  ExpertiseDomain,
  Stat,
  Client,
  WhyUsReason,
  HeroSlide,
  ContactMessage,
  QuotationRequest,
} from '@/features/content/domain/entities/content';

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

const seedTeam: TeamMember[] = [
  { id: 't1', name: 'Kouassi Aristide', role: 'Lead Developer & Co-fondateur', image: 'https://images.pexels.com/photos/31422830/pexels-photo-31422830.png?auto=compress&cs=tinysrgb&h=650&w=940', tools: ['React', 'TypeScript', 'FastAPI', 'Docker', 'PostgreSQL'], sort_order: 0 },
  { id: 't2', name: 'Aminata Bamba', role: 'UI/UX Designer & Product Manager', image: 'https://images.pexels.com/photos/6497114/pexels-photo-6497114.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', tools: ['Figma', 'Framer', 'Photoshop', 'Notion', 'Miro'], sort_order: 1 },
  { id: 't3', name: 'Yao Konan', role: 'Backend Engineer', image: 'https://images.pexels.com/photos/7562139/pexels-photo-7562139.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', tools: ['Laravel', 'Python', 'Redis', 'MySQL', 'Nginx'], sort_order: 2 },
  { id: 't4', name: 'Fatou Diarra', role: 'Mobile Developer', image: 'https://images.pexels.com/photos/6497112/pexels-photo-6497112.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', tools: ['Flutter', 'Dart', 'Android', 'iOS', 'Firebase'], sort_order: 3 },
];

const seedValues: Value[] = [
  { id: 'v1', icon: 'Award', title: 'Excellence', description: "Nous visons l'excellence dans chaque ligne de code et chaque pixel.", sort_order: 0 },
  { id: 'v2', icon: 'Zap', title: 'Innovation', description: 'Nous explorons constamment de nouvelles technologies et approches.', sort_order: 1 },
  { id: 'v3', icon: 'Shield', title: 'Fiabilité', description: 'Nos solutions sont robustes, testées et conçues pour durer.', sort_order: 2 },
  { id: 'v4', icon: 'Target', title: 'Performance', description: 'Nous mesurons et optimisons en continu pour des résultats concrets.', sort_order: 3 },
  { id: 'v5', icon: 'Heart', title: 'Simplicité', description: 'La simplicité est notre marque de fabrique. Complexité masquée, usage fluide.', sort_order: 4 },
  { id: 'v6', icon: 'Compass', title: 'Accompagnement', description: 'Nous sommes partenaires de nos clients sur le long terme.', sort_order: 5 },
];

const seedMissionVision: MissionVision[] = [
  { id: 'mv1', tab_key: 'mission', icon: 'Target', label: 'Notre mission', title: 'Accompagner la transformation digitale africaine', description: "Accompagner la transformation digitale des entreprises africaines en concevant des solutions logicielles sur mesure, performantes et adaptées au contexte local.", points: ['Des solutions sur mesure, jamais génériques', 'Une technologie au service de la valeur métier', 'Un impact économique durable pour nos clients'], sort_order: 0 },
  { id: 'mv2', tab_key: 'vision', icon: 'Eye', label: 'Notre vision', title: "Être le partenaire tech de référence en Afrique de l'Ouest", description: "Devenir le partenaire technologique de référence en Afrique de l'Ouest pour la conception de solutions digitales innovantes et de qualité internationale.", points: ["Des produits d'une qualité internationale", 'Une innovation adaptée aux réalités locales', 'Un écosystème tech qui grandit avec ses clients'], sort_order: 1 },
];

const seedPillars: AboutPillar[] = [
  { id: 'p1', icon: 'Target', title: 'Expertise', description: "Une équipe pluridisciplinaire maîtrisant toute la chaîne digitale, du frontend à l'infrastructure.", sort_order: 0 },
  { id: 'p2', icon: 'Rocket', title: 'Approche', description: 'Une méthodologie structurée et collaborative, centrée sur les objectifs métier de nos clients.', sort_order: 1 },
  { id: 'p3', icon: 'Award', title: 'Qualité', description: "Un engagement fort sur la qualité du code, du design et de l'expérience utilisateur finale.", sort_order: 2 },
];

const seedExpertise: ExpertiseDomain[] = [
  { id: 'e1', icon: 'Code2', label: 'Frontend', description: 'Des interfaces modernes, performantes et accessibles.', technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'], sort_order: 0 },
  { id: 'e2', icon: 'Smartphone', label: 'Mobile', description: 'Des applications natives et cross-platform fluides.', technologies: ['Flutter', 'Dart', 'Android', 'iOS'], sort_order: 1 },
  { id: 'e3', icon: 'Server', label: 'Backend', description: 'Des API robustes et une architecture logicielle solide.', technologies: ['FastAPI', 'Laravel', 'Python', 'PHP', 'Node.js'], sort_order: 2 },
  { id: 'e4', icon: 'Database', label: 'Data', description: 'Des bases de données optimisées et fiables.', technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'], sort_order: 3 },
  { id: 'e5', icon: 'Cloud', label: 'Infrastructure', description: 'Déploiement, conteneurisation et orchestration.', technologies: ['Docker', 'Nginx', 'VPS', 'Cloud', 'Linux'], sort_order: 4 },
  { id: 'e6', icon: 'GitBranch', label: 'CI/CD', description: 'Automatisation du build, test et déploiement.', technologies: ['GitHub Actions', 'CI/CD Pipelines', 'Automated Testing'], sort_order: 5 },
  { id: 'e7', icon: 'Shield', label: 'Sécurité', description: 'Authentification, chiffrement et bonnes pratiques.', technologies: ['JWT', 'OAuth2', 'SSL/TLS', 'CORS', 'Rate Limiting'], sort_order: 6 },
  { id: 'e8', icon: 'Cpu', label: 'Architecture', description: 'Clean Architecture, microservices et design patterns.', technologies: ['Clean Architecture', 'DDD', 'Microservices', 'API REST', 'SaaS Multi-tenant'], sort_order: 7 },
];

const seedStats: Stat[] = [
  { id: 's1', value: 50, suffix: '+', label: 'Projets livrés', sort_order: 0 },
  { id: 's2', value: 5, suffix: '+', label: 'Solutions SaaS', sort_order: 1 },
  { id: 's3', value: 30, suffix: '+', label: 'Clients satisfaits', sort_order: 2 },
  { id: 's4', value: 99, suffix: '%', label: 'Disponibilité', sort_order: 3 },
];

const seedClients: Client[] = [
  { id: 'c1', name: 'EventFlow CI', sort_order: 0 },
  { id: 'c2', name: 'GaragePro', sort_order: 1 },
  { id: 'c3', name: 'PressingExpress', sort_order: 2 },
  { id: 'c4', name: 'VoucherConnect', sort_order: 3 },
  { id: 'c5', name: 'StockMaster', sort_order: 4 },
  { id: 'c6', name: 'CorpWeb', sort_order: 5 },
  { id: 'c7', name: 'Ministère Digital', sort_order: 6 },
  { id: 'c8', name: 'AfriTech Hub', sort_order: 7 },
];

const seedWhyUs: WhyUsReason[] = [
  { id: 'w1', icon: 'Layers', title: 'Expertise complète', description: 'Un seul partenaire pour le web, mobile, backend et infrastructure. Plus besoin de coordonner plusieurs prestataires.', sort_order: 0 },
  { id: 'w2', icon: 'TrendingUp', title: 'Architecture évolutive', description: 'Les solutions sont conçues pour évoluer avec votre croissance, sans refonte majeure.', sort_order: 1 },
  { id: 'w3', icon: 'Target', title: 'Vision produit', description: 'Nous construisons des produits, pas seulement des écrans. Chaque décision technique sert vos objectifs métier.', sort_order: 2 },
  { id: 'w4', icon: 'Sparkles', title: 'Approche sur mesure', description: 'Chaque projet répond à un besoin concret. Pas de template, pas de solution générique.', sort_order: 3 },
  { id: 'w5', icon: 'LifeBuoy', title: 'Accompagnement', description: "Nous accompagnons le client avant et après le lancement. La maintenance et l'évolution font partie du service.", sort_order: 4 },
];

const seedHeroSlides: HeroSlide[] = [
  { id: 'h1', eyebrow: 'Applications Web', title: 'Nous concevons les', highlight: 'solutions digitales', subtitle: 'Sites corporate, applications web, dashboards et plateformes métiers performants pour les entreprises et organisations.', cta_label: 'Voir nos réalisations', cta_to: '/projects', accent: 'primary', mockup: 'dashboard', sort_order: 0 },
  { id: 'h2', eyebrow: 'Applications Mobiles', title: 'Des expériences', highlight: 'mobiles natives', subtitle: 'Applications iOS, Android et cross-platform avec Flutter. Une expérience fluide et professionnelle sur tous les appareils.', cta_label: 'Découvrir nos services', cta_to: '/services', accent: 'secondary', mockup: 'mobile', sort_order: 1 },
  { id: 'h3', eyebrow: 'Plateformes SaaS', title: 'Des plateformes', highlight: 'SaaS évolutives', subtitle: 'Logiciels multi-tenant, abonnements et outils métiers. Nous transformons vos idées en produits rentables et durables.', cta_label: 'Explorer nos solutions', cta_to: '/solutions', accent: 'primary', mockup: 'saas', sort_order: 2 },
];

export interface ContentState {
  articles: BlogArticle[];
  projects: Project[];
  services: Service[];
  solutions: Solution[];
  team: TeamMember[];
  values: Value[];
  missionVision: MissionVision[];
  pillars: AboutPillar[];
  expertise: ExpertiseDomain[];
  stats: Stat[];
  clients: Client[];
  whyUs: WhyUsReason[];
  heroSlides: HeroSlide[];
  messages: ContactMessage[];
  quotations: QuotationRequest[];

  // Articles CRUD
  addArticle: (a: Omit<BlogArticle, 'id'>) => void;
  updateArticle: (id: string, a: Partial<BlogArticle>) => void;
  deleteArticle: (id: string) => void;

  // Projects CRUD
  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Services CRUD
  addService: (s: Omit<Service, 'id'>) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Solutions CRUD
  addSolution: (s: Omit<Solution, 'id'>) => void;
  updateSolution: (id: string, s: Partial<Solution>) => void;
  deleteSolution: (id: string) => void;

  // Team CRUD
  addTeamMember: (t: Omit<TeamMember, 'id' | 'sort_order'>) => void;
  updateTeamMember: (id: string, t: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Values CRUD
  addValue: (v: Omit<Value, 'id' | 'sort_order'>) => void;
  updateValue: (id: string, v: Partial<Value>) => void;
  deleteValue: (id: string) => void;

  // Mission/Vision CRUD
  updateMissionVision: (id: string, mv: Partial<MissionVision>) => void;

  // Pillars CRUD
  addPillar: (p: Omit<AboutPillar, 'id' | 'sort_order'>) => void;
  updatePillar: (id: string, p: Partial<AboutPillar>) => void;
  deletePillar: (id: string) => void;

  // Expertise CRUD
  addExpertise: (e: Omit<ExpertiseDomain, 'id' | 'sort_order'>) => void;
  updateExpertise: (id: string, e: Partial<ExpertiseDomain>) => void;
  deleteExpertise: (id: string) => void;

  // Stats CRUD
  addStat: (s: Omit<Stat, 'id' | 'sort_order'>) => void;
  updateStat: (id: string, s: Partial<Stat>) => void;
  deleteStat: (id: string) => void;

  // Clients CRUD
  addClient: (c: Omit<Client, 'id' | 'sort_order'>) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // WhyUs CRUD
  addWhyUs: (w: Omit<WhyUsReason, 'id' | 'sort_order'>) => void;
  updateWhyUs: (id: string, w: Partial<WhyUsReason>) => void;
  deleteWhyUs: (id: string) => void;

  // Hero CRUD
  addHeroSlide: (h: Omit<HeroSlide, 'id' | 'sort_order'>) => void;
  updateHeroSlide: (id: string, h: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;

  // Messages
  addMessage: (m: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => void;
  updateMessageStatus: (id: string, status: string) => void;
  deleteMessage: (id: string) => void;

  // Quotations
  addQuotation: (q: Omit<QuotationRequest, 'id' | 'created_at' | 'status'>) => void;
  updateQuotationStatus: (id: string, status: string) => void;
  deleteQuotation: (id: string) => void;
}

function nextSortOrder<T extends { sort_order: number }>(arr: T[]): number {
  return arr.length;
}

export const useContentStore = create<ContentState>((set) => ({
  articles: [...seedArticles],
  projects: [...seedProjects],
  services: [...seedServices],
  solutions: [...seedSolutions],
  team: seedTeam,
  values: seedValues,
  missionVision: seedMissionVision,
  pillars: seedPillars,
  expertise: seedExpertise,
  stats: seedStats,
  clients: seedClients,
  whyUs: seedWhyUs,
  heroSlides: seedHeroSlides,
  messages: [],
  quotations: [],

  addArticle: (a) => set((s) => ({ articles: [{ ...a, id: genId() }, ...s.articles] })),
  updateArticle: (id, a) => set((s) => ({ articles: s.articles.map((x) => (x.id === id ? { ...x, ...a } : x)) })),
  deleteArticle: (id) => set((s) => ({ articles: s.articles.filter((x) => x.id !== id) })),

  addProject: (p) => set((s) => ({ projects: [{ ...p, id: genId() }, ...s.projects] })),
  updateProject: (id, p) => set((s) => ({ projects: s.projects.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),

  addService: (sv) => set((s) => ({ services: [...s.services, { ...sv, id: genId() }] })),
  updateService: (id, sv) => set((s) => ({ services: s.services.map((x) => (x.id === id ? { ...x, ...sv } : x)) })),
  deleteService: (id) => set((s) => ({ services: s.services.filter((x) => x.id !== id) })),

  addSolution: (so) => set((s) => ({ solutions: [...s.solutions, { ...so, id: genId() }] })),
  updateSolution: (id, so) => set((s) => ({ solutions: s.solutions.map((x) => (x.id === id ? { ...x, ...so } : x)) })),
  deleteSolution: (id) => set((s) => ({ solutions: s.solutions.filter((x) => x.id !== id) })),

  addTeamMember: (t) => set((s) => ({ team: [...s.team, { ...t, id: genId(), sort_order: nextSortOrder(s.team) }] })),
  updateTeamMember: (id, t) => set((s) => ({ team: s.team.map((x) => (x.id === id ? { ...x, ...t } : x)) })),
  deleteTeamMember: (id) => set((s) => ({ team: s.team.filter((x) => x.id !== id) })),

  addValue: (v) => set((s) => ({ values: [...s.values, { ...v, id: genId(), sort_order: nextSortOrder(s.values) }] })),
  updateValue: (id, v) => set((s) => ({ values: s.values.map((x) => (x.id === id ? { ...x, ...v } : x)) })),
  deleteValue: (id) => set((s) => ({ values: s.values.filter((x) => x.id !== id) })),

  updateMissionVision: (id, mv) => set((s) => ({ missionVision: s.missionVision.map((x) => (x.id === id ? { ...x, ...mv } : x)) })),

  addPillar: (p) => set((s) => ({ pillars: [...s.pillars, { ...p, id: genId(), sort_order: nextSortOrder(s.pillars) }] })),
  updatePillar: (id, p) => set((s) => ({ pillars: s.pillars.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
  deletePillar: (id) => set((s) => ({ pillars: s.pillars.filter((x) => x.id !== id) })),

  addExpertise: (e) => set((s) => ({ expertise: [...s.expertise, { ...e, id: genId(), sort_order: nextSortOrder(s.expertise) }] })),
  updateExpertise: (id, e) => set((s) => ({ expertise: s.expertise.map((x) => (x.id === id ? { ...x, ...e } : x)) })),
  deleteExpertise: (id) => set((s) => ({ expertise: s.expertise.filter((x) => x.id !== id) })),

  addStat: (st) => set((s) => ({ stats: [...s.stats, { ...st, id: genId(), sort_order: nextSortOrder(s.stats) }] })),
  updateStat: (id, st) => set((s) => ({ stats: s.stats.map((x) => (x.id === id ? { ...x, ...st } : x)) })),
  deleteStat: (id) => set((s) => ({ stats: s.stats.filter((x) => x.id !== id) })),

  addClient: (c) => set((s) => ({ clients: [...s.clients, { ...c, id: genId(), sort_order: nextSortOrder(s.clients) }] })),
  updateClient: (id, c) => set((s) => ({ clients: s.clients.map((x) => (x.id === id ? { ...x, ...c } : x)) })),
  deleteClient: (id) => set((s) => ({ clients: s.clients.filter((x) => x.id !== id) })),

  addWhyUs: (w) => set((s) => ({ whyUs: [...s.whyUs, { ...w, id: genId(), sort_order: nextSortOrder(s.whyUs) }] })),
  updateWhyUs: (id, w) => set((s) => ({ whyUs: s.whyUs.map((x) => (x.id === id ? { ...x, ...w } : x)) })),
  deleteWhyUs: (id) => set((s) => ({ whyUs: s.whyUs.filter((x) => x.id !== id) })),

  addHeroSlide: (h) => set((s) => ({ heroSlides: [...s.heroSlides, { ...h, id: genId(), sort_order: nextSortOrder(s.heroSlides) }] })),
  updateHeroSlide: (id, h) => set((s) => ({ heroSlides: s.heroSlides.map((x) => (x.id === id ? { ...x, ...h } : x)) })),
  deleteHeroSlide: (id) => set((s) => ({ heroSlides: s.heroSlides.filter((x) => x.id !== id) })),

  addMessage: (m) => set((s) => ({ messages: [{ ...m, id: genId(), status: 'new', created_at: new Date().toISOString() }, ...s.messages] })),
  updateMessageStatus: (id, status) => set((s) => ({ messages: s.messages.map((x) => (x.id === id ? { ...x, status } : x)) })),
  deleteMessage: (id) => set((s) => ({ messages: s.messages.filter((x) => x.id !== id) })),

  addQuotation: (q) => set((s) => ({ quotations: [{ ...q, id: genId(), status: 'new', created_at: new Date().toISOString() }, ...s.quotations] })),
  updateQuotationStatus: (id, status) => set((s) => ({ quotations: s.quotations.map((x) => (x.id === id ? { ...x, status } : x)) })),
  deleteQuotation: (id) => set((s) => ({ quotations: s.quotations.filter((x) => x.id !== id) })),
}));
