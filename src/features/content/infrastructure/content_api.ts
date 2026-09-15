import { supabase } from '@/core/database/supabase_client';
import type { BlogArticle } from '@/features/blog/domain/entities/article';
import type { Project } from '@/features/projects/domain/entities/project';
import type { Service } from '@/features/services/domain/entities/service';
import type { Solution } from '@/features/solutions/domain/entities/solution';
import type {
  TeamMember, Value, MissionVision, AboutPillar, ExpertiseDomain,
  Stat, Client, WhyUsReason, HeroSlide, ContactMessage, QuotationRequest,
} from '@/features/content/domain/entities/content';

// ==================== MAPPERS ====================
// DB uses snake_case, TS entities use camelCase

type ArticleRow = {
  id: string; title: string; slug: string; excerpt: string; category: string;
  author: string; author_role: string; author_bio: string; date: string;
  reading_time: string; cover_image: string; featured: boolean;
  content: string; tags: string[]; sort_order: number;
};

function mapArticle(r: ArticleRow): BlogArticle {
  return {
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
    category: r.category, author: r.author, authorRole: r.author_role,
    authorBio: r.author_bio, date: r.date, readingTime: r.reading_time,
    coverImage: r.cover_image, featured: r.featured, content: r.content,
    tags: r.tags ?? [],
  };
}

type ProjectRow = {
  id: string; name: string; slug: string; sector: string; tagline: string;
  description: string; problem: string; solution: string;
  technologies: string[]; services: string[]; featured: boolean;
  year: string; client: string; duration: string;
  results: { label: string; value: string }[]; features: string[]; image: string; link: string;
};

function mapProject(r: ProjectRow): Project {
  return {
    id: r.id, name: r.name, slug: r.slug, sector: r.sector, tagline: r.tagline,
    description: r.description, problem: r.problem, solution: r.solution,
    technologies: r.technologies ?? [], services: r.services ?? [],
    featured: r.featured, year: r.year, client: r.client, duration: r.duration,
    results: r.results ?? [], features: r.features ?? [], image: r.image ?? '', link: r.link ?? '',
  };
}

type ServiceRow = {
  id: string; name: string; slug: string; tagline: string;
  description: string; icon: string; features: string[]; technologies: string[];
};

function mapService(r: ServiceRow): Service {
  return {
    id: r.id, name: r.name, slug: r.slug, tagline: r.tagline,
    description: r.description, icon: r.icon,
    features: r.features ?? [], technologies: r.technologies ?? [],
  };
}

type SolutionRow = {
  id: string; name: string; slug: string; tagline: string;
  problem: string; target: string; description: string;
  features: string[]; technologies: string[]; category: string; link: string;
};

function mapSolution(r: SolutionRow): Solution {
  return {
    id: r.id, name: r.name, slug: r.slug, tagline: r.tagline,
    problem: r.problem, target: r.target, description: r.description,
    features: r.features ?? [], technologies: r.technologies ?? [],
    category: r.category, link: r.link ?? '',
  };
}

function mapTeamMember(r: any): TeamMember {
  return { id: r.id, name: r.name, role: r.role, image: r.image, tools: r.tools ?? [], sort_order: r.sort_order };
}

function mapValue(r: any): Value {
  return { id: r.id, icon: r.icon, title: r.title, description: r.description, sort_order: r.sort_order };
}

function mapMissionVision(r: any): MissionVision {
  return { id: r.id, tab_key: r.tab_key, icon: r.icon, label: r.label, title: r.title, description: r.description, points: r.points ?? [], sort_order: r.sort_order };
}

function mapPillar(r: any): AboutPillar {
  return { id: r.id, icon: r.icon, title: r.title, description: r.description, sort_order: r.sort_order };
}

function mapExpertise(r: any): ExpertiseDomain {
  return { id: r.id, icon: r.icon, label: r.label, description: r.description, technologies: r.technologies ?? [], sort_order: r.sort_order };
}

function mapStat(r: any): Stat {
  return { id: r.id, value: r.value, suffix: r.suffix, label: r.label, sort_order: r.sort_order };
}

function mapClient(r: any): Client {
  return { id: r.id, name: r.name, sort_order: r.sort_order };
}

