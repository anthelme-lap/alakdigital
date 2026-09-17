import { apiClient } from '@/core/http/api_client';
import { NotFoundError } from '@/core/errors/app_error';
import type { BlogArticle } from '@/features/blog/domain/entities/article';
import type { Project } from '@/features/projects/domain/entities/project';
import type { Service } from '@/features/services/domain/entities/service';
import type { Solution } from '@/features/solutions/domain/entities/solution';
import type {
  TeamMember, Value, MissionVision, AboutPillar, CompanyStory, ExpertiseDomain,
  Stat, Client, WhyUsReason, HeroSlide, ContactMessage, QuotationRequest,
} from '@/features/content/domain/entities/content';

interface PaginatedResponse<T> {
  items: T[];
}

// ==================== ARTICLES (mapping camelCase <-> snake_case) ====================

type ArticleResponse = {
  id: string; title: string; slug: string; excerpt: string; category: string;
  author: string; author_role: string; author_bio: string; date: string;
  reading_time: string; cover_image: string; featured: boolean;
  content: string; tags: string[];
};

function mapArticle(r: ArticleResponse): BlogArticle {
  return {
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
    category: r.category, author: r.author, authorRole: r.author_role,
    authorBio: r.author_bio, date: r.date, readingTime: r.reading_time,
    coverImage: r.cover_image, featured: r.featured, content: r.content,
    tags: r.tags ?? [],
  };
}

function articleToPayload(a: Partial<BlogArticle>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (a.title !== undefined) payload.title = a.title;
  if (a.slug !== undefined) payload.slug = a.slug;
  if (a.excerpt !== undefined) payload.excerpt = a.excerpt;
  if (a.category !== undefined) payload.category = a.category;
  if (a.author !== undefined) payload.author = a.author;
  if (a.authorRole !== undefined) payload.author_role = a.authorRole;
  if (a.authorBio !== undefined) payload.author_bio = a.authorBio;
  if (a.date !== undefined) payload.date = a.date;
  if (a.readingTime !== undefined) payload.reading_time = a.readingTime;
  if (a.coverImage !== undefined) payload.cover_image = a.coverImage;
  if (a.featured !== undefined) payload.featured = a.featured;
  if (a.content !== undefined) payload.content = a.content;
  if (a.tags !== undefined) payload.tags = a.tags;
  return payload;
}

export async function fetchArticles(): Promise<BlogArticle[]> {
  const res = await apiClient.get<PaginatedResponse<ArticleResponse>>('/articles?limit=0');
  return res.items.map(mapArticle);
}
export async function fetchArticleBySlug(slug: string): Promise<BlogArticle | null> {
  try {
    return mapArticle(await apiClient.get<ArticleResponse>(`/articles/${slug}`));
  } catch (e) {
    if (e instanceof NotFoundError) return null;
    throw e;
  }
}
export async function insertArticle(a: Omit<BlogArticle, 'id'>): Promise<BlogArticle> {
  return mapArticle(await apiClient.post<ArticleResponse>('/admin/articles', articleToPayload(a)));
}
export async function updateArticle(id: string, a: Partial<BlogArticle>): Promise<BlogArticle> {
  return mapArticle(await apiClient.put<ArticleResponse>(`/admin/articles/${id}`, articleToPayload(a)));
}
export async function deleteArticle(id: string): Promise<void> {
  await apiClient.delete(`/admin/articles/${id}`);
}

// ==================== PROJECTS / SERVICES / SOLUTIONS ====================
// Champs identiques cote backend (pas de mapping necessaire).

