import { fetchProjects, fetchProjectBySlug } from '@/features/content/infrastructure/content_api';
import type { ProjectRepository } from '@/features/projects/domain/repositories/project_repository';

export class StaticProjectRepository implements ProjectRepository {
  async getAll() {
    return fetchProjects();
  }

  async getBySlug(slug: string) {
    return fetchProjectBySlug(slug);
  }

  async getFeatured() {
    const projects = await fetchProjects();
    return projects.filter((p) => p.featured);
  }
}