function mapWhyUs(r: any): WhyUsReason {
  return { id: r.id, icon: r.icon, title: r.title, description: r.description, sort_order: r.sort_order };
}

function mapHeroSlide(r: any): HeroSlide {
  return { id: r.id, eyebrow: r.eyebrow, title: r.title, highlight: r.highlight, subtitle: r.subtitle, cta_label: r.cta_label, cta_to: r.cta_to, accent: r.accent, mockup: r.mockup, sort_order: r.sort_order };
}

function mapMessage(r: any): ContactMessage {
  return { id: r.id, name: r.name, company: r.company, email: r.email, phone: r.phone, project_type: r.project_type, message: r.message, status: r.status, created_at: r.created_at };
}

function mapQuotation(r: any): QuotationRequest {
  return { id: r.id, project_type: r.project_type, description: r.description, features: r.features, budget: r.budget, timeline: r.timeline, name: r.name, company: r.company, email: r.email, phone: r.phone, status: r.status, created_at: r.created_at };
}

// ==================== QUERIES ====================

async function fetchAll<T>(table: string, mapper: (r: any) => T, orderBy = 'sort_order'): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').order(orderBy);
  if (error) throw error;
  return (data ?? []).map(mapper);
}

// --- Articles ---
export async function fetchArticles(): Promise<BlogArticle[]> {
  return fetchAll('articles', mapArticle);
}
export async function fetchArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? mapArticle(data) : null;
}

// --- Projects ---
export async function fetchProjects(): Promise<Project[]> {
  return fetchAll('projects', mapProject);
}
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? mapProject(data) : null;
}

// --- Services ---
export async function fetchServices(): Promise<Service[]> {
  return fetchAll('services', mapService);
}
export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? mapService(data) : null;
}

// --- Solutions ---
export async function fetchSolutions(): Promise<Solution[]> {
  return fetchAll('solutions', mapSolution);
}
export async function fetchSolutionBySlug(slug: string): Promise<Solution | null> {
  const { data, error } = await supabase.from('solutions').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? mapSolution(data) : null;
}

// --- Team ---
export async function fetchTeam(): Promise<TeamMember[]> {
  return fetchAll('team_members', mapTeamMember);
}

// --- Values ---
export async function fetchValues(): Promise<Value[]> {
  return fetchAll('values', mapValue);
}

// --- Mission/Vision ---
export async function fetchMissionVision(): Promise<MissionVision[]> {
  return fetchAll('mission_vision', mapMissionVision);
}

// --- Pillars ---
export async function fetchPillars(): Promise<AboutPillar[]> {
  return fetchAll('about_pillars', mapPillar);
}

// --- Expertise ---
export async function fetchExpertise(): Promise<ExpertiseDomain[]> {
  return fetchAll('expertise_domains', mapExpertise);
}

// --- Stats ---
export async function fetchStats(): Promise<Stat[]> {
  return fetchAll('stats', mapStat);
}

// --- Clients ---
export async function fetchClients(): Promise<Client[]> {
  return fetchAll('clients', mapClient);
}

// --- Why Us ---
export async function fetchWhyUs(): Promise<WhyUsReason[]> {
  return fetchAll('why_us_reasons', mapWhyUs);
}

// --- Hero Slides ---
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  return fetchAll('hero_slides', mapHeroSlide);
}

// --- Messages ---
export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