export async function fetchProjects(): Promise<Project[]> {
  const res = await apiClient.get<PaginatedResponse<Project>>('/projects?limit=0');
  return res.items;
}
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await apiClient.get<Project>(`/projects/${slug}`);
  } catch (e) {
    if (e instanceof NotFoundError) return null;
    throw e;
  }
}
export async function insertProject(p: Omit<Project, 'id'>): Promise<Project> {
  return apiClient.post<Project>('/admin/projects', p);
}
export async function updateProject(id: string, p: Partial<Project>): Promise<Project> {
  return apiClient.put<Project>(`/admin/projects/${id}`, p);
}
export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}`);
}

export async function fetchServices(): Promise<Service[]> {
  const res = await apiClient.get<PaginatedResponse<Service>>('/services?limit=0');
  return res.items;
}
export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    return await apiClient.get<Service>(`/services/${slug}`);
  } catch (e) {
    if (e instanceof NotFoundError) return null;
    throw e;
  }
}
export async function insertService(s: Omit<Service, 'id'>): Promise<Service> {
  return apiClient.post<Service>('/admin/services', s);
}
export async function updateService(id: string, s: Partial<Service>): Promise<Service> {
  return apiClient.put<Service>(`/admin/services/${id}`, s);
}
export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/admin/services/${id}`);
}

export async function fetchSolutions(): Promise<Solution[]> {
  const res = await apiClient.get<PaginatedResponse<Solution>>('/solutions?limit=0');
  return res.items;
}
export async function fetchSolutionBySlug(slug: string): Promise<Solution | null> {
  try {
    return await apiClient.get<Solution>(`/solutions/${slug}`);
  } catch (e) {
    if (e instanceof NotFoundError) return null;
    throw e;
  }
}
export async function insertSolution(s: Omit<Solution, 'id'>): Promise<Solution> {
  return apiClient.post<Solution>('/admin/solutions', s);
}
export async function updateSolution(id: string, s: Partial<Solution>): Promise<Solution> {
  return apiClient.put<Solution>(`/admin/solutions/${id}`, s);
}
export async function deleteSolution(id: string): Promise<void> {
  await apiClient.delete(`/admin/solutions/${id}`);
}

// ==================== SOUS-RESSOURCES SIMPLES (content) ====================
// Meme forme cote backend et cote front (champs deja en snake_case des deux
// cotes) : un seul helper generique CRUD, reutilise pour les 8 ressources.

function simpleContentApi<T>(resource: string) {
  return {
    fetchAll: () => apiClient.get<T[]>(`/${resource}`),
    insert: (payload: Record<string, unknown>) =>
      apiClient.post<T>(`/admin/${resource}`, payload),
    update: (id: string, payload: Record<string, unknown>) =>
      apiClient.put<T>(`/admin/${resource}/${id}`, payload),
    remove: async (id: string) => {
      await apiClient.delete(`/admin/${resource}/${id}`);
    },
  };
}

const teamApi = simpleContentApi<TeamMember>('team-members');
export const fetchTeam = teamApi.fetchAll;
export const insertTeamMember = (t: { name: string; role: string; image: string; tools: string[] }) =>
  teamApi.insert(t);
export const updateTeamMember = (id: string, t: Partial<TeamMember>) => teamApi.update(id, t);
export const deleteTeamMember = teamApi.remove;

const valuesApi = simpleContentApi<Value>('values');
export const fetchValues = valuesApi.fetchAll;
export const insertValue = (v: { icon: string; title: string; description: string }) => valuesApi.insert(v);
export const updateValue = (id: string, v: Partial<Value>) => valuesApi.update(id, v);
export const deleteValue = valuesApi.remove;

const missionVisionApi = simpleContentApi<MissionVision>('mission-vision');
export const fetchMissionVision = missionVisionApi.fetchAll;
export const updateMissionVision = (id: string, mv: Partial<MissionVision>) => missionVisionApi.update(id, mv);

const companyStoryApi = simpleContentApi<CompanyStory>('company-story');
export const fetchCompanyStory = companyStoryApi.fetchAll;
export const updateCompanyStory = (id: string, s: Partial<CompanyStory>) => companyStoryApi.update(id, s);

const pillarsApi = simpleContentApi<AboutPillar>('about-pillars');
export const fetchPillars = pillarsApi.fetchAll;
export const insertPillar = (p: { icon: string; title: string; description: string }) => pillarsApi.insert(p);
export const updatePillar = (id: string, p: Partial<AboutPillar>) => pillarsApi.update(id, p);
export const deletePillar = pillarsApi.remove;