// --- Quotations ---
export async function fetchQuotations(): Promise<QuotationRequest[]> {
  const { data, error } = await supabase.from('quotation_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapQuotation);
}

// ==================== MUTATIONS ====================

// --- Articles ---
export async function insertArticle(a: Omit<BlogArticle, 'id'>): Promise<BlogArticle> {
  const { data, error } = await supabase.from('articles').insert({
    title: a.title, slug: a.slug, excerpt: a.excerpt, category: a.category,
    author: a.author, author_role: a.authorRole, author_bio: a.authorBio,
    date: a.date, reading_time: a.readingTime, cover_image: a.coverImage,
    featured: a.featured, content: a.content, tags: a.tags,
  }).select('*').single();
  if (error) throw error;
  return mapArticle(data);
}

export async function updateArticle(id: string, a: Partial<BlogArticle>): Promise<BlogArticle> {
  const update: Record<string, any> = {};
  if (a.title !== undefined) update.title = a.title;
  if (a.slug !== undefined) update.slug = a.slug;
  if (a.excerpt !== undefined) update.excerpt = a.excerpt;
  if (a.category !== undefined) update.category = a.category;
  if (a.author !== undefined) update.author = a.author;
  if (a.authorRole !== undefined) update.author_role = a.authorRole;
  if (a.authorBio !== undefined) update.author_bio = a.authorBio;
  if (a.date !== undefined) update.date = a.date;
  if (a.readingTime !== undefined) update.reading_time = a.readingTime;
  if (a.coverImage !== undefined) update.cover_image = a.coverImage;
  if (a.featured !== undefined) update.featured = a.featured;
  if (a.content !== undefined) update.content = a.content;
  if (a.tags !== undefined) update.tags = a.tags;
  const { data, error } = await supabase.from('articles').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapArticle(data);
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

// --- Projects ---
export async function insertProject(p: Omit<Project, 'id'>): Promise<Project> {
  const { data, error } = await supabase.from('projects').insert({
    name: p.name, slug: p.slug, sector: p.sector, tagline: p.tagline,
    description: p.description, problem: p.problem, solution: p.solution,
    technologies: p.technologies, services: p.services, featured: p.featured,
    year: p.year, client: p.client, duration: p.duration,
    results: p.results, features: p.features, image: p.image, link: p.link,
  }).select('*').single();
  if (error) throw error;
  return mapProject(data);
}

export async function updateProject(id: string, p: Partial<Project>): Promise<Project> {
  const update: Record<string, any> = {};
  if (p.name !== undefined) update.name = p.name;
  if (p.slug !== undefined) update.slug = p.slug;
  if (p.sector !== undefined) update.sector = p.sector;
  if (p.tagline !== undefined) update.tagline = p.tagline;
  if (p.description !== undefined) update.description = p.description;
  if (p.problem !== undefined) update.problem = p.problem;
  if (p.solution !== undefined) update.solution = p.solution;
  if (p.technologies !== undefined) update.technologies = p.technologies;
  if (p.services !== undefined) update.services = p.services;
  if (p.featured !== undefined) update.featured = p.featured;
  if (p.year !== undefined) update.year = p.year;
  if (p.client !== undefined) update.client = p.client;
  if (p.duration !== undefined) update.duration = p.duration;
  if (p.results !== undefined) update.results = p.results;
  if (p.features !== undefined) update.features = p.features;
  if (p.image !== undefined) update.image = p.image;
  if (p.link !== undefined) update.link = p.link;
  const { data, error } = await supabase.from('projects').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapProject(data);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// --- Services ---
export async function insertService(s: Omit<Service, 'id'>): Promise<Service> {
  const { data, error } = await supabase.from('services').insert({
    name: s.name, slug: s.slug, tagline: s.tagline, description: s.description,
    icon: s.icon, features: s.features, technologies: s.technologies,
  }).select('*').single();
  if (error) throw error;
  return mapService(data);
}

export async function updateService(id: string, s: Partial<Service>): Promise<Service> {
  const update: Record<string, any> = {};
  if (s.name !== undefined) update.name = s.name;
  if (s.slug !== undefined) update.slug = s.slug;
  if (s.tagline !== undefined) update.tagline = s.tagline;
  if (s.description !== undefined) update.description = s.description;
  if (s.icon !== undefined) update.icon = s.icon;
  if (s.features !== undefined) update.features = s.features;
  if (s.technologies !== undefined) update.technologies = s.technologies;
  const { data, error } = await supabase.from('services').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapService(data);
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

// --- Solutions ---
export async function insertSolution(s: Omit<Solution, 'id'>): Promise<Solution> {
  const { data, error } = await supabase.from('solutions').insert({
    name: s.name, slug: s.slug, tagline: s.tagline, problem: s.problem,
    target: s.target, description: s.description, features: s.features,
    technologies: s.technologies, category: s.category, link: s.link,
  }).select('*').single();
  if (error) throw error;
  return mapSolution(data);
}

export async function updateSolution(id: string, s: Partial<Solution>): Promise<Solution> {
  const update: Record<string, any> = {};
  if (s.name !== undefined) update.name = s.name;
  if (s.slug !== undefined) update.slug = s.slug;
  if (s.tagline !== undefined) update.tagline = s.tagline;
  if (s.problem !== undefined) update.problem = s.problem;
  if (s.target !== undefined) update.target = s.target;
  if (s.description !== undefined) update.description = s.description;
  if (s.features !== undefined) update.features = s.features;
  if (s.technologies !== undefined) update.technologies = s.technologies;
  if (s.category !== undefined) update.category = s.category;
  if (s.link !== undefined) update.link = s.link;
  const { data, error } = await supabase.from('solutions').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapSolution(data);
}

export async function deleteSolution(id: string): Promise<void> {
  const { error } = await supabase.from('solutions').delete().eq('id', id);
  if (error) throw error;
}

// --- Team ---
export async function insertTeamMember(t: { name: string; role: string; image: string; tools: string[] }): Promise<TeamMember> {
  const { data, error } = await supabase.from('team_members').insert(t).select('*').single();
  if (error) throw error;
  return mapTeamMember(data);
}

export async function updateTeamMember(id: string, t: Partial<TeamMember>): Promise<TeamMember> {
  const update: Record<string, any> = {};
  if (t.name !== undefined) update.name = t.name;
  if (t.role !== undefined) update.role = t.role;
  if (t.image !== undefined) update.image = t.image;
  if (t.tools !== undefined) update.tools = t.tools;
  const { data, error } = await supabase.from('team_members').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapTeamMember(data);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
}

// --- Values ---
export async function insertValue(v: { icon: string; title: string; description: string }): Promise<Value> {
  const { data, error } = await supabase.from('values').insert(v).select('*').single();
  if (error) throw error;
  return mapValue(data);
}

export async function updateValue(id: string, v: Partial<Value>): Promise<Value> {
  const update: Record<string, any> = {};
  if (v.icon !== undefined) update.icon = v.icon;
  if (v.title !== undefined) update.title = v.title;
  if (v.description !== undefined) update.description = v.description;
  const { data, error } = await supabase.from('values').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapValue(data);
}

export async function deleteValue(id: string): Promise<void> {
  const { error } = await supabase.from('values').delete().eq('id', id);
  if (error) throw error;
}

// --- Mission/Vision ---
export async function updateMissionVision(id: string, mv: Partial<MissionVision>): Promise<MissionVision> {
  const update: Record<string, any> = {};
  if (mv.icon !== undefined) update.icon = mv.icon;
  if (mv.label !== undefined) update.label = mv.label;
  if (mv.title !== undefined) update.title = mv.title;
  if (mv.description !== undefined) update.description = mv.description;
  if (mv.points !== undefined) update.points = mv.points;
  const { data, error } = await supabase.from('mission_vision').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapMissionVision(data);
}

// --- Pillars ---
export async function insertPillar(p: { icon: string; title: string; description: string }): Promise<AboutPillar> {
  const { data, error } = await supabase.from('about_pillars').insert(p).select('*').single();
  if (error) throw error;
  return mapPillar(data);
}

export async function updatePillar(id: string, p: Partial<AboutPillar>): Promise<AboutPillar> {
  const update: Record<string, any> = {};
  if (p.icon !== undefined) update.icon = p.icon;
  if (p.title !== undefined) update.title = p.title;
  if (p.description !== undefined) update.description = p.description;
  const { data, error } = await supabase.from('about_pillars').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapPillar(data);
}

export async function deletePillar(id: string): Promise<void> {
  const { error } = await supabase.from('about_pillars').delete().eq('id', id);
  if (error) throw error;
}

// --- Expertise ---
export async function insertExpertise(e: { icon: string; label: string; description: string; technologies: string[] }): Promise<ExpertiseDomain> {
  const { data, error } = await supabase.from('expertise_domains').insert(e).select('*').single();
  if (error) throw error;
  return mapExpertise(data);
}

export async function updateExpertise(id: string, e: Partial<ExpertiseDomain>): Promise<ExpertiseDomain> {
  const update: Record<string, any> = {};
  if (e.icon !== undefined) update.icon = e.icon;
  if (e.label !== undefined) update.label = e.label;
  if (e.description !== undefined) update.description = e.description;
  if (e.technologies !== undefined) update.technologies = e.technologies;
  const { data, error } = await supabase.from('expertise_domains').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapExpertise(data);
}

export async function deleteExpertise(id: string): Promise<void> {
  const { error } = await supabase.from('expertise_domains').delete().eq('id', id);
  if (error) throw error;
}

// --- Stats ---
export async function insertStat(s: { value: number; suffix: string; label: string }): Promise<Stat> {
  const { data, error } = await supabase.from('stats').insert(s).select('*').single();
  if (error) throw error;
  return mapStat(data);
}

export async function updateStat(id: string, s: Partial<Stat>): Promise<Stat> {
  const update: Record<string, any> = {};
  if (s.value !== undefined) update.value = s.value;
  if (s.suffix !== undefined) update.suffix = s.suffix;
  if (s.label !== undefined) update.label = s.label;
  const { data, error } = await supabase.from('stats').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapStat(data);
}

export async function deleteStat(id: string): Promise<void> {
  const { error } = await supabase.from('stats').delete().eq('id', id);
  if (error) throw error;
}

// --- Clients ---
export async function insertClient(c: { name: string }): Promise<Client> {
  const { data, error } = await supabase.from('clients').insert(c).select('*').single();
  if (error) throw error;
  return mapClient(data);
}

export async function updateClient(id: string, c: Partial<Client>): Promise<Client> {
  const update: Record<string, any> = {};
  if (c.name !== undefined) update.name = c.name;
  const { data, error } = await supabase.from('clients').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapClient(data);
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
}

// --- Why Us ---
export async function insertWhyUs(w: { icon: string; title: string; description: string }): Promise<WhyUsReason> {
  const { data, error } = await supabase.from('why_us_reasons').insert(w).select('*').single();
  if (error) throw error;
  return mapWhyUs(data);
}

export async function updateWhyUs(id: string, w: Partial<WhyUsReason>): Promise<WhyUsReason> {
  const update: Record<string, any> = {};
  if (w.icon !== undefined) update.icon = w.icon;
  if (w.title !== undefined) update.title = w.title;
  if (w.description !== undefined) update.description = w.description;
  const { data, error } = await supabase.from('why_us_reasons').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapWhyUs(data);
}

export async function deleteWhyUs(id: string): Promise<void> {
  const { error } = await supabase.from('why_us_reasons').delete().eq('id', id);
  if (error) throw error;
}

// --- Hero Slides ---
export async function insertHeroSlide(h: Omit<HeroSlide, 'id' | 'sort_order'>): Promise<HeroSlide> {
  const { data, error } = await supabase.from('hero_slides').insert(h).select('*').single();
  if (error) throw error;
  return mapHeroSlide(data);
}

export async function updateHeroSlide(id: string, h: Partial<HeroSlide>): Promise<HeroSlide> {
  const update: Record<string, any> = {};
  if (h.eyebrow !== undefined) update.eyebrow = h.eyebrow;
  if (h.title !== undefined) update.title = h.title;
  if (h.highlight !== undefined) update.highlight = h.highlight;
  if (h.subtitle !== undefined) update.subtitle = h.subtitle;
  if (h.cta_label !== undefined) update.cta_label = h.cta_label;
  if (h.cta_to !== undefined) update.cta_to = h.cta_to;
  if (h.accent !== undefined) update.accent = h.accent;
  if (h.mockup !== undefined) update.mockup = h.mockup;
  const { data, error } = await supabase.from('hero_slides').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapHeroSlide(data);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw error;
}

// --- Messages ---
export async function insertMessage(m: { name: string; company: string; email: string; phone: string; project_type: string; message: string }): Promise<ContactMessage> {
  const { data, error } = await supabase.from('contact_messages').insert(m).select('*').single();
  if (error) throw error;
  return mapMessage(data);
}

export async function updateMessageStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

// --- Quotations ---
export async function insertQuotation(q: { project_type: string; description: string; features: string; budget: string; timeline: string; name: string; company: string; email: string; phone: string }): Promise<QuotationRequest> {
  const { data, error } = await supabase.from('quotation_requests').insert(q).select('*').single();
  if (error) throw error;
  return mapQuotation(data);
}

export async function updateQuotationStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('quotation_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteQuotation(id: string): Promise<void> {
  const { error } = await supabase.from('quotation_requests').delete().eq('id', id);
  if (error) throw error;
}