const expertiseApi = simpleContentApi<ExpertiseDomain>('expertise-domains');
export const fetchExpertise = expertiseApi.fetchAll;
export const insertExpertise = (e: { icon: string; label: string; description: string; technologies: string[] }) =>
  expertiseApi.insert(e);
export const updateExpertise = (id: string, e: Partial<ExpertiseDomain>) => expertiseApi.update(id, e);
export const deleteExpertise = expertiseApi.remove;

const statsApi = simpleContentApi<Stat>('stats');
export const fetchStats = statsApi.fetchAll;
export const insertStat = (s: { value: number; suffix: string; label: string }) => statsApi.insert(s);
export const updateStat = (id: string, s: Partial<Stat>) => statsApi.update(id, s);
export const deleteStat = statsApi.remove;

const clientsApi = simpleContentApi<Client>('clients');
export const fetchClients = clientsApi.fetchAll;
export const insertClient = (c: { name: string }) => clientsApi.insert(c);
export const updateClient = (id: string, c: Partial<Client>) => clientsApi.update(id, c);
export const deleteClient = clientsApi.remove;

const whyUsApi = simpleContentApi<WhyUsReason>('why-us-reasons');
export const fetchWhyUs = whyUsApi.fetchAll;
export const insertWhyUs = (w: { icon: string; title: string; description: string }) => whyUsApi.insert(w);
export const updateWhyUs = (id: string, w: Partial<WhyUsReason>) => whyUsApi.update(id, w);
export const deleteWhyUs = whyUsApi.remove;

const heroSlidesApi = simpleContentApi<HeroSlide>('hero-slides');
export const fetchHeroSlides = heroSlidesApi.fetchAll;
export const insertHeroSlide = (h: Omit<HeroSlide, 'id' | 'sort_order'>) => heroSlidesApi.insert(h);
export const updateHeroSlide = (id: string, h: Partial<HeroSlide>) => heroSlidesApi.update(id, h);
export const deleteHeroSlide = heroSlidesApi.remove;

// ==================== MESSAGES / QUOTATIONS (formulaires publics) ====================
// `created_at` cote front <-> `date_creation` cote backend.

type ContactMessageResponse = Omit<ContactMessage, 'created_at'> & { date_creation: string };
type QuotationRequestResponse = Omit<QuotationRequest, 'created_at'> & { date_creation: string };

export async function fetchMessages(): Promise<ContactMessage[]> {
  const rows = await apiClient.get<ContactMessageResponse[]>('/admin/contact-messages');
  return rows.map((r) => ({ ...r, created_at: r.date_creation }));
}
export async function insertMessage(m: {
  name: string; company: string; email: string; phone: string; project_type: string; message: string;
}): Promise<ContactMessage> {
  const r = await apiClient.post<ContactMessageResponse>('/contact-messages', m);
  return { ...r, created_at: r.date_creation };
}
export async function updateMessageStatus(id: string, status: string): Promise<void> {
  await apiClient.patch(`/admin/contact-messages/${id}/status`, { status });
}
export async function deleteMessage(id: string): Promise<void> {
  await apiClient.delete(`/admin/contact-messages/${id}`);
}

export async function fetchQuotations(): Promise<QuotationRequest[]> {
  const rows = await apiClient.get<QuotationRequestResponse[]>('/admin/quotation-requests');
  return rows.map((r) => ({ ...r, created_at: r.date_creation }));
}
export async function insertQuotation(q: {
  project_type: string; description: string; features: string; budget: string; timeline: string;
  name: string; company: string; email: string; phone: string;
}): Promise<QuotationRequest> {
  const r = await apiClient.post<QuotationRequestResponse>('/quotation-requests', q);
  return { ...r, created_at: r.date_creation };
}
export async function updateQuotationStatus(id: string, status: string): Promise<void> {
  await apiClient.patch(`/admin/quotation-requests/${id}/status`, { status });
}
export async function deleteQuotation(id: string): Promise<void> {
  await apiClient.delete(`/admin/quotation-requests/${id}`);
}
